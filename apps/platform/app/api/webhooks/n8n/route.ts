import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Webhook endpoint called by n8n pipeline for platform callbacks
// e.g., "challenge available" badge update when news → challenge is complete
export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization')
  const expectedToken = process.env.N8N_WEBHOOK_SECRET

  if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json() as {
    event: string
    cluster_id?: string
    challenge_id?: string
  }

  const supabase = createAdminClient()

  switch (body.event) {
    case 'challenge_ready': {
      // Future: mark cluster with challenge_available badge
      return NextResponse.json({ ok: true, event: 'challenge_ready' })
    }

    case 'pipeline_health': {
      // n8n pings every hour to confirm pipeline is alive
      return NextResponse.json({ ok: true, ts: Date.now() })
    }

    default:
      return NextResponse.json({ ok: true, event: body.event })
  }
}
