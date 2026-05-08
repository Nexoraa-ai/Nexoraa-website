import Link from 'next/link'

interface ComingSoonPageProps {
  layerNum: string
  layerName: string
  color: string
  headline: string
  description: string
  features: string[]
}

export function ComingSoonPage({
  layerNum,
  layerName,
  color,
  headline,
  description,
  features,
}: ComingSoonPageProps) {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center animate-fadein">
      {/* Layer badge */}
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-8"
        style={{ borderColor: `${color}30`, background: `${color}08` }}
      >
        <span className="font-mono text-[10px] font-bold" style={{ color }}>L.{layerNum}</span>
        <span className="font-mono text-[10px]" style={{ color }}>{layerName}</span>
        <span className="font-mono text-[9px] px-1.5 py-0.5 rounded border ml-1"
          style={{ borderColor: `${color}20`, color: `${color}90`, background: `${color}08` }}>
          in development
        </span>
      </div>

      {/* Headline */}
      <h1 className="text-2xl font-extrabold text-[var(--text)] mb-3 leading-tight">{headline}</h1>
      <p className="text-[14px] text-[var(--muted)] leading-relaxed mb-10 max-w-md mx-auto">{description}</p>

      {/* Features preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-10 text-left">
        {features.map(feat => (
          <div
            key={feat}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--s1)]"
          >
            <span className="font-mono text-[11px]" style={{ color }}>→</span>
            <span className="text-[13px] text-[var(--muted)]">{feat}</span>
          </div>
        ))}
      </div>

      {/* Progress indicator */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-48 h-1.5 rounded-full bg-[var(--s3)] overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: '20%', background: color }}
          />
        </div>
        <span className="font-mono text-[10px] text-[var(--dim)]">development in progress · Phase 1</span>
      </div>

      {/* Back to feed */}
      <div className="mt-10">
        <Link
          href="/feed"
          className="inline-flex items-center gap-2 text-[13px] text-[var(--muted)] hover:text-[var(--l0)] transition-colors font-mono"
        >
          ← Back to AIPulse feed
        </Link>
      </div>
    </div>
  )
}
