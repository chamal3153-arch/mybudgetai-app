import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { planId } = await req.json()
  const service = await createServiceClient()

  const { data, error } = await service
    .from('plans')
    .update({ is_public: true })
    .eq('id', planId)
    .eq('user_id', user.id)
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ shareUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/share/${data.id}` })
}
