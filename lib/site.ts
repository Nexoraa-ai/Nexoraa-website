const FALLBACK_URL = 'http://localhost:3000'

export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || FALLBACK_URL
  try {
    return new URL(raw)
  } catch {
    return new URL(FALLBACK_URL)
  }
}
