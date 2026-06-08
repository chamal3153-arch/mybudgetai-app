export const runtime = 'edge'
import { createServiceClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PlanViewer from '@/app/plan/[id]/PlanViewer'

export default async function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServiceClient()

  const { data: plan } = await supabase
    .from('plans')
    .select('*')
    .eq('id', id)
    .eq('is_public', true)
    .maybeSingle()

  if (!plan) notFound()

  return (
    <div>
      {/* Shared plan banner */}
      <div style={{ background: 'rgba(200,240,96,0.06)', borderBottom: '1px solid rgba(200,240,96,0.15)', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 18, color: 'var(--accent)' }}>BudgetPlan.AI</span>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>· Shared financial plan</span>
        </div>
        <Link href="/signup" style={{ padding: '8px 18px', background: 'var(--accent)', color: '#09090b', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', boxShadow: '0 0 12px rgba(200,240,96,0.3)' }}>
          Build my free plan →
        </Link>
      </div>
      <PlanViewer plan={plan} isPaid={false} isShared />
    </div>
  )
}
