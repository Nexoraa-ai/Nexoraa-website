import type { Category } from '@neuralforge/types'
import { CATEGORY_LAYER } from '@neuralforge/types'

interface CategoryPillProps {
  category: Category
}

const CATEGORY_LABELS: Record<Category, string> = {
  model_release: 'Model',
  tool_launch: 'Tool',
  research_paper: 'Research',
  funding: 'Funding',
  security: 'Security',
  tutorial: 'Tutorial',
  regulation: 'Policy',
  opinion: 'Opinion',
}

const LAYER_HEX: Record<string, string> = {
  l0: '#00d4ff',
  l1: '#7c6df8',
  l2: '#f7a435',
  l3: '#f74470',
  l4: '#35d97a',
  l5: '#ff6b35',
  l6: '#a855f7',
  gold: '#f5c842',
  muted: '#565775',
}

export function CategoryPill({ category }: CategoryPillProps) {
  const layerKey = CATEGORY_LAYER[category]
  const color = LAYER_HEX[layerKey] ?? '#565775'

  return (
    <span
      className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full"
      style={{
        color,
        backgroundColor: `${color}18`,
        border: `1px solid ${color}30`,
      }}
    >
      {CATEGORY_LABELS[category]}
    </span>
  )
}
