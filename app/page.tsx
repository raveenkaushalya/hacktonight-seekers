import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nova Bank — Modern Banking Solutions',
  description: 'Manage your finances effortlessly with Nova Bank'
}

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#1d0730] via-[#2e0a46] to-[#450043] p-6 relative overflow-hidden">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 40px, #fff 40px, #fff 41px)'
        }}
      />

      <div className="text-center relative z-10 animate-fade-in">
        <div className="mx-auto mb-8 w-24 h-24 rounded-3xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/10">
          <img
            src="/loginlogo.png"
            alt="Nova Bank"
            className="w-full h-full object-cover"
          />
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 tracking-tight">
          Nova Bank
        </h1>
        <p className="text-lg text-white/60 mb-12 max-w-md mx-auto">
          Your trusted partner for modern, secure banking
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/login"
            className="px-8 py-3.5 bg-white text-[#1d0730] rounded-full font-semibold text-base shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="px-8 py-3.5 bg-white/10 text-white border border-white/20 rounded-full font-semibold text-base backdrop-blur-sm hover:bg-white/20 hover:-translate-y-0.5 transition-all"
          >
            Create Account
          </Link>
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-6 text-white/40 text-sm">
          <Link
            href="/dashboard"
            className="hover:text-white/70 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/bank-transfer"
            className="hover:text-white/70 transition-colors"
          >
            Transfer
          </Link>
          <Link
            href="/pay-bills"
            className="hover:text-white/70 transition-colors"
          >
            Pay Bills
          </Link>
          <Link
            href="/e-statement"
            className="hover:text-white/70 transition-colors"
          >
            E-Statement
          </Link>
        </div>
      </div>
    </main>
  )
}
