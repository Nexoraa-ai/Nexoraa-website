'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FeedItem } from './FeedItem'
import { FeedFilter } from './FeedFilter'
import type { FeedCluster, SummaryLevel, Category, UserPlan, VerticalSlug } from '@neuralforge/types'

const VERTICAL_SHORT: Record<VerticalSlug, string> = {
  'web-dev': 'Web Dev',
  'mobile': 'Mobile',
  'data-ml': 'Data & ML',
  'devops-cloud': 'DevOps',
  'design-ux': 'Design',
  'product': 'Product',
  'students': 'Students',
  'entrepreneurs': 'Founders',
}

const VERTICAL_COLOR: Record<VerticalSlug, string> = {
  'web-dev': '#00d4ff',
  'mobile': '#7c6df8',
  'data-ml': '#f74470',
  'devops-cloud': '#f7a435',
  'design-ux': '#35d97a',
  'product': '#a855f7',
  'students': '#f5c842',
  'entrepreneurs': '#ff6b35',
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

interface FeedContainerProps {
  initialClusters: FeedCluster[]
  userId?: string
  userPlan: UserPlan
  preferredLevel: SummaryLevel
  streak: number
  displayName?: string | null
  selectedVerticals?: VerticalSlug[] | null
}

export function FeedContainer({
  initialClusters,
  userId,
  userPlan,
  preferredLevel: initialLevel,
  streak,
  displayName,
  selectedVerticals,
}: FeedContainerProps) {
  const [clusters, setClusters] = useState(initialClusters)
  const [summaryLevel, setSummaryLevel] = useState<SummaryLevel>(initialLevel)
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(initialClusters.length === 20)
  const supabase = createClient()

  const greeting = getGreeting()
  const firstName = displayName?.split(' ')[0] ?? displayName ?? null

  const handleLevelChange = useCallback(
    async (level: SummaryLevel) => {
      setSummaryLevel(level)
      if (userId) {
        await supabase
          .from('user_profiles')
          .update({ preferred_level: level })
          .eq('id', userId)
      }
    },
    [userId, supabase]
  )

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return
    setIsLoadingMore(true)
    const lastCluster = clusters[clusters.length - 1]
    const { data } = await supabase.rpc('get_feed', {
      p_user_id: userId ?? null,
      p_min_priority: userId ? 50 : 70,
      p_limit: 20,
      p_after: lastCluster?.first_seen_at ?? null,
      p_offset: 0,
    })
    if (data && data.length > 0) {
      setClusters(prev => [...prev, ...data])
      setHasMore(data.length === 20)
    } else {
      setHasMore(false)
    }
    setIsLoadingMore(false)
  }, [clusters, isLoadingMore, hasMore, userId, supabase])

  const markAsRead = useCallback(
    async (clusterId: string) => {
      if (!userId) return
      await supabase.from('user_reads').upsert({
        user_id: userId,
        cluster_id: clusterId,
        read_level: summaryLevel,
      })
    },
    [userId, summaryLevel, supabase]
  )

  const filteredClusters = activeCategory
    ? clusters.filter(c => c.category === activeCategory)
    : clusters

  return (
    <div className="max-w-3xl mx-auto">
      {/* Personalization header */}
      {userId && (
        <div className="mb-5 animate-fadein">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <span className="text-[var(--l0)]">⚡</span>
                <span>
                  {firstName ? (
                    <>
                      {greeting},{' '}
                      <span
                        style={{
                          background: 'linear-gradient(90deg, var(--l1), var(--l0))',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        {firstName}
                      </span>
                    </>
                  ) : (
                    'AIPulse'
                  )}
                </span>
              </h1>

              {/* Selected verticals */}
              {selectedVerticals && selectedVerticals.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  {selectedVerticals.map(v => (
                    <span
                      key={v}
                      className="font-mono text-[9px] px-1.5 py-0.5 rounded border"
                      style={{
                        color: VERTICAL_COLOR[v],
                        background: `${VERTICAL_COLOR[v]}12`,
                        borderColor: `${VERTICAL_COLOR[v]}25`,
                      }}
                    >
                      {VERTICAL_SHORT[v]}
                    </span>
                  ))}
                </div>
              )}

              {streak > 0 && (
                <p className="text-xs text-[var(--muted)] mt-1 font-mono">
                  🔥 {streak}-day streak
                </p>
              )}
            </div>

            {/* Summary level toggle */}
            <div className="flex items-center gap-1 bg-[var(--s2)] rounded-lg p-1 shrink-0">
              {(['beginner', 'intermediate', 'expert'] as SummaryLevel[]).map(level => (
                <button
                  key={level}
                  onClick={() => handleLevelChange(level)}
                  disabled={level === 'expert' && userPlan === 'free'}
                  className={[
                    'px-2.5 py-1 rounded-md text-xs font-medium font-mono transition-all',
                    summaryLevel === level
                      ? 'bg-[var(--l0)] text-[var(--bg)] font-semibold shadow-[0_0_8px_rgba(0,212,255,0.3)]'
                      : 'text-[var(--muted)] hover:text-[var(--text)]',
                    level === 'expert' && userPlan === 'free'
                      ? 'opacity-40 cursor-not-allowed'
                      : 'cursor-pointer',
                  ].join(' ')}
                  title={
                    level === 'expert' && userPlan === 'free'
                      ? 'Upgrade to Pro to unlock ML-level summaries'
                      : undefined
                  }
                >
                  {level === 'beginner' ? '101' : level === 'intermediate' ? 'dev' : 'ml'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Unauthenticated minimal header */}
      {!userId && (
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <span className="text-[var(--l0)]">⚡</span>
            AIPulse
          </h1>
          <div className="flex items-center gap-1 bg-[var(--s2)] rounded-lg p-1">
            {(['beginner', 'intermediate'] as SummaryLevel[]).map(level => (
              <button
                key={level}
                onClick={() => setSummaryLevel(level)}
                className={[
                  'px-2.5 py-1 rounded-md text-xs font-medium font-mono transition-all',
                  summaryLevel === level
                    ? 'bg-[var(--l0)] text-[var(--bg)] font-semibold'
                    : 'text-[var(--muted)] hover:text-[var(--text)]',
                ].join(' ')}
              >
                {level === 'beginner' ? '101' : 'dev'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category filter */}
      <FeedFilter activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      {/* Feed items */}
      <div className="space-y-3 mt-4">
        {filteredClusters.length === 0 ? (
          <div className="text-center py-16 text-[var(--muted)] animate-fadein">
            <div className="text-3xl mb-3">📡</div>
            <p className="text-sm font-medium text-[var(--text)]">Pipeline warming up</p>
            <p className="text-xs mt-1">New AI intelligence will appear here shortly.</p>
          </div>
        ) : (
          filteredClusters.map((cluster, i) => (
            <div key={cluster.cluster_id} className="animate-fadein" style={{ animationDelay: `${i * 0.04}s` }}>
              <FeedItem
                cluster={cluster}
                summaryLevel={summaryLevel}
                userPlan={userPlan}
                onRead={markAsRead}
                index={i}
              />
            </div>
          ))
        )}
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center mt-8 mb-4">
          <button
            onClick={loadMore}
            disabled={isLoadingMore}
            className="px-5 py-2 bg-[var(--s2)] border border-[var(--border)] rounded-lg text-sm text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--border2)] hover:shadow-[0_0_12px_rgba(0,212,255,0.06)] transition-all font-mono"
          >
            {isLoadingMore ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 border border-[var(--muted)] border-t-[var(--l0)] rounded-full animate-spin" />
                loading…
              </span>
            ) : (
              'load more'
            )}
          </button>
        </div>
      )}
    </div>
  )
}
