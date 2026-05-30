'use client'
import Link from 'next/link'
import { Lock } from 'lucide-react'

export default function PlanViewer({ plan, isPaid }: { plan: any, isPaid: boolean }) {
  const fr = plan.free_data || {}
  const pr = plan.premium_data || {}
  const ba = fr.budget_allocation || {}
  const sym = plan.currency || '$'
  const fmt = (n: number) => sym + Math.round(n).toLocaleString()

  const bars = [
    { label: 'Needs', pct: ba.needs_pct, amt: ba.needs_amount, color: 'linear-gradient(90deg,#60a5fa,#818cf8)' },
    { label: 'Savings', pct: ba.savings_pct, amt: ba.savings_amount, color: 'linear-gradient(90deg,#c8f060,#a8d940)' },
    { label: 'Investments', pct: ba.invest_pct, amt: ba.invest_amount, color: 'linear-gradient(90deg,#34d399,#10b981)' },
    { label: 'Wants', pct: ba.wants_pct, amt: ba.wants_amount, color: 'linear-gradient(90deg,#f97316,#fb923c)' },
    ...(ba.debt_pct > 0 ? [{ label: 'Debt Repayment', pct: ba.debt_pct, amt: ba.debt_amount, color: 'linear-gradient(90deg,#f87171,#fb7185)' }] : [])
  ]

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>📍 {plan.country} · {plan.goal} · {plan.timeframe}</div>
        <h1 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 'clamp(24px,5vw,36px)', letterSpacing: '-0.02em', marginBottom: 6 }}>
          Here&apos;s your plan, <span style={{ color: 'var(--accent)' }}>{plan.name}</span>.
        </h1>
        <p style={{ fontSize: 14, color: 'var(--muted)' }}>Personalised for {plan.country} · Risk {plan.risk}/10 · {plan.timeframe} plan</p>
      </div>

      {/* Budget Allocation */}
      <div style={card}>
        <div style={cardTitle}>📊 Budget Allocation</div>
        {bars.map(b => (
          <div key={b.label} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{b.label}</span>
              <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500 }}>{b.pct}% · {fmt(b.amt)}</span>
            </div>
            <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${b.pct}%`, background: b.color, borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Grocery tip */}
      {fr.grocery_tip && (
        <div style={card}>
          <div style={cardTitle}>💡 Grocery Tip for {plan.country}</div>
          <p style={{ fontSize: 15, lineHeight: 1.7 }}>{fr.grocery_tip}</p>
        </div>
      )}

      {/* Savings teaser */}
      {fr.savings_breadcrumb && (
        <div style={card}>
          <div style={cardTitle}>💰 Savings Strategy</div>
          <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 12 }}>{fr.savings_breadcrumb}</p>
          {!isPaid && <PaywallChip />}
        </div>
      )}

      {/* Investment teaser */}
      {fr.investment_breadcrumb && (
        <div style={card}>
          <div style={cardTitle}>📈 Investment Overview</div>
          <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 12 }}>{fr.investment_breadcrumb}</p>
          {!isPaid && <PaywallChip />}
        </div>
      )}

      {/* Brutal insight */}
      {fr.brutal_honest_insight && (
        <div style={{ background: 'linear-gradient(135deg,rgba(248,113,113,0.06),rgba(248,113,113,0.02))', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 12, padding: 24, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--error)', marginBottom: 10 }}>⚡ Brutal Honest Insight</div>
          <p style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 18, lineHeight: 1.5, fontStyle: 'italic' }}>{fr.brutal_honest_insight}</p>
        </div>
      )}

      {/* Premium content */}
      {isPaid && pr.investment_picks && (
        <>
          <div style={card}>
            <div style={cardTitle}>🎯 Investment Picks</div>
            {pr.investment_picks.map((p: any, i: number) => (
              <div key={i} style={{ background: 'var(--surface-el)', border: '1px solid var(--border)', borderRadius: 8, padding: 14, marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 600 }}>{p.name}</span>
                  <span style={{ fontSize: 11, background: 'rgba(200,240,96,0.1)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 100 }}>{p.type}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 6 }}>{p.why}</p>
                <div style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', gap: 16 }}>
                  <span>Risk: <strong style={{ color: 'var(--body)' }}>{p.risk_level}</strong></span>
                  <span>Min: <strong style={{ color: 'var(--body)' }}>{p.min_amount}</strong></span>
                  <span>Via: <strong style={{ color: 'var(--body)' }}>{p.where_to_buy}</strong></span>
                </div>
              </div>
            ))}
          </div>

          {pr.savings_strategy && (
            <div style={card}>
              <div style={cardTitle}>🏦 Full Savings Strategy</div>
              <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 14 }}>{pr.savings_strategy.strategy_explanation}</p>
              {pr.savings_strategy.best_accounts?.map((a: string, i: number) => (
                <div key={i} style={{ padding: 12, background: 'var(--surface-el)', border: '1px solid var(--border)', borderRadius: 8, marginBottom: 8, fontSize: 14 }}>{a}</div>
              ))}
            </div>
          )}

          {pr.best_businesses && (
            <div style={card}>
              <div style={cardTitle}>🚀 Best Businesses to Start</div>
              {pr.best_businesses.map((b: any, i: number) => (
                <div key={i} style={{ background: 'var(--surface-el)', border: '1px solid var(--border)', borderRadius: 8, padding: 14, marginBottom: 10 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{b.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--gold)', marginBottom: 6 }}>Startup cost: {b.startup_cost}</div>
                  <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 6 }}>{b.why_fits}</p>
                  <div style={{ fontSize: 13, color: 'var(--accent)' }}>First step: {b.first_step}</div>
                </div>
              ))}
            </div>
          )}

          {pr.action_plan && (
            <div style={card}>
              <div style={cardTitle}>📅 90-Day Action Plan</div>
              {['month_1','month_2','month_3'].map((m, i) => (
                <div key={m} style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Month {i+1}</div>
                  {(pr.action_plan[m] || []).map((item: string, j: number) => (
                    <div key={j} style={{ display: 'flex', gap: 10, fontSize: 14, lineHeight: 1.5, marginBottom: 6 }}>
                      <span style={{ color: 'var(--accent)', flexShrink: 0 }}>→</span><span>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {pr.goal_timeline && (
            <div style={card}>
              <div style={cardTitle}>🗓️ Goal Timeline</div>
              {[
                ['Months to goal', `${pr.goal_timeline.months_to_goal} months`],
                ['Monthly needed', fmt(pr.goal_timeline.monthly_needed)],
                ['Optimistic scenario', `${pr.goal_timeline.optimistic_months} months`],
                ['Pessimistic scenario', `${pr.goal_timeline.pessimistic_months} months`],
              ].map(([l,v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                  <span style={{ color: 'var(--muted)' }}>{l}</span><span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Paywall block for free users */}
      {!isPaid && (
        <div style={{ background: 'linear-gradient(135deg,var(--surface),rgba(240,192,96,0.04))', border: '1px solid rgba(240,192,96,0.2)', borderRadius: 16, padding: '28px 24px', marginTop: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--gold)', background: 'rgba(240,192,96,0.1)', display: 'inline-block', padding: '4px 12px', borderRadius: 100, marginBottom: 14 }}>FULL REPORT</div>
          <h3 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 22, marginBottom: 8 }}>Unlock your complete financial plan</h3>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 22 }}>Investment picks, savings accounts, business ideas, 90-day action plan & PDF download.</p>
          <div style={{ marginBottom: 18 }}>
            <span style={{ fontSize: 16, color: 'var(--muted)', textDecoration: 'line-through', marginRight: 8 }}>$25</span>
            <span style={{ fontSize: 38, fontWeight: 700 }}>$5</span>
            <span style={{ display: 'block', fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>one-time · no subscription</span>
          </div>
          <a href="https://buy.stripe.com/8x28wPfUo27o7xyc9TenS0h" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', padding: '16px 36px', background: 'linear-gradient(135deg,var(--gold),#e8b050)', color: '#09090b', borderRadius: 12, fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
            🔓 Get Full Report — $5
          </a>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12 }}>Secure checkout via Stripe · Instant access</p>
        </div>
      )}

      {/* Bottom actions */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
        <Link href="/plan/new" style={{ padding: '12px 22px', background: 'var(--surface-el)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14, color: 'var(--body)', textDecoration: 'none' }}>← New plan</Link>
        <Link href="/dashboard" style={{ padding: '12px 22px', background: 'var(--surface-el)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14, color: 'var(--body)', textDecoration: 'none' }}>📊 Dashboard</Link>
      </div>
      <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)', marginTop: 20, lineHeight: 1.6 }}>This plan was generated by AI and is not financial advice. Always consult a qualified advisor.</p>
    </div>
  )
}

function PaywallChip() {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(240,192,96,0.06)', border: '1px solid rgba(240,192,96,0.15)', borderRadius: 8, fontSize: 13, color: 'var(--gold)', cursor: 'pointer' }}>
      <Lock size={13} /> Unlock full strategy — $5
    </div>
  )
}

const card: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 22, marginBottom: 14 }
const cardTitle: React.CSSProperties = { fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16 }
