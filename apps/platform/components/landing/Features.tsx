'use client'

import { useState, useEffect, useRef } from 'react'

type LayerKey = '00' | '01' | '02' | '03' | '04' | '05' | '06'

interface Layer {
  num: LayerKey
  name: string
  status: 'live' | 'soon'
  color: string
  icon: string
  pitch: string
  flowFrom?: string
}

const LAYERS: Layer[] = [
  { num: '00', name: 'AIPulse', status: 'live', color: '#00d4ff', icon: '⚡', pitch: 'Curated AI news. Deduped. Scored. 3-level summaries.' },
  { num: '01', name: 'Learn', status: 'soon', color: '#7c6df8', icon: '📚', pitch: 'Today\'s news → tomorrow\'s lesson, in 72h.', flowFrom: 'AIPulse' },
  { num: '02', name: 'Build', status: 'soon', color: '#f7a435', icon: '🛠', pitch: 'Coding challenges scaffolded from real AI papers.', flowFrom: 'Learn' },
  { num: '03', name: 'Compete', status: 'soon', color: '#f74470', icon: '🏆', pitch: 'Weekly contests. Real leaderboard. Streak bonuses.', flowFrom: 'Build' },
  { num: '04', name: 'Community', status: 'soon', color: '#35d97a', icon: '🌐', pitch: 'Topic rooms, projects, co-founder matching.', flowFrom: 'Compete' },
  { num: '05', name: 'AI Agents', status: 'soon', color: '#ff6b35', icon: '🤖', pitch: 'Personal AI agents trained on the Nexoraa corpus.', flowFrom: 'Community' },
  { num: '06', name: 'Freelance', status: 'soon', color: '#a855f7', icon: '💼', pitch: 'Get matched with AI projects via verified builds.', flowFrom: 'AI Agents' },
]

// ─── Layer 0: AIPulse Feed Demo ───
function FeedDemo({ color }: { color: string }) {
  const [level, setLevel] = useState<'101' | 'dev' | 'ml'>('dev')
  const [openImpact, setOpenImpact] = useState(false)

  const summaries = {
    '101': 'OpenAI launched GPT-5. It\'s smarter, twice as fast, and now understands code far better than before.',
    'dev': 'GPT-5 ships with 2× throughput, 2M context, and 41% lower error rate on HumanEval. New responses API replaces chat completions.',
    'ml': 'GPT-5: MoE architecture, ~1.8T effective params, 2M context via ring attention, 84.2 HumanEval, 92.7 MMLU.',
  }

  return (
    <div className="bg-[#0a0b14] border border-[#1e1f30] rounded-xl overflow-hidden text-left">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[#1e1f30] bg-[#08090e]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-pulse" />
        <span className="font-mono text-[9px] text-[#383960]">live · AIPulse</span>
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ color, background: `${color}15` }}>
            model release
          </span>
          <span className="font-mono text-[9px] text-[#383960]">P 94</span>
          <span className="font-mono text-[9px] text-[#383960] ml-auto">12 sources</span>
        </div>
        <p className="text-[12px] text-[#e8e9f5] font-semibold leading-snug">
          OpenAI releases GPT-5 with 2× efficiency and 2M context window
        </p>
        <p className="text-[11px] text-[#8587a8] leading-relaxed transition-all duration-200" style={{ minHeight: 56 }}>
          {summaries[level]}
        </p>
        <div className="flex items-center gap-1 bg-[#13141f] rounded-md p-0.5 w-fit">
          {(['101', 'dev', 'ml'] as const).map(l => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className="font-mono text-[9px] px-2 py-0.5 rounded-sm transition-all"
              style={level === l ? { background: color, color: '#08090e', fontWeight: 700 } : { color: '#565775' }}
            >
              {l}
            </button>
          ))}
        </div>
        <button
          onClick={() => setOpenImpact(v => !v)}
          className="w-full flex items-center justify-between px-2 py-1.5 mt-2 rounded-md border border-[#1e1f30] hover:border-[#2a2b40] transition-colors"
        >
          <span className="font-mono text-[10px] text-[#565775]">8 industry impact panels</span>
          <span className="font-mono text-[10px]" style={{ color, transform: openImpact ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
        </button>
        {openImpact && (
          <div className="grid grid-cols-2 gap-1 pt-1 animate-fadein">
            {['🌐 web-dev', '📱 mobile', '🧠 data-ml', '☁️ devops'].map(v => (
              <div key={v} className="font-mono text-[9px] text-[#565775] px-2 py-1 bg-[#13141f] rounded">{v}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Layer 1: Learn ───
function LearnDemo({ color }: { color: string }) {
  const chapters = [
    { name: 'What is attention?', done: true },
    { name: 'Self-attention math', done: true },
    { name: 'Multi-head intuition', done: false, current: true },
    { name: 'KV-cache tricks', done: false },
  ]
  return (
    <div className="bg-[#0a0b14] border border-[#1e1f30] rounded-xl p-4 text-left space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] px-2 py-0.5 rounded" style={{ color, background: `${color}15` }}>
          lesson · 72h SLA
        </span>
        <span className="font-mono text-[9px] text-[#565775]">spawned from GPT-5 release</span>
      </div>
      <div>
        <p className="text-[13px] font-bold text-[#e8e9f5] leading-tight">Transformers: Attention is all you need</p>
        <p className="text-[10px] text-[#565775] mt-0.5">Track: Foundations of LLMs · Module 3</p>
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono text-[10px] text-[#565775]">progress</span>
          <span className="font-mono text-[10px]" style={{ color }}>2/4 · 50%</span>
        </div>
        <div className="h-1.5 rounded-full bg-[#13141f] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: '50%', background: `linear-gradient(90deg, ${color}, ${color}80)`, boxShadow: `0 0 8px ${color}` }}
          />
        </div>
      </div>
      <div className="space-y-1">
        {chapters.map(c => (
          <div key={c.name} className="flex items-center gap-2 text-[11px] py-1">
            <span
              className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] shrink-0"
              style={{
                background: c.done ? color : c.current ? `${color}30` : '#13141f',
                color: c.done ? '#08090e' : color,
                border: c.current ? `1px solid ${color}` : 'none',
              }}
            >
              {c.done ? '✓' : c.current ? '●' : ''}
            </span>
            <span className="text-[#8587a8]" style={{ fontWeight: c.current ? 600 : 400 }}>{c.name}</span>
            {c.current && <span className="ml-auto font-mono text-[8px]" style={{ color }}>now</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Layer 2: Build ───
function BuildDemo({ color }: { color: string }) {
  const [stage, setStage] = useState<'idle' | 'running' | 'passed'>('idle')

  function runTests() {
    setStage('running')
    setTimeout(() => setStage('passed'), 1400)
  }

  return (
    <div className="bg-[#0a0b14] border border-[#1e1f30] rounded-xl overflow-hidden text-left">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1e1f30] bg-[#08090e]">
        <span className="font-mono text-[10px] text-[#e8e9f5]">implement_attention.py</span>
        <span className="font-mono text-[8px] px-1.5 py-0.5 rounded" style={{ color, background: `${color}15` }}>medium</span>
      </div>
      <pre className="px-3 py-2 text-[11px] leading-relaxed font-mono text-[#8587a8] overflow-hidden">
        <span className="text-[#565775]"># Implement scaled dot-product attention</span>{'\n'}
        <span className="text-[#7c6df8]">def</span>{' '}<span className="text-[#00d4ff]">attention</span>(q, k, v):{'\n'}
        {'    '}d_k = k.shape[-<span className="text-[#f7a435]">1</span>]{'\n'}
        {'    '}scores = (q @ k.T) / <span className="text-[#7c6df8]">math</span>.sqrt(d_k){'\n'}
        {'    '}<span className="text-[#7c6df8]">return</span> softmax(scores) @ v
      </pre>
      <div className="px-3 py-2 border-t border-[#1e1f30] flex items-center gap-2">
        <button
          onClick={runTests}
          disabled={stage === 'running'}
          className="px-3 py-1.5 rounded-md text-[10px] font-bold font-mono transition-all disabled:opacity-60"
          style={{ background: color, color: '#08090e' }}
        >
          {stage === 'running' ? '▶ running…' : stage === 'passed' ? '✓ passed' : '▶ run tests'}
        </button>
        <div className="flex items-center gap-1 ml-auto">
          {[1, 2, 3, 4].map(i => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full transition-all duration-300"
              style={{
                background: stage === 'passed' ? color : stage === 'running' && i <= 2 ? color : '#13141f',
                boxShadow: stage === 'passed' ? `0 0 4px ${color}` : 'none',
              }}
            />
          ))}
          <span className="font-mono text-[9px] text-[#565775] ml-1">
            {stage === 'passed' ? '4/4' : stage === 'running' ? '2/4' : '0/4'}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Layer 3: Compete ───
function CompeteDemo({ color }: { color: string }) {
  const players = [
    { rank: 1, name: 'kashish.dev', score: 2840, country: '🇮🇳' },
    { rank: 2, name: 'arjun_mehta', score: 2790, country: '🇮🇳' },
    { rank: 3, name: 'sara.builds', score: 2710, country: '🇺🇸' },
    { rank: 4, name: 'you', score: 2680, country: '🇮🇳', you: true },
    { rank: 5, name: 'neo.ml', score: 2620, country: '🇸🇬' },
  ]
  return (
    <div className="bg-[#0a0b14] border border-[#1e1f30] rounded-xl p-3 text-left space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-bold text-[#e8e9f5]">Saturday Contest #14</span>
        <span className="flex items-center gap-1.5 font-mono text-[10px]" style={{ color }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: color }} />
          live · 24:18
        </span>
      </div>
      <div className="space-y-1">
        {players.map(p => (
          <div
            key={p.rank}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md transition-all"
            style={{
              background: p.you ? `${color}10` : 'transparent',
              border: p.you ? `1px solid ${color}30` : '1px solid transparent',
            }}
          >
            <span className="font-mono text-[10px] w-4 text-[#565775]">#{p.rank}</span>
            <span className="text-[10px]">{p.country}</span>
            <span className="text-[11px] flex-1" style={{ color: p.you ? color : '#e8e9f5', fontWeight: p.you ? 700 : 400 }}>
              {p.name}
            </span>
            {p.you && (
              <span className="font-mono text-[8px] px-1 rounded text-[#35d97a] bg-[#35d97a]/10">↑ +12</span>
            )}
            <span className="font-mono text-[10px] text-[#8587a8] tabular-nums">{p.score}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Layer 4: Community ───
function CommunityDemo({ color }: { color: string }) {
  const rooms = [
    { tag: '#transformers', members: 1240, hot: true },
    { tag: '#llm-deploy', members: 892, hot: true },
    { tag: '#computer-vision', members: 634 },
    { tag: '#rag-systems', members: 1108, hot: true },
  ]
  return (
    <div className="bg-[#0a0b14] border border-[#1e1f30] rounded-xl p-3 text-left space-y-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[12px] font-bold text-[#e8e9f5]">Topic rooms</span>
        <span className="font-mono text-[9px] text-[#565775]">3.8K active</span>
      </div>
      {rooms.map(r => (
        <div key={r.tag} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[#13141f] transition-colors cursor-pointer">
          <span className="font-mono text-[11px] flex-1" style={{ color }}>{r.tag}</span>
          {r.hot && <span className="font-mono text-[8px] px-1 rounded text-[#f74470] bg-[#f74470]/10">🔥 hot</span>}
          <span className="font-mono text-[9px] text-[#565775]">{r.members.toLocaleString()}</span>
        </div>
      ))}
      <div className="mt-2 px-2 py-2 rounded-md border border-dashed" style={{ borderColor: `${color}30`, background: `${color}05` }}>
        <p className="text-[10px] text-[#8587a8] leading-relaxed">
          <span style={{ color, fontWeight: 600 }}>@arjun.m</span> · just dropped GPT-5 fine-tuning notes — 47 replies
        </p>
      </div>
    </div>
  )
}

// ─── Layer 5: AI Agents ───
function AgentsDemo({ color }: { color: string }) {
  const [typed, setTyped] = useState('')
  const fullText = 'GPT-5 uses MoE with ~1.8T params...'

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      i++
      setTyped(fullText.slice(0, i))
      if (i >= fullText.length) clearInterval(interval)
    }, 40)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-[#0a0b14] border border-[#1e1f30] rounded-xl p-3 text-left space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}40` }}>
          <span className="text-[12px]">🤖</span>
        </div>
        <div>
          <p className="text-[11px] font-bold text-[#e8e9f5]">Research Agent</p>
          <p className="font-mono text-[8px] text-[#565775]">trained on Nexoraa corpus</p>
        </div>
      </div>
      <div className="bg-[#13141f] rounded-md px-2.5 py-2 ml-auto max-w-[80%]">
        <p className="text-[10px] text-[#e8e9f5]">explain GPT-5 architecture briefly</p>
      </div>
      <div className="rounded-md px-2.5 py-2 mr-auto max-w-[85%]" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
        <p className="text-[10px] text-[#c8c9df] leading-relaxed">
          {typed}
          <span className="inline-block w-1 h-3 bg-current ml-0.5 align-middle animate-pulse" style={{ color }} />
        </p>
        <div className="flex gap-1 mt-1.5">
          <span className="font-mono text-[7px] px-1.5 py-0.5 rounded text-[#565775] bg-[#13141f]">cited: 12 sources</span>
        </div>
      </div>
      <div className="flex gap-1 pt-1">
        {['Research', 'Code', 'Summarize'].map((a, i) => (
          <span
            key={a}
            className="font-mono text-[9px] px-2 py-1 rounded-md transition-all"
            style={i === 0
              ? { background: color, color: '#08090e', fontWeight: 700 }
              : { background: '#13141f', color: '#565775' }
            }
          >
            {a}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Layer 6: Freelance ───
function FreelanceDemo({ color }: { color: string }) {
  return (
    <div className="bg-[#0a0b14] border border-[#1e1f30] rounded-xl p-3 text-left space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-bold text-[#e8e9f5]">Matched gig</span>
        <span className="font-mono text-[9px] px-1.5 py-0.5 rounded" style={{ color, background: `${color}15` }}>
          89% fit
        </span>
      </div>
      <div className="border border-[#1e1f30] rounded-md p-2.5 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[12px] font-bold text-[#e8e9f5] leading-tight">Build a RAG system for legal docs</p>
          <span className="text-[12px] font-bold" style={{ color }}>$4.5k</span>
        </div>
        <p className="text-[10px] text-[#565775] leading-relaxed">
          Need: LangChain/LlamaIndex, Pinecone, evaluation pipeline. 2-week project.
        </p>
        <div className="flex flex-wrap gap-1">
          {[
            { tag: 'rag', verified: true },
            { tag: 'embeddings', verified: true },
            { tag: 'evals', verified: true },
            { tag: 'fastapi', verified: false },
          ].map(s => (
            <span
              key={s.tag}
              className="font-mono text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1"
              style={s.verified
                ? { color: '#35d97a', background: 'rgba(53,217,122,0.1)', border: '1px solid rgba(53,217,122,0.2)' }
                : { color: '#565775', background: '#13141f' }
              }
            >
              {s.verified && '✓'} {s.tag}
            </span>
          ))}
        </div>
      </div>
      <p className="font-mono text-[9px] text-[#565775] leading-relaxed">
        ✓ skills verified from your <span style={{ color }}>3 builds</span> in L2
      </p>
    </div>
  )
}

const DEMO_COMPONENTS: Record<LayerKey, (props: { color: string }) => React.ReactElement> = {
  '00': FeedDemo,
  '01': LearnDemo,
  '02': BuildDemo,
  '03': CompeteDemo,
  '04': CommunityDemo,
  '05': AgentsDemo,
  '06': FreelanceDemo,
}

export function Features() {
  const [activeLayer, setActiveLayer] = useState<LayerKey>('00')
  const [autoplay, setAutoplay] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!autoplay) return
    intervalRef.current = setInterval(() => {
      setActiveLayer(curr => {
        const idx = LAYERS.findIndex(l => l.num === curr)
        return LAYERS[(idx + 1) % LAYERS.length].num
      })
    }, 5000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [autoplay])

  function pickLayer(num: LayerKey) {
    setActiveLayer(num)
    setAutoplay(false)
  }

  const active = LAYERS.find(l => l.num === activeLayer)!
  const DemoComponent = DEMO_COMPONENTS[activeLayer]

  return (
    <section id="features" className="py-24 px-4 bg-[#0a0b14]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1e1f30] bg-[#0e0f18] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]" />
            <span className="font-mono text-[11px] text-[#00d4ff] tracking-widest uppercase">Live demo · The Platform</span>
          </div>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-tight text-[#e8e9f5] mb-3">
            7 layers. <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(95deg, #7c6df8, #00d4ff)' }}>Try them all.</span>
          </h2>
          <p className="text-[#a8abc8] text-base max-w-xl mx-auto">
            Each layer feeds the next. Click a layer to see what it actually does.
          </p>
        </div>

        {/* Connected layer pipeline */}
        <div className="relative mb-8 pb-2">
          <div
            className="absolute left-[7%] right-[7%] top-5 h-px opacity-70 sm:top-6"
            style={{ background: `linear-gradient(90deg, ${LAYERS.map(layer => layer.color).join(', ')})` }}
          />
          <div className="absolute left-[7%] right-[7%] top-5 h-px bg-[#0a0b14]/50 sm:top-6" />
          <div
            className="absolute top-[1.1rem] h-1.5 w-1.5 rounded-full transition-all duration-700 sm:top-[1.35rem]"
            style={{
              left: `calc(7% + ${(LAYERS.findIndex(layer => layer.num === activeLayer) / (LAYERS.length - 1)) * 86}% - 3px)`,
              background: active.color,
              boxShadow: `0 0 12px ${active.color}, 0 0 28px ${active.color}80`,
            }}
          />
          <div className="grid grid-cols-7 items-start gap-1 sm:gap-4 px-1 sm:px-2">
            {LAYERS.map((layer) => {
              const isActive = activeLayer === layer.num
              return (
                <div key={layer.num} className="relative flex items-start justify-center">
                  <button
                    onClick={() => pickLayer(layer.num)}
                    className="group relative z-10 flex min-w-0 flex-col items-center gap-2 transition-all duration-300"
                  >
                    <div
                      className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-base sm:text-lg transition-all duration-300 border-2"
                      style={{
                        background: isActive ? `${layer.color}15` : '#0e0f18',
                        borderColor: isActive ? layer.color : '#1e1f30',
                        boxShadow: isActive ? `0 0 24px ${layer.color}40, inset 0 0 12px ${layer.color}10` : 'none',
                        transform: isActive ? 'scale(1.15)' : 'scale(1)',
                      }}
                    >
                      <span style={{ filter: isActive ? 'none' : 'grayscale(0.6) opacity(0.7)' }}>
                        {layer.icon}
                      </span>
                      {isActive && layer.status === 'live' && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: layer.color, boxShadow: `0 0 6px ${layer.color}` }} />
                      )}
                    </div>
                    <span
                      className="font-mono text-[10px] font-bold transition-colors"
                      style={{ color: isActive ? layer.color : '#8f92b8' }}
                    >
                      L{layer.num}
                    </span>
                    <span
                      className="text-[11px] sm:text-xs font-semibold leading-tight transition-colors text-center"
                      style={{ color: isActive ? '#ffffff' : '#a8abc8' }}
                    >
                      {layer.name}
                    </span>
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Active layer pitch + demo */}
        <div
          className="grid md:grid-cols-2 gap-6 items-start mt-16 transition-all duration-500"
          key={activeLayer}
        >
          {/* Left: pitch */}
          <div className="space-y-4 animate-fadein">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl border"
                style={{
                  background: `${active.color}15`,
                  borderColor: `${active.color}40`,
                  boxShadow: `0 0 20px ${active.color}25`,
                }}
              >
                {active.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-[11px] font-bold" style={{ color: active.color }}>
                    Layer {active.num}
                  </span>
                  <span
                    className="font-mono text-[8px] px-1.5 py-0.5 rounded-full"
                    style={
                      active.status === 'live'
                        ? { color: active.color, background: `${active.color}15`, border: `1px solid ${active.color}30` }
                        : { color: '#565775', background: '#13141f', border: '1px solid #1e1f30' }
                    }
                  >
                    {active.status === 'live' ? '● live' : 'soon'}
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-[#e8e9f5]">{active.name}</h3>
              </div>
            </div>

            <p className="text-base text-[#c5c7dc] leading-relaxed">{active.pitch}</p>

            {active.flowFrom && (
              <div className="flex items-center gap-2 text-xs text-[#a8abc8]">
                <span className="font-mono">flows from</span>
                <span className="font-mono px-2 py-0.5 rounded" style={{ color: active.color, background: `${active.color}10` }}>
                  {active.flowFrom}
                </span>
                <span style={{ color: active.color }}>→</span>
                <span className="font-mono text-[#c5c7dc]">{active.name}</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setAutoplay(v => !v)}
                className="font-mono text-[10px] px-3 py-1.5 rounded-lg border transition-all"
                style={{
                  borderColor: autoplay ? `${active.color}40` : '#2a2b40',
                  color: autoplay ? active.color : '#a8abc8',
                  background: autoplay ? `${active.color}08` : 'transparent',
                }}
              >
                {autoplay ? '⏸ pause tour' : '▶ play tour'}
              </button>
              <span className="font-mono text-[10px] text-[#8f92b8]">
                {LAYERS.findIndex(l => l.num === activeLayer) + 1} / {LAYERS.length}
              </span>
            </div>
          </div>

          {/* Right: live demo */}
          <div className="relative">
            <div
              className="absolute -inset-2 rounded-2xl opacity-30 blur-2xl transition-all duration-500"
              style={{ background: `radial-gradient(ellipse, ${active.color}, transparent 70%)` }}
            />
            <div className="relative animate-fadein">
              <DemoComponent color={active.color} />
              <div className="absolute -top-2 -right-2 font-mono text-[8px] px-2 py-0.5 rounded-full bg-[#08090e] border" style={{ borderColor: `${active.color}40`, color: active.color }}>
                interactive ↗
              </div>
            </div>
          </div>
        </div>

        {/* Flywheel caption */}
        <div className="mt-16 text-center">
          <p className="font-mono text-xs text-[#a8abc8]">
            Read · Learn · Build · Compete · Connect · Agent · Work
          </p>
          <p className="font-mono text-[11px] text-[#8589ad] mt-1">The AI Work OS flywheel — every layer earns the next</p>
        </div>
      </div>
    </section>
  )
}
