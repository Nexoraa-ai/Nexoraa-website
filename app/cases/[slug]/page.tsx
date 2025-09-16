import { notFound } from 'next/navigation'
import Link from 'next/link'
import { cases, caseBySlug } from '@/content/cases'

export function generateStaticParams() {
  return cases.map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const cs = caseBySlug(params.slug)
  if (!cs) return {}
  return { title: `${cs.title} — Nexoraa`, description: cs.summary }
}

export default function CasePage({ params }: { params: { slug: string } }) {
  const cs = caseBySlug(params.slug)
  if (!cs) return notFound()

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/cases" className="text-zinc-400 hover:text-white">← All cases</Link>
      <h1 className="mt-4 text-3xl md:text-5xl font-semibold text-white">{cs.title}</h1>
      <p className="mt-4 text-zinc-300">{cs.summary}</p>
      <h2 className="mt-8 text-white font-semibold">Headline Metrics</h2>
      <ul className="mt-3 list-disc list-inside text-zinc-300 space-y-2">
        {cs.metrics.map(m => <li key={m}>{m}</li>)}
      </ul>
      <div className="mt-10">
        <a href="/" className="rounded-md ring-1 ring-white/15 px-4 py-2">Back to Home</a>
      </div>
    </main>
  )
}
