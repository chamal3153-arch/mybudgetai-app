export const runtime = 'edge'
import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { POSTS } from '@/lib/blog'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Personal Finance Blog | BudgetPlan AI',
  description: 'Free personal finance guides: budgeting, saving, investing, and debt payoff. Practical advice that works in any country.',
  alternates: { canonical: 'https://budgetplanai.com/blog' },
  openGraph: {
    title: 'Personal Finance Blog | BudgetPlan AI',
    description: 'Free personal finance guides: budgeting, saving, investing, and debt payoff.',
    url: 'https://budgetplanai.com/blog',
    siteName: 'BudgetPlan AI',
  },
}

const CATEGORY_COLORS: Record<string, string> = {
  Budgeting: 'rgba(200,240,96,0.12)',
  Savings: 'rgba(52,211,153,0.12)',
  Investing: 'rgba(96,165,250,0.12)',
  Debt: 'rgba(248,113,113,0.12)',
  Tools: 'rgba(167,139,250,0.12)',
  Planning: 'rgba(251,191,36,0.12)',
}

const CATEGORY_TEXT: Record<string, string> = {
  Budgeting: '#c8f060',
  Savings: '#34d399',
  Investing: '#60a5fa',
  Debt: '#f87171',
  Tools: '#a78bfa',
  Planning: '#fbbf24',
}

export default async function BlogPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const featured = POSTS[POSTS.length - 1]
  const rest = POSTS.slice(0, POSTS.length - 1).reverse()

  return (
    <>
      <style>{`
        .blog-card { transition: border-color 0.15s; }
        .blog-card:hover { border-color: rgba(200,240,96,0.3) !important; }
      `}</style>
      <Navbar user={user} />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 20px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 }}>Personal Finance</div>
          <h1 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 'clamp(28px,5vw,42px)', letterSpacing: '-0.02em', marginBottom: 14 }}>
            Money guides that actually help
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 16, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            Practical personal finance advice &mdash; budgeting, saving, investing, and paying off debt. No fluff, no jargon.
          </p>
        </div>

        {/* Featured post */}
        <Link href={`/blog/${featured.slug}`} style={{ textDecoration: 'none', display: 'block', marginBottom: 40 }}>
          <div className="blog-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '32px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', background: 'rgba(200,240,96,0.1)', padding: '4px 10px', borderRadius: 100 }}>Latest</span>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 100, background: CATEGORY_COLORS[featured.category] || 'var(--surface)', color: CATEGORY_TEXT[featured.category] || 'var(--muted)' }}>{featured.category}</span>
            </div>
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ fontSize: 52, lineHeight: 1 }} dangerouslySetInnerHTML={{ __html: featured.cover }} />
              <div style={{ flex: 1, minWidth: 240 }}>
                <h2 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 'clamp(18px,3vw,24px)', letterSpacing: '-0.01em', marginBottom: 10, color: 'var(--body)', lineHeight: 1.3 }}>{featured.title}</h2>
                <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{featured.description}</p>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{featured.date} &middot; {featured.readTime}</div>
              </div>
            </div>
          </div>
        </Link>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
          {rest.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
              <div className="blog-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '22px 20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 36, marginBottom: 14 }} dangerouslySetInnerHTML={{ __html: post.cover }} />
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 100, background: CATEGORY_COLORS[post.category] || 'var(--surface)', color: CATEGORY_TEXT[post.category] || 'var(--muted)', display: 'inline-block', marginBottom: 12, alignSelf: 'flex-start' }}>{post.category}</span>
                <h2 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 17, letterSpacing: '-0.01em', marginBottom: 10, color: 'var(--body)', lineHeight: 1.35, flex: 1 }}>{post.title}</h2>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12 }}>{post.date} &middot; {post.readTime}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ marginTop: 56, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '32px 28px', textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 22, marginBottom: 8 }}>Stop reading, start planning</h3>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 22 }}>Get a personalized financial plan built for your income, country, and goals. Free in 60 seconds.</p>
          <Link href="/signup" style={{ display: 'inline-flex', padding: '14px 28px', background: 'var(--accent)', color: '#09090b', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            Build my free plan &rarr;
          </Link>
        </div>

      </div>
    </>
  )
}
