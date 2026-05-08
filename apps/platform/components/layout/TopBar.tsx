'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import type { UserPlan } from '@neuralforge/types'

const PLAN_COLORS: Record<UserPlan, string> = {
  free: '#565775',
  pro: '#00d4ff',
  premium: '#7c6df8',
  enterprise: '#f5c842',
}

interface TopBarProps {
  user: User
  profile: {
    display_name?: string | null
    plan?: UserPlan | null
    current_streak?: number | null
  } | null
}

export function TopBar({ user, profile }: TopBarProps) {
  const router = useRouter()
  const supabase = createClient()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const plan = (profile?.plan ?? 'free') as UserPlan
  const initials = (profile?.display_name ?? user.email ?? '?')[0].toUpperCase()
  const displayName = profile?.display_name ?? user.email?.split('@')[0] ?? 'User'

  // Close menu on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [menuOpen])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.replace('/')
    router.refresh()
  }

  return (
    <header className="flex items-center gap-3 px-4 md:px-6 py-2.5 border-b border-[var(--border)] bg-[var(--bg)] shrink-0">
      {/* Mobile logo */}
      <span className="md:hidden font-mono text-[11px] font-bold text-[var(--l0)] tracking-[0.15em] uppercase">
        Nexoraa
      </span>

      <div className="flex-1" />

      {/* Pipeline status indicator */}
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--s2)] border border-[var(--border)]">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--l0)] animate-pulse" />
        <span className="font-mono text-[9px] text-[var(--muted)]">pipeline active</span>
      </div>

      {/* User menu */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(v => !v)}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[var(--s2)] transition-colors group"
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--l1), var(--l0))' }}
          >
            {initials}
          </div>
          <span className="hidden sm:block text-[12px] text-[var(--muted)] group-hover:text-[var(--text)] transition-colors">
            {displayName}
          </span>
          <span
            className="hidden sm:block font-mono text-[9px] px-1.5 py-0.5 rounded"
            style={{ color: PLAN_COLORS[plan], background: `${PLAN_COLORS[plan]}15` }}
          >
            {plan}
          </span>
          <span className="text-[10px] text-[var(--dim)]">{menuOpen ? '▲' : '▼'}</span>
        </button>

        {/* Dropdown */}
        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 w-52 bg-[var(--s1)] border border-[var(--border)] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-fadein">
            {/* User info */}
            <div className="px-3 py-3 border-b border-[var(--border)]">
              <p className="text-[13px] font-semibold text-[var(--text)] truncate">{displayName}</p>
              <p className="text-[11px] text-[var(--muted)] truncate">{user.email}</p>
            </div>

            {/* Menu items */}
            <div className="p-1">
              <button
                onClick={() => { setMenuOpen(false); router.push('/feed') }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[var(--s2)] transition-colors text-left"
              >
                <span className="text-[#00d4ff] text-[13px]">⚡</span>
                <span className="text-[13px] text-[var(--text)]">AIPulse Feed</span>
              </button>

              <button
                onClick={() => { setMenuOpen(false); router.push('/settings') }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[var(--s2)] transition-colors text-left"
              >
                <span className="text-[var(--muted)] text-[13px]">⚙</span>
                <span className="text-[13px] text-[var(--text)]">Settings & Preferences</span>
              </button>

              {plan === 'free' && (
                <button
                  onClick={() => { setMenuOpen(false); router.push('/#pricing') }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[var(--s2)] transition-colors text-left"
                >
                  <span className="text-[#7c6df8] text-[13px]">✨</span>
                  <span className="text-[13px] text-[var(--l0)]">Upgrade to Pro</span>
                </button>
              )}

              <div className="h-px bg-[var(--border)] my-1" />

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[var(--s2)] transition-colors text-left"
              >
                <span className="text-[var(--muted)] text-[13px]">→</span>
                <span className="text-[13px] text-[var(--muted)]">Sign out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
