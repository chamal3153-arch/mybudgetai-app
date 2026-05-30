import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 20% 40%, rgba(200,240,96,0.06) 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 80% 60%, rgba(240,192,96,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', maxWidth: 580, width: '100%' }}>
        <span style={{ fontFamily: 'var(--font-serif, serif)', fontSize: 22, color: 'var(--accent)', letterSpacing: '-0.02em', display: 'block', marginBottom: 48 }}>MyBudget.AI</span>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 36, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}><span style={{ color: '#f0c060' }}>★★★★★</span> 4.9 / 5</span>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>👤 12,000+ plans generated</span>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>🌍 195 countries</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif, serif)', fontSize: 'clamp(36px,8vw,58px)', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 20 }}>
          Your money,<br /><em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>finally making sense.</em>
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--muted)', maxWidth: 420, margin: '0 auto 40px' }}>
          Answer 8 questions. Get a personalized budget, investment picks, and a 90-day action plan — powered by AI.
        </p>
        <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '18px 40px', background: 'var(--accent)', color: '#09090b', borderRadius: 12, fontSize: 17, fontWeight: 600, textDecoration: 'none' }}>
          Build my free plan →
        </Link>
        <p style={{ marginTop: 14, fontSize: 13, color: 'var(--muted)' }}>Free to start · <strong style={{ color: 'var(--body)' }}>Full report $5</strong> · No credit card needed</p>
        <p style={{ marginTop: 10 }}><Link href="/login" style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'underline' }}>Already have an account? Sign in</Link></p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginTop: 36, paddingTop: 28, borderTop: '1px solid var(--border)', fontSize: 13, color: 'var(--muted)' }}>
          {['📊 Budget breakdown','📈 Investment picks','🏦 Savings strategy','📅 90-day plan','🗓️ Goal timeline'].map(f => <span key={f}>{f}</span>)}
        </div>
      </div>
    </main>
  )
}
