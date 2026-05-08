import { notFound } from 'next/navigation'
import Link from 'next/link'
import { unitBySlug, units } from '@/content/units'
import UnitHero from '@/components/UnitHero'

export function generateStaticParams() {
  return units.map(u => ({ slug: u.slug }))
}

type UnitPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: UnitPageProps) {
  const { slug } = await params
  const unit = unitBySlug(slug)
  if (!unit) return {}
  return {
    title: `${unit.title} — Nexoraa`,
    description: unit.description
  }
}

export default async function UnitPage({ params }: UnitPageProps) {
  const { slug } = await params
  const unit = unitBySlug(slug)
  if (!unit) return notFound()

  return (
    <main>
      <UnitHero unit={unit} />
      <div className="mx-auto max-w-5xl px-6 pb-16">
        <Link href="/" className="text-zinc-400 hover:text-white">← Back</Link>

  <section className="mt-10 grid md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-6">
          <h2 className="text-white font-semibold">Key Features</h2>
          <ul className="mt-3 list-disc list-inside text-zinc-300 space-y-2">
            {unit.features.map(f => <li key={f}>{f}</li>)}
          </ul>
        </div>
        <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-6">
          <h2 className="text-white font-semibold">Expected Outcomes</h2>
          <ul className="mt-3 list-disc list-inside text-zinc-300 space-y-2">
            {unit.outcomes.map(o => <li key={o}>{o}</li>)}
          </ul>
        </div>
      </section>

  <section className="mt-10 grid md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-6">
          <h2 className="text-white font-semibold">Integrations</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {unit.integrations.map(i => (
              <span key={i} className="rounded-md bg-ink ring-1 ring-white/10 px-2 py-1 text-xs text-zinc-300">{i}</span>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-6">
          <h2 className="text-white font-semibold">Keywords</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {unit.keywords.map(k => (
              <span key={k} className="rounded-md bg-ink ring-1 ring-white/10 px-2 py-1 text-xs text-zinc-300">{k}</span>
            ))}
          </div>
        </div>
      </section>

        <div className="mt-12 flex items-center gap-3">
          <a href={`/contact?unit=${encodeURIComponent(unit.slug)}&topic=${encodeURIComponent(unit.title)}`} className="rounded-md bg-primary-600 px-5 py-3 text-white font-medium hover:bg-primary-500">Discuss a pilot</a>
          <a href="#contact" className="rounded-md ring-1 ring-white/15 px-5 py-3 text-zinc-200 hover:bg-white/5">General inquiry</a>
        </div>
      </div>
    </main>
  )
}
