'use client'

import { useState } from 'react'
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
  { value: 'beginner', label: 'Beginner', tag: '101', color: '#35d97a', desc: '~200 words, plain English. No jargon.' },
  { value: 'intermediate', label: 'Developer', tag: 'dev', color: '#00d4ff', desc: '~100 words. Model names, API changes, benchmarks.' },
  { value: 'expert', label: 'ML Engineer', tag: 'ml', color: '#7c6df8', desc: '~50 words, dense & technical. Architecture details.' },
]

type SaveState = 'idle' | 'saving' | 'saved'

interface PreferencesFormProps {
  userId: string
  userEmail: string
  initialDisplayName: string
  initialRole: string
  initialVerticals: VerticalSlug[]
  initialLevel: SummaryLevel
  userPlan: string
}

function SaveButton({ state, onClick }: { state: SaveState; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={state === 'saving'}
      className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-[12px] font-semibold font-mono transition-all disabled:opacity-60"
      style={
        state === 'saved'
          ? { background: 'rgba(53,217,122,0.15)', color: '#35d97a', border: '1px solid rgba(53,217,122,0.3)' }
          : { background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.25)' }
      }
    >
      {state === 'saving' ? (
        <>
          <span className="w-3 h-3 border border-[#00d4ff]/40 border-t-[#00d4ff] rounded-full animate-spin" />
          saving…
        </>
      ) : state === 'saved' ? (
        <>✓ saved</>
      ) : (
        'save changes'
      )}
    </button>
  )
}

export function PreferencesForm({
  userId,
  userEmail,
  initialDisplayName,
  initialRole,
  initialVerticals,
  initialLevel,
  userPlan,
}: PreferencesFormProps) {
  const supabase = createClient()

  const [displayName, setDisplayName] = useState(initialDisplayName)
  const [selectedRole, setSelectedRole] = useState(initialRole)
  const [selectedVerticals, setSelectedVerticals] = useState<VerticalSlug[]>(initialVerticals)
  const [selectedLevel, setSelectedLevel] = useState<SummaryLevel>(initialLevel)

  const [profileSave, setProfileSave] = useState<SaveState>('idle')
  const [verticalsSave, setVerticalsSave] = useState<SaveState>('idle')
  const [levelSave, setLevelSave] = useState<SaveState>('idle')

  function toggleVertical(slug: VerticalSlug) {
    setSelectedVerticals(prev =>
      prev.includes(slug)
        ? prev.filter(v => v !== slug)
        : prev.length < 5 ? [...prev, slug] : prev
    )
    setVerticalsSave('idle')
  }

  async function saveProfile() {
    setProfileSave('saving')
    await supabase
      .from('user_profiles')
      .update({ display_name: displayName.trim(), metadata: { role: selectedRole } })
      .eq('id', userId)
    setProfileSave('saved')
    setTimeout(() => setProfileSave('idle'), 3000)
  }

  async function saveVerticals() {
    setVerticalsSave('saving')
    await supabase
      .from('user_profiles')
      .update({ selected_verticals: selectedVerticals })
      .eq('id', userId)
    setVerticalsSave('saved')
    setTimeout(() => setVerticalsSave('idle'), 3000)
  }

  async function saveLevel() {
    setLevelSave('saving')
    await supabase
      .from('user_profiles')
      .update({ preferred_level: selectedLevel })
      .eq('id', userId)
    setLevelSave('saved')
    setTimeout(() => setLevelSave('idle'), 3000)
  }

  return (
    <div className="space-y-6">

      {/* ── Section: Profile ── */}
      <section className="bg-[var(--s1)] border border-[var(--border)] rounded-xl p-5 animate-fadein">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[14px] font-bold text-[var(--text)]">Profile</h2>
            <p className="text-[11px] text-[var(--muted)] mt-0.5">Your name and role in the AI ecosystem</p>
          </div>
          <SaveButton state={profileSave} onClick={saveProfile} />
        </div>

        {/* Display name */}
        <div className="mb-4">
          <label className="block font-mono text-[10px] text-[var(--dim)] uppercase tracking-wider mb-1.5">
            Display name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={e => { setDisplayName(e.target.value); setProfileSave('idle') }}
            className="w-full max-w-xs px-3 py-2 rounded-lg bg-[var(--s2)] border border-[var(--border)] text-[var(--text)] text-[13px] font-medium placeholder:text-[var(--dim)] focus:outline-none focus:border-[#00d4ff]/50 focus:shadow-[0_0_0_3px_rgba(0,212,255,0.06)] transition-all"
          />
          <p className="text-[10px] text-[var(--dim)] mt-1 font-mono">{userEmail}</p>
        </div>

        {/* Role */}
        <label className="block font-mono text-[10px] text-[var(--dim)] uppercase tracking-wider mb-2">
          Role
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {ROLES.map(role => {
            const selected = selectedRole === role.slug
            return (
              <button
                key={role.slug}
                onClick={() => { setSelectedRole(role.slug); setProfileSave('idle') }}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg border text-left transition-all duration-150 hover:scale-[1.01]"
                style={{
                  borderColor: selected ? 'rgba(0,212,255,0.35)' : 'var(--border)',
                  background: selected ? 'rgba(0,212,255,0.05)' : 'var(--s2)',
                }}
              >
                <span className="text-[15px] shrink-0">{role.icon}</span>
                <div>
                  <div className="text-[11px] font-semibold text-[var(--text)] leading-tight">{role.label}</div>
                  <div className="text-[9px] text-[var(--dim)] leading-tight hidden sm:block">{role.desc}</div>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* ── Section: Feed Interests ── */}
      <section className="bg-[var(--s1)] border border-[var(--border)] rounded-xl p-5 animate-fadein-d1">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[14px] font-bold text-[var(--text)]">Feed interests</h2>
            <p className="text-[11px] text-[var(--muted)] mt-0.5">Up to 5 areas — filters your feed and impact panels</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-[var(--dim)]">{selectedVerticals.length} / 5</span>
            <SaveButton state={verticalsSave} onClick={saveVerticals} />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {VERTICALS.map(v => {
            const selected = selectedVerticals.includes(v.slug)
            const atLimit = selectedVerticals.length >= 5 && !selected
            return (
              <button
                key={v.slug}
                onClick={() => toggleVertical(v.slug)}
                disabled={atLimit}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg border text-left transition-all duration-150 hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  borderColor: selected ? 'rgba(0,212,255,0.35)' : 'var(--border)',
                  background: selected ? 'rgba(0,212,255,0.05)' : 'var(--s2)',
                }}
              >
                <span className="text-[15px] shrink-0">{v.icon}</span>
                <div>
                  <div className="text-[11px] font-semibold text-[var(--text)] leading-tight">{v.label}</div>
                  <div className="text-[9px] text-[var(--dim)] leading-tight hidden sm:block">{v.desc}</div>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* ── Section: Reading Level ── */}
      <section className="bg-[var(--s1)] border border-[var(--border)] rounded-xl p-5 animate-fadein-d2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[14px] font-bold text-[var(--text)]">Reading level</h2>
            <p className="text-[11px] text-[var(--muted)] mt-0.5">Controls how summaries are written in your feed</p>
          </div>
          <SaveButton state={levelSave} onClick={saveLevel} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {LEVELS.map(level => {
            const selected = selectedLevel === level.value
            const locked = level.value === 'expert' && userPlan === 'free'
            return (
              <button
                key={level.value}
                onClick={() => { if (!locked) { setSelectedLevel(level.value); setLevelSave('idle') } }}
                disabled={locked}
                className="flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-150 hover:scale-[1.005] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  borderColor: selected ? `${level.color}40` : 'var(--border)',
                  background: selected ? `${level.color}08` : 'var(--s2)',
                  boxShadow: selected ? `0 0 14px ${level.color}0d` : 'none',
                }}
              >
                <div
                  className="shrink-0 w-8 h-7 rounded-md flex items-center justify-center font-mono text-[11px] font-bold transition-all"
                  style={selected
                    ? { background: level.color, color: '#08090e' }
                    : { background: 'var(--s3)', color: 'var(--muted)' }
                  }
                >
                  {level.tag}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[12px] font-bold text-[var(--text)]">{level.label}</span>
                    {locked && (
                      <span className="font-mono text-[8px] px-1 py-0.5 rounded border border-[var(--border)] text-[var(--dim)]">
                        Pro+
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[var(--muted)] leading-relaxed">{level.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* ── Section: Account ── */}
      <section className="bg-[var(--s1)] border border-[var(--border)] rounded-xl p-5 animate-fadein-d3">
        <h2 className="text-[14px] font-bold text-[var(--text)] mb-3">Account</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
            <span className="text-[12px] text-[var(--muted)]">Email</span>
            <span className="font-mono text-[11px] text-[var(--text)]">{userEmail}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
            <span className="text-[12px] text-[var(--muted)]">Plan</span>
            <span
              className="font-mono text-[10px] px-2 py-0.5 rounded"
              style={
                userPlan === 'premium'
                  ? { color: '#7c6df8', background: 'rgba(124,109,248,0.12)' }
                  : userPlan === 'pro'
                  ? { color: '#00d4ff', background: 'rgba(0,212,255,0.1)' }
                  : { color: '#565775', background: 'rgba(86,87,117,0.15)' }
              }
            >
              {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)}
            </span>
          </div>
          {userPlan === 'free' && (
            <div className="pt-2">
              <a
                href="/#pricing"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#00d4ff]/25 bg-[#00d4ff]/5 text-[11px] font-semibold text-[#00d4ff] hover:bg-[#00d4ff]/10 hover:border-[#00d4ff]/40 transition-all"
              >
                ⚡ Upgrade to Pro — unlock ML summaries & unlimited swipes
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
