import { OnboardingFlow } from '@/components/auth/OnboardingFlow'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Set up your feed — Nexoraa',
}

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Check if onboarding already done
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('selected_verticals, preferred_level')
    .eq('id', user.id)
    .maybeSingle()

  // If profile exists with non-default verticals, skip onboarding
  if (profile?.selected_verticals && profile.selected_verticals.length > 0) {
    redirect('/feed')
  }

  return <OnboardingFlow userId={user.id} userEmail={user.email ?? ''} />
}
