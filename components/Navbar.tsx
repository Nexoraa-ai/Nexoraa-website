"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'

const nav = [
  { href: '#units', label: 'Business Units' },
  { href: '/cases', label: 'Case Studies' },
  { href: '/blog', label: 'Blog' },
  { href: '#approach', label: 'Approach' },
  { href: '/contact', label: 'Contact' }
]

export default function Navbar() {
  const [logoSrc, setLogoSrc] = useState('/logo.svg')
  useEffect(() => {
    let mounted = true
    fetch('/nexoraa-logo.png', { method: 'HEAD' }).then((res) => {
      if (!mounted) return
      if (res.ok) setLogoSrc('/nexoraa-logo.png')
    }).catch(() => {})
    return () => { mounted = false }
  }, [])
  return (
    <header className="sticky top-0 z-40 border-b border-white/10">
      <div className="relative mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
        {/* High-contrast navbar tint + animated aurora */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 backdrop-blur supports-[backdrop-filter]:bg-[#0a0f1d]/80">
          <div className="absolute -top-16 left-1/3 h-40 w-72 rounded-full bg-[#0b6bff]/15 blur-2xl animate-aurora" />
          <div className="absolute -bottom-20 right-1/3 h-32 w-56 rounded-full bg-[#00e0ff]/12 blur-2xl animate-aurora-slow" />
        </div>
        <Link href="/" className="flex items-center gap-3">
          <img
            src={logoSrc}
            alt="Nexoraa"
            height={34}
            className="h-[34px] w-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
          />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-200">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="hover:text-white transition-colors">
              {n.label}
            </a>
          ))}
        </nav>
        <a href="/contact" className="rounded-md bg-white/10 px-4 py-2 text-sm ring-1 ring-white/15 hover:bg-white/15">Talk to us</a>
      </div>
    </header>
  )
}
