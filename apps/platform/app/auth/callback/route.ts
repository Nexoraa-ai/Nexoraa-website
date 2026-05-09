import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function getSafeNext(searchParams: URLSearchParams) {
  const next = searchParams.get('next') ?? '/feed'
  return next.startsWith('/') && !next.startsWith('//') ? next : '/feed'
}

function getRedirectOrigin(request: Request, origin: string) {
  if (process.env.NODE_ENV === 'development') return origin

  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto') ?? 'https'

  return forwardedHost ? `${forwardedProto}://${forwardedHost}` : origin
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const authError = searchParams.get('error_description') ?? searchParams.get('error')
  const next = getSafeNext(searchParams)
  const redirectOrigin = getRedirectOrigin(request, origin)

  if (authError) {
    const url = new URL('/login', redirectOrigin)
    url.searchParams.set('error', authError)
    return NextResponse.redirect(url)
  }

  if (!code) {
    const url = new URL('/login', redirectOrigin)
    url.searchParams.set('error', 'Missing auth callback code.')
    return NextResponse.redirect(url)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    const url = new URL('/login', redirectOrigin)
    url.searchParams.set('error', error.message)
    return NextResponse.redirect(url)
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const url = new URL('/login', redirectOrigin)
    url.searchParams.set('error', 'Could not load your authenticated session.')
    return NextResponse.redirect(url)
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile) {
    return NextResponse.redirect(`${redirectOrigin}/onboarding`)
  }

  if (next.startsWith('/onboarding')) {
    return NextResponse.redirect(`${redirectOrigin}/feed`)
  }

  return NextResponse.redirect(`${redirectOrigin}${next}`)
}
