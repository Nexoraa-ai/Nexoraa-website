'use client'

import { useState } from 'react'
import Link from 'next/link'

const PLANS = [
  {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    color: '#565775',
    description: 'Start reading the most important AI stories every day.',
    cta: 'Get started',
    ctaHref: '/signup',
    highlight: false,
    features: [
      { text: 'Top 5 stories/day (priority ≥ 70)', included: true },
      { text: 'Beginner + intermediate summaries', included: true },
      { text: 'Category filtering', included: true },
      { text: '2 verticals (web-dev + data-ml)', included: true },
      { text: 'Expert summaries (ML-level)', included: false },
      { text: 'All 8 industry impact panels', included: false },
      { text: 'Daily digest email', included: false },
      { text: 'Unlimited feed + streak tracking', included: false },
    ],
  },
  {
    name: 'Pro',
    price: { monthly: 499, yearly: 399 },
    color: '#00d4ff',
    description: 'For developers who want the full signal with no noise.',
    cta: 'Start 7-day free trial',
    ctaHref: '/signup?plan=pro',
    highlight: true,
    badge: 'Most popular',
    features: [
      { text: 'Unlimited feed (priority ≥ 50)', included: true },
      { text: 'All 3 summary levels (beginner → expert)', included: true },
      { text: 'All 8 industry impact verticals', included: true },
      { text: 'Daily digest email at your level', included: true },
      { text: 'Streak tracking + badges', included: true },
      { text: 'Custom vertical + reading level', included: true },
      { text: 'Early access to L1–L6', included: false },
      { text: 'API access', included: false },
    ],
  },
  {
    name: 'Premium',
    price: { monthly: 999, yearly: 799 },
    color: '#7c6df8',
    description: 'The complete platform — everything, the moment it ships.',
    cta: 'Start 7-day free trial',
    ctaHref: '/signup?plan=premium',
    highlight: false,
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Early access to L1 Learn (beta)', included: true },
      { text: 'Early access to L2 Build (beta)', included: true },
      { text: 'Early access to L3–L6 as they ship', included: true },
      { text: 'API access (feed + search)', included: true },
      { text: 'Priority support + Discord access', included: true },
      { text: 'Team seats (coming soon)', included: true },
      { text: 'Custom digest frequency', included: true },
    ],
  },
]

export function Pricing() {
  const [yearly, setYearly] = useState(false)
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)

  return (
    <section id="pricing" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1e1f30] bg-[#0e0f18] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f7a435]" />
            <span className="font-mono text-[11px] text-[#f7a435] tracking-widest uppercase">Pricing</span>
          </div>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-tight text-[#e8e9f5] mb-3">
            Simple, transparent pricing
          </h2>
          <p className="text-[#565775] text-[15px] max-w-lg mx-auto mb-8">
            Start free. Upgrade when you need the full signal.
            All prices in INR.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-0 bg-[#0e0f18] border border-[#1e1f30] rounded-xl p-1">
            <button
              onClick={() => setYearly(false)}
              className={[
                'px-5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200',
                !yearly ? 'bg-[#1a1b28] text-[#e8e9f5] shadow-sm' : 'text-[#565775] hover:text-[#8587a8]',
              ].join(' ')}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={[
                'px-5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 flex items-center gap-2',
                yearly ? 'bg-[#1a1b28] text-[#e8e9f5] shadow-sm' : 'text-[#565775] hover:text-[#8587a8]',
              ].join(' ')}
            >
              Yearly
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#35d97a]/10 text-[#35d97a] border border-[#35d97a]/25">
                save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map(plan => {
            const isHovered = hoveredPlan === plan.name
            return (
              <div
                key={plan.name}
                className="relative flex flex-col rounded-2xl p-px transition-all duration-300 cursor-default"
                style={{
                  transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                  background: plan.highlight
                    ? `linear-gradient(135deg, ${plan.color}40, transparent 60%)`
                    : isHovered
                    ? `linear-gradient(135deg, ${plan.color}20, transparent 60%)`
                    : '#1e1f30',
                }}
                onMouseEnter={() => setHoveredPlan(plan.name)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                {/* Inner card */}
                <div
                  className="flex flex-col flex-1 rounded-[15px] p-6"
                  style={{
                    background: plan.highlight ? '#0d0e1c' : '#0e0f18',
                    boxShadow: plan.highlight
                      ? `0 0 60px ${plan.color}18`
                      : isHovered
                      ? `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${plan.color}10`
                      : '0 4px 20px rgba(0,0,0,0.3)',
                  }}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span
                        className="font-mono text-[9px] font-bold px-3 py-1 rounded-full"
                        style={{ background: plan.color, color: '#08090e' }}
                      >
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* Plan header */}
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: plan.color, boxShadow: `0 0 8px ${plan.color}` }}
                      />
                      <span
                        className="font-mono text-[11px] font-bold"
                        style={{ color: plan.color }}
                      >
                        {plan.name}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1 mb-2">
                      {plan.price.monthly === 0 ? (
                        <span className="text-4xl font-extrabold text-[#e8e9f5]">Free</span>
                      ) : (
                        <>
                          <span className="text-lg font-bold text-[#565775]">₹</span>
                          <span className="text-4xl font-extrabold text-[#e8e9f5]">
                            {yearly ? plan.price.yearly : plan.price.monthly}
                          </span>
                          <span className="text-[13px] text-[#565775]">/ mo</span>
                          {yearly && (
                            <span className="font-mono text-[9px] text-[#35d97a] ml-1">
                              billed yearly
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    <p className="text-[12px] text-[#565775] leading-relaxed">{plan.description}</p>
                  </div>

                  {/* CTA */}
                  <Link
                    href={plan.ctaHref}
                    className={[
                      'w-full py-2.5 rounded-xl text-[13px] font-bold text-center transition-all duration-200 mb-6 block',
                    ].join(' ')}
                    style={plan.highlight
                      ? {
                          background: plan.color,
                          color: '#08090e',
                          boxShadow: isHovered ? `0 0 24px ${plan.color}60` : 'none',
                        }
                      : {
                          background: 'transparent',
                          border: `1px solid ${plan.color}30`,
                          color: plan.color,
                        }
                    }
                  >
                    {plan.cta}
                  </Link>

                  {/* Features */}
                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map(feat => (
                      <li key={feat.text} className="flex items-start gap-2.5">
                        <span
                          className="shrink-0 mt-0.5 text-[11px] font-bold"
                          style={{ color: feat.included ? plan.color : '#2a2b40' }}
                        >
                          {feat.included ? '✓' : '×'}
                        </span>
                        <span
                          className="text-[12px] leading-snug"
                          style={{ color: feat.included ? '#8587a8' : '#383960' }}
                        >
                          {feat.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

        {/* Enterprise */}
        <div className="mt-10 text-center p-6 rounded-2xl border border-[#1e1f30] bg-[#0e0f18]">
          <p className="text-[14px] text-[#565775]">
            Need enterprise, white-label, or team plans?{' '}
            <a href="mailto:hello@nexoraa.in" className="text-[#00d4ff] hover:underline font-medium">
              Contact us →
            </a>
            <span className="mx-3 text-[#2a2b40]">·</span>
            <span className="text-[#383960]">Custom pricing for teams of 5+</span>
          </p>
        </div>
      </div>
    </section>
  )
}
