'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { COUNTRIES } from '@/lib/countries'

const GOALS = [
  {id:'Emergency Fund',emoji:'🛡️'},{id:'Grow Wealth',emoji:'📈'},{id:'Buy a Home',emoji:'🏠'},
  {id:'Pay Off Debt',emoji:'⛓️'},{id:'Retire Early',emoji:'🌅'},{id:'Start a Business',emoji:'🚀'},
  {id:'Travel & Experiences',emoji:'✈️'},{id:'Kids & Family',emoji:'👨‍👩‍👧'},{id:'Education',emoji:'🎓'},
  {id:'Reach Income Target',emoji:'💰'},
]

const TIMEFRAMES = ['6 months','1 year','2 years','3 years','5 years','10 years','20+ years']
const MSGS = ['Analyzing your financial picture...','Calculating your goal timeline...','Finding the best investments for your country...','Writing your personalized plan...','Almost ready...']

export default function PlanGenerator({ userId, isPaid }: { userId: string, isPaid: boolean }) {
  const router = useRouter()
  const [step, setStep] = useState<'form'|'loading'|'done'>('form')
  const [msgIdx, setMsgIdx] = useState(0)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name:'', age:'', country: COUNTRIES[0], income:'', expenses:'', savings:'', debt:'', goal:'', timeframe:'', risk: 5 })
  const [countryQuery, setCountryQuery] = useState('')
  const [showCountryDD, setShowCountryDD] = useState(false)

  const filteredCountries = countryQuery ? COUNTRIES.filter(c => c.name.toLowerCase().includes(countryQuery.toLowerCase())) : COUNTRIES

  async function generate() {
    if (!form.name || !form.age || !form.income || !form.goal || !form.timeframe) {
      setError('Please fill in all required fields.'); return
    }
    setError(''); setStep('loading')
    let i = 0
    const interval = setInterval(() => { i = (i+1) % MSGS.length; setMsgIdx(i) }, 2200)

    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, countryName: form.country.name, currency: form.country.currency, currencyCode: form.country.code, userId, isPaid })
      })
      clearInterval(interval)
      if (!res.ok) throw new Error('Generation failed')
      const { planId } = await res.json()
      router.push(`/plan/${planId}`)
    } catch (e) {
      clearInterval(interval)
      setError('Generation failed. Please try again.')
      setStep('form')
    }
  }

  if (step === 'loading') return (
    <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', padding: 20 }}>
      <div style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 28, color: 'var(--accent)', marginBottom: 40 }}>MyBudget.AI</div>
      <div style={{ fontSize: 17, color: 'var(--body)', marginBottom: 32, minHeight: 28 }}>{MSGS[msgIdx]}</div>
      <div style={{ width: 280, height: 2, background: 'var(--border)', borderRadius: 1, overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'var(--accent)', borderRadius: 1, animation: 'loadbar 2.5s ease-in-out infinite' }} />
      </div>
      <style>{`@keyframes loadbar{0%{width:0;margin-left:0}50%{width:70%;margin-left:0}100%{width:0;margin-left:100%}}`}</style>
    </div>
  )

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 20px 80px' }}>
      {error && <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: 'var(--error)', marginBottom: 20 }}>{error}</div>}

      <section style={section}>
        <div style={sectionLabel}>Personal</div>
        <div style={grid2}>
          <Field label="First name *"><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Alex" style={inp} /></Field>
          <Field label="Age *"><input type="number" value={form.age} onChange={e=>setForm({...form,age:e.target.value})} placeholder="28" min={16} max={80} style={inp} /></Field>
        </div>
        <Field label="Country *">
          <div style={{ position: 'relative' }}>
            <span style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',fontSize:18,pointerEvents:'none' }}>{form.country.flag}</span>
            <input value={countryQuery || form.country.name} onChange={e=>{setCountryQuery(e.target.value);setShowCountryDD(true)}} onFocus={()=>setShowCountryDD(true)} style={{...inp, paddingLeft:44}} placeholder="Search country..." />
            {showCountryDD && filteredCountries.length > 0 && (
              <div style={{ position:'absolute',top:'calc(100% + 6px)',left:0,right:0,background:'var(--surface-el)',border:'1px solid var(--border)',borderRadius:10,maxHeight:220,overflowY:'auto',zIndex:200 }}>
                {filteredCountries.slice(0,30).map(c=>(
                  <div key={c.name} onClick={()=>{setForm({...form,country:c});setCountryQuery('');setShowCountryDD(false)}} style={{ padding:'10px 14px',cursor:'pointer',display:'flex',alignItems:'center',gap:10,fontSize:14 }}>
                    <span>{c.flag}</span><span style={{color:'var(--body)'}}>{c.name}</span><span style={{marginLeft:'auto',color:'var(--muted)',fontSize:12}}>{c.code}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Field>
      </section>

      <div style={divider} />

      <section style={section}>
        <div style={sectionLabel}>Financial</div>
        <Field label={`Monthly income * (${form.country.currency})`}><input type="number" value={form.income} onChange={e=>setForm({...form,income:e.target.value})} placeholder="3500" min={0} style={inp} /></Field>
        <div style={grid2}>
          <Field label={`Monthly expenses (${form.country.currency})`}><input type="number" value={form.expenses} onChange={e=>setForm({...form,expenses:e.target.value})} placeholder="2200" min={0} style={inp} /></Field>
          <Field label={`Existing savings (${form.country.currency})`}><input type="number" value={form.savings} onChange={e=>setForm({...form,savings:e.target.value})} placeholder="5000" min={0} style={inp} /></Field>
        </div>
        <Field label={`Outstanding debt (${form.country.currency})`}><input type="number" value={form.debt} onChange={e=>setForm({...form,debt:e.target.value})} placeholder="0" min={0} style={inp} /></Field>
      </section>

      <div style={divider} />

      <section style={section}>
        <div style={sectionLabel}>Your Goal *</div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10 }}>
          {GOALS.map(g=>(
            <div key={g.id} onClick={()=>setForm({...form,goal:g.id})} style={{ background: form.goal===g.id ? 'rgba(200,240,96,0.06)' : 'var(--surface)', border: `1px solid ${form.goal===g.id ? 'var(--accent)' : 'var(--border)'}`, borderRadius:10,padding:'16px 10px',cursor:'pointer',textAlign:'center' }}>
              <div style={{fontSize:24,marginBottom:6}}>{g.emoji}</div>
              <div style={{fontSize:12,fontWeight:500}}>{g.id}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={divider} />

      <section style={section}>
        <div style={sectionLabel}>Timeframe *</div>
        <div style={{ display:'flex',flexWrap:'wrap',gap:8 }}>
          {TIMEFRAMES.map(t=>(
            <div key={t} onClick={()=>setForm({...form,timeframe:t})} style={{ padding:'9px 16px',borderRadius:100,border:`1px solid ${form.timeframe===t ? 'var(--accent)' : 'var(--border)'}`,background: form.timeframe===t ? 'rgba(200,240,96,0.1)' : 'var(--surface)',color: form.timeframe===t ? 'var(--accent)' : 'var(--muted)',fontSize:13,fontWeight:500,cursor:'pointer' }}>
              {t}
            </div>
          ))}
        </div>
      </section>

      <section style={{ ...section, marginTop: 24 }}>
        <div style={sectionLabel}>Risk tolerance — {form.risk}/10</div>
        <input type="range" min={1} max={10} value={form.risk} onChange={e=>setForm({...form,risk:Number(e.target.value)})} style={{ width:'100%',accentColor:'var(--accent)',marginBottom:6 }} />
        <div style={{ display:'flex',justifyContent:'space-between',fontSize:12,color:'var(--muted)' }}>
          <span>1 — Play it safe</span><span>5 — Balanced</span><span>10 — Go aggressive</span>
        </div>
      </section>

      <div style={{ marginTop: 32 }}>
        <button onClick={generate} style={{ width:'100%',padding:'18px',background:'var(--accent)',color:'#09090b',border:'none',borderRadius:12,fontSize:16,fontWeight:700,cursor:'pointer',fontFamily:'inherit' }}>
          Generate my plan →
        </button>
        <p style={{ textAlign:'center',marginTop:12,fontSize:13,color:'var(--muted)' }}>Takes ~15 seconds · Free insights always included</p>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string, children: React.ReactNode }) {
  return <div style={{ marginBottom: 18 }}><label style={{ display:'block',fontSize:13,fontWeight:500,marginBottom:7,color:'var(--body)' }}>{label}</label>{children}</div>
}

const section: React.CSSProperties = { marginBottom: 8 }
const sectionLabel: React.CSSProperties = { fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 18 }
const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }
const divider: React.CSSProperties = { height: 1, background: 'var(--border)', margin: '28px 0' }
const inp: React.CSSProperties = { width: '100%', padding: '13px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--body)', fontSize: 14, outline: 'none', fontFamily: 'inherit' }
