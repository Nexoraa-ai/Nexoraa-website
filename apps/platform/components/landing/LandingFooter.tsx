'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const SOCIAL = [
  {
    label: 'X / Twitter',
    href: 'https://twitter.com/nexoraa_in',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/nexoraa',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: 'Discord',
    href: 'https://discord.gg/nexoraa',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
      </svg>
    ),
  },
]

const FOOTER_LINKS = [
  {
    title: 'Platform',
    links: [
      { label: 'AIPulse Feed', href: '/feed' },
      { label: 'Features', href: '#features' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Pricing', href: '#pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: 'mailto:hello@nexoraa.in' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign up', href: '/signup' },
      { label: 'Sign in', href: '/login' },
      { label: 'Settings', href: '/settings' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
]

export function LandingFooter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleJoinWaitlist(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || status === 'loading') return
    setStatus('loading')
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('waitlist')
        .insert({ name: email.split('@')[0], email: email.trim(), source: 'landing-footer' })
      if (error && error.code !== '23505') throw error
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <footer className="relative overflow-hidden">
      {/* CTA block */}
      <div className="relative py-28 px-4 overflow-hidden">
        {/* Gradient orb */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(124,109,248,0.18) 0%, transparent 65%)' }}
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-px pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.3), transparent)' }}
        />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1e1f30] bg-[#0e0f18]/80 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-pulse" />
            <span className="font-mono text-[11px] text-[#00d4ff] tracking-widest uppercase">Start today</span>
          </div>

          <h3 className="text-[clamp(2rem,5vw,3.2rem)] font-extrabold tracking-tight text-[#e8e9f5] mb-4 leading-tight">
            The AI wave won't wait.
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(95deg, #7c6df8, #00d4ff)' }}
            >
              Neither should you.
            </span>
          </h3>

          <p className="text-[#565775] text-[15px] mb-10 max-w-md mx-auto leading-relaxed">
            Join developers who start every morning with the most important AI news, summarized at their level.
          </p>

          {/* Waitlist form */}
          {status === 'success' ? (
            <div className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-[#35d97a]/30 bg-[#35d97a]/05">
              <span className="text-[#35d97a]">✓</span>
              <span className="text-[14px] font-semibold text-[#35d97a]">You're on the list! We'll be in touch.</span>
            </div>
          ) : (
            <form onSubmit={handleJoinWaitlist} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-3 rounded-xl bg-[#0e0f18] border border-[#2a2b40] text-[#e8e9f5] text-[14px] placeholder:text-[#383960] focus:outline-none focus:border-[#00d4ff]/40 focus:shadow-[0_0_0_3px_rgba(0,212,255,0.06)] transition-all"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-3 rounded-xl bg-[#00d4ff] text-[#08090e] font-bold text-[14px] hover:shadow-[0_0_28px_rgba(0,212,255,0.45)] transition-all disabled:opacity-60 hover:scale-[1.03] whitespace-nowrap"
              >
                {status === 'loading' ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border border-[#08090e]/40 border-t-[#08090e] rounded-full animate-spin" />
                    Joining…
                  </span>
                ) : (
                  'Join waitlist →'
                )}
              </button>
            </form>
          )}
          {status === 'error' && (
            <p className="text-[12px] text-[#f74470] mt-2">Something went wrong. Try again.</p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-[#00d4ff]/25 text-[#00d4ff] text-[13px] font-semibold hover:bg-[#00d4ff]/05 hover:border-[#00d4ff]/40 transition-all"
            >
              ⚡ Create account now
            </Link>
          </div>
        </div>
      </div>

      {/* Footer links section */}
      <div className="border-t border-[#1e1f30] bg-[#08090e]">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand column */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(124,109,248,0.25), rgba(0,212,255,0.2))',
                    border: '1px solid rgba(0,212,255,0.25)',
                  }}
                >
                  <span className="text-[12px] font-bold text-[#00d4ff] font-mono">N</span>
                </div>
                <span className="font-mono text-[11px] font-bold text-[#565775] tracking-[0.15em] uppercase">Nexoraa</span>
              </div>
              <p className="text-[12px] text-[#383960] leading-relaxed mb-5">
                The AI Work OS for developers who don't want to fall behind.
              </p>
              {/* Social links */}
              <div className="flex items-center gap-2">
                {SOCIAL.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-8 h-8 rounded-lg border border-[#1e1f30] bg-[#0e0f18] flex items-center justify-center text-[#383960] hover:text-[#00d4ff] hover:border-[#00d4ff]/30 transition-all duration-200"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {FOOTER_LINKS.map(group => (
              <div key={group.title}>
                <h4 className="font-mono text-[10px] text-[#383960] uppercase tracking-widest mb-4">
                  {group.title}
                </h4>
                <ul className="space-y-2.5">
                  {group.links.map(link => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[13px] text-[#565775] hover:text-[#e8e9f5] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[#1a1b28]">
            <p className="font-mono text-[10px] text-[#2a2b40]">
              © {new Date().getFullYear()} Nexoraa · Built for Indian developers
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="font-mono text-[10px] text-[#2a2b40] hover:text-[#383960] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="font-mono text-[10px] text-[#2a2b40] hover:text-[#383960] transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
