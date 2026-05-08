'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header
        className={[
          'fixed top-0 inset-x-0 z-50 transition-all duration-500',
          scrolled ? 'py-2' : 'py-0',
        ].join(' ')}
      >
        <div
          className={[
            'mx-auto transition-all duration-500',
            scrolled
              ? 'max-w-5xl mx-4 sm:mx-auto px-4 rounded-2xl bg-[#08090e]/85 backdrop-blur-xl border border-[#1e1f30] shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
              : 'max-w-6xl px-4 sm:px-6',
          ].join(' ')}
        >
          <div className="h-14 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, rgba(124,109,248,0.25), rgba(0,212,255,0.2))',
                  border: '1px solid rgba(0,212,255,0.3)',
                  boxShadow: '0 0 12px rgba(0,212,255,0.15)',
                }}
              >
                <span className="text-[12px] font-bold text-[#00d4ff] font-mono">N</span>
              </div>
              <span className="font-mono text-[12px] font-bold text-[#00d4ff] tracking-[0.15em] uppercase group-hover:text-white transition-colors">
                Nexoraa
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {LINKS.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative px-3 py-2 text-[13px] text-[#565775] hover:text-[#e8e9f5] transition-colors duration-200 group"
                >
                  {link.label}
                  <span className="absolute bottom-1 left-3 right-3 h-px bg-[#00d4ff] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                </a>
              ))}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/login"
                className="text-[13px] text-[#565775] hover:text-[#e8e9f5] transition-colors px-3 py-1.5"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="text-[13px] font-semibold bg-[#00d4ff] text-[#08090e] px-4 py-1.5 rounded-xl transition-all duration-200 hover:shadow-[0_0_24px_rgba(0,212,255,0.5)] hover:scale-[1.03]"
              >
                Get started →
              </Link>
            </div>

            {/* Mobile: hamburger */}
            <button
              className="md:hidden flex flex-col items-center justify-center w-9 h-9 gap-1.5 rounded-lg hover:bg-[#1e1f30] transition-colors"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
            >
              <span
                className="w-5 h-px bg-[#e8e9f5] transition-all duration-300 origin-center"
                style={{ transform: menuOpen ? 'translateY(3px) rotate(45deg)' : 'none' }}
              />
              <span
                className="w-5 h-px bg-[#e8e9f5] transition-all duration-300"
                style={{ opacity: menuOpen ? 0 : 1 }}
              />
              <span
                className="w-5 h-px bg-[#e8e9f5] transition-all duration-300 origin-center"
                style={{ transform: menuOpen ? 'translateY(-3px) rotate(-45deg)' : 'none' }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      <div
        className="fixed inset-0 z-40 md:hidden transition-all duration-300 flex flex-col"
        style={{
          background: '#08090e',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* Gradient blob */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(124,109,248,0.15) 0%, transparent 70%)' }} />

        <div className="flex flex-col h-full pt-20 px-6 pb-8">
          <nav className="flex flex-col gap-1 flex-1">
            {LINKS.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-4 rounded-xl text-[18px] font-semibold text-[#8587a8] hover:text-[#e8e9f5] hover:bg-[#1e1f30] transition-all duration-200"
                style={{
                  transitionDelay: menuOpen ? `${i * 60}ms` : '0ms',
                  transform: menuOpen ? 'translateX(0)' : 'translateX(20px)',
                  opacity: menuOpen ? 1 : 0,
                }}
              >
                <span className="font-mono text-[11px] text-[#383960]">0{i + 1}</span>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3 mt-auto">
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="w-full py-3 rounded-xl text-center text-[15px] font-semibold text-[#565775] border border-[#1e1f30] hover:border-[#2a2b40] transition-all"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              onClick={() => setMenuOpen(false)}
              className="w-full py-3 rounded-xl text-center text-[15px] font-bold bg-[#00d4ff] text-[#08090e] hover:shadow-[0_0_24px_rgba(0,212,255,0.4)] transition-all"
            >
              Get started free →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
