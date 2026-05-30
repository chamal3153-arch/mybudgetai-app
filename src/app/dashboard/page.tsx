import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { Plus, FileText, Lock } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: plans } = await supabase
    .from('plans')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: purchase } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  const isPaid = !!purchase

  return (
    <>
      <Navbar user={user} />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 28, letterSpacing: '-0.02em', marginBottom: 4 }}>Your Plans</h1>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>{plans?.length || 0} plan{plans?.length !== 1 ? 's' : ''} generated</p>
          </div>
          <Link href="/plan/new" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: 'var(--accent)', color: '#09090b', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            <Plus size={16} /> New Plan
          </Link>
        </div>

        {/* Paid status banner */}
        {!isPaid && (
          <div style={{ background: 'linear-gradient(135deg,var(--surface),rgba(240,192,96,0.04))', border: '1px solid rgba(240,192,96,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gold)', marginBottom: 2 }}>🔒 Free plan active</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>Upgrade to unlock investment picks, savings strategy, 90-day action plan & PDF export</div>
            </div>
            <a href="https://buy.stripe.com/8x28wPfUo27o7xyc9TenS0h" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', padding: '10px 20px', background: 'var(--gold)', color: '#09090b', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Unlock Full Report — $5
            </a>
          </div>
        )}

        {/* Plans list */}
        {!plans || plans.length === 0 ? (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
            <h2 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 22, marginBottom: 8 }}>No plans yet</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Generate your first personalized financial plan in 60 seconds.</p>
            <Link href="/plan/new" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: 'var(--accent)', color: '#09090b', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
              <Plus size={16} /> Build my free plan
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {plans.map((plan: any) => (
              <Link key={plan.id} href={`/plan/${plan.id}`} style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', textDecoration: 'none', transition: 'border-color 0.15s' }}>
                <div style={{ width: 44, height: 44, background: 'rgba(200,240,96,0.08)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileText size={20} color="var(--accent)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--body)', marginBottom: 3 }}>{plan.goal} — {plan.country}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>{plan.timeframe} · Risk {plan.risk}/10 · {plan.currency}{Number(plan.income).toLocaleString()}/mo</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  {!isPaid && !plan.is_premium && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--muted)', background: 'rgba(113,113,122,0.1)', padding: '3px 8px', borderRadius: 100 }}><Lock size={10} /> Free</span>}
                  {plan.is_premium && <span style={{ fontSize: 11, color: 'var(--gold)', background: 'rgba(240,192,96,0.1)', padding: '3px 8px', borderRadius: 100 }}>★ Premium</span>}
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>{new Date(plan.created_at).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
