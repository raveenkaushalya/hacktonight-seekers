'use client'

import Link from 'next/link'
import { type FormEvent, useState } from 'react'
import AuthButton from '@/components/authButton'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    accountNumber: '',
    accountName: '',
    branch: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!formData.accountNumber.trim()) e.accountNumber = 'Required'
    else if (!/^\d{6,}$/.test(formData.accountNumber))
      e.accountNumber = 'Must be at least 6 digits'
    if (!formData.accountName.trim()) e.accountName = 'Required'
    if (!formData.branch.trim()) e.branch = 'Required'
    if (!formData.email.trim()) e.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = 'Invalid email'
    if (!formData.password) e.password = 'Required'
    else if (formData.password.length < 6) e.password = 'Min 6 characters'
    if (formData.password !== formData.confirmPassword)
      e.confirmPassword = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    if (!validate()) return
    // In a real app, this would call POST /api/auth/register
    setSuccess(true)
  }

  const fields = [
    { key: 'accountNumber', label: 'Account Number', type: 'text' },
    { key: 'accountName', label: 'Account Name', type: 'text' },
    { key: 'branch', label: 'Branch', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'password', label: 'Password', type: 'password' },
    { key: 'confirmPassword', label: 'Confirm Password', type: 'password' }
  ] as const

  if (success) {
    return (
      <section className="mx-auto min-h-[700px] w-full max-w-[1100px] rounded-[40px] bg-white px-8 py-9 shadow-[0_24px_48px_rgba(29,7,48,0.12)] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#22c55e"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 12 2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#1d0730] mb-2">
            Account Created!
          </h2>
          <p className="text-[#8a8a9a] mb-8">
            Your registration is being processed.
          </p>
          <Link
            href="/login"
            className="inline-block rounded-full bg-gradient-to-br from-[#7a2d78] to-[#450043] px-8 py-3 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Go to Login
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto min-h-[700px] w-full max-w-[1100px] rounded-[40px] bg-white px-8 py-9 shadow-[0_24px_48px_rgba(29,7,48,0.12)] lg:min-h-[820px] lg:px-14">
      <div className="relative mx-auto w-full max-w-[860px]">
        <img
          src="/loginlogo.png"
          alt="Nova Bank"
          className="absolute left-0 top-0 hidden w-[100px] md:block rounded-2xl"
        />

        <h1 className="mb-3 text-center text-[2.2rem] font-bold text-[#1d0730]">
          Create Account
        </h1>
        <p className="mb-10 text-center text-sm text-[#8a8a9a]">
          Join Nova Bank and start managing your finances
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map((field) => {
            const fieldId = `sign-up-${field.key}`
            return (
              <div
                className="grid items-start gap-3 md:grid-cols-[160px_1fr]"
                key={field.key}
              >
                <label
                  className="text-sm font-medium text-[#4a4a5a] pt-3"
                  htmlFor={fieldId}
                >
                  {field.label}
                </label>
                <div>
                  <input
                    id={fieldId}
                    type={field.type}
                    value={formData[field.key]}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [field.key]: e.target.value
                      }))
                    }
                    className={`h-[52px] w-full rounded-[14px] border-0 bg-[#f8f6f2] px-5 text-base text-[#1a1a2e] outline-none transition-all placeholder:text-[#8a8a9a] focus:shadow-[0_0_0_3px_rgba(154,92,151,0.15)] focus:bg-white ${
                      errors[field.key] ? 'ring-2 ring-red-300 bg-red-50' : ''
                    }`}
                    placeholder={field.label}
                  />
                  {errors[field.key] && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors[field.key]}
                    </p>
                  )}
                </div>
              </div>
            )
          })}

          <div className="flex justify-center pt-4">
            <AuthButton>SIGN UP</AuthButton>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-[#8a8a9a]">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-bold text-[#1d0730] hover:text-[#7a2d78] transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </section>
  )
}
