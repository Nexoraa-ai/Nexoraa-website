import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({ ok: true, service: 'nexoraa-website', ts: Date.now() })
}
