export const runtime = 'edge'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import ContactForm from './ContactForm'

export const metadata = {
  title: 'Contact Us | BudgetPlan AI',
  description: 'Get in touch with the BudgetPlan AI team.',
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
            Questions about your plan, billing, or the product? Email us directly at{' '}
            <a href="mailto:costsaverai@proton.me" style={{ color: 'var(--accent)', textDecoration: 'none' }}>costsaverai@proton.me</a>{' '}
            or use the form below.
          </p>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontSize: 24 }}>&#9993;</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Email us directly</div>
            <a href="mailto:costsaverai@proton.me" style={{ fontSize: 14, color: 'var(--accent)', textDecoration: 'none' }}>costsaverai@proton.me</a>
          </div>
        </div>

        <ContactForm userEmail={user?.email} />
      </div>
    </>
  )
}
