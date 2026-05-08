'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import type { UserPlan } from '@neuralforge/types'

const LAYERS = [
  { num: '00', label: 'AIPulse', href: '/feed', color: 'var(--l0)', active: true },
  { num: '01', label: 'Learn', href: '/learn', color: 'var(--l1)', active: false },
  { num: '02', label: 'Build', href: '/challenges', color: 'var(--l2)', active: false },
  { num: '03', label: 'Compete', href: '/compete', color: 'var(--l3)', active: false },
  { num: '04', label: 'Community', href: '/community', color: 'var(--l4)', active: false },
  { num: '05', label: 'AI Agents', href: '/agents', color: 'var(--l5)', active: false },
  { num: '06', label: 'Freelance', href: '/freelance', color: 'var(--l6)', active: false },
]

const PLAN_STYLES: Record<UserPlan, { label: string; color: string }> = {
  free: { label: 'Free', color: '#565775' },
  pro: { label: 'Pro', color: '#00d4ff' },
  premium: { label: 'Premium', color: '#7c6df8' },
  enterprise: { label: 'Enterprise', color: '#f5c842' },
}

interface SidebarProps {
  user: User
  profile: {
    display_name?: string | null
    plan?: UserPlan | null
    current_streak?: number | null
  } | null
}

export function Sidebar({ user, profile }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [hoveredHref, setHoveredHref] = useState<string | null>(null)
  const plan = (profile?.plan ?? 'free') as UserPlan
  const planStyle = PLAN_STYLES[plan]
  const streak = profile?.current_streak ?? 0
  const initials = (profile?.display_name ?? user.email ?? '?')[0].toUpperCase()

  return (
    <aside className="hidden md:flex flex-col w-52 shrink-0 border-r border-[var(--border)] bg-[var(--s1)]">
      {/* Logo */}
      <div className="px-4 pt-4 pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, rgba(124,109,248,0.2), rgba(0,212,255,0.15))',
              border: '1px solid rgba(0,212,255,0.2)',
              boxShadow: '0 0 8px rgba(0,212,255,0.1)',
            }}
          >
            <span className="text-[11px] font-bold text-[#00d4ff] font-mono">N</span>
          </div>
          <span className="font-mono text-[11px] font-bold text-[#00d4ff] tracking-[0.15em] uppercase">
            Nexoraa
          </span>
        </div>
      </div>

      {/* Layer nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {LAYERS.map(layer => {
          const isActive = pathname === layer.href || pathname.startsWith(layer.href + '/')
          const isHovered = hoveredHref === layer.href
          return (
            <Link
              key={layer.href}
              href={layer.active ? layer.href : '#'}
              onMouseEnter={() => layer.active && setHoveredHref(layer.href)}
              onMouseLeave={() => setHoveredHref(null)}
              className={[
                'flex items-center gap-2.5 px-2 py-2 rounded-lg transition-all duration-200',
                isActive && layer.active ? 'bg-[var(--s3)] border border-[var(--border)]' : '',
                layer.active && !isActive ? 'hover:bg-[var(--s2)]' : '',
                !layer.active ? 'opacity-30 cursor-not-allowed pointer-events-none' : '',
              ].join(' ')}
              style={
                isActive && layer.active
                  ? { boxShadow: `0 0 12px ${layer.color}15` }
                  : isHovered && layer.active
                  ? { boxShadow: `0 0 8px ${layer.color}10` }
                  : undefined
              }
            >
              <span
                className="font-mono text-[10px] font-bold w-6 shrink-0 transition-all duration-200"
                style={{
                  color: isActive && layer.active
                    ? layer.color
                    : isHovered && layer.active
                    ? layer.color
                    : 'var(--dim)',
                  textShadow: (isActive || isHovered) && layer.active
                    ? `0 0 8px ${layer.color}60`
                    : 'none',
                }}
              >
                {layer.num}
              </span>
              <span
                className={[
                  'text-[13px] font-medium flex-1 transition-colors duration-200',
                  isActive && layer.active
                    ? 'text-[var(--text)]'
                    : 'text-[var(--muted)]',
                  isHovered && layer.active && !isActive ? 'text-[var(--text)]' : '',
                ].join(' ')}
              >
                {layer.label}
              </span>
              {!layer.active && (
                <span className="font-mono text-[8px] text-[var(--dim)] border border-[var(--border)] px-1 py-0.5 rounded">
                  soon
                </span>
              )}
              {isActive && layer.active && (
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse"
                  style={{ background: layer.color, boxShadow: `0 0 6px ${layer.color}` }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-[var(--border)] p-3 space-y-2">
        {streak > 0 && (
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[var(--s2)]">
            <span className="text-[12px]">🔥</span>
            <span className="font-mono text-[10px] text-[#f7a435]">{streak}-day streak</span>
          </div>
        )}

        <div
          className="flex items-center gap-2 px-2 group cursor-pointer hover:bg-[var(--s2)] rounded-lg py-1.5 transition-all duration-200"
          role="button"
          onClick={() => router.push('/settings')}
          title="Settings & Preferences"
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 transition-all duration-200 group-hover:scale-105"
            style={{ background: 'linear-gradient(135deg, var(--l1), var(--l0))' }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-[var(--text)] truncate">
              {profile?.display_name ?? user.email?.split('@')[0] ?? 'User'}
            </p>
            <span
              className="font-mono text-[9px] px-1.5 py-0.5 rounded"
              style={{ color: planStyle.color, background: `${planStyle.color}15` }}
            >
              {planStyle.label}
            </span>
          </div>
          <span className="text-[var(--dim)] text-[11px] opacity-0 group-hover:opacity-100 transition-opacity">⚙</span>
        </div>

        {plan === 'free' && (
          <Link
            href="/#pricing"
            className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg border border-[#00d4ff]/20 bg-[#00d4ff]/5 text-[11px] font-semibold text-[#00d4ff] transition-all duration-200 hover:bg-[#00d4ff]/10 hover:border-[#00d4ff]/35 hover:shadow-[0_0_12px_rgba(0,212,255,0.12)]"
          >
            ⚡ Upgrade to Pro
          </Link>
        )}
      </div>
    </aside>
  )
}
