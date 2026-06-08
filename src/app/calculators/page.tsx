export const runtime = 'edge'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import CalculatorsClient from './CalculatorsClient'

export const metadata = {
  title: 'Free Financial Calculators | BudgetPlan AI',
  description: 'Free compound interest, savings goal, mortgage and budget calculators. Plan your financial future with our AI-powered tools.',
}

export default async function CalculatorsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return (
    <>
      <Navbar user={user} />
      <CalculatorsClient />
    </>
  )
}

