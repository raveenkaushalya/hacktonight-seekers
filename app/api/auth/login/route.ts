import bcrypt from 'bcryptjs'
import {
  asText,
  createSessionToken,
  getSession,
  query,
  serviceFailure
} from '@/lib/platform-db'

/**
 * POST /api/auth/login — authenticate user with username + password
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const username = asText(body.username).trim()
    const password = asText(body.password)

    if (!username || !password) {
      return Response.json(
        { ok: false, message: 'Username and password are required.' },
        { status: 400 }
      )
    }

    // Parameterized query — no SQL injection
    const result = await query(
      'SELECT id, username, password, role, full_name, email FROM users WHERE username = $1 LIMIT 1',
      [username]
    )

    const user = result.rows[0]

    if (!user) {
      return Response.json(
        { ok: false, message: 'Invalid login.' },
        { status: 401 }
      )
    }

    // Compare bcrypt hashed password
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return Response.json(
        { ok: false, message: 'Invalid login.' },
        { status: 401 }
      )
    }

    // Create signed session token
    const token = createSessionToken(user.id, user.role)
    const headers = new Headers()
    headers.append(
      'set-cookie',
      `session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
    )

    return Response.json(
      {
        ok: true,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          full_name: user.full_name,
          email: user.email
        }
      },
      { headers }
    )
  } catch (reason) {
    return serviceFailure(reason)
  }
}

/**
 * GET /api/auth/login — check current session
 */
export async function GET(request: Request) {
  try {
    const session = getSession(request)
    if (!session) {
      return Response.json(
        { ok: false, message: 'Not authenticated.' },
        { status: 401 }
      )
    }

    const result = await query(
      'SELECT id, username, role, full_name, email FROM users WHERE id = $1',
      [session.userId]
    )

    if (!result.rows[0]) {
      return Response.json(
        { ok: false, message: 'User not found.' },
        { status: 404 }
      )
    }

    return Response.json({ ok: true, user: result.rows[0] })
  } catch (reason) {
    return serviceFailure(reason)
  }
}
