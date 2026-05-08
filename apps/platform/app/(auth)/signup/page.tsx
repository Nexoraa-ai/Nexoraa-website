import { Suspense } from 'react'
import { SignupForm } from '@/components/auth/SignupForm'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign up — Nexoraa',
}

export default function SignupPage() {
  return (
    <div className="w-full max-w-sm animate-fadein">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-extrabold text-[#e8e9f5] mb-2">Create your account</h1>
        <p className="text-[13px] text-[#565775]">
          Free forever. No credit card required.
        </p>
      </div>

      <Suspense fallback={<div className="h-64 bg-[#0e0f18] border border-[#1e1f30] rounded-2xl animate-pulse" />}>
        <SignupForm />
      </Suspense>

      <p className="text-center text-[12px] text-[#383960] mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-[#00d4ff] hover:underline">
          Sign in →
        </Link>
      </p>

      <p className="text-center text-[11px] text-[#2a2b40] mt-4">
        By signing up you agree to our{' '}
        <span className="text-[#383960]">Terms of Service</span> and{' '}
        <span className="text-[#383960]">Privacy Policy</span>.
      </p>
    </div>
  )
}
