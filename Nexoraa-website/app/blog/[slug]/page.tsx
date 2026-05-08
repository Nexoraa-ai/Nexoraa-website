import { notFound } from 'next/navigation'
import Link from 'next/link'
import { posts, postBySlug } from '@/content/blog'

export function generateStaticParams() {
  return posts.map(p => ({ slug: p.slug }))
}

type BlogPostPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const p = postBySlug(slug)
  if (!p) return {}
  return { title: `${p.title} — Nexoraa`, description: p.summary }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const p = postBySlug(slug)
  if (!p) return notFound()

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/blog" className="text-zinc-400 hover:text-white">← Blog</Link>
      <h1 className="mt-4 text-3xl md:text-5xl font-semibold text-white">{p.title}</h1>
      <p className="mt-3 text-zinc-300">{p.summary}</p>
      <div className="mt-6 flex flex-wrap gap-2 text-xs text-zinc-400">
        {p.tags.map(t => <span key={t} className="rounded bg-ink ring-1 ring-white/10 px-2 py-1">{t}</span>)}
      </div>
      <div className="mt-10 text-zinc-300">
        <p>Coming soon: full article content.</p>
      </div>
    </main>
  )
}
