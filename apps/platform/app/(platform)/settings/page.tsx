import { createClient } from '@/lib/supabase/server'
import { PreferencesForm } from '@/components/settings/PreferencesForm'
import type { Metadata } from 'next'
import type { VerticalSlug, SummaryLevel } from '@neuralforge/types'

export const metadata: Metadata = {
  title: 'Settings — Nexoraa',
}

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('display_name, selected_verticals, preferred_level, plan, metadata')
    .eq('id', user!.id)
    .maybeSingle()

  const role = (profile?.metadata as Record<string, string> | null)?.role ?? ''

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 animate-fadein">
        <h1 className="text-xl font-bold text-[var(--text)] flex items-center gap-2">
          <span className="text-[var(--muted)]">⚙</span> Settings
        </h1>
        <p className="text-[12px] text-[var(--muted)] mt-0.5">
          Manage your profile, feed preferences, and account.
        </p>
      </div>

      <PreferencesForm
        userId={user!.id}
        userEmail={user!.email ?? ''}
        initialDisplayName={profile?.display_name ?? user!.email?.split('@')[0] ?? ''}
        initialRole={role}
        initialVerticals={(profile?.selected_verticals as VerticalSlug[]) ?? ['web-dev', 'data-ml']}
        initialLevel={(profile?.preferred_level as SummaryLevel) ?? 'beginner'}
        userPlan={profile?.plan ?? 'free'}
      />
    </div>
  )
}
