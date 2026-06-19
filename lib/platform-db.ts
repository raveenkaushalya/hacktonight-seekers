import { Pool } from 'pg'
import { createHmac } from 'node:crypto'

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:supersecurepassword@localhost:5432/htn26db'

export const pool = new Pool({
  connectionString,
  max: 3
})

let booted = false

const schema = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer',
  full_name TEXT NOT NULL,
  nic TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  account_number TEXT UNIQUE NOT NULL,
  account_name TEXT NOT NULL,
  balance NUMERIC(14, 2) NOT NULL DEFAULT 0,
  pin TEXT NOT NULL DEFAULT '0000'
);

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  from_account TEXT NOT NULL,
  to_account TEXT NOT NULL,
  amount NUMERIC(14, 2) NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'SUCCESS',
  created_by INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  event TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`

// NOTE: bcryptjs hashed passwords — original plaintext passwords for dev reference:
//   dilara  -> password123
//   kasun   -> kasun
//   admin   -> admin
const seed = `
INSERT INTO users (id, username, password, role, full_name, nic, email) VALUES
  (1, 'dilara', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'customer', 'Dilara Perera', '200112345678', 'dilara@example.test'),
  (2, 'kasun', '$2a$10$IQoLwJ5aAnkHzSJsUQ0BGeSjUm6Y6s7VzKXiTzSLxHzonQPW4wx2K', 'customer', 'Kasun Wickramanayake', '199812345678', 'kasun@example.test'),
  (3, 'admin', '$2a$10$Vz5Z8t4qRqKpXqXqXqXqXuXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXq', 'admin', 'Platform Administrator', '000000000000', 'root@example.test')
ON CONFLICT (id) DO NOTHING;

INSERT INTO accounts (user_id, account_number, account_name, balance, pin) VALUES
  (1, '1000003423', 'Dilara Savings', 100000.00, '1234'),
  (1, '1000004876', 'Dilara Expenses', 42000.00, '1234'),
  (2, '2000006754', 'Kasun Current', 9870.00, '0000'),
  (3, '9999999999', 'Admin Vault', 9999999.99, '9999')
ON CONFLICT (account_number) DO NOTHING;

INSERT INTO transactions (from_account, to_account, amount, description, created_by) VALUES
  ('1000003423', '2000006754', 4500.00, 'Lunch money', 1),
  ('1000004876', '9999999999', 10000.00, 'Totally normal fee', 1),
  ('2000006754', '1000003423', 9870.00, 'Refund maybe', 2)
ON CONFLICT DO NOTHING;
`

export async function ensureDatabase() {
  if (booted) return
  await pool.query(schema)
  await pool.query(seed)
  booted = true
}

/**
 * Safe parameterized query — always use $1, $2 placeholders.
 * Never interpolate user input into SQL strings.
 */
export async function query(sql: string, params: unknown[] = []) {
  await ensureDatabase()
  return pool.query(sql, params)
}

export function asText(value: unknown) {
  if (value === undefined || value === null) return ''
  return String(value)
}

/**
 * Safe error response — never leaks stack traces, DB URLs, or internal details.
 */
export function serviceFailure(reason: unknown) {
  const issue = reason as { message?: string; code?: string }
  console.error('[bank-error]', issue.message || reason)

  return Response.json(
    {
      ok: false,
      message: 'An internal error occurred. Please try again later.',
      code: issue.code || 'INTERNAL_ERROR'
    },
    { status: 500 }
  )
}

// ─── Auth helpers ───────────────────────────────────────────────────────

const SESSION_SECRET =
  process.env.SESSION_SECRET || 'dev-secret-change-in-production'

/**
 * Create a signed session token: userId:role:signature
 */
export function createSessionToken(userId: number, role: string): string {
  const payload = `${userId}:${role}`
  const sig = createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('hex')
    .slice(0, 16)
  return `${payload}:${sig}`
}

/**
 * Verify and parse a session token. Returns null if invalid/tampered.
 */
export function verifySessionToken(
  token: string
): { userId: number; role: string } | null {
  if (!token) return null
  const parts = token.split(':')
  if (parts.length !== 3) return null
  const [userIdStr, role, sig] = parts
  const userId = parseInt(userIdStr, 10)
  if (isNaN(userId)) return null

  const expectedSig = createHmac('sha256', SESSION_SECRET)
    .update(`${userId}:${role}`)
    .digest('hex')
    .slice(0, 16)

  if (sig !== expectedSig) return null
  return { userId, role }
}

/**
 * Extract session from request cookies. Returns null if not authenticated.
 */
export function getSession(
  request: Request
): { userId: number; role: string } | null {
  const cookieHeader = request.headers.get('cookie') || ''
  const match = cookieHeader.match(/session=([^;]+)/)
  if (!match) return null
  return verifySessionToken(decodeURIComponent(match[1]))
}
