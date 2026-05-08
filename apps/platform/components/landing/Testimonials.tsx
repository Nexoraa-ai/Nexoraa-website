'use client'

import { useState, useEffect, useRef } from 'react'

const TESTIMONIALS = [
  {
    quote: "Nexoraa is the first AI news tool that actually respects my time. The expert-level summaries save me 2+ hours of reading every morning.",
    name: "Arjun Mehta",
    role: "ML Engineer @ Sarvam AI",
    avatar: "AM",
    color: '#7c6df8',
    plan: 'pro',
  },
  {
    quote: "I've tried 8 AI newsletters. Nexoraa is the only one that understands that a developer needs different information than a PM. The vertical panels are genius.",
    name: "Priya Sharma",
    role: "Senior Engineer @ Zepto",
    avatar: "PS",
    color: '#00d4ff',
    plan: 'premium',
  },
  {
    quote: "The 72h news-to-challenge pipeline is what sold me. I'm not just reading about GPT-5 — I'm building with it the same week it drops.",
    name: "Rishi Kapoor",
    role: "Founder @ BuildWithAI",
    avatar: "RK",
    color: '#35d97a',
    plan: 'premium',
  },
  {
    quote: "As a CS student, I finally feel like I understand what's happening in AI, not just seeing scary headlines. The beginner summaries are perfect.",
    name: "Divya Nair",
    role: "CS @ IIT Bombay",
    avatar: "DN",
    color: '#f7a435',
    plan: 'pro',
  },
  {
    quote: "Our whole team uses Nexoraa now. It's replaced 3 newsletters, our Slack AI channel, and 30 minutes of daily Twitter doom-scrolling.",
    name: "Kiran Reddy",
    role: "CTO @ Zocket",
    avatar: "KR",
    color: '#f74470',
    plan: 'premium',
  },
  {
    quote: "I was skeptical about 'AI-curated AI news' but the deduplication alone is worth it. Same stories, 12 different sources — filtered to one clean card.",
    name: "Ananya Singh",
    role: "DevRel @ Anthropic India",
    avatar: "AS",
    color: '#a855f7',
    plan: 'pro',
  },
]

const STATS = [
  { value: '4.9/5', label: 'Average rating', sub: 'from 200+ reviews' },
  { value: '2h+', label: 'Time saved daily', sub: 'vs reading everything manually' },
  { value: '94%', label: 'Retention rate', sub: 'after 30 days' },
  { value: '12K+', label: 'Developers', sub: 'on the waitlist' },
]

export function Testimonials() {
  const [activeIdx, setActiveIdx] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function startAutoplay() {
    intervalRef.current = setInterval(() => {
      setActiveIdx(i => (i + 1) % TESTIMONIALS.length)
    }, 4000)
  }

  useEffect(() => {
    startAutoplay()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  function handleDotClick(i: number) {
    setActiveIdx(i)
    if (intervalRef.current) clearInterval(intervalRef.current)
    startAutoplay()
  }

  const active = TESTIMONIALS[activeIdx]

  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1e1f30] bg-[#0e0f18] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f74470]" />
            <span className="font-mono text-[11px] text-[#f74470] tracking-widest uppercase">Social proof</span>
          </div>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-tight text-[#e8e9f5] mb-3">
            Loved by AI developers
          </h2>
          <p className="text-[#565775] text-[15px] max-w-lg mx-auto">
            From students to senior engineers, Nexoraa is how the best developers stay ahead.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {STATS.map(stat => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-xl border border-[#1e1f30] bg-[#0e0f18] hover:border-[#2a2b40] transition-all duration-200"
            >
              <div className="text-2xl font-extrabold text-[#e8e9f5] mb-0.5">{stat.value}</div>
              <div className="text-[12px] font-semibold text-[#8587a8] mb-0.5">{stat.label}</div>
              <div className="font-mono text-[9px] text-[#383960]">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Featured quote */}
        <div className="relative mb-8">
          <div
            className="absolute inset-0 rounded-2xl transition-all duration-500"
            style={{ background: `radial-gradient(ellipse at 50% 0%, ${active.color}08, transparent 70%)` }}
          />
          <div
            className="relative rounded-2xl border p-8 md:p-10 transition-all duration-300"
            style={{ borderColor: `${active.color}20`, background: '#0d0e1c' }}
          >
            {/* Quote mark */}
            <div
              className="text-6xl font-bold leading-none mb-4 transition-colors duration-300"
              style={{ color: `${active.color}25` }}
            >
              "
            </div>
            <p className="text-[17px] md:text-[19px] text-[#c8c9df] leading-relaxed font-medium mb-6 transition-all duration-300">
              {active.quote}
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0 transition-all duration-300"
                style={{ background: `linear-gradient(135deg, ${active.color}, ${active.color}80)` }}
              >
                {active.avatar}
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#e8e9f5]">{active.name}</p>
                <p className="text-[12px] text-[#565775]">{active.role}</p>
              </div>
              <div className="ml-auto">
                <span
                  className="font-mono text-[9px] px-2 py-0.5 rounded"
                  style={{ color: active.color, background: `${active.color}15` }}
                >
                  {active.plan}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dots + all cards below */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: activeIdx === i ? 24 : 6,
                height: 6,
                background: activeIdx === i ? TESTIMONIALS[i].color : '#2a2b40',
              }}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>

        {/* Grid of all testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              onClick={() => handleDotClick(i)}
              className="rounded-xl border p-4 cursor-pointer transition-all duration-200 hover:scale-[1.01]"
              style={{
                borderColor: activeIdx === i ? `${t.color}30` : '#1e1f30',
                background: activeIdx === i ? `${t.color}05` : '#0e0f18',
              }}
            >
              <p className="text-[12px] text-[#565775] leading-relaxed mb-3 line-clamp-3">{t.quote}</p>
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                  style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}80)` }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#8587a8]">{t.name}</p>
                  <p className="text-[10px] text-[#383960]">{t.role.split('@')[1]?.trim() ?? t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
