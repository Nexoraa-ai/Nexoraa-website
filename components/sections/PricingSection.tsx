'use client'

import { motion } from 'framer-motion'

const plans = [
  {
    name: 'Free', price: '₹0', sub: 'Forever', color: '#565775', feat: false,
    items: ['3 news items/day', 'Beginner summaries only', '5 swipes/day', '10 challenges/month', '7-day streak', 'Weekly contest (view)', 'Community feed (read)'],
  },
  {
    name: 'Pro', price: '₹999', sub: '₹7,999/yr · $19/mo', color: '#7c6df8', feat: true,
    items: ['Unlimited news + all levels', 'All industries (8)', 'Unlimited swipe', 'Unlimited challenges', 'Editorial solutions', 'Weekly contest participation', 'Video courses', 'Flashcard system', 'Learning paths + certs'],
  },
  {
    name: 'Premium', price: '₹1,999', sub: '₹14,999/yr · $29/mo', color: '#f7a435', feat: false,
    items: ['Everything in Pro', 'GPU-enabled labs', 'AI Security CTF access', 'Mock AI interview sim', 'Company-specific problems', 'Priority hackathon support'],
  },
  {
    name: 'AI Agent', price: '₹499+', sub: 'Solo · Squad · Dept', color: '#ff6b35', feat: false,
    items: ['Solo: ₹499–₹1,999/mo', 'Squad (2–5): ₹2,499–₹4,999', 'Department: ₹9,999–₹24,999', 'Credits: ₹199/50 tasks', 'Try 3 tasks free', 'Deep customization'],
  },
  {
    name: 'Enterprise', price: 'Custom', sub: '₹20K–30K/seat/yr', color: '#f5c842', feat: false,
    items: ['SSO + LMS integration', 'Admin dashboard', 'Custom learning paths', 'Talent marketplace access', 'Sponsored hackathons', 'Placement fees'],
  },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-6 md:px-12 border-b border-[#1e1f30]">
      <div className="max-w-[1400px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-[clamp(28px,4vw,42px)] font-extrabold tracking-[-0.02em] mb-4 text-white">
            Simple, transparent pricing.
          </h2>
          <p className="text-base text-[#565775] max-w-[600px] mx-auto leading-relaxed">
            Start building and learning for free. Upgrade when you need GPU compute, dedicated AI agents, or enterprise scale.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {plans.map((p, i) => (
            <motion.div 
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className={`rounded-[20px] p-6 flex flex-col ${
                p.feat 
                  ? 'bg-gradient-to-b from-[rgba(124,109,248,0.08)] to-[#0e0f18] border border-[#7c6df8] shadow-[0_0_30px_rgba(124,109,248,0.15)] relative z-10 scale-105' 
                  : 'bg-[#0e0f18] border border-[#1e1f30]'
              }`}
            >
              {p.feat && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#7c6df8] text-white text-[10px] font-bold tracking-widest uppercase rounded-full">
                  Most Popular
                </div>
              )}
              
              <div className="text-[11px] text-[#8e8fa6] font-bold uppercase tracking-[0.1em] mb-2">{p.name}</div>
              <div className="font-mono text-3xl font-extrabold mb-1" style={{ color: p.color }}>{p.price}</div>
              <div className="text-[11px] text-[#565775] mb-6 font-medium">{p.sub}</div>
              
              <ul className="list-none text-left flex-1 space-y-3 mb-8">
                {p.items.map(item => (
                  <li key={item} className="text-[13px] text-[#8e8fa6] flex items-start gap-2.5">
                    <span className="text-[#35d97a] shrink-0">✓</span>
                    <span className="leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-auto">
                {p.feat ? (
                  <a
                    href="#waitlist"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7c6df8] to-[#00d4ff] text-white text-[13px] font-bold text-center block hover:opacity-90 transition-opacity"
                  >
                    Start Free Trial
                  </a>
                ) : (
                  <a href="#waitlist" className="block w-full py-2.5 rounded-xl border border-[#2a2b40] text-white text-[13px] font-bold text-center transition-colors hover:bg-[#13141f]">
                    Get Started
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
