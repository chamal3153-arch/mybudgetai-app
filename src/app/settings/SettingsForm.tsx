'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SettingsForm({ user, profile, purchase }: { user: any, profile: any, purchase: any }) {
  const [reminders, setReminders] = useState(profile?.email_reminders ?? true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function saveSettings() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('profiles').upsert({ id: user.id, email: user.email, email_reminders: reminders })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Account */}
      <div style={card}>
        <div style={cardTitle}>Account</div>
        <div style={row}><span style={key}>Email</span><span style={val}>{user.email}</span></div>
        <div style={row}><span style={key}>Plan</span><span style={{ ...val, color: purchase ? 'var(--gold)' : 'var(--muted)' }}>{purchase ? '★ Premium' : 'Free'}</span></div>
        {!purchase && (
          <div style={{ marginTop: 12 }}>
            <a href="https://buy.stripe.com/8x28wPfUo27o7xyc9TenS0h" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', padding: '10px 20px', background: 'var(--gold)', color: '#09090b', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              Upgrade to Premium — $5
            </a>
          </div>
        )}
      </div>

      {/* Email Notifications */}
      <div style={card}>
        <div style={cardTitle}>Email Reminders</div>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Receive weekly email reminders with your action items and progress check-ins based on your financial plans.
        </p>
        <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <div
            onClick={() => setReminders(!reminders)}
            style={{ width: 44, height: 24, borderRadius: 12, background: reminders ? 'var(--accent)' : 'var(--border)', position: 'relative', transition: 'background 0.2s', cursor: 'pointer', flexShrink: 0 }}
          >
            <div style={{ position: 'absolute', top: 3, left: reminders ? 23 : 3, width: 18, height: 18, borderRadius: 9, background: reminders ? '#09090b' : 'var(--muted)', transition: 'left 0.2s' }} />
          </div>
          <span style={{ fontSize: 14 }}>Weekly action item reminders</span>
        </label>
      </div>

      {/* Save */}
      <button onClick={saveSettings} disabled={saving} style={{ padding: '13px 28px', background: saved ? 'rgba(200,240,96,0.15)' : 'var(--accent)', color: saved ? 'var(--accent)' : '#09090b', border: saved ? '1px solid var(--accent)' : 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', alignSelf: 'flex-start' }}>
        {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save settings'}
      </button>
    </div>
  )
}

const card: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 22px' }
const cardTitle: React.CSSProperties = { fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14 }
const row: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }
const key: React.CSSProperties = { color: 'var(--muted)' }
const val: React.CSSProperties = { color: 'var(--body)', fontWeight: 500 }
