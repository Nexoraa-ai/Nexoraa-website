import { LoginForm } from '@/components/auth/LoginForm'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign in — Nexoraa',
}

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm animate-fadein">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-extrabold text-[#e8e9f5] mb-2">Welcome back</h1>
        <p className="text-[13px] text-[#565775]">Sign in to your Nexoraa account</p>
      </div>

      <LoginForm />

      <p className="text-center text-[12px] text-[#383960] mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-[#00d4ff] hover:underline">
          Sign up free →
        </Link>
      </p>
    </div>
  )
}
