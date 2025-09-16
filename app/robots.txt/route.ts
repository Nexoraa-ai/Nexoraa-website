export function GET() {
  const body = `User-agent: *\nAllow: /\nSitemap: https://nexoraa.example/sitemap.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } })
}
