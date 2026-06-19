import { asText, getSession, query, serviceFailure } from '@/lib/platform-db'

/**
 * GET /api/search — search users, accounts, transactions
 * Requires authentication. Uses parameterized queries.
 */
export async function GET(request: Request) {
  try {
    const session = getSession(request)
    if (!session) {
      return Response.json(
        { ok: false, message: 'Authentication required.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const q = asText(searchParams.get('q')).trim()

    if (!q) {
      return Response.json({ ok: true, results: [] })
    }

    const pattern = `%${q}%`

    // Parameterized ILIKE — safe from SQL injection
    const result = await query(
      `SELECT 'user' AS type, id::text, username AS label, email AS detail FROM users
       WHERE username ILIKE $1 OR full_name ILIKE $1
       UNION ALL
       SELECT 'account' AS type, id::text, account_number AS label, account_name AS detail FROM accounts
       WHERE account_number ILIKE $1 OR account_name ILIKE $1
       UNION ALL
       SELECT 'transaction' AS type, id::text, from_account || ' -> ' || to_account AS label, description AS detail FROM transactions
       WHERE description ILIKE $1
       LIMIT 25`,
      [pattern]
    )

    return Response.json({
      ok: true,
      query: q,
      results: result.rows
    })
  } catch (reason) {
    return serviceFailure(reason)
  }
}
