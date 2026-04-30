import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json() as Partial<Record<'name' | 'email' | 'role', string>>
    const { name, email, role } = body
    const trimmedName = name?.trim()
    const trimmedEmail = email?.trim().toLowerCase()
    const trimmedRole = role?.trim()

    if (!trimmedName || !trimmedEmail || !trimmedRole) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: 'Added to waitlist' }, { status: 200 })
  } catch (error) {
    console.error('Waitlist error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
