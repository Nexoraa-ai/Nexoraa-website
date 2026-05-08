'use client'

import { useState } from 'react'
import { formatDistanceToNow, format } from 'date-fns'
import { PriorityBadge } from './PriorityBadge'
import { CategoryPill } from '../shared/CategoryPill'
import { VerticalPanel } from './VerticalPanel'
import type { FeedCluster, SummaryLevel, UserPlan } from '@neuralforge/types'
import { PRIORITY } from '@neuralforge/types'

interface FeedItemProps {
  cluster: FeedCluster
  summaryLevel: SummaryLevel
  userPlan: UserPlan
  onRead: (clusterId: string) => void
  index?: number
}

export function FeedItem({ cluster, summaryLevel, userPlan, onRead, index = 0 }: FeedItemProps) {
  const [expanded, setExpanded] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [hovered, setHovered] = useState(false)

  const summary = summaryLevel === 'beginner'
    ? cluster.summary_beginner
    : summaryLevel === 'intermediate'
    ? cluster.summary_intermediate
    : cluster.summary_expert

  const isBreaking = cluster.priority_score >= PRIORITY.OPUS_MIN
  const isImportant = cluster.priority_score >= PRIORITY.VERTICAL_PANELS_MIN

  const leftBorderColor = isBreaking
    ? 'var(--l3)'
    : isImportant
    ? 'var(--l0)'
    : 'var(--border2)'

  const date = new Date(cluster.first_seen_at)
  const relativeTime = formatDistanceToNow(date, { addSuffix: true })
  const absoluteTime = format(date, 'MMM d, h:mm a')

  function handleExpand() {
    setExpanded(e => !e)
    if (!expanded) onRead(cluster.cluster_id)
  }

  return (
    <article
      className={[
        'relative bg-[var(--s1)] border border-[var(--border)] rounded-xl overflow-hidden',
        'transition-all duration-200 cursor-default',
        isBreaking ? 'animate-pulse-glow' : '',
      ].join(' ')}
      style={{
        borderLeft: `3px solid ${leftBorderColor}`,
        animationDelay: `${index * 0.05}s`,
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
        boxShadow: hovered
          ? isBreaking
            ? '0 8px 32px rgba(247,68,112,0.12), 0 2px 8px rgba(0,0,0,0.4)'
            : isImportant
            ? '0 8px 32px rgba(0,212,255,0.08), 0 2px 8px rgba(0,0,0,0.4)'
            : '0 8px 24px rgba(0,0,0,0.3)'
          : '0 1px 4px rgba(0,0,0,0.2)',
        borderColor: hovered ? 'var(--border2)' : undefined,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="p-4">
        {/* Top row: category + priority + sources + time */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <CategoryPill category={cluster.category} />
          <PriorityBadge score={cluster.priority_score} />

          {cluster.item_count > 1 && (
            <span
              className="font-mono text-[10px] px-1.5 py-0.5 rounded border"
              style={{
                color: 'var(--l4)',
                background: 'rgba(53,217,122,0.07)',
                borderColor: 'rgba(53,217,122,0.2)',
              }}
            >
              {cluster.item_count} sources
            </span>
          )}

          <span className="ml-auto font-mono text-[10px] text-[var(--dim)]" title={absoluteTime}>
            {relativeTime}
          </span>
        </div>

        {/* Title */}
        <h2
          className="text-[15px] font-semibold leading-snug cursor-pointer transition-colors duration-150"
          style={{ color: hovered ? 'var(--l0)' : 'var(--text)' }}
          onClick={handleExpand}
        >
          {cluster.canonical_title}
        </h2>

        {/* Absolute date */}
        <div className="mt-1 flex items-center gap-1.5">
          <span className="font-mono text-[10px] text-[var(--dim)]">{absoluteTime}</span>
          {cluster.region_relevance === 'india' || cluster.region_relevance === 'india_first' ? (
            <span className="font-mono text-[9px] text-[var(--dim)] border border-[var(--border)] px-1 rounded">🇮🇳 IN</span>
          ) : null}
        </div>

        {/* Summary */}
        {summary && (
          <div
            className="mt-2 text-[13px] text-[var(--muted)] leading-relaxed overflow-hidden transition-all duration-300"
            style={{ maxHeight: expanded ? '1000px' : '4.5rem' }}
          >
            <p className={!expanded ? 'line-clamp-3' : undefined}>{summary}</p>
          </div>
        )}

        {/* Actions row */}
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={handleExpand}
            className="text-[11px] font-mono text-[var(--muted)] hover:text-[var(--l0)] transition-colors"
          >
            {expanded ? '↑ collapse' : '↓ read more'}
          </button>

          {cluster.priority_score >= PRIORITY.VERTICAL_PANELS_MIN &&
            Object.keys(cluster.vertical_panels).length > 0 && (
              <button
                onClick={() => setPanelOpen(o => !o)}
                className="text-[11px] font-mono transition-colors ml-auto"
                style={{ color: panelOpen ? 'var(--l0)' : 'var(--muted)' }}
              >
                {panelOpen ? '— impact' : '+ impact by industry'}
              </button>
            )}
        </div>
      </div>

      {/* Vertical impact panel */}
      {panelOpen && cluster.priority_score >= PRIORITY.VERTICAL_PANELS_MIN && (
        <VerticalPanel panels={cluster.vertical_panels} />
      )}
    </article>
  )
}
