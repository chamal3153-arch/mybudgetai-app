import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import PlanGenerator from './PlanGenerator'

export default async function NewPlanPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: purchase } = await supabase.from('purchases').select('id').eq('user_id', user.id).limit(1).maybeSingle()

  return (
    <>
      <Navbar user={user} />
      <PlanGenerator userId={user.id} isPaid={!!purchase} />
    </>
  )
}
