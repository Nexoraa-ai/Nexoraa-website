import { getSiteUrl } from '@/lib/site'

export function GET() {
  const siteUrl = getSiteUrl()
  const body = `User-agent: *\nAllow: /\nSitemap: ${siteUrl.origin}/sitemap.xml\n`
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } })
}
