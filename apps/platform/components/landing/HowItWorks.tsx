'use client'

import { useState, useEffect, useRef } from 'react'

const STAGES = [
  {
    n: '01',
    label: 'Ingest',
    color: '#00d4ff',
    icon: '📡',
    line: 'Fetch from 500+ RSS / API / scraper sources',
    shortDetail: 'URL canonicalize · SHA-256 hash',
    cost: '$0',
  },
  {
    n: '02',
    label: 'Dedup',
    color: '#7c6df8',
    icon: '🧩',
    line: '3-layer engine: URL hash → trigram → embedding cosine',
    shortDetail: '~80% caught at zero LLM cost',
    cost: '$0',
  },
  {
    n: '03',
    label: 'Classify',
    color: '#f7a435',
    icon: '🏷',
    line: 'Rules engine first, Haiku for ambiguous (~40%)',
    shortDetail: '8 categories · 60% rule-bypassed',
    cost: '$0.000057',
  },
  {
    n: '04',
    label: 'Score',
    color: '#35d97a',
    icon: '📊',
    line: 'authority + cross-coverage + freshness + engagement',
    shortDetail: 'Priority 0–100 · gates next stages',
    cost: '$0',
  },
  {
    n: '05',
    label: 'Summarize',
    color: '#f74470',
    icon: '✍️',
    line: 'One Sonnet call → beginner / dev / ml in one shot',
    shortDetail: 'Cluster-level · cached forever',
    cost: '$0.0096',
  },
  {
    n: '06',
    label: 'Deliver',
    color: '#a855f7',
    icon: '🎯',
    line: 'Personalized feed + 8 vertical impact panels',
    shortDetail: 'Quality-gated: no incomplete data ever shown',
    cost: '$0',
  },
]

export function HowItWorks() {
  const [activeStage, setActiveStage] = useState(0)
  const [playing, setPlaying] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!playing) return
    intervalRef.current = setInterval(() => {
      setActiveStage(s => (s + 1) % (STAGES.length + 1))
    }, 2200)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [playing])

  const isComplete = activeStage === STAGES.length

  // Sample data that progressively gets enriched
  const sampleStates = [
    { url: 'https://openai.com/blog/...', title: '', priority: 0, cluster: '?', summary: '', categories: [] },
    { url: 'openai.com/blog/gpt-5-release', title: 'OpenAI launches GPT-5', priority: 0, cluster: '?', summary: '', categories: [] },
    { url: '✓ canonicalized', title: 'OpenAI launches GPT-5', priority: 0, cluster: 'cluster_8a3f', summary: '', categories: [] },
    { url: '✓ canonicalized', title: 'OpenAI launches GPT-5', priority: 0, cluster: 'cluster_8a3f', summary: '', categories: ['model_release'] },
    { url: '✓ canonicalized', title: 'OpenAI launches GPT-5', priority: 94, cluster: 'cluster_8a3f', summary: '', categories: ['model_release'] },
    { url: '✓ canonicalized', title: 'OpenAI launches GPT-5', priority: 94, cluster: 'cluster_8a3f', summary: 'GPT-5 ships with 2× efficiency...', categories: ['model_release'] },
    { url: '✓ canonicalized', title: 'OpenAI launches GPT-5', priority: 94, cluster: 'cluster_8a3f', summary: 'GPT-5 ships with 2× efficiency...', categories: ['model_release'] },
  ]
  const data = sampleStates[Math.min(activeStage, sampleStates.length - 1)]

  return (
    <section id="how-it-works" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1e1f30] bg-[#0e0f18] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7c6df8]" />
            <span className="font-mono text-[11px] text-[#7c6df8] tracking-widest uppercase">Watch the pipeline</span>
          </div>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-tight text-[#e8e9f5] mb-3">
            One article. <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(95deg, #7c6df8, #00d4ff)' }}>Six stages.</span>
          </h2>
          <p className="text-[#a8abc8] text-base max-w-xl mx-auto">
            See exactly what happens between a raw URL appearing on the web and it landing in your feed —
            without ever showing you a duplicate, raw article, or unsummarized junk.
          </p>
        </div>

        {/* Pipeline timeline */}
        <div className="relative mb-12">
          {/* Background line */}
          <div className="absolute top-[3.35rem] left-0 right-0 h-px bg-[#25263a]" />
          {/* Active progress line */}
          <div
            className="absolute top-[3.35rem] left-0 h-px transition-all duration-700 ease-out"
            style={{
              width: `${(Math.min(activeStage, STAGES.length) / STAGES.length) * 100}%`,
              background: `linear-gradient(90deg, ${STAGES[0].color}, ${STAGES[Math.min(activeStage, STAGES.length - 1)].color})`,
              boxShadow: `0 0 8px ${STAGES[Math.min(activeStage, STAGES.length - 1)].color}80`,
            }}
          />

          <div className="grid grid-cols-6 gap-2 relative">
            {STAGES.map((stage, i) => {
              const isPast = i < activeStage
              const isCurrent = i === activeStage
              const isFuture = i > activeStage
              return (
                <button
                  key={stage.n}
                  onClick={() => { setActiveStage(i); setPlaying(false) }}
                  className="flex flex-col items-center gap-4 group"
                >
                  <div
                    className="relative w-12 h-12 rounded-full flex items-center justify-center text-base transition-all duration-500 border-2 z-10"
                    style={{
                      background: isPast || isCurrent ? `${stage.color}15` : '#0e0f18',
                      borderColor: isPast || isCurrent ? stage.color : '#2a2b40',
                      transform: isCurrent ? 'scale(1.2)' : 'scale(1)',
                      boxShadow: isCurrent
                        ? `0 0 28px ${stage.color}80, 0 0 12px ${stage.color}40 inset`
                        : isPast
                        ? `0 0 12px ${stage.color}30`
                        : 'none',
                      filter: isFuture ? 'opacity(0.5) grayscale(0.3)' : 'none',
                    }}
                  >
                    {isPast ? (
                      <span style={{ color: stage.color }}>✓</span>
                    ) : (
                      <span>{stage.icon}</span>
                    )}
                    {isCurrent && (
                      <span className="absolute -inset-1 rounded-full animate-ping" style={{ border: `1px solid ${stage.color}40` }} />
                    )}
                  </div>
                  <div className="text-center">
                    <div
                      className="font-mono text-[10px] font-bold transition-colors"
                      style={{ color: isPast || isCurrent ? stage.color : '#8f92b8' }}
                    >
                      {stage.n}
                    </div>
                    <div
                      className="text-xs font-semibold transition-colors"
                      style={{ color: isCurrent ? '#ffffff' : isPast ? '#c5c7dc' : '#8f92b8' }}
                    >
                      {stage.label}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Live demo grid */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Left: stage description */}
          <div className="lg:col-span-1 space-y-3">
            {!isComplete ? (
              <div
                className="rounded-2xl p-5 border transition-all duration-300"
                key={activeStage}
                style={{
                  borderColor: `${STAGES[activeStage].color}25`,
                  background: `linear-gradient(135deg, ${STAGES[activeStage].color}06, transparent)`,
                }}
              >
                <div className="flex items-center gap-2 mb-3 animate-fadein">
                  <span
                    className="font-mono text-[10px] font-bold px-2 py-0.5 rounded"
                    style={{ color: STAGES[activeStage].color, background: `${STAGES[activeStage].color}15` }}
                  >
                    Stage {STAGES[activeStage].n}
                  </span>
                  <h3 className="text-lg font-bold text-[#e8e9f5]">{STAGES[activeStage].label}</h3>
                </div>
                <p className="text-sm text-[#c5c7dc] leading-relaxed mb-4 animate-fadein">
                  {STAGES[activeStage].line}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-[10px] text-[#8f92b8]">→</span>
                  <span className="font-mono text-[11px] text-[#a8abc8]">{STAGES[activeStage].shortDetail}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#1e1f30]">
                  <span className="font-mono text-[10px] text-[#a8abc8]">cost / item</span>
                  <span
                    className="font-mono text-[10px] font-bold"
                    style={{ color: STAGES[activeStage].cost === '$0' ? '#35d97a' : STAGES[activeStage].color }}
                  >
                    {STAGES[activeStage].cost}
                  </span>
                </div>
              </div>
            ) : (
              <div
                className="rounded-2xl p-5 border animate-fadein"
                style={{
                  borderColor: 'rgba(53,217,122,0.3)',
                  background: 'linear-gradient(135deg, rgba(53,217,122,0.08), transparent)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">✓</span>
                  <h3 className="text-lg font-bold text-[#35d97a]">Pipeline complete</h3>
                </div>
                <p className="text-sm text-[#c5c7dc] leading-relaxed mb-3">
                  Total LLM cost: <span className="font-mono text-[#35d97a]">~$0.0097</span> per cluster.
                  Stories without complete summaries are <span className="text-[#e8e9f5] font-semibold">never</span> shown.
                </p>
                <p className="font-mono text-[11px] text-[#a8abc8]">
                  At 25K MAU: <span className="text-[#35d97a]">$268/mo</span> vs naive $605
                </p>
              </div>
            )}

            <button
              onClick={() => setPlaying(v => !v)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#2a2b40] hover:border-[#3a3b55] bg-[#0e0f18] transition-all flex items-center justify-center gap-2"
            >
              <span className="font-mono text-xs text-[#c5c7dc]">
                {playing ? '⏸  pause animation' : '▶  replay pipeline'}
              </span>
            </button>

            <button
              onClick={() => { setActiveStage(0); setPlaying(true) }}
              className="w-full px-4 py-2 rounded-xl text-center font-mono text-[11px] text-[#a8abc8] hover:text-[#e8e9f5] transition-colors"
            >
              ↻ start over
            </button>
          </div>

          {/* Right: live data preview */}
          <div className="lg:col-span-2">
            <div className="bg-[#0a0b14] border border-[#1e1f30] rounded-2xl overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-[#1e1f30] bg-[#08090e]">
                <div className="w-2 h-2 rounded-full bg-[#f74470]/60" />
                <div className="w-2 h-2 rounded-full bg-[#f7a435]/60" />
                <div className="w-2 h-2 rounded-full bg-[#35d97a]/60" />
                <span className="ml-3 font-mono text-[11px] text-[#a8abc8]">item.json — pipeline trace</span>
                {!isComplete && (
                  <span className="ml-auto flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: STAGES[activeStage].color }} />
                    <span className="font-mono text-[9px]" style={{ color: STAGES[activeStage].color }}>
                      processing · stage {STAGES[activeStage].n}
                    </span>
                  </span>
                )}
              </div>

              <div className="p-5 space-y-2 font-mono text-xs leading-relaxed min-h-[280px]">
                <Field label="source_url" value={data.url} active={activeStage >= 0} color={STAGES[0].color} />
                <Field label="title" value={data.title || '...'} active={activeStage >= 1} color={STAGES[0].color} />
                <Field label="cluster_id" value={data.cluster} active={activeStage >= 2} color={STAGES[1].color} />
                <Field label="category" value={data.categories[0] || '?'} active={activeStage >= 3} color={STAGES[2].color} />
                <Field label="priority_score" value={data.priority ? String(data.priority) : '?'} active={activeStage >= 4} color={STAGES[3].color} highlight={data.priority >= 70} />
                <Field label="summary" value={data.summary || '...'} active={activeStage >= 5} color={STAGES[4].color} truncate />

                {/* Final card */}
                {isComplete && (
                  <div className="pt-2 mt-3 border-t border-[#1e1f30] animate-fadein">
                    <p className="font-mono text-[10px] text-[#a8abc8] mb-2">→ feed.tsx receives:</p>
                    <div
                      className="rounded-xl border p-3 space-y-2"
                      style={{ borderColor: `${STAGES[5].color}30`, background: `${STAGES[5].color}05`, borderLeftWidth: 2 }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ color: STAGES[2].color, background: `${STAGES[2].color}15` }}>
                          model_release
                        </span>
                        <span className="font-mono text-[9px] text-[#383960]">P 94</span>
                        <span className="font-mono text-[9px] text-[#383960] ml-auto">12 sources</span>
                      </div>
                      <p className="text-[12px] text-[#e8e9f5] font-semibold leading-snug font-sans">
                        OpenAI launches GPT-5 with 2× efficiency and 2M context window
                      </p>
                      <p className="text-[11px] text-[#c5c7dc] leading-relaxed font-sans">
                        GPT-5 ships with 2× throughput, 2M context, and 41% lower error rate on HumanEval...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quality gate banner */}
            {isComplete && (
              <div className="mt-3 flex items-center gap-3 px-4 py-3 rounded-xl border animate-fadein" style={{ borderColor: 'rgba(53,217,122,0.2)', background: 'rgba(53,217,122,0.04)' }}>
                <span className="text-[#35d97a] text-base">🛡️</span>
                <div className="flex-1">
                  <p className="text-[12px] font-semibold text-[#e8e9f5]">Quality gate: <code className="font-mono text-[10px] text-[#35d97a]">summary IS NOT NULL</code></p>
                  <p className="text-[11px] text-[#a8abc8]">
                    Items missing any pipeline stage are silently archived — they never reach your feed.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({
  label,
  value,
  active,
  color,
  truncate,
  highlight,
}: {
  label: string
  value: string
  active: boolean
  color: string
  truncate?: boolean
  highlight?: boolean
}) {
  return (
    <div
      className="flex items-start gap-3 transition-all duration-500"
      style={{ opacity: active ? 1 : 0.3 }}
    >
      <span className="text-[#a8abc8] w-32 shrink-0">{label}:</span>
      <span
        className={[
          'flex-1 transition-colors duration-300',
          truncate ? 'truncate' : '',
        ].join(' ')}
        style={{
          color: !active ? '#515476' : highlight ? '#35d97a' : value === '?' || value === '...' ? '#a8abc8' : color,
          fontWeight: highlight ? 700 : 400,
        }}
      >
        {value}
        {active && (value !== '?' && value !== '...') && (
          <span className="inline-block ml-1.5 w-1.5 h-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 4px ${color}` }} />
        )}
      </span>
    </div>
  )
}
