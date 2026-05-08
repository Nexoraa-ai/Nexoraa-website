'use client'

import type { VerticalPanels, VerticalSlug } from '@neuralforge/types'
import { VERTICAL_LABELS } from '@neuralforge/types'

interface VerticalPanelProps {
  panels: VerticalPanels
}

const VERTICAL_ICONS: Record<VerticalSlug, string> = {
  'web-dev': '🌐',
  'mobile': '📱',
  'data-ml': '🧠',
  'devops-cloud': '☁️',
  'design-ux': '🎨',
  'product': '📊',
  'students': '🎓',
  'entrepreneurs': '🚀',
}

const VERTICALS: VerticalSlug[] = [
  'web-dev', 'mobile', 'data-ml', 'devops-cloud',
  'design-ux', 'product', 'students', 'entrepreneurs',
]

export function VerticalPanel({ panels }: VerticalPanelProps) {
  const populated = VERTICALS.filter(v => panels[v])

  if (populated.length === 0) return null

  return (
    <div className="border-t border-[var(--border)] bg-[var(--s2)] px-4 py-3">
      <p className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider mb-3">
        How this affects your field
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {populated.map(slug => (
          <div
            key={slug}
            className="p-2.5 rounded-lg bg-[var(--s3)] border border-[var(--border)]"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[11px]">{VERTICAL_ICONS[slug]}</span>
              <span className="text-[10px] font-mono font-semibold text-[var(--l0)] uppercase tracking-wide">
                {VERTICAL_LABELS[slug]}
              </span>
            </div>
            <p className="text-[12px] text-[var(--muted)] leading-relaxed">
              {panels[slug]}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
