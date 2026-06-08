'use client'
import Link from 'next/link'
import { Lock, Share2, Download, CheckSquare, Square } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function PlanViewer({ plan, isPaid, isShared }: { plan: any, isPaid: boolean, isShared?: boolean }) {
  const fr = plan.free_data || {}
  const pr = plan.premium_data || {}
  const ba = fr.budget_allocation || {}
  const sym = plan.currency || '$'
  const fmt = (n: number) => sym + Math.round(n).toLocaleString()

  // Progress tracking (stored in localStorage)
  const storageKey = `progress_${plan.id}`
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [shareUrl, setShareUrl] = useState('')
  const [sharing, setSharing] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) setChecked(JSON.parse(saved))
  }, [storageKey])

  function toggle(key: string) {
    const next = { ...checked, [key]: !checked[key] }
    setChecked(next)
    localStorage.setItem(storageKey, JSON.stringify(next))
  }

  async function sharePlan() {
    setSharing(true)
    try {
      const res = await fetch('/api/share-plan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ planId: plan.id }) })
      const { shareUrl } = await res.json()
      setShareUrl(shareUrl)
      navigator.clipboard.writeText(shareUrl).catch(() => {})
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } finally { setSharing(false) }
  }

  async function downloadPDF() {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const W = 210, margin = 20, contentW = W - margin * 2
    let y = 30

    // Cover
    doc.setFillColor(9, 9, 11); doc.rect(0, 0, W, 297, 'F')
    doc.setFillColor(200, 240, 96); doc.rect(0, 0, 4, 297, 'F')
    doc.setTextColor(200, 240, 96); doc.setFontSize(26); doc.setFont('helvetica', 'bold')
    doc.text('BudgetPlan AI', margin, 50)
    doc.setTextColor(228, 228, 231); doc.setFontSize(16); doc.setFont('helvetica', 'normal')
    doc.text('Personal Financial Plan', margin, 64)
    doc.setFillColor(24, 24, 31); doc.roundedRect(margin, 84, contentW, 70, 4, 4, 'F')
    doc.setTextColor(113, 113, 122); doc.setFontSize(9); doc.text('PREPARED FOR', margin + 14, 100)
    doc.setTextColor(228, 228, 231); doc.setFontSize(20); doc.setFont('helvetica', 'bold')
    doc.text(plan.name || 'You', margin + 14, 114)
    doc.setFontSize(11); doc.setFont('helvetica', 'normal'); doc.setTextColor(200, 240, 96)
    doc.text(`Goal: ${plan.goal}`, margin + 14, 127)
    doc.setTextColor(113, 113, 122); doc.text(`${plan.country} · ${plan.timeframe} · Risk ${plan.risk}/10`, margin + 14, 138)
    doc.setTextColor(113, 113, 122); doc.setFontSize(9)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, 270)
    doc.text('AI-generated plan. Not financial advice.', margin, 278)

    // Budget page
    doc.addPage(); doc.setFillColor(9, 9, 11); doc.rect(0, 0, W, 297, 'F')
    doc.setFillColor(200, 240, 96); doc.rect(0, 0, 4, 297, 'F')
    y = 30

    const addH = (text: string) => {
      doc.setFillColor(24, 24, 31); doc.rect(margin, y - 5, contentW, 13, 'F')
      doc.setTextColor(200, 240, 96); doc.setFontSize(9); doc.setFont('helvetica', 'bold')
      doc.text(text.toUpperCase(), margin + 8, y + 3); y += 18
    }
    const addT = (text: string, opts: any = {}) => {
      doc.setTextColor(opts.c ? opts.c[0] : 228, opts.c ? opts.c[1] : 228, opts.c ? opts.c[2] : 231)
      doc.setFontSize(opts.s || 11); doc.setFont('helvetica', opts.b ? 'bold' : 'normal')
      const lines = doc.splitTextToSize(text, contentW - 8)
      doc.text(lines, margin + (opts.i || 0), y)
      y += lines.length * (opts.s || 11) * 0.5 + (opts.g !== undefined ? opts.g : 6)
    }

    addH('Budget Allocation')
    const bars = [
      { label: 'Needs', pct: ba.needs_pct, amt: ba.needs_amount, color: [96, 165, 250] },
      { label: 'Savings', pct: ba.savings_pct, amt: ba.savings_amount, color: [200, 240, 96] },
      { label: 'Investments', pct: ba.invest_pct, amt: ba.invest_amount, color: [52, 211, 153] },
      { label: 'Wants', pct: ba.wants_pct, amt: ba.wants_amount, color: [249, 115, 22] },
    ]
    if (ba.debt_pct > 0) bars.push({ label: 'Debt', pct: ba.debt_pct, amt: ba.debt_amount, color: [248, 113, 113] })
    bars.forEach(b => {
      doc.setTextColor(228, 228, 231); doc.setFontSize(10); doc.setFont('helvetica', 'normal')
      doc.text(b.label, margin, y)
      doc.text(`${b.pct}%  ·  ${fmt(b.amt)}`, W - margin, y, { align: 'right' })
      y += 5
      doc.setFillColor(24, 24, 31); doc.rect(margin, y, contentW, 4, 'F')
      doc.setFillColor(...(b.color as [number,number,number])); doc.rect(margin, y, contentW * b.pct / 100, 4, 'F')
      y += 10
    })

    y += 8; addH('Honest Insight')
    if (fr.brutal_honest_insight) addT(fr.brutal_honest_insight)

    if (isPaid && pr.investment_picks) {
      doc.addPage(); doc.setFillColor(9, 9, 11); doc.rect(0, 0, W, 297, 'F')
      doc.setFillColor(200, 240, 96); doc.rect(0, 0, 4, 297, 'F'); y = 30
      addH('Investment Picks')
      pr.investment_picks.forEach((p: any) => {
        if (y > 240) { doc.addPage(); doc.setFillColor(9,9,11); doc.rect(0,0,W,297,'F'); doc.setFillColor(200,240,96); doc.rect(0,0,4,297,'F'); y = 30 }
        doc.setFillColor(24,24,31); doc.roundedRect(margin, y-2, contentW, 30, 2, 2, 'F')
        doc.setTextColor(228,228,231); doc.setFontSize(12); doc.setFont('helvetica','bold'); doc.text(p.name, margin+6, y+8)
        doc.setTextColor(200,240,96); doc.setFontSize(9); doc.setFont('helvetica','normal'); doc.text(p.type, W-margin-6, y+8, {align:'right'})
        doc.setTextColor(113,113,122); doc.setFontSize(9)
        const wl = doc.splitTextToSize(p.why, contentW-12); doc.text(wl[0]||'', margin+6, y+16)
        doc.text(`Min: ${p.min_amount}  ·  Via: ${p.where_to_buy}`, margin+6, y+24); y += 38
      })
    }

    if (isPaid && pr.action_plan) {
      doc.addPage(); doc.setFillColor(9,9,11); doc.rect(0,0,W,297,'F')
      doc.setFillColor(200,240,96); doc.rect(0,0,4,297,'F'); y = 30; addH('90-Day Action Plan')
      ;['month_1','month_2','month_3'].forEach((m,i) => {
        doc.setTextColor(200,240,96); doc.setFontSize(11); doc.setFont('helvetica','bold'); doc.text(`Month ${i+1}`, margin, y); y+=7
        ;(pr.action_plan[m]||[]).forEach((item: string) => {
          doc.setTextColor(228,228,231); doc.setFontSize(10); doc.setFont('helvetica','normal')
          const lines = doc.splitTextToSize('→  '+item, contentW-8); doc.text(lines, margin+4, y); y += lines.length*5.5+2
        }); y+=8
      })
    }

    doc.save(`BudgetPlanAI-${plan.name || 'Plan'}-${plan.goal?.replace(/\s/g,'-')}.pdf`)
  }

  const bars = [
    { label: 'Needs', pct: ba.needs_pct, amt: ba.needs_amount, color: 'linear-gradient(90deg,#60a5fa,#818cf8)' },
    { label: 'Savings', pct: ba.savings_pct, amt: ba.savings_amount, color: 'linear-gradient(90deg,#c8f060,#a8d940)' },
    { label: 'Investments', pct: ba.invest_pct, amt: ba.invest_amount, color: 'linear-gradient(90deg,#34d399,#10b981)' },
    { label: 'Wants', pct: ba.wants_pct, amt: ba.wants_amount, color: 'linear-gradient(90deg,#f97316,#fb923c)' },
    ...(ba.debt_pct > 0 ? [{ label: 'Debt Repayment', pct: ba.debt_pct, amt: ba.debt_amount, color: 'linear-gradient(90deg,#f87171,#fb7185)' }] : [])
  ]

  const totalActions = ['month_1','month_2','month_3'].reduce((acc, m) => acc + (pr.action_plan?.[m]?.length || 0), 0)
  const completedActions = Object.values(checked).filter(Boolean).length

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>📍 {plan.country} · {plan.goal} · {plan.timeframe}</div>
        <h1 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 'clamp(24px,5vw,36px)', letterSpacing: '-0.02em', marginBottom: 6 }}>
          Here&apos;s your plan, <span style={{ color: 'var(--accent)' }}>{plan.name}</span>.
        </h1>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 16 }}>Personalised for {plan.country} · Risk {plan.risk}/10 · {plan.timeframe} plan</p>

        {/* Action buttons */}
        {!isShared && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={downloadPDF} style={actionBtn}>
              <Download size={14} /> Download PDF
            </button>
            <button onClick={sharePlan} disabled={sharing} style={actionBtn}>
              <Share2 size={14} /> {sharing ? 'Sharing...' : copied ? '✓ Link copied!' : 'Share plan'}
            </button>
          </div>
        )}
        {shareUrl && <div style={{ marginTop: 8, fontSize: 12, color: 'var(--muted)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 12px', fontFamily: 'monospace', wordBreak: 'break-all' }}>{shareUrl}</div>}
      </div>

      {/* Budget */}
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
      {fr.grocery_tip && <div style={card}><div style={cardTitle}>💡 Grocery Tip for {plan.country}</div><p style={{ fontSize: 15, lineHeight: 1.7 }}>{fr.grocery_tip}</p></div>}

      {/* Savings teaser */}
      {fr.savings_breadcrumb && (
        <div style={card}>
          <div style={cardTitle}>💰 Savings Strategy</div>
          <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: isPaid ? 0 : 12 }}>{fr.savings_breadcrumb}</p>
          {!isPaid && <PaywallChip />}
        </div>
      )}

      {/* Investment teaser */}
      {fr.investment_breadcrumb && (
        <div style={card}>
          <div style={cardTitle}>📈 Investment Overview</div>
          <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: isPaid ? 0 : 12 }}>{fr.investment_breadcrumb}</p>
          {!isPaid && <PaywallChip />}
        </div>
      )}

      {/* Brutal insight */}
      {fr.brutal_honest_insight && (
        <div style={{ background: 'linear-gradient(135deg,rgba(248,113,113,0.06),rgba(248,113,113,0.02))', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 12, padding: 22, marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--error)', marginBottom: 10 }}>⚡ Brutal Honest Insight</div>
          <p style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 18, lineHeight: 1.5, fontStyle: 'italic' }}>{fr.brutal_honest_insight}</p>
        </div>
      )}

      {/* Premium content */}
      {isPaid && pr.investment_picks && (
        <div style={card}>
          <div style={cardTitle}>🎯 Investment Picks</div>
          {pr.investment_picks.map((p: any, i: number) => (
            <div key={i} style={{ background: 'var(--surface-el)', border: '1px solid var(--border)', borderRadius: 8, padding: 14, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontWeight: 600 }}>{p.name}</span>
                <span style={{ fontSize: 11, background: 'rgba(200,240,96,0.1)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 100 }}>{p.type}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 6 }}>{p.why}</p>
              <div style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <span>Risk: <strong style={{ color: 'var(--body)' }}>{p.risk_level}</strong></span>
                <span>Min: <strong style={{ color: 'var(--body)' }}>{p.min_amount}</strong></span>
                <span>Via: <strong style={{ color: 'var(--body)' }}>{p.where_to_buy}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isPaid && pr.savings_strategy && (
        <div style={card}>
          <div style={cardTitle}>🏦 Full Savings Strategy</div>
          <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 14 }}>{pr.savings_strategy.strategy_explanation}</p>
          {pr.savings_strategy.best_accounts?.map((a: string, i: number) => (
            <div key={i} style={{ padding: 12, background: 'var(--surface-el)', border: '1px solid var(--border)', borderRadius: 8, marginBottom: 8, fontSize: 14 }}>{a}</div>
          ))}
        </div>
      )}

      {isPaid && pr.best_businesses && (
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

      {/* 90-Day Action Plan with progress tracker */}
      {isPaid && pr.action_plan && (
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={cardTitle}>📅 90-Day Action Plan</div>
            {totalActions > 0 && (
              <div style={{ fontSize: 12, color: completedActions === totalActions ? 'var(--accent)' : 'var(--muted)', fontWeight: 600 }}>
                {completedActions}/{totalActions} done {completedActions === totalActions ? '🎉' : ''}
              </div>
            )}
          </div>
          {/* Progress bar */}
          {totalActions > 0 && (
            <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, marginBottom: 20, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(completedActions / totalActions) * 100}%`, background: 'var(--accent)', borderRadius: 2, transition: 'width 0.3s ease', boxShadow: '0 0 8px rgba(200,240,96,0.4)' }} />
            </div>
          )}
          {['month_1','month_2','month_3'].map((m, i) => (
            <div key={m} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Month {i+1}</div>
              {(pr.action_plan[m] || []).map((item: string, j: number) => {
                const key = `${m}_${j}`
                const done = !!checked[key]
                return (
                  <div key={j} onClick={() => toggle(key)} style={{ display: 'flex', gap: 10, fontSize: 14, lineHeight: 1.5, marginBottom: 8, cursor: 'pointer', padding: '8px 10px', borderRadius: 8, background: done ? 'rgba(200,240,96,0.05)' : 'transparent', border: `1px solid ${done ? 'rgba(200,240,96,0.2)' : 'transparent'}`, transition: 'all 0.15s' }}>
                    <span style={{ color: done ? 'var(--accent)' : 'var(--muted)', flexShrink: 0, marginTop: 2 }}>{done ? <CheckSquare size={16} /> : <Square size={16} />}</span>
                    <span style={{ color: done ? 'var(--muted)' : 'var(--body)', textDecoration: done ? 'line-through' : 'none' }}>{item}</span>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )}

      {isPaid && pr.goal_timeline && (
        <div style={card}>
          <div style={cardTitle}>🗓️ Goal Timeline</div>
          {[
            ['Months to goal', `${pr.goal_timeline.months_to_goal} months`],
            ['Monthly needed', fmt(pr.goal_timeline.monthly_needed)],
            ['Optimistic scenario', `${pr.goal_timeline.optimistic_months} months`],
            ['Pessimistic scenario', `${pr.goal_timeline.pessimistic_months} months`],
          ].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
              <span style={{ color: 'var(--muted)' }}>{l}</span><span style={{ fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
      )}

      {/* Paywall */}
      {!isPaid && (
        <div style={{ background: 'linear-gradient(135deg,var(--surface),rgba(240,192,96,0.04))', border: '1px solid rgba(240,192,96,0.2)', borderRadius: 16, padding: '28px 24px', marginTop: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--gold)', background: 'rgba(240,192,96,0.1)', display: 'inline-block', padding: '4px 12px', borderRadius: 100, marginBottom: 14 }}>FULL REPORT</div>
          <h3 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 22, marginBottom: 8 }}>Unlock your complete financial plan</h3>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 22 }}>Investment picks, savings accounts, business ideas, 90-day action plan with progress tracker & PDF download.</p>
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
      {!isShared && (
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <Link href="/plan/new" style={{ padding: '12px 22px', background: 'var(--surface-el)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14, color: 'var(--body)', textDecoration: 'none' }}>← New plan</Link>
          <Link href="/dashboard" style={{ padding: '12px 22px', background: 'var(--surface-el)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14, color: 'var(--body)', textDecoration: 'none' }}>📊 Dashboard</Link>
          <Link href="/calculators" style={{ padding: '12px 22px', background: 'var(--surface-el)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14, color: 'var(--body)', textDecoration: 'none' }}>🧮 Calculators</Link>
        </div>
      )}
      {isShared && (
        <div style={{ textAlign: 'center', marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 14 }}>Want your own personalised financial plan?</p>
          <Link href="/signup" style={{ display: 'inline-flex', padding: '14px 32px', background: 'var(--accent)', color: '#09090b', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none', boxShadow: '0 0 20px rgba(200,240,96,0.3)' }}>Build my free plan →</Link>
        </div>
      )}
      <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)', marginTop: 20, lineHeight: 1.6 }}>AI-generated plan. Not financial advice. Always consult a qualified advisor.</p>
    </div>
  )
}

function PaywallChip() {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(240,192,96,0.06)', border: '1px solid rgba(240,192,96,0.15)', borderRadius: 8, fontSize: 13, color: 'var(--gold)' }}>
      <Lock size={13} /> Unlock full strategy — $5
    </div>
  )
}

const card: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 22, marginBottom: 14 }
const cardTitle: React.CSSProperties = { fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--muted)', marginBottom: 16 }
const actionBtn: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontWeight: 500, color: 'var(--body)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }
