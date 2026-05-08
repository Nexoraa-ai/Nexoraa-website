'use client'

import type { Category } from '@neuralforge/types'
import { CATEGORY_LAYER } from '@neuralforge/types'

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'model_release', label: 'Models' },
  { value: 'tool_launch', label: 'Tools' },
  { value: 'research_paper', label: 'Research' },
  { value: 'funding', label: 'Funding' },
  { value: 'security', label: 'Security' },
  { value: 'tutorial', label: 'Tutorials' },
  { value: 'regulation', label: 'Policy' },
  { value: 'opinion', label: 'Opinion' },
]

const LAYER_COLORS: Record<string, string> = {
  l0: 'var(--l0)',
  l1: 'var(--l1)',
  l2: 'var(--l2)',
  l3: 'var(--l3)',
  l4: 'var(--l4)',
  l5: 'var(--l5)',
  l6: 'var(--l6)',
  gold: 'var(--gold)',
  muted: 'var(--muted)',
}

interface FeedFilterProps {
  activeCategory: Category | null
  onCategoryChange: (category: Category | null) => void
}

export function FeedFilter({ activeCategory, onCategoryChange }: FeedFilterProps) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      <button
        onClick={() => onCategoryChange(null)}
        className={[
          'shrink-0 px-3 py-1 rounded-full text-[11px] font-mono font-medium transition-all',
          !activeCategory
            ? 'bg-[var(--l0)] text-[var(--bg)]'
            : 'bg-[var(--s2)] text-[var(--muted)] hover:text-[var(--text)]',
        ].join(' ')}
      >
        All
      </button>
      {CATEGORIES.map(cat => {
        const color = LAYER_COLORS[CATEGORY_LAYER[cat.value]] ?? 'var(--muted)'
        const isActive = activeCategory === cat.value
        return (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(isActive ? null : cat.value)}
            className="shrink-0 px-3 py-1 rounded-full text-[11px] font-mono font-medium transition-all"
            style={{
              backgroundColor: isActive ? `${color}25` : 'var(--s2)',
              color: isActive ? color : 'var(--muted)',
              border: `1px solid ${isActive ? `${color}50` : 'transparent'}`,
            }}
          >
            {cat.label}
          </button>
        )
      })}
    </div>
  )
}
