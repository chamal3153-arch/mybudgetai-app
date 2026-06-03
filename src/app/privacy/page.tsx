export const runtime = 'edge'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'Privacy Policy | MyBudget.AI',
  description: 'Privacy Policy for MyBudget.AI â€” how we collect, use and protect your data.',
}

export default async function PrivacyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <Navbar user={user} />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 20px 80px' }}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>Last updated: June 3, 2026</p>
          <h1 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 36, letterSpacing: '-0.02em', marginBottom: 10 }}>Privacy Policy</h1>
          <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.7 }}>
            MyBudget.AI is a product of <a href="https://costsaverai.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>CostSaver AI</a>. We take your privacy seriously. This policy explains what data we collect, how we use it, and your rights.
          </p>
        </div>

        {[
          {
            title: '1. Information We Collect',
            content: `We collect information you provide directly:
â€¢ Account information: email address and password when you sign up
â€¢ Financial information: income, expenses, savings, debt and goals you enter to generate your plan
â€¢ Usage data: pages visited, plans generated, features used
â€¢ Payment information: processed securely by Stripe â€” we never store card details

We also collect automatically:
â€¢ Device type, browser, operating system
â€¢ IP address and approximate location (country level)
â€¢ Cookies and similar tracking technologies`
          },
          {
            title: '2. How We Use Your Information',
            content: `We use your information to:
â€¢ Generate your personalised financial plan using AI
â€¢ Save and display your plans in your dashboard
â€¢ Send weekly action item reminders (if enabled in Settings)
â€¢ Process payments via Stripe
â€¢ Improve our AI models and service quality
â€¢ Comply with legal obligations

We do NOT sell your personal data to third parties.`
          },
          {
            title: '3. AI-Generated Financial Plans',
            content: `Your financial data is sent to DeepSeek's API to generate your plan. This data is used solely for generating your plan and is subject to DeepSeek's privacy policy. We do not use your financial data to train AI models without your consent.

MyBudget.AI plans are AI-generated and for informational purposes only. They are not financial advice. Always consult a qualified financial advisor before making investment decisions.`
          },
          {
            title: '4. Data Storage & Security',
            content: `Your data is stored in Supabase (PostgreSQL database) hosted on AWS infrastructure with encryption at rest and in transit. We use industry-standard security measures including:
â€¢ SSL/TLS encryption for all data in transit
â€¢ Row-level security on all database tables
â€¢ Encrypted storage of sensitive fields
â€¢ Regular security audits

Despite these measures, no internet transmission is 100% secure.`
          },
          {
            title: '5. Cookies',
            content: `We use essential cookies to:
â€¢ Keep you logged in (authentication session)
â€¢ Remember your preferences

We do not use advertising cookies. We use Google Analytics to understand how users use our service â€” this may set analytics cookies. You can opt out via your browser settings.`
          },
          {
            title: '6. Third-Party Services',
            content: `We use the following third-party services:
â€¢ Supabase â€” database and authentication (supabase.com)
â€¢ Stripe â€” payment processing (stripe.com)
â€¢ DeepSeek â€” AI plan generation (deepseek.com)
â€¢ Resend â€” email delivery (resend.com)
â€¢ Vercel â€” hosting (vercel.com)

Each service has its own privacy policy governing their use of your data.`
          },
          {
            title: '7. Your Rights',
            content: `You have the right to:
â€¢ Access: request a copy of your personal data
â€¢ Correction: update inaccurate personal data
â€¢ Deletion: request deletion of your account and all data
â€¢ Portability: export your data in machine-readable format
â€¢ Opt-out: unsubscribe from email reminders at any time in Settings

To exercise any of these rights, email us at privacy@costsaverai.com`
          },
          {
            title: '8. Data Retention',
            content: `We retain your data for as long as your account is active. If you delete your account, we delete all associated personal data within 30 days, except where required to retain it for legal purposes (e.g., transaction records for tax compliance).`
          },
          {
            title: '9. Children\'s Privacy',
            content: `MyBudget.AI is not directed at children under 16. We do not knowingly collect personal information from children under 16. If you believe we have collected data from a child, contact us immediately at privacy@costsaverai.com`
          },
          {
            title: '10. Changes to This Policy',
            content: `We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by displaying a notice on our website. Your continued use of the service after changes constitutes acceptance of the updated policy.`
          },
          {
            title: '11. Contact Us',
            content: `If you have questions about this Privacy Policy, please contact us:\n\nCostSaver AI\nEmail: privacy@costsaverai.com\nWebsite: https://costsaverai.com`
          },
        ].map(s => (
          <div key={s.title} style={{ marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: 'var(--body)' }}>{s.title}</h2>
            <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{s.content}</div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13 }}>
          <Link href="/terms" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Terms of Service</Link>
          <Link href="/contact" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Contact Us</Link>
          <a href="https://costsaverai.com" target="_blank" rel="noreferrer" style={{ color: 'var(--muted)', textDecoration: 'none' }}>CostSaver AI</a>
        </div>
      </div>
    </>
  )
}

