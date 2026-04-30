import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, role } = body

    if (!name || !email || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // TODO: Connect to your actual database (Supabase, Resend, etc.) here
    console.log('--- NEW WAITLIST SIGNUP ---')
    console.log(`Name:  ${name}`)
    console.log(`Email: ${email}`)
    console.log(`Role:  ${role}`)
    console.log('---------------------------')

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    return NextResponse.json({ success: true, message: 'Added to waitlist' }, { status: 200 })
  } catch (error) {
    console.error('Waitlist error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
