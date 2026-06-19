import { query, serviceFailure, getSession } from '@/lib/platform-db'

/**
 * GET /api/accounts — returns accounts for the authenticated user only
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

    // Parameterized query — user can only see their own accounts
    const result = await query(
      `SELECT a.id, a.account_number, a.account_name, a.balance, u.username, u.full_name
       FROM accounts a
       JOIN users u ON u.id = a.user_id
       WHERE a.user_id = $1
       ORDER BY a.id`,
      [session.userId]
    )

    return Response.json({
      ok: true,
      accounts: result.rows
    })
  } catch (reason) {
    return serviceFailure(reason)
  }
}
