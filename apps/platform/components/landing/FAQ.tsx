'use client'

import { useState } from 'react'

const FAQS = [
  {
    q: 'What makes Nexoraa different from just following AI Twitter?',
    a: 'Nexoraa ingests 500+ sources, deduplicates stories (so you see one story, not 12 retweets), scores them by priority, and gives you a clean feed at your reading level. Twitter gives you raw noise. Nexoraa gives you signal.',
  },
  {
    q: 'What does "3 reading levels" mean in practice?',
    a: 'Every story gets three summaries in a single LLM call: Beginner (~200 words, plain English, "what happened and why you should care"), Intermediate (~100 words, for working devs, includes model names and API changes), Expert (~50 words, dense, for ML engineers, covers architecture and methodology). Toggle between them instantly — no re-fetch.',
  },
  {
    q: 'How fresh is the feed? When do new stories appear?',
    a: 'RSS sources (arXiv, lab blogs, aggregators) are polled every 30 minutes. X/Twitter is scraped once daily at 6am IST to control costs. Reddit is fetched every 30 minutes. Stories appear in your feed within minutes of ingestion once they complete the pipeline (dedup → classify → summarize).',
  },
  {
    q: 'What is "industry impact" and when does it appear?',
    a: 'High-priority stories (score ≥ 70) get 2-sentence impact notes for 8 developer verticals: web devs, mobile, data/ML, DevOps, design/UX, product, students, and entrepreneurs. This tells you specifically how a breakthrough affects your day-to-day work.',
  },
  {
    q: 'Is the free plan actually useful or just a teaser?',
    a: "The free plan shows the top 5 stories per day (priority ≥ 70 — the most important ones), with beginner and intermediate summaries, and filters by category. It's genuinely useful for staying informed. Pro adds unlimited feed depth, all verticals, and expert-level summaries.",
  },
  {
    q: 'When are Layers 1–6 (Learn, Build, Compete…) launching?',
    a: "Layer 0 (AIPulse) is live now. Layer 1 (Learn) and Layer 2 (Build) are in active development targeting 60–90 days. Premium subscribers get early beta access as each layer ships. The 72-hour SLA (news → coding challenge) is the core mechanic we're building toward.",
  },
  {
    q: 'What data does Nexoraa collect?',
    a: "Your email, selected verticals, reading level preference, and which stories you've read (for deduplication and personalization). We do not sell data. We do not train models on your behavior. Read history is used only to exclude already-read stories from your feed.",
  },
  {
    q: 'Can I cancel my subscription anytime?',
    a: 'Yes. Cancel any time from your account settings. You retain Pro/Premium access until the end of the billing period. No questions asked.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 px-4 bg-[#0a0b14]">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1e1f30] bg-[#0e0f18] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#35d97a]" />
            <span className="font-mono text-[11px] text-[#35d97a] tracking-widest uppercase">FAQ</span>
          </div>
          <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold tracking-tight text-[#e8e9f5] mb-3">
            Common questions
          </h2>
          <p className="text-[14px] text-[#565775]">
            Everything you need to know before you dive in.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-2">
          {FAQS.map((faq, i) => {
            const isOpen = open === i
            return (
              <div
                key={i}
                className="rounded-xl border overflow-hidden transition-all duration-200"
                style={{
                  borderColor: isOpen ? 'rgba(0,212,255,0.2)' : '#1e1f30',
                  background: isOpen ? 'rgba(0,212,255,0.02)' : '#0e0f18',
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 group"
                >
                  <span
                    className="text-[14px] font-semibold leading-snug transition-colors duration-200"
                    style={{ color: isOpen ? '#e8e9f5' : '#8587a8' }}
                  >
                    {faq.q}
                  </span>
                  <span
                    className="shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300"
                    style={{
                      borderColor: isOpen ? 'rgba(0,212,255,0.4)' : '#2a2b40',
                      background: isOpen ? 'rgba(0,212,255,0.1)' : 'transparent',
                      color: isOpen ? '#00d4ff' : '#565775',
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>

                {/* Smooth accordion body */}
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{ maxHeight: isOpen ? '300px' : '0px' }}
                >
                  <div className="px-5 pb-5 border-t border-[#1a1b28]">
                    <p className="text-[13px] text-[#565775] leading-relaxed pt-4">{faq.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Still have questions */}
        <div className="mt-10 text-center">
          <p className="text-[13px] text-[#383960]">
            Still have questions?{' '}
            <a
              href="mailto:hello@nexoraa.in"
              className="text-[#00d4ff] hover:underline transition-colors"
            >
              Drop us an email →
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
