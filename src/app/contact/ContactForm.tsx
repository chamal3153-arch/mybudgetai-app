'use client'
import { useState } from 'react'

export default function ContactForm({ userEmail }: { userEmail?: string }) {
  const [form, setForm] = useState({ name: '', email: userEmail || '', subject: 'General question', message: '' })
  const [status, setStatus] = useState<'idle'|'loading'|'sent'|'error'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (res.ok) setStatus('sent')
      else setStatus('error')
    } catch { setStatus('error') }
  }

  if (status === 'sent') return (
    <div style={{ background: 'rgba(200,240,96,0.06)', border: '1px solid rgba(200,240,96,0.2)', borderRadius: 14, padding: '32px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
      <h3 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 22, marginBottom: 8 }}>Message sent!</h3>
      <p style={{ color: 'var(--muted)', fontSize: 14 }}>We&apos;ll get back to you within 24 hours at {form.email}</p>
    </div>
  )

  return (
    <form onSubmit={submit} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px 24px' }}>
      <h2 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 20, marginBottom: 22 }}>Send us a message</h2>
      {status === 'error' && <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--error)', marginBottom: 16 }}>Something went wrong. Email us directly at support@costsaverai.com</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div><label style={lbl}>Your name</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Alex" style={inp} /></div>
        <div><label style={lbl}>Email address</label><input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com" style={inp} /></div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={lbl}>Subject</label>
        <select value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} style={inp}>
          <option>General question</option>
          <option>Billing & refund</option>
          <option>Technical issue</option>
          <option>My plan seems wrong</option>
          <option>Privacy request</option>
          <option>Partnership</option>
        </select>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={lbl}>Message</label>
        <textarea required value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="How can we help?" rows={5} style={{ ...inp, resize: 'vertical' }} />
      </div>
      <button type="submit" disabled={status==='loading'} style={{ width: '100%', padding: '14px', background: 'var(--accent)', color: '#09090b', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
        {status === 'loading' ? 'Sending...' : 'Send message →'}
      </button>
      <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12, textAlign: 'center' }}>We respond within 24 hours · Mon–Fri</p>
    </form>
  )
}

const lbl: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--muted)' }
const inp: React.CSSProperties = { width: '100%', padding: '11px 13px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--body)', fontSize: 14, outline: 'none', fontFamily: 'inherit' }
