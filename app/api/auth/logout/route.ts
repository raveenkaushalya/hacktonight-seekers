/**
 * POST /api/auth/logout — clear the session cookie
 */
export async function POST() {
  const headers = new Headers()
  headers.append(
    'set-cookie',
    'session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'
  )

  return Response.json({ ok: true, message: 'Logged out.' }, { headers })
}
