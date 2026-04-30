'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#platform', label: 'Platform' },
    { href: '#agents', label: 'AI Agents' },
    { href: '#loop', label: 'Growth Loop' },
    { href: '#pricing', label: 'Pricing' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-300 ${
        scrolled ? 'bg-[rgba(8,9,14,0.7)] backdrop-blur-xl border-b border-[#1e1f30] shadow-2xl' : 'bg-transparent'
      }`}
    >
      <div className={`max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-16' : 'h-24'}`}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c6df8] to-[#00d4ff] flex items-center justify-center text-base font-black text-white shadow-[0_0_16px_rgba(124,109,248,0.4)] transition-transform group-hover:scale-105">
            N
          </div>
          <span className="text-lg font-extrabold tracking-[-0.03em] bg-gradient-to-r from-[#7c6df8] to-[#00d4ff] bg-clip-text text-transparent">
            Nexoraa
          </span>
        </Link>

        {/* Desktop nav - Floating Dock style */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-full border border-white/5 bg-black/20 backdrop-blur-md">
          {links.map((l, index) => (
            <a 
              key={l.href} 
              href={l.href}
              className="relative px-4 py-2 rounded-full text-[13px] font-medium text-[#8e8fa6] hover:text-white transition-colors z-10"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {hoveredIndex === index && (
                <motion.span
                  className="absolute inset-0 rounded-full bg-white/10 -z-10"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.15 } }}
                  exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
                />
              )}
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <a href="#contact" className="hidden md:block px-4 py-2 rounded-xl text-[13px] font-semibold text-white border border-[#2a2b40] transition-colors hover:bg-white/5">
            Sign in
          </a>
          
          <div className="hidden md:block">
            <a
              href="#waitlist"
              className="px-5 py-2 rounded-xl text-[13px] font-bold text-white bg-gradient-to-r from-[#7c6df8] to-[#00d4ff] hover:opacity-90 transition-opacity"
            >
              Start a Project
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden bg-transparent border-none text-white cursor-pointer p-1"
            aria-label="Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-[#0e0f18] border-t border-[#1e1f30] p-4 flex flex-col gap-2 absolute top-full left-0 right-0 shadow-2xl"
        >
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-medium text-[#8e8fa6] hover:bg-[#13141f] hover:text-white transition-colors">
              {l.label}
            </a>
          ))}
          <a href="#waitlist" onClick={() => setMobileOpen(false)} className="mt-2 px-3 py-3 rounded-lg bg-[#7c6df8] text-white text-sm font-bold text-center">
            Start a Project
          </a>
        </motion.div>
      )}
    </header>
  )
}
