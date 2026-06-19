import {
  asText,
  getSession,
  pool,
  query,
  serviceFailure
} from '@/lib/platform-db'

/**
 * POST /api/transfer — transfer money between accounts
 * Requires auth, validates ownership, checks balance, uses DB transaction
 */
export async function POST(request: Request) {
  try {
    const session = getSession(request)
    if (!session) {
      return Response.json(
        { ok: false, message: 'Authentication required.' },
        { status: 401 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const fromAccount = asText(body.fromAccount || body.from).trim()
    const toAccount = asText(body.toAccount || body.to).trim()
    const amountStr = asText(body.amount).trim()
    const description = asText(body.description).trim()

    // Validate inputs
    if (!fromAccount || !toAccount || !amountStr) {
      return Response.json(
        {
          ok: false,
          message: 'fromAccount, toAccount, and amount are required.'
        },
        { status: 400 }
      )
    }

    const amount = parseFloat(amountStr)
    if (isNaN(amount) || amount <= 0) {
      return Response.json(
        { ok: false, message: 'Amount must be a positive number.' },
        { status: 400 }
      )
    }

    if (fromAccount === toAccount) {
      return Response.json(
        { ok: false, message: 'Cannot transfer to the same account.' },
        { status: 400 }
      )
    }

    // Verify the sender owns the source account
    const ownerCheck = await query(
      'SELECT id, balance FROM accounts WHERE account_number = $1 AND user_id = $2',
      [fromAccount, session.userId]
    )

    if (!ownerCheck.rows[0]) {
      return Response.json(
        { ok: false, message: 'Source account not found or not yours.' },
        { status: 403 }
      )
    }

    const currentBalance = parseFloat(ownerCheck.rows[0].balance)
    if (currentBalance < amount) {
      return Response.json(
        {
          ok: false,
          message: 'Insufficient balance.',
          currentBalance
        },
        { status: 400 }
      )
    }

    // Verify the destination account exists
    const destCheck = await query(
      'SELECT id FROM accounts WHERE account_number = $1',
      [toAccount]
    )

    if (!destCheck.rows[0]) {
      return Response.json(
        { ok: false, message: 'Destination account not found.' },
        { status: 404 }
      )
    }

    // Atomic transaction — both debit and credit succeed or both fail
    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      await client.query(
        'UPDATE accounts SET balance = balance - $1 WHERE account_number = $2',
        [amount, fromAccount]
      )

      await client.query(
        'UPDATE accounts SET balance = balance + $1 WHERE account_number = $2',
        [amount, toAccount]
      )

      const inserted = await client.query(
        `INSERT INTO transactions (from_account, to_account, amount, description, created_by)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, from_account, to_account, amount, description, status, created_at`,
        [fromAccount, toAccount, amount, description, session.userId]
      )

      await client.query('COMMIT')

      return Response.json({
        ok: true,
        message: 'Transfer completed successfully.',
        transaction: inserted.rows[0]
      })
    } catch (txError) {
      await client.query('ROLLBACK')
      throw txError
    } finally {
      client.release()
    }
  } catch (reason) {
    return serviceFailure(reason)
  }
}
