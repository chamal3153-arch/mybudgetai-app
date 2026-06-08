export const runtime = 'edge'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: Request) {
  const { name, email, subject, message } = await req.json()
  if (!name || !email || !message) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const resend = new Resend(process.env.RESEND_API_KEY)

  await resend.emails.send({
    from: 'MyBudget.AI Contact <noreply@costsaverai.com>',
    to: 'support@costsaverai.com',
    replyTo: email,
    subject: `[MyBudget.AI] ${subject} - from ${name}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
        <h2 style="color:#c8f060;">New contact form submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr/>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap;">${message}</p>
      </div>
    `
  })

  // Auto-reply to user
  await resend.emails.send({
    from: 'MyBudget.AI <support@costsaverai.com>',
    to: email,
    subject: `We received your message - MyBudget.AI`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#09090b;color:#e4e4e7;padding:32px 24px;border-radius:12px;">
        <h2 style="color:#c8f060;margin-bottom:4px;">MyBudget.AI</h2>
        <p style="color:#71717a;font-size:13px;margin-bottom:24px;">A product of CostSaver AI</p>
        <h3 style="margin-bottom:8px;">Thanks ${name}, we got your message!</h3>
        <p style="color:#71717a;font-size:14px;line-height:1.6;">We'll get back to you within 24 hours. Your subject was: <strong style="color:#e4e4e7;">${subject}</strong></p>
        <hr style="border-color:rgba(255,255,255,0.06);margin:24px 0;"/>
        <p style="font-size:13px;color:#71717a;">While you wait, explore your dashboard or try our free financial calculators at <a href="https://mybudgetai.pages.dev/calculators" style="color:#c8f060;">mybudgetai.pages.dev/calculators</a></p>
        <p style="font-size:12px;color:#52525b;margin-top:20px;">CostSaver AI &middot; <a href="https://costsaverai.com" style="color:#52525b;">costsaverai.com</a></p>
      </div>
    `
  })

  return NextResponse.json({ ok: true })
}
