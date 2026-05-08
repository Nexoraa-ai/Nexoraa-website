import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { SummaryLevel } from '@neuralforge/types'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { cluster_id, read_level, swiped } = await request.json() as {
    cluster_id: string
    read_level?: SummaryLevel
    swiped?: boolean
  }

  if (!cluster_id) {
    return NextResponse.json({ error: 'cluster_id required' }, { status: 400 })
  }

  const { error } = await supabase.from('user_reads').upsert({
    user_id: user.id,
    cluster_id,
    read_level: read_level ?? 'beginner',
    swiped: swiped ?? false,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
