'use client'
import { useState } from 'react'

type Tab = 'compound' | 'savings' | 'mortgage' | 'budget'

export default function CalculatorsClient() {
  const [tab, setTab] = useState<Tab>('compound')

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 20px 80px' }}>
      <h1 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 32, letterSpacing: '-0.02em', marginBottom: 6 }}>Financial Calculators</h1>
      <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 32 }}>Free tools to plan your financial future — no signup needed.</p>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 28, flexWrap: 'wrap' }}>
        {([
          { id: 'compound', label: '📈 Compound Interest' },
          { id: 'savings', label: '🎯 Savings Goal' },
          { id: 'mortgage', label: '🏠 Mortgage' },
          { id: 'budget', label: '📊 Budget Split' },
        ] as {id: Tab, label: string}[]).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '9px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
            background: tab === t.id ? 'var(--accent)' : 'var(--surface)',
            color: tab === t.id ? '#09090b' : 'var(--muted)',
            boxShadow: tab === t.id ? '0 0 16px rgba(200,240,96,0.3)' : 'none',
          }}>{t.label}</button>
        ))}
      </div>

      {tab === 'compound' && <CompoundCalc />}
      {tab === 'savings' && <SavingsCalc />}
      {tab === 'mortgage' && <MortgageCalc />}
      {tab === 'budget' && <BudgetCalc />}
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 28 }}>{children}</div>
}
function Field({ label, children }: { label: string, children: React.ReactNode }) {
  return <div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--muted)', marginBottom: 6 }}>{label}</label>{children}</div>
}
const inp: React.CSSProperties = { width: '100%', padding: '11px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--body)', fontSize: 14, outline: 'none', fontFamily: 'inherit' }
const calcBtn: React.CSSProperties = { width: '100%', padding: '13px', background: 'var(--accent)', color: '#09090b', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginTop: 8 }
function Result({ label, value, accent }: { label: string, value: string, accent?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 14, color: 'var(--muted)' }}>{label}</span>
      <span style={{ fontSize: 16, fontWeight: 700, color: accent ? 'var(--accent)' : 'var(--body)' }}>{value}</span>
    </div>
  )
}
const fmt = (n: number) => '$' + Math.round(n).toLocaleString()

function CompoundCalc() {
  const [p, setP] = useState('10000')
  const [r, setR] = useState('8')
  const [y, setY] = useState('10')
  const [monthly, setMonthly] = useState('200')
  const [res, setRes] = useState<any>(null)

  function calc() {
    const principal = parseFloat(p) || 0
    const rate = parseFloat(r) / 100
    const years = parseFloat(y) || 0
    const m = parseFloat(monthly) || 0
    const n = years * 12
    const monthlyRate = rate / 12
    const future = principal * Math.pow(1 + rate, years) +
      m * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate)
    const totalContrib = principal + m * n
    setRes({ future, totalContrib, gain: future - totalContrib, years })
  }

  return (
    <Card>
      <h2 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 22, marginBottom: 20 }}>📈 Compound Interest Calculator</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Initial investment ($)"><input style={inp} type="number" value={p} onChange={e => setP(e.target.value)} /></Field>
        <Field label="Annual return (%)"><input style={inp} type="number" value={r} onChange={e => setR(e.target.value)} /></Field>
        <Field label="Years"><input style={inp} type="number" value={y} onChange={e => setY(e.target.value)} /></Field>
        <Field label="Monthly contribution ($)"><input style={inp} type="number" value={monthly} onChange={e => setMonthly(e.target.value)} /></Field>
      </div>
      <button style={calcBtn} onClick={calc}>Calculate →</button>
      {res && (
        <div style={{ marginTop: 24 }}>
          <Result label="Future value" value={fmt(res.future)} accent />
          <Result label="Total contributed" value={fmt(res.totalContrib)} />
          <Result label="Investment gain" value={fmt(res.gain)} />
          <Result label="Return on investment" value={((res.gain / res.totalContrib) * 100).toFixed(1) + '%'} />
        </div>
      )}
    </Card>
  )
}

function SavingsCalc() {
  const [goal, setGoal] = useState('50000')
  const [saved, setSaved] = useState('5000')
  const [rate, setRate] = useState('5')
  const [monthly, setMonthly] = useState('500')
  const [res, setRes] = useState<any>(null)

  function calc() {
    const G = parseFloat(goal) || 0
    const S = parseFloat(saved) || 0
    const r = parseFloat(rate) / 100 / 12
    const m = parseFloat(monthly) || 0
    // Solve for n: G = S*(1+r)^n + m*((1+r)^n - 1)/r
    let n = 0
    let current = S
    while (current < G && n < 1200) { current = current * (1 + r) + m; n++ }
    setRes({ months: n, years: (n / 12).toFixed(1), reachDate: new Date(Date.now() + n * 30.44 * 86400000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) })
  }

  return (
    <Card>
      <h2 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 22, marginBottom: 20 }}>🎯 Savings Goal Calculator</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Savings goal ($)"><input style={inp} type="number" value={goal} onChange={e => setGoal(e.target.value)} /></Field>
        <Field label="Already saved ($)"><input style={inp} type="number" value={saved} onChange={e => setSaved(e.target.value)} /></Field>
        <Field label="Annual interest rate (%)"><input style={inp} type="number" value={rate} onChange={e => setRate(e.target.value)} /></Field>
        <Field label="Monthly savings ($)"><input style={inp} type="number" value={monthly} onChange={e => setMonthly(e.target.value)} /></Field>
      </div>
      <button style={calcBtn} onClick={calc}>Calculate →</button>
      {res && (
        <div style={{ marginTop: 24 }}>
          <Result label="Months to goal" value={`${res.months} months`} />
          <Result label="Years to goal" value={`${res.years} years`} accent />
          <Result label="Estimated date" value={res.reachDate} />
        </div>
      )}
    </Card>
  )
}

function MortgageCalc() {
  const [price, setPrice] = useState('350000')
  const [down, setDown] = useState('70000')
  const [rate, setRate] = useState('6.5')
  const [years, setYears] = useState('30')
  const [res, setRes] = useState<any>(null)

  function calc() {
    const P = parseFloat(price) - parseFloat(down)
    const r = parseFloat(rate) / 100 / 12
    const n = parseFloat(years) * 12
    const payment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    const total = payment * n
    setRes({ payment, total, interest: total - P, principal: P })
  }

  return (
    <Card>
      <h2 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 22, marginBottom: 20 }}>🏠 Mortgage Calculator</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Home price ($)"><input style={inp} type="number" value={price} onChange={e => setPrice(e.target.value)} /></Field>
        <Field label="Down payment ($)"><input style={inp} type="number" value={down} onChange={e => setDown(e.target.value)} /></Field>
        <Field label="Annual interest rate (%)"><input style={inp} type="number" value={rate} onChange={e => setRate(e.target.value)} /></Field>
        <Field label="Loan term (years)"><input style={inp} type="number" value={years} onChange={e => setYears(e.target.value)} /></Field>
      </div>
      <button style={calcBtn} onClick={calc}>Calculate →</button>
      {res && (
        <div style={{ marginTop: 24 }}>
          <Result label="Monthly payment" value={fmt(res.payment)} accent />
          <Result label="Loan amount" value={fmt(res.principal)} />
          <Result label="Total interest paid" value={fmt(res.interest)} />
          <Result label="Total cost" value={fmt(res.total)} />
        </div>
      )}
    </Card>
  )
}

function BudgetCalc() {
  const [income, setIncome] = useState('4000')
  const [rule, setRule] = useState<'503020' | '702010'>('503020')
  const [res, setRes] = useState<any>(null)

  function calc() {
    const inc = parseFloat(income) || 0
    if (rule === '503020') {
      setRes({ labels: ['Needs (50%)', 'Wants (30%)', 'Savings (20%)'], values: [inc * 0.5, inc * 0.3, inc * 0.2], colors: ['#60a5fa', '#f97316', '#c8f060'] })
    } else {
      setRes({ labels: ['Needs (70%)', 'Savings (20%)', 'Fun (10%)'], values: [inc * 0.7, inc * 0.2, inc * 0.1], colors: ['#60a5fa', '#c8f060', '#f97316'] })
    }
  }

  return (
    <Card>
      <h2 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 22, marginBottom: 20 }}>📊 Budget Split Calculator</h2>
      <Field label="Monthly income ($)"><input style={inp} type="number" value={income} onChange={e => setIncome(e.target.value)} /></Field>
      <Field label="Budget rule">
        <div style={{ display: 'flex', gap: 8 }}>
          {[{ id: '503020', label: '50/30/20 Rule' }, { id: '702010', label: '70/20/10 Rule' }].map(r => (
            <button key={r.id} onClick={() => setRule(r.id as any)} style={{ flex: 1, padding: '10px', borderRadius: 8, border: `1px solid ${rule === r.id ? 'var(--accent)' : 'var(--border)'}`, background: rule === r.id ? 'rgba(200,240,96,0.1)' : 'var(--bg)', color: rule === r.id ? 'var(--accent)' : 'var(--muted)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600 }}>{r.label}</button>
          ))}
        </div>
      </Field>
      <button style={calcBtn} onClick={calc}>Calculate →</button>
      {res && (
        <div style={{ marginTop: 24 }}>
          {res.labels.map((l: string, i: number) => (
            <div key={l} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 14 }}>{l}</span>
                <span style={{ fontWeight: 700, color: res.colors[i] }}>{fmt(res.values[i])}</span>
              </div>
              <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(res.values[i] / parseFloat(income)) * 100}%`, background: res.colors[i], borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
