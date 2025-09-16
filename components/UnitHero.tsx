import { type Unit } from '@/content/units'

const palette: Record<Unit['slug'], { from: string; to: string; title: string }> = {
  'corporate-core': { from: 'from-primary-400', to: 'to-neon', title: 'Corporate Core' },
  'tradesync': { from: 'from-teal-300', to: 'to-primary-400', title: 'TradeSync' },
  'healthtrust': { from: 'from-emerald-300', to: 'to-neon', title: 'HealthTrust' },
  'finsecure': { from: 'from-sky-300', to: 'to-primary-400', title: 'FinSecure' },
}

export default function UnitHero({ unit }: { unit: Unit }) {
  const colors = palette[unit.slug]
  return (
    <section className="relative overflow-hidden">
      {/* Soft aurora wash matching the global theme */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-[#0b6bff]/14 blur-3xl animate-aurora" />
        <div className="absolute top-16 -right-10 h-56 w-56 rounded-full bg-[#00e0ff]/12 blur-2xl animate-aurora-slow" />
      </div>
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-10">
        <div className="relative">
          <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary-500/25 blur-3xl" />
          <h1 className="relative text-3xl md:text-5xl font-semibold text-white">
            {unit.title}
          </h1>
          <p className="relative mt-4 text-zinc-300 max-w-3xl">{unit.description}</p>
          <div className="relative mt-6 inline-flex items-center gap-2 rounded-md ring-1 ring-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300">
            <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${colors.from} ${colors.to} animate-pulse-glow`} />
            <span>{unit.focus}</span>
          </div>
        </div>
        <div className="mt-10">
          <AnimatedCircuit className="w-full" from={colors.from} to={colors.to} />
        </div>
      </div>
    </section>
  )
}

function AnimatedCircuit({ className, from, to }: { className?: string; from: string; to: string }) {
  return (
    <svg viewBox="0 0 900 240" className={className} aria-hidden>
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#7C4DFF" offset="0" />
          <stop stopColor="#00F0FF" offset="1" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#grad)" strokeWidth="2" opacity="0.9">
        <path className="animate-dash" d="M20 60 H240 C300 60 300 140 360 140 H520 C600 140 600 60 680 60 H880" />
        <path className="animate-dash delay-200" d="M20 110 H200 C260 110 260 190 320 190 H560 C620 190 620 110 700 110 H880" />
        <path className="animate-dash delay-400" d="M20 160 H280 C340 160 340 80 400 80 H540 C620 80 620 160 700 160 H880" />
      </g>
      <g>
        <circle cx="240" cy="60" r="3" fill="#ffffff66" />
        <circle cx="360" cy="140" r="3" fill="#ffffff66" />
        <circle cx="520" cy="140" r="3" fill="#ffffff66" />
        <circle cx="680" cy="60" r="3" fill="#ffffff66" />
      </g>
    </svg>
  )
}
