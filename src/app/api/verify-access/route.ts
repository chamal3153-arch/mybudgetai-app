export const runtime = 'edge'
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

  const supabase = await createServiceClient()
  const { data } = await supabase.from('purchases').select('id').eq('email', email.toLowerCase()).limit(1).maybeSingle()

  return NextResponse.json({ hasAccess: !!data })
}

