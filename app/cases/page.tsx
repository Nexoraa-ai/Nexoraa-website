import Link from 'next/link'
import { cases } from '@/content/cases'
import { Suspense } from 'react'

export const metadata = {
  title: 'Case Studies — Nexoraa',
  description: 'Selected outcomes and wins across Nexoraa business units.'
}

function CasesListing() {
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const tag = params.get('tag') || 'all'
  const page = Math.max(1, parseInt(params.get('page') || '1', 10))
  const pageSize = 6

  const filtered = tag === 'all' ? cases : cases.filter(c => [c.unit].includes(tag as any))
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const start = (page - 1) * pageSize
  const list = filtered.slice(start, start + pageSize)

  const tags = ['all', 'corporate-core', 'tradesync', 'healthtrust', 'finsecure']

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
        {tags.map(t => (
          <a key={t} href={`?tag=${t}`} className={`rounded-md px-2 py-1 ring-1 ring-white/10 ${t===tag ? 'bg-white/10 text-white' : 'text-zinc-300 hover:bg-white/5'}`}>{t}</a>
        ))}
      </div>
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        {list.map(cs => (
          <Link key={cs.slug} href={`/cases/${cs.slug}`} className="group rounded-xl bg-white/5 ring-1 ring-white/10 p-6 hover:bg-white/[0.07] transition">
            <h2 className="text-white font-semibold">{cs.title}</h2>
            <p className="mt-2 text-zinc-400 text-sm">{cs.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-400">
              {cs.metrics.map(m => <span key={m} className="rounded bg-ink ring-1 ring-white/10 px-2 py-1">{m}</span>)}
            </div>
          </Link>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-8 flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <a key={n} href={`?tag=${tag}&page=${n}`} className={`rounded-md px-2 py-1 ring-1 ring-white/10 ${n===page ? 'bg-white/10 text-white' : 'text-zinc-300 hover:bg-white/5'}`}>{n}</a>
          ))}
        </div>
      )}
    </>
  )
}

export default function CasesPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl md:text-5xl font-semibold text-white">Case Studies</h1>
      <p className="mt-4 text-zinc-300 max-w-3xl">Explore selected outcomes across Corporate Core, TradeSync, HealthTrust, and FinSecure.</p>
      <Suspense>
        <CasesListing />
      </Suspense>
    </main>
  )
}
