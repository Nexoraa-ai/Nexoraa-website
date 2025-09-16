import { units } from '@/content/units'
import { cases } from '@/content/cases'
import { posts } from '@/content/blog'

export function GET() {
  const base = 'https://nexoraa.example'
  const now = new Date().toISOString()
  const urls = [
    '/',
    '/cases',
    '/blog',
    ...units.map(u => `/units/${u.slug}`),
    ...cases.map(c => `/cases/${c.slug}`),
    ...posts.map(p => `/blog/${p.slug}`),
  ]
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${base}${u}</loc><lastmod>${now}</lastmod></url>`).join('\n')}\n</urlset>`
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } })
}
