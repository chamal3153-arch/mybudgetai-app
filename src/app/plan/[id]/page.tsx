import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import PlanViewer from './PlanViewer'

export default async function PlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: plan } = await supabase.from('plans').select('*').eq('id', id).eq('user_id', user.id).maybeSingle()
  if (!plan) notFound()

  const { data: purchase } = await supabase.from('purchases').select('id').eq('user_id', user.id).limit(1).maybeSingle()

  return (
    <>
      <Navbar user={user} />
      <PlanViewer plan={plan} isPaid={!!purchase} />
    </>
  )
}
