import { getSession, query, serviceFailure } from '@/lib/platform-db'

/**
 * GET /api/admin/system — admin-only system overview
 * Requires authentication with admin role.
 * No longer leaks passwords, PINs, cookies, or process.env.
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

    if (session.role !== 'admin') {
      return Response.json(
        { ok: false, message: 'Admin access required.' },
        { status: 403 }
      )
    }

    // Safe queries — no passwords, PINs, or sensitive data
    const users = await query(
      'SELECT id, username, role, full_name, email, created_at FROM users ORDER BY id'
    )
    const accounts = await query(
      'SELECT id, user_id, account_number, account_name, balance FROM accounts ORDER BY id'
    )
    const logs = await query(
      'SELECT id, event, payload, created_at FROM audit_logs ORDER BY id DESC LIMIT 10'
    )

    return Response.json({
      ok: true,
      message: 'System overview.',
      users: users.rows,
      accounts: accounts.rows,
      auditLogs: logs.rows
    })
  } catch (reason) {
    return serviceFailure(reason)
  }
}
