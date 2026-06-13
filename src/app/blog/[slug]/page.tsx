export const runtime = 'edge'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { getPost, POSTS } from '@/lib/blog'
import { createClient } from '@/lib/supabase/server'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: `${post.title} | BudgetPlan AI`,
    description: post.description,
    keywords: [post.category, 'personal finance', 'budgeting', 'BudgetPlan AI'],
    alternates: { canonical: `https://budgetplanai.com/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://budgetplanai.com/blog/${slug}`,
      siteName: 'BudgetPlan AI',
      type: 'article',
      publishedTime: post.date,
      authors: ['BudgetPlan AI'],
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.description },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const related = POSTS.filter(p => p.slug !== slug && (p.category === post.category)).slice(0, 2)
  const others = POSTS.filter(p => p.slug !== slug && !related.includes(p)).slice(0, 2 - related.length)
  const relatedPosts = [...related, ...others].slice(0, 2)

  // Article JSON-LD
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'BudgetPlan AI', url: 'https://budgetplanai.com' },
    publisher: {
      '@type': 'Organization',
      name: 'BudgetPlan AI',
      logo: { '@type': 'ImageObject', url: 'https://budgetplanai.com/og-image.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://budgetplanai.com/blog/${slug}` },
    image: 'https://budgetplanai.com/og-image.png',
  }

  // FAQPage JSON-LD (if post has FAQ blocks)
  const faqItems = post.blocks.flatMap(b => b.type === 'faq' ? b.items : [])
  const faqSchema = faqItems.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  } : null

  // BreadcrumbList JSON-LD
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://budgetplanai.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://budgetplanai.com/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://budgetplanai.com/blog/${slug}` },
    ],
  }

  // Lookup related posts by slug for the `related` block type
  const postMap = Object.fromEntries(POSTS.map(p => [p.slug, p]))

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <Navbar user={user} />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px 80px' }}>

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Home</Link>
          <span>&rsaquo;</span>
          <Link href="/blog" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Blog</Link>
          <span>&rsaquo;</span>
          <span>{post.category}</span>
        </nav>

        {/* Header */}
        <header style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 36, marginBottom: 16 }} dangerouslySetInnerHTML={{ __html: post.cover }} />
          <h1 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 'clamp(24px,5vw,36px)', letterSpacing: '-0.02em', lineHeight: 1.25, marginBottom: 14 }}>
            {post.title}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.7, marginBottom: 18 }}>{post.description}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'var(--muted)', paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontWeight: 500, color: 'var(--body)' }}>BudgetPlan AI</span>
            <span>&middot;</span>
            <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>&middot;</span>
            <span>{post.readTime}</span>
          </div>
        </header>

        {/* Body */}
        <article>
          {post.blocks.map((block, i) => {
            if (block.type === 'h2') return (
              <h2 key={i} style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 'clamp(18px,3vw,23px)', letterSpacing: '-0.01em', marginTop: 40, marginBottom: 14, lineHeight: 1.3 }}>{block.text}</h2>
            )
            if (block.type === 'h3') return (
              <h3 key={i} style={{ fontSize: 16, fontWeight: 600, marginTop: 24, marginBottom: 10 }}>{block.text}</h3>
            )
            if (block.type === 'p') return (
              <p key={i} style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--body)', marginBottom: 18 }}>{block.text}</p>
            )
            if (block.type === 'ul') return (
              <ul key={i} style={{ margin: '0 0 18px 0', paddingLeft: 22 }}>
                {block.items.map((item, j) => (
                  <li key={j} style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--body)', marginBottom: 6 }}>{item}</li>
                ))}
              </ul>
            )
            if (block.type === 'ol') return (
              <ol key={i} style={{ margin: '0 0 18px 0', paddingLeft: 22 }}>
                {block.items.map((item, j) => (
                  <li key={j} style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--body)', marginBottom: 8 }}>{item}</li>
                ))}
              </ol>
            )
            if (block.type === 'callout') return (
              <div key={i} style={{ background: 'rgba(200,240,96,0.06)', border: '1px solid rgba(200,240,96,0.2)', borderLeft: '3px solid var(--accent)', borderRadius: 8, padding: '16px 18px', margin: '24px 0', fontSize: 15, lineHeight: 1.7, fontStyle: 'italic' }}>
                {block.text}
              </div>
            )
            if (block.type === 'related') {
              const relPosts = block.slugs.map(s => postMap[s]).filter(Boolean)
              if (!relPosts.length) return null
              return (
                <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px', margin: '28px 0' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>Also read</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {relPosts.map(p => (
                      <Link key={p.slug} href={`/blog/${p.slug}`} style={{ fontSize: 14, color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
                        &rarr; {p.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            }
            if (block.type === 'faq') return (
              <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', margin: '36px 0' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', padding: '14px 18px', borderBottom: '1px solid var(--border)', background: 'rgba(200,240,96,0.04)' }}>
                  Frequently Asked Questions
                </div>
                {block.items.map((item, j) => (
                  <div key={j} style={{ padding: '18px', borderBottom: j < block.items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8, lineHeight: 1.4 }}>{item.q}</div>
                    <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>{item.a}</div>
                  </div>
                ))}
              </div>
            )
            if (block.type === 'cta') return (
              <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px 24px', margin: '36px 0', textAlign: 'center' }}>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--body)', marginBottom: 18 }}>{block.text}</p>
                <Link href="/signup" style={{ display: 'inline-flex', padding: '13px 28px', background: 'var(--accent)', color: '#09090b', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
                  Get my free plan &rarr;
                </Link>
              </div>
            )
            return null
          })}
        </article>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 18, marginBottom: 20 }}>Keep reading</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 14 }}>
              {relatedPosts.map(p => (
                <Link key={p.slug} href={`/blog/${p.slug}`} style={{ textDecoration: 'none', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 16px', display: 'block' }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }} dangerouslySetInnerHTML={{ __html: p.cover }} />
                  <div style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 15, color: 'var(--body)', lineHeight: 1.35, marginBottom: 8 }}>{p.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{p.readTime}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <Link href="/blog" style={{ fontSize: 14, color: 'var(--accent)', textDecoration: 'none' }}>&larr; All articles</Link>
        </div>

      </div>
    </>
  )
}
