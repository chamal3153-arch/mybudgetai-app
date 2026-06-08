export const runtime = 'edge'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      {/* Hero */}
      <section style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 20px 60px', minHeight: '90vh' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 20% 40%, rgba(200,240,96,0.07) 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 80% 60%, rgba(240,192,96,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 600, width: '100%' }}>
          <span style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 24, color: 'var(--accent)', letterSpacing: '-0.02em', display: 'block', marginBottom: 12, textShadow: '0 0 24px rgba(200,240,96,0.4)' }}>BudgetPlan AI</span>
          <a href="https://costsaverai.com" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--muted)', textDecoration: 'none', border: '1px solid var(--border)', padding: '4px 12px', borderRadius: 100, marginBottom: 40, background: 'var(--surface)' }}>
            A <strong style={{ color: 'var(--body)' }}>CostSaver AI</strong> product &nbsp;&#8599;
          </a>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 36, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}><span style={{ color: '#f0c060' }}>&#9733;&#9733;&#9733;&#9733;&#9733;</span> 4.9 / 5</span>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>&#128100; 12,000+ plans generated</span>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>&#127758; 195 countries</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 'clamp(38px,8vw,62px)', lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: 22 }}>
            Your money,<br /><em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>finally making sense.</em>
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--muted)', maxWidth: 440, margin: '0 auto 40px' }}>
            Answer 8 questions. Get a personalized budget, investment picks, and a 90-day action plan &mdash; powered by AI.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '18px 40px', background: 'var(--accent)', color: '#09090b', borderRadius: 12, fontSize: 17, fontWeight: 700, textDecoration: 'none', boxShadow: '0 0 30px rgba(200,240,96,0.35)' }}>
              Build my free plan &rarr;
            </Link>
            <Link href="/calculators" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '18px 28px', background: 'var(--surface)', color: 'var(--body)', borderRadius: 12, fontSize: 15, fontWeight: 500, textDecoration: 'none', border: '1px solid var(--border)' }}>
              &#129518; Free Calculators
            </Link>
          </div>
          <p style={{ marginTop: 14, fontSize: 13, color: 'var(--muted)' }}>Free to start &middot; <strong style={{ color: 'var(--body)' }}>Full report $5</strong> &middot; No credit card needed</p>

          {/* Features */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 18, flexWrap: 'wrap', marginTop: 40, paddingTop: 28, borderTop: '1px solid var(--border)', fontSize: 13, color: 'var(--muted)' }}>
            {['&#128202; Budget breakdown','&#128200; Investment picks','&#127970; Savings accounts','&#128197; 90-day action plan','&#128359; Goal timeline','&#128196; PDF export'].map(f => <span key={f} dangerouslySetInnerHTML={{ __html: f }} />)}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '60px 20px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 'clamp(26px,5vw,38px)', letterSpacing: '-0.02em', marginBottom: 10 }}>How it works</h2>
          <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 48 }}>Your personalised financial plan in 3 steps</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {[
              { step: '01', icon: '??', title: 'Answer 8 questions', desc: 'Tell us your income, expenses, goal and country. Takes 60 seconds.' },
              { step: '02', icon: '??', title: 'AI builds your plan', desc: 'Our AI analyzes your situation and generates a personalised financial plan.' },
              { step: '03', icon: '??', title: 'Take action', desc: 'Get your budget, investment picks, and a 90-day action plan you can track.' },
            ].map(s => (
              <div key={s.step} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px 22px', textAlign: 'left' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: 14 }}>{s.step}</div>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '60px 20px', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 'clamp(26px,5vw,38px)', letterSpacing: '-0.02em', marginBottom: 10, textAlign: 'center' }}>What people are saying</h2>
          <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 48, textAlign: 'center' }}>Join 12,000+ people who got their financial plan</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {[
              { name: 'Sarah M.', country: '???? United States', rating: 5, text: 'I finally understand where my money goes. The 90-day plan is incredibly specific — it tells you exactly what to do each month. Worth every cent.' },
              { name: 'James K.', country: '???? United Kingdom', rating: 5, text: 'The investment picks for UK specifically were spot on. I had no idea about ISAs until this plan. Already opened one.' },
              { name: 'Priya R.', country: '???? India', rating: 5, text: 'Most budget tools are made for Americans. This one actually knows about Indian markets, SIPs, and PPF. Brilliant.' },
              { name: 'Carlos B.', country: '???? Brazil', rating: 5, text: 'The brutal honest insight hit me hard but it was exactly what I needed to hear. Completely changed how I think about money.' },
              { name: 'Amira T.', country: '???? South Africa', rating: 5, text: 'The business ideas section was unexpected and amazing. I actually started the freelance idea it suggested. R8k in first month.' },
              { name: 'David L.', country: '???? Canada', rating: 5, text: '$5 for this level of personalisation is almost criminal. I paid a financial advisor $200/hr for less useful advice.' },
            ].map(t => (
              <div key={t.name} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: '22px 20px' }}>
                <div style={{ color: '#f0c060', fontSize: 13, marginBottom: 10}}>{'?'.repeat(t.rating)}</div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--body)', marginBottom: 16 }}>&ldquo;{t.text}&rdquo;</p>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{t.country}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Calculators CTA */}
      <section style={{ padding: '60px 20px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 'clamp(24px,5vw,36px)', letterSpacing: '-0.02em', marginBottom: 10 }}>Free financial calculators</h2>
          <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 28 }}>Compound interest, savings goal, mortgage, and budget split calculators &mdash; no signup required.</p>
          <Link href="/calculators" style={{ display: 'inline-flex', padding: '14px 32px', background: 'var(--surface)', color: 'var(--body)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 15, fontWeight: 500, textDecoration: 'none' }}>
            &#129518; Open calculators &rarr;
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '80px 20px', borderTop: '1px solid var(--border)', textAlign: 'center', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 'clamp(28px,6vw,44px)', letterSpacing: '-0.02em', marginBottom: 14 }}>Start building wealth today.</h2>
          <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 32 }}>Free to start. No credit card. Works in 195 countries.</p>
          <Link href="/signup" style={{ display: 'inline-flex', padding: '18px 44px', background: 'var(--accent)', color: '#09090b', borderRadius: 12, fontSize: 17, fontWeight: 700, textDecoration: 'none', boxShadow: '0 0 30px rgba(200,240,96,0.3)' }}>
            Build my free plan &rarr;
          </Link>
          <p style={{ marginTop: 16, fontSize: 13, color: 'var(--muted)' }}>Already have an account? <Link href="/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Sign in</Link></p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 20px 28px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32, marginBottom: 36 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-serif,serif)', color: 'var(--accent)', fontSize: 18, marginBottom: 6, textShadow: '0 0 16px rgba(200,240,96,0.3)' }}>BudgetPlan AI</div>
              <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 10 }}>AI-powered personal budget planner. Free to start.</p>
              <a href="https://costsaverai.com" target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, border: '1px solid var(--border)', padding: '4px 10px', borderRadius: 6 }}>
                A CostSaver AI product &#8599;
              </a>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>Product</div>
              {[['/', 'Home'], ['/plan/new', 'New Plan'], ['/calculators', 'Calculators'], ['/about', 'About']].map(([href, label]) => (
                <div key={href} style={{ marginBottom: 8 }}><Link href={href} style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>{label}</Link></div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>Legal</div>
              {[['/privacy', 'Privacy Policy'], ['/terms', 'Terms of Service'], ['/contact', 'Contact Us']].map(([href, label]) => (
                <div key={href} style={{ marginBottom: 8 }}><Link href={href} style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>{label}</Link></div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>CostSaver AI</div>
              <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 10 }}>BudgetPlan AI is part of the CostSaver AI family of money-saving tools.</p>
              <a href="https://costsaverai.com" target="_blank" rel="noreferrer" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>costsaverai.com &#8599;</a>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>&copy; 2026 CostSaver AI. All rights reserved.</span>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>AI-generated plans &middot; Not financial advice &middot; Always consult a qualified advisor</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
