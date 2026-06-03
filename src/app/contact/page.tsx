import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import ContactForm from './ContactForm'

export const metadata = {
  title: 'Contact Us | MyBudget.AI',
  description: 'Get in touch with the MyBudget.AI team. We are here to help with any questions about your financial plan.',
}

export default async function ContactPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return (
    <>
      <Navbar user={user} />
      <div style={{ maxWidth: 660, margin: '0 auto', padding: '48px 20px 80px' }}>
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 36, letterSpacing: '-0.02em', marginBottom: 10 }}>Contact Us</h1>
          <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.7 }}>
            Questions about your plan, billing, or the product? We&apos;re here to help.
            MyBudget.AI is a product of <a href="https://costsaverai.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>CostSaver AI</a>.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 36 }}>
          {[
            { icon: '💬', title: 'General support', email: 'support@costsaverai.com' },
            { icon: '💳', title: 'Billing & refunds', email: 'billing@costsaverai.com' },
            { icon: '🔒', title: 'Privacy concerns', email: 'privacy@costsaverai.com' },
            { icon: '🤝', title: 'Partnerships', email: 'hello@costsaverai.com' },
          ].map(c => (
            <div key={c.title} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 16px' }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{c.title}</div>
              <a href={`mailto:${c.email}`} style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>{c.email}</a>
            </div>
          ))}
        </div>

        <ContactForm userEmail={user?.email} />
      </div>
    </>
  )
}
