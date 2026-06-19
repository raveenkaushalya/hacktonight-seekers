'use client'

import Link from 'next/link'
import { type FormEvent, useState } from 'react'
import AuthButton from '@/components/authButton'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [step, setStep] = useState<'email' | 'verify'>('email')
  const [message, setMessage] = useState('')

  function handleSendOTP(e: FormEvent) {
    e.preventDefault()
    if (!email.trim()) {
      setMessage('Please enter your email.')
      return
    }
    // In a real app, this would call an API to send the OTP
    setStep('verify')
    setMessage('A verification code has been sent to your email.')
  }

  function handleReset(e: FormEvent) {
    e.preventDefault()
    if (!otp.trim()) {
      setMessage('Please enter the OTP.')
      return
    }
    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters.')
      return
    }
    // In a real app, this would call an API to reset the password
    setMessage('Password has been reset successfully!')
  }

  return (
    <section className="mx-auto flex min-h-[500px] w-full max-w-[1100px] items-center justify-center rounded-[40px] bg-white px-8 py-10 shadow-[0_24px_48px_rgba(29,7,48,0.12)] lg:min-h-[684px]">
      <div className="w-full max-w-[670px]">
        <h1 className="mb-3 text-center text-[2.2rem] font-bold text-[#1d0730]">
          Reset Password
        </h1>
        <p className="mb-12 text-center text-sm text-[#8a8a9a]">
          {step === 'email'
            ? 'Enter your email to receive a verification code'
            : 'Enter the code and your new password'}
        </p>

        {message && (
          <div className="mb-6 rounded-xl bg-[#faf5fa] px-4 py-3 text-sm text-[#7a2d78] border border-[#f0e4ef] text-center">
            {message}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendOTP} className="space-y-8">
            <div className="grid items-center gap-4 md:grid-cols-[100px_1fr]">
              <label
                className="text-sm font-medium text-[#4a4a5a]"
                htmlFor="reset-email"
              >
                Email
              </label>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-[52px] rounded-[14px] border-0 bg-[#f8f6f2] px-5 text-base text-[#1a1a2e] outline-none transition-all focus:shadow-[0_0_0_3px_rgba(154,92,151,0.15)] focus:bg-white"
                placeholder="your@email.com"
              />
            </div>

            <div className="flex justify-center">
              <AuthButton>SEND CODE</AuthButton>
            </div>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-6">
            <div className="grid items-center gap-4 md:grid-cols-[140px_1fr]">
              <label
                className="text-sm font-medium text-[#4a4a5a]"
                htmlFor="reset-otp"
              >
                Verification Code
              </label>
              <input
                id="reset-otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="h-[52px] rounded-[14px] border-0 bg-[#f8f6f2] px-5 text-base text-[#1a1a2e] outline-none transition-all focus:shadow-[0_0_0_3px_rgba(154,92,151,0.15)] focus:bg-white"
                placeholder="Enter 6-digit code"
              />
            </div>

            <div className="grid items-center gap-4 md:grid-cols-[140px_1fr]">
              <label
                className="text-sm font-medium text-[#4a4a5a]"
                htmlFor="reset-password"
              >
                New Password
              </label>
              <input
                id="reset-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-[52px] rounded-[14px] border-0 bg-[#f8f6f2] px-5 text-base text-[#1a1a2e] outline-none transition-all focus:shadow-[0_0_0_3px_rgba(154,92,151,0.15)] focus:bg-white"
                placeholder="Minimum 6 characters"
              />
            </div>

            <div className="flex justify-center">
              <AuthButton>RESET PASSWORD</AuthButton>
            </div>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-[#8a8a9a]">
          Remember your password?{' '}
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
