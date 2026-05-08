'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { VerticalSlug, SummaryLevel } from '@neuralforge/types'

const ROLES = [
  { slug: 'developer', label: 'Developer', icon: '⌨️', desc: 'Building apps & APIs' },
  { slug: 'ml-engineer', label: 'ML Engineer', icon: '🧠', desc: 'Models, training, inference' },
  { slug: 'founder', label: 'Founder', icon: '🚀', desc: 'Building AI products' },
  { slug: 'student', label: 'Student', icon: '🎓', desc: 'Learning AI & CS' },
  { slug: 'designer', label: 'Designer', icon: '🎨', desc: 'UX & AI-powered design' },
  { slug: 'pm', label: 'Product Manager', icon: '🎯', desc: 'Strategy & roadmaps' },
  { slug: 'data-scientist', label: 'Data Scientist', icon: '📊', desc: 'Data, analytics, ML ops' },
  { slug: 'other', label: 'Other', icon: '💡', desc: 'Curious about AI' },
]

const VERTICALS: { slug: VerticalSlug; label: string; icon: string; desc: string }[] = [
  { slug: 'web-dev', label: 'Web Development', icon: '🌐', desc: 'React, Next.js, APIs' },
  { slug: 'mobile', label: 'Mobile Dev', icon: '📱', desc: 'iOS, Android, React Native' },
  { slug: 'data-ml', label: 'Data & ML', icon: '🧠', desc: 'Python, PyTorch, LLMs' },
  { slug: 'devops-cloud', label: 'DevOps & Cloud', icon: '☁️', desc: 'Docker, K8s, MLOps' },
  { slug: 'design-ux', label: 'Design & UX', icon: '🎨', desc: 'AI design tools, UX' },
  { slug: 'product', label: 'Product & Strategy', icon: '🎯', desc: 'PMs, founders, strategy' },
  { slug: 'students', label: 'Students', icon: '🎓', desc: 'Learning AI fundamentals' },
  { slug: 'entrepreneurs', label: 'Entrepreneurs', icon: '🚀', desc: 'Building AI products' },
]

const LEVELS: { value: SummaryLevel; label: string; desc: string; tag: string; color: string }[] = [
  {
    value: 'beginner',
    label: 'Beginner',
    tag: '101',
    color: '#35d97a',
    desc: '~200 words, plain English. "What happened and why you should care."',
  },
  {
    value: 'intermediate',
    label: 'Developer',
    tag: 'dev',
    color: '#00d4ff',
    desc: '~100 words for developers. Model names, API changes, benchmark numbers.',
  },
  {
    value: 'expert',
    label: 'ML Engineer',
    tag: 'ml',
    color: '#7c6df8',
    desc: '~50 words, dense & technical. Architecture, methodology, training details.',
  },
]

type Step = 'welcome' | 'role' | 'verticals' | 'level' | 'done'

const STEP_ORDER: Step[] = ['welcome', 'role', 'verticals', 'level', 'done']

interface OnboardingFlowProps {
  userId: string
  userEmail: string
}

export function OnboardingFlow({ userId, userEmail }: OnboardingFlowProps) {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState<Step>('welcome')
  const [displayName, setDisplayName] = useState(userEmail.split('@')[0])
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedVerticals, setSelectedVerticals] = useState<VerticalSlug[]>(['web-dev', 'data-ml'])
  const [selectedLevel, setSelectedLevel] = useState<SummaryLevel>('beginner')
  const [saving, setSaving] = useState(false)

  const currentIndex = STEP_ORDER.indexOf(step)
  const totalSteps = STEP_ORDER.length - 1
  const progress = (currentIndex / totalSteps) * 100

  function goNext(next: Step) { setStep(next) }
  function goBack(prev: Step) { setStep(prev) }

  function toggleVertical(slug: VerticalSlug) {
    setSelectedVerticals(prev =>
      prev.includes(slug)
        ? prev.filter(v => v !== slug)
        : prev.length < 5 ? [...prev, slug] : prev
    )
  }

  async function handleFinish() {
    setSaving(true)
    await supabase.from('user_profiles').upsert({
      id: userId,
      display_name: displayName.trim() || userEmail.split('@')[0],
      selected_verticals: selectedVerticals,
      preferred_level: selectedLevel,
      plan: 'free',
      metadata: { role: selectedRole },
    })
    setStep('done')
    setTimeout(() => router.replace('/feed'), 2400)
  }

  return (
    <div className="w-full max-w-xl">
      {/* Progress bar */}
      {step !== 'done' && (
        <div className="flex items-center gap-3 mb-8 animate-fadein">
          <div className="flex-1 h-1 rounded-full bg-[#1e1f30] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #7c6df8, #00d4ff)',
              }}
            />
          </div>
          <span className="font-mono text-[10px] text-[#383960] shrink-0">
            {currentIndex + 1} / {totalSteps}
          </span>
        </div>
      )}

      {/* ── Step 1: Welcome ── */}
      {step === 'welcome' && (
        <div className="animate-fadein">
          <div className="mb-2 flex items-center gap-2 animate-fadein">
            <div className="w-8 h-8 rounded-xl bg-[#00d4ff]/10 border border-[#00d4ff]/20 flex items-center justify-center">
              <span className="text-[13px] font-bold text-[#00d4ff] font-mono">N</span>
            </div>
            <span className="font-mono text-[11px] font-bold text-[#00d4ff] tracking-[0.15em] uppercase">
              Nexoraa
            </span>
          </div>

          <div className="mb-7 mt-4">
            <h2 className="text-2xl font-extrabold text-[#e8e9f5] mb-2 leading-tight animate-fadein-d1">
              Welcome to your<br />
              <span
                style={{
                  background: 'linear-gradient(90deg, #7c6df8, #00d4ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                AI intelligence hub
              </span>
            </h2>
            <p className="text-[13px] text-[#565775] animate-fadein-d2">
              Let&apos;s personalize your feed in under 60 seconds.
            </p>
          </div>

          <div className="animate-fadein-d2">
            <label className="block font-mono text-[10px] text-[#383960] uppercase tracking-wider mb-2">
              What should we call you?
            </label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && displayName.trim()) goNext('role') }}
              className="w-full px-4 py-3 rounded-xl bg-[#0e0f18] border border-[#1e1f30] text-[#e8e9f5] text-[15px] font-semibold placeholder:text-[#383960] focus:outline-none focus:border-[#00d4ff]/50 focus:shadow-[0_0_0_3px_rgba(0,212,255,0.08)] transition-all"
              placeholder="Your name"
              autoFocus
            />
          </div>

          <div className="flex justify-end mt-6 animate-fadein-d3">
            <button
              onClick={() => goNext('role')}
              disabled={!displayName.trim()}
              className="px-6 py-2.5 rounded-xl font-bold text-[13px] text-[#08090e] transition-all disabled:opacity-40 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,212,255,0.25)] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #7c6df8, #00d4ff)' }}
            >
              Let&apos;s go →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Role ── */}
      {step === 'role' && (
        <div className="animate-fadein">
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-[#e8e9f5] mb-1">
              What&apos;s your role?
            </h2>
            <p className="text-[13px] text-[#565775]">
              This helps us tune your feed&apos;s tone and depth.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-6">
            {ROLES.map((role, i) => {
              const selected = selectedRole === role.slug
              return (
                <button
                  key={role.slug}
                  onClick={() => setSelectedRole(role.slug)}
                  className="flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                  style={{
                    animationDelay: `${i * 0.04}s`,
                    borderColor: selected ? 'rgba(0,212,255,0.4)' : '#1e1f30',
                    background: selected ? 'rgba(0,212,255,0.05)' : '#0e0f18',
                    boxShadow: selected ? '0 0 14px rgba(0,212,255,0.1)' : 'none',
                  }}
                >
                  <span className="text-lg shrink-0 mt-0.5">{role.icon}</span>
                  <div>
                    <div className="text-[13px] font-semibold text-[#e8e9f5] flex items-center gap-1.5">
                      {role.label}
                      {selected && <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]" />}
                    </div>
                    <div className="text-[11px] text-[#383960]">{role.desc}</div>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => goBack('welcome')}
              className="text-[13px] text-[#565775] hover:text-[#e8e9f5] transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={() => goNext('verticals')}
              disabled={!selectedRole}
              className="px-5 py-2 rounded-xl font-bold text-[13px] text-[#08090e] transition-all disabled:opacity-40 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,212,255,0.2)] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #7c6df8, #00d4ff)' }}
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Verticals ── */}
      {step === 'verticals' && (
        <div className="animate-fadein">
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-[#e8e9f5] mb-1">
              What do you work on?
            </h2>
            <p className="text-[13px] text-[#565775]">
              Pick up to 5 areas. Your feed and impact panels will be filtered to these.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-6">
            {VERTICALS.map((v, i) => {
              const selected = selectedVerticals.includes(v.slug)
              const atLimit = selectedVerticals.length >= 5 && !selected
              return (
                <button
                  key={v.slug}
                  onClick={() => toggleVertical(v.slug)}
                  disabled={atLimit}
                  className="flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    animationDelay: `${i * 0.04}s`,
                    borderColor: selected ? 'rgba(0,212,255,0.4)' : '#1e1f30',
                    background: selected ? 'rgba(0,212,255,0.05)' : '#0e0f18',
                    boxShadow: selected ? '0 0 14px rgba(0,212,255,0.1)' : 'none',
                  }}
                >
                  <span className="text-lg shrink-0 mt-0.5">{v.icon}</span>
                  <div>
                    <div className="text-[13px] font-semibold text-[#e8e9f5] flex items-center gap-1.5">
                      {v.label}
                      {selected && <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]" />}
                    </div>
                    <div className="text-[11px] text-[#383960]">{v.desc}</div>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => goBack('role')}
                className="text-[13px] text-[#565775] hover:text-[#e8e9f5] transition-colors"
              >
                ← Back
              </button>
              <span className="font-mono text-[10px] text-[#383960]">
                {selectedVerticals.length} / 5 selected
              </span>
            </div>
            <button
              onClick={() => goNext('level')}
              disabled={selectedVerticals.length === 0}
              className="px-5 py-2 rounded-xl font-bold text-[13px] text-[#08090e] transition-all disabled:opacity-40 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,212,255,0.2)] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #7c6df8, #00d4ff)' }}
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 4: Level ── */}
      {step === 'level' && (
        <div className="animate-fadein">
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-[#e8e9f5] mb-1">
              Choose your reading level
            </h2>
            <p className="text-[13px] text-[#565775]">
              Switch anytime in the feed. All levels are pre-generated — zero extra cost.
            </p>
          </div>

          <div className="space-y-2 mb-6">
            {LEVELS.map(level => {
              const selected = selectedLevel === level.value
              return (
                <button
                  key={level.value}
                  onClick={() => setSelectedLevel(level.value)}
                  className="w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-200 hover:scale-[1.005] active:scale-[0.998]"
                  style={{
                    borderColor: selected ? `${level.color}40` : '#1e1f30',
                    background: selected ? `${level.color}08` : '#0e0f18',
                    boxShadow: selected ? `0 0 16px ${level.color}10` : 'none',
                  }}
                >
                  <div
                    className="shrink-0 mt-0.5 w-8 h-7 rounded-md flex items-center justify-center font-mono text-[11px] font-bold transition-all"
                    style={
                      selected
                        ? { background: level.color, color: '#08090e' }
                        : { background: '#13141f', color: '#565775' }
                    }
                  >
                    {level.tag}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[14px] font-bold text-[#e8e9f5]">{level.label}</span>
                      {selected && (
                        <span
                          className="font-mono text-[9px] px-1.5 py-0.5 rounded border"
                          style={{
                            color: level.color,
                            background: `${level.color}15`,
                            borderColor: `${level.color}30`,
                          }}
                        >
                          selected
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-[#565775] leading-relaxed">{level.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => goBack('verticals')}
              className="text-[13px] text-[#565775] hover:text-[#e8e9f5] transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handleFinish}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl font-bold text-[13px] text-[#08090e] transition-all disabled:opacity-50 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,212,255,0.25)] active:scale-[0.98] flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #7c6df8, #00d4ff)' }}
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-[#08090e]/30 border-t-[#08090e] rounded-full animate-spin" />
                  Setting up…
                </>
              ) : (
                'Go to my feed →'
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── Step 5: Done ── */}
      {step === 'done' && (
        <div className="flex flex-col items-center justify-center py-16 text-center animate-fadein">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 animate-pulse-glow"
            style={{ background: 'linear-gradient(135deg, #7c6df8, #00d4ff)' }}
          >
            <span className="text-4xl">⚡</span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#e8e9f5] mb-2 animate-fadein-d1">
            You&apos;re all set, {displayName.trim()}!
          </h2>
          <p className="text-[13px] text-[#565775] animate-fadein-d2">
            Your personalized AI intelligence feed is ready.
          </p>
          <div className="mt-5 flex items-center gap-2 animate-fadein-d3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-pulse" />
            <span className="font-mono text-[11px] text-[#00d4ff]">Loading your feed…</span>
          </div>
        </div>
      )}
    </div>
  )
}
