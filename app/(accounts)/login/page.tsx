'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FormEvent, useState } from 'react'
import AuthButton from '@/components/authButton'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password) {
      setError('Please enter both username and password.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password })
      })

      const data = await res.json()

      if (!data.ok) {
        setError(data.message || 'Login failed.')
        return
      }

      if (data.user && data.user.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto flex min-h-[480px] w-full max-w-[1060px] overflow-hidden rounded-[40px] bg-white shadow-[0_24px_48px_rgba(29,7,48,0.12)] lg:min-h-[660px]">
      <aside
        aria-label="Nova Bank shell artwork"
        className="relative hidden w-[46.2%] shrink-0 overflow-hidden bg-[#1d0730] md:block"
      >
        <img
          src="/loginshellbg.png"
          alt=""
          className="size-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/loginlogo.png"
            alt="Nova Bank"
            className="w-[38%] max-w-[276px]"
          />
        </div>
      </aside>

      <div className="flex flex-1 items-center justify-center bg-white px-8 py-10">
        <div className="w-full max-w-[450px] text-center">
          <h1 className="mb-2 text-[2.2rem] font-bold text-[#1d0730]">
            Welcome Back
          </h1>
          <p className="mb-10 text-sm text-[#8a8a9a]">
            Sign in to your Nova Bank account
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-100">
                {error}
              </div>
            )}

            <div className="relative">
              <label className="sr-only" htmlFor="login-account">
                Username
              </label>
              <img
                src="/person.png"
                alt=""
                aria-hidden="true"
                className="-translate-y-1/2 absolute left-5 top-1/2 size-5 opacity-40"
              />
              <input
                id="login-account"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                autoComplete="username"
                className="h-[56px] w-full rounded-[16px] border-0 bg-[#f8f6f2] px-6 pl-14 text-base text-[#1a1a2e] outline-none transition-all placeholder:text-[#8a8a9a] focus:shadow-[0_0_0_3px_rgba(154,92,151,0.15)] focus:bg-white"
              />
            </div>

            <div className="relative">
              <label className="sr-only" htmlFor="login-password">
                Password
              </label>
              <img
                src="/password.png"
                alt=""
                aria-hidden="true"
                className="-translate-y-1/2 absolute left-5 top-1/2 size-5 opacity-40"
              />
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                className="h-[56px] w-full rounded-[16px] border-0 bg-[#f8f6f2] px-6 pl-14 text-base text-[#1a1a2e] outline-none transition-all placeholder:text-[#8a8a9a] focus:shadow-[0_0_0_3px_rgba(154,92,151,0.15)] focus:bg-white"
              />
            </div>

            <div className="text-right">
              <Link
                href="/reset-password"
                className="text-sm font-medium text-[#7a2d78] hover:text-[#450043] transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <div className="pt-2">
              <AuthButton loading={loading} className="mx-auto">
                SIGN IN
              </AuthButton>
            </div>
          </form>

          <p className="mt-8 text-sm text-[#8a8a9a]">
            Don&apos;t have an account?{' '}
            <Link
              href="/sign-up"
              className="font-bold text-[#1d0730] hover:text-[#7a2d78] transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
