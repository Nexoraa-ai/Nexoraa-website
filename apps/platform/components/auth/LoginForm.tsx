'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function LoginForm() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.replace('/feed')
    router.refresh()
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/feed`,
      },
    })

    if (error) {
      setError(error.message)
      setGoogleLoading(false)
    }
  }

  return (
    <div className="bg-[#0e0f18] border border-[#1e1f30] rounded-2xl p-6">
      {/* Google OAuth button */}
      <button
        onClick={handleGoogleLogin}
        disabled={googleLoading || loading}
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-[#1e1f30] rounded-xl bg-[#13141f] hover:border-[#2a2b40] hover:bg-[#191a28] transition-all text-[13px] font-medium text-[#e8e9f5] disabled:opacity-50 mb-4"
      >
        {googleLoading ? (
          <span className="w-4 h-4 border-2 border-[#565775] border-t-[#00d4ff] rounded-full animate-spin" />
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        Continue with Google
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-[#1e1f30]" />
        <span className="font-mono text-[10px] text-[#383960]">or</span>
        <div className="flex-1 h-px bg-[#1e1f30]" />
      </div>

      {/* Email form */}
      <form onSubmit={handleEmailLogin} className="space-y-3">
        <div>
          <label className="block font-mono text-[10px] text-[#383960] uppercase tracking-wider mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full px-3 py-2.5 bg-[#13141f] border border-[#1e1f30] rounded-xl text-[13px] text-[#e8e9f5] placeholder-[#383960] focus:outline-none focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/20 transition-all"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block font-mono text-[10px] text-[#383960] uppercase tracking-wider">
              Password
            </label>
            <a href="#" className="font-mono text-[10px] text-[#565775] hover:text-[#00d4ff] transition-colors">
              Forgot?
            </a>
          </div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-3 py-2.5 bg-[#13141f] border border-[#1e1f30] rounded-xl text-[13px] text-[#e8e9f5] placeholder-[#383960] focus:outline-none focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/20 transition-all"
          />
        </div>

        {error && (
          <div className="px-3 py-2 bg-[#f74470]/10 border border-[#f74470]/20 rounded-lg">
            <p className="text-[12px] text-[#f74470]">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || googleLoading}
          className="w-full py-2.5 bg-[#00d4ff] text-[#08090e] font-bold text-[13px] rounded-xl hover:bg-[#00d4ff]/90 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-1"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-[#08090e]/30 border-t-[#08090e] rounded-full animate-spin" />
              Signing in…
            </span>
          ) : (
            'Sign in'
          )}
        </button>
      </form>
    </div>
  )
}
