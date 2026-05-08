'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const SAMPLE_ITEMS = [
  { cat: 'model release', catColor: '#00d4ff', title: 'OpenAI releases GPT-5 with 2× efficiency gains and extended context window', pri: 94, sources: 12 },
  { cat: 'research paper', catColor: '#7c6df8', title: 'Google DeepMind: Gemini 2.5 achieves state-of-the-art on 32 benchmarks', pri: 88, sources: 8 },
  { cat: 'tool launch', catColor: '#35d97a', title: 'Vercel AI SDK v5 ships with native streaming primitives and MCP support', pri: 76, sources: 5 },
  { cat: 'funding', catColor: '#f5c842', title: 'Mistral AI raises $600M Series C at $6B valuation for open-source LLMs', pri: 71, sources: 9 },
]

function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{
    id: number; x: number; y: number; size: number; delay: number; duration: number; color: string
  }>>([])

  useEffect(() => {
    const colors = ['#00d4ff', '#7c6df8', '#f74470', '#35d97a', '#f7a435']
    setParticles(
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 4,
        duration: Math.random() * 6 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
      }))
    )
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full animate-float-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  )
}

export function Hero() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-4 overflow-hidden">
      {/* Aurora blobs */}
      <div
        className="pointer-events-none absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full opacity-60"
        style={{ background: 'radial-gradient(ellipse, rgba(124,109,248,0.18) 0%, transparent 65%)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-48 -left-32 w-[600px] h-[600px] rounded-full opacity-60"
        style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.12) 0%, transparent 65%)' }}
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-30"
        style={{ background: 'radial-gradient(ellipse, rgba(247,68,112,0.06) 0%, transparent 65%)' }}
      />

      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #7c6df8 1px, transparent 0)',
          backgroundSize: '36px 36px',
        }}
      />

      <FloatingParticles />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Live badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#1e1f30] bg-[#0e0f18]/80 mb-8 backdrop-blur-sm"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-pulse" />
          <span className="font-mono text-[11px] text-[#565775]">
            Layer 0 · AIPulse · Pipeline active
          </span>
          <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/20">
            LIVE
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-[clamp(2.6rem,6.5vw,5rem)] font-extrabold leading-[1.06] tracking-tight mb-6"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
          }}
        >
          <span className="text-[#e8e9f5]">Stay ahead of</span>
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(95deg, #7c6df8 10%, #00d4ff 55%, #35d97a 100%)' }}
          >
            every AI breakthrough
          </span>
        </h1>

        {/* Subheading */}
        <p
          className="text-[1.1rem] text-[#565775] leading-relaxed max-w-2xl mx-auto mb-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s',
          }}
        >
          Nexoraa ingests <span className="text-[#8587a8]">500+ AI sources</span>, deduplicates stories, and surfaces
          what matters — summarized at your reading level. Then helps you{' '}
          <span className="text-[#8587a8]">learn it, build with it, and compete on it</span>.
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-wrap items-center justify-center gap-3 mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s',
          }}
        >
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#00d4ff] text-[#08090e] font-bold text-[15px] rounded-xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,212,255,0.5)] hover:scale-[1.03]"
          >
            Start for free
            <span className="text-[13px]">→</span>
          </Link>
          <Link
            href="/feed"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#0e0f18] border border-[#2a2b40] text-[#e8e9f5] font-semibold text-[15px] rounded-xl hover:border-[#3a3b55] hover:bg-[#13141f] transition-all duration-200"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#35d97a] animate-pulse" />
            View live feed
          </Link>
        </div>

        {/* Product mockup */}
        <div
          className="relative max-w-2xl mx-auto"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
            transition: 'opacity 0.9s ease 0.4s, transform 0.9s ease 0.4s',
          }}
        >
          {/* Glow behind card */}
          <div className="absolute inset-x-16 -top-6 h-20 bg-[#7c6df8]/25 blur-3xl rounded-full" />
          <div className="absolute inset-x-16 -bottom-4 h-12 bg-[#00d4ff]/15 blur-2xl rounded-full" />

          <div className="relative bg-[#0d0e1a] border border-[#1e1f30] rounded-2xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.7)]">
            {/* Window bar */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#1e1f30] bg-[#0a0b14]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#f74470]/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#f7a435]/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#35d97a]/60" />
              <span className="ml-3 font-mono text-[10px] text-[#2a2b40]">AIPulse — Nexoraa</span>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-pulse" />
                <span className="font-mono text-[9px] text-[#383960]">live pipeline</span>
              </div>
            </div>

            {/* Feed items */}
            <div className="divide-y divide-[#1a1b28]">
              {SAMPLE_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className="px-4 py-3 flex items-start gap-3 hover:bg-[#12131e] transition-colors cursor-pointer"
                  style={{
                    borderLeft: `2px solid ${item.catColor}`,
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateX(0)' : 'translateX(-12px)',
                    transition: `opacity 0.5s ease ${0.5 + i * 0.1}s, transform 0.5s ease ${0.5 + i * 0.1}s`,
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded"
                        style={{ color: item.catColor, background: `${item.catColor}15` }}
                      >
                        {item.cat}
                      </span>
                      <span className="font-mono text-[9px] text-[#2a2b40]">P{item.pri}</span>
                      <span className="font-mono text-[9px] text-[#2a2b40] ml-auto">{item.sources} sources</span>
                    </div>
                    <p className="text-[12px] text-[#c8c9df] font-medium leading-snug line-clamp-1">
                      {item.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Level toggle */}
            <div className="px-4 py-2.5 border-t border-[#1e1f30] bg-[#0a0b14] flex items-center justify-between">
              <span className="font-mono text-[9px] text-[#2a2b40]">reading level</span>
              <div className="flex items-center gap-0.5 bg-[#12131e] rounded-lg p-0.5">
                {[{ l: '101', active: false }, { l: 'dev', active: true }, { l: 'ml', active: false }].map(({ l, active }) => (
                  <span
                    key={l}
                    className="font-mono text-[9px] px-2.5 py-1 rounded-md transition-all"
                    style={active
                      ? { background: '#00d4ff', color: '#08090e', fontWeight: 700 }
                      : { color: '#383960' }
                    }
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          className="flex flex-wrap items-center justify-center gap-8 mt-14 pt-10 border-t border-[#1e1f30]"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.7s ease 0.9s',
          }}
        >
          {[
            { value: '500+', label: 'AI sources ingested', color: '#00d4ff' },
            { value: '3 levels', label: 'Beginner → Expert', color: '#7c6df8' },
            { value: '8 verticals', label: 'Role-specific impact', color: '#35d97a' },
            { value: '7 layers', label: 'Full Work OS', color: '#f7a435' },
          ].map(stat => (
            <div key={stat.label} className="text-center group">
              <div
                className="text-xl font-bold mb-0.5 transition-all duration-200 group-hover:scale-110"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="font-mono text-[10px] text-[#383960] mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
