import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'About MyBudget.AI — AI-Powered Personal Finance',
  description: 'MyBudget.AI is an AI-powered personal budget planner built by CostSaver AI. Learn about our mission to make financial planning accessible to everyone.',
}

export default async function AboutPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <Navbar user={user} />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 20px 80px' }}>

        {/* Hero */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>
            A product of <a href="https://costsaverai.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>CostSaver AI ↗</a>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 'clamp(32px,6vw,48px)', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 20 }}>
            Financial planning for<br /><em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>everyone, everywhere.</em>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.8, maxWidth: 580 }}>
            MyBudget.AI was built because most financial planning tools are expensive, complicated, or only designed for wealthy countries. We believe everyone — regardless of where they live or how much they earn — deserves a clear, personalised financial plan.
          </p>
        </div>

        {/* Mission */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px 24px', marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 }}>Our Mission</div>
          <p style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 22, lineHeight: 1.5, fontStyle: 'italic' }}>
            "To make world-class financial planning accessible to every person on earth — not just those who can afford a financial advisor."
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 48 }}>
          {[
            { value: '12,000+', label: 'Plans generated' },
            { value: '195', label: 'Countries supported' },
            { value: '$5', label: 'One-time full report' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '22px 18px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 32, color: 'var(--accent)', marginBottom: 6 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 26, letterSpacing: '-0.02em', marginBottom: 20 }}>How MyBudget.AI works</h2>
          {[
            { icon: '✏️', title: 'You answer 8 questions', desc: 'Income, expenses, savings, debt, goal, timeframe, and risk tolerance. Takes about 60 seconds.' },
            { icon: '🤖', title: 'AI builds your plan', desc: 'Our AI (powered by DeepSeek) analyses your specific situation, country, and goals to generate a personalised financial plan — not a generic template.' },
            { icon: '📊', title: 'Free insights, immediately', desc: 'Budget breakdown, grocery tip for your country, savings teaser, and an honest insight about your finances — all free, no account needed.' },
            { icon: '🔓', title: 'Full report for $5', desc: 'Investment picks specific to your country and risk level, best savings accounts, business ideas, 90-day action plan, goal timeline, and PDF export.' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 20, padding: '18px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
              <span style={{ fontSize: 28, flexShrink: 0, marginTop: 2 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 5 }}>{s.title}</div>
                <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CostSaver AI */}
        <div style={{ background: 'linear-gradient(135deg,rgba(200,240,96,0.05),rgba(200,240,96,0.02))', border: '1px solid rgba(200,240,96,0.2)', borderRadius: 14, padding: '28px 24px', marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 22, letterSpacing: '-0.02em', marginBottom: 12 }}>Part of the CostSaver AI family</h2>
          <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 16 }}>
            MyBudget.AI is built and maintained by <strong style={{ color: 'var(--body)' }}>CostSaver AI</strong> — a company building AI-powered tools that help people and businesses save money and make smarter financial decisions.
          </p>
          <a href="https://costsaverai.com" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'rgba(200,240,96,0.1)', border: '1px solid rgba(200,240,96,0.3)', borderRadius: 8, fontSize: 14, fontWeight: 600, color: 'var(--accent)', textDecoration: 'none' }}>
            Visit CostSaver AI ↗
          </a>
        </div>

        {/* Disclaimer */}
        <div style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: 12, padding: '20px 22px', marginBottom: 32 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--error)', marginBottom: 8 }}>Important Disclaimer</div>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>
            MyBudget.AI provides AI-generated financial information for educational purposes only. It is not a substitute for professional financial advice. Always consult a licensed financial advisor before making investment or financial decisions. CostSaver AI is not a registered investment advisor.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13 }}>
          <Link href="/signup" style={{ display: 'inline-flex', padding: '12px 24px', background: 'var(--accent)', color: '#09090b', borderRadius: 8, fontWeight: 600, textDecoration: 'none' }}>Build my free plan →</Link>
          <Link href="/contact" style={{ color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>Contact us</Link>
          <a href="https://costsaverai.com" target="_blank" rel="noreferrer" style={{ color: 'var(--muted)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>CostSaver AI ↗</a>
        </div>
      </div>
    </>
  )
}
