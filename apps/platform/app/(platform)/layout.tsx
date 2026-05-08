import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { createClient } from '@/lib/supabase/server'

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Hard auth gate — redirect to login if not authenticated
  if (!user) {
    redirect('/login')
  }

  // Load profile for sidebar + topbar
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('display_name, plan, current_streak, selected_verticals, preferred_level')
    .eq('id', user.id)
    .maybeSingle()

  return (
    <div className="flex h-screen overflow-hidden bg-[#08090e]">
      <Sidebar user={user} profile={profile} />
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <TopBar user={user} profile={profile} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 relative z-10">
          {children}
        </main>
      </div>
    </div>
  )
}
