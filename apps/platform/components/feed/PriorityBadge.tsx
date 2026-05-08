import { PRIORITY } from '@neuralforge/types'

interface PriorityBadgeProps {
  score: number
}

export function PriorityBadge({ score }: PriorityBadgeProps) {
  const color =
    score >= PRIORITY.OPUS_MIN
      ? '#f74470'          // l3 pink — breaking
      : score >= PRIORITY.VERTICAL_PANELS_MIN
      ? '#00d4ff'          // l0 cyan — important
      : '#565775'          // muted — standard

  return (
    <span
      className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded"
      style={{
        color,
        backgroundColor: `${color}18`,
        border: `1px solid ${color}30`,
      }}
    >
      P{score}
    </span>
  )
}
