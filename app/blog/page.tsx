import Link from 'next/link'
import { posts } from '@/content/blog'
import { Suspense } from 'react'

export const metadata = { title: 'Blog — Nexoraa', description: 'Notes, patterns, and playbooks from Nexoraa.' }

function BlogListing() {
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const tag = params.get('tag') || 'all'
  const page = Math.max(1, parseInt(params.get('page') || '1', 10))
  const pageSize = 6
  const allTags = Array.from(new Set(posts.flatMap(p => p.tags)))
  const tags = ['all', ...allTags]

  const filtered = tag === 'all' ? posts : posts.filter(p => p.tags.includes(tag))
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const start = (page - 1) * pageSize
  const list = filtered.slice(start, start + pageSize)

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
        {tags.map(t => (
          <a key={t} href={`?tag=${t}`} className={`rounded-md px-2 py-1 ring-1 ring-white/10 ${t===tag ? 'bg-white/10 text-white' : 'text-zinc-300 hover:bg-white/5'}`}>{t}</a>
        ))}
      </div>
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        {list.map(p => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="group rounded-xl bg-white/5 ring-1 ring-white/10 p-6 hover:bg-white/[0.07] transition">
            <h2 className="text-white font-semibold">{p.title}</h2>
            <p className="mt-2 text-zinc-400 text-sm">{p.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-400">
              {p.tags.map(t => <span key={t} className="rounded bg-ink ring-1 ring-white/10 px-2 py-1">{t}</span>)}
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

export default function BlogPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl md:text-5xl font-semibold text-white">Blog</h1>
      <p className="mt-4 text-zinc-300 max-w-3xl">Notes, patterns, and playbooks from the field.</p>
      <Suspense>
        <BlogListing />
      </Suspense>
    </main>
  )
}
