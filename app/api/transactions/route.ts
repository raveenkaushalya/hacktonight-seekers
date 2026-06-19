import { getSession, query, serviceFailure } from '@/lib/platform-db'

/**
 * GET /api/transactions — get recent transactions for the authenticated user
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

    const result = await query(
      `SELECT t.id, t.from_account, t.to_account, t.amount, t.description, t.status, t.created_at
       FROM transactions t
       JOIN accounts a ON a.account_number = t.from_account OR a.account_number = t.to_account
       WHERE a.user_id = $1
       GROUP BY t.id
       ORDER BY t.created_at DESC
       LIMIT 20`,
      [session.userId]
    )

    return Response.json({
      ok: true,
      transactions: result.rows
    })
  } catch (reason) {
    return serviceFailure(reason)
  }
}
