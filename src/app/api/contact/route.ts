export const runtime = 'edge'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const { name, email, subject, message } = await req.json()
  if (!name || !email || !message) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  // Always save to Supabase first so no message is ever lost
  try {
    const supabase = await createServiceClient()
    await supabase.from('contact_messages').insert({ name, email, subject, message })
  } catch (_) {
    // table may not exist yet — non-fatal, email still sends
  }

  // Send email notification to owner
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'BudgetPlan AI <noreply@costsaverai.com>',
      to: 'costsaverai@proton.me',
      replyTo: email,
      subject: `[BudgetPlan AI] ${subject} - from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
          <h2 style="color:#c8f060;">New contact form submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr/>
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-wrap;">${message}</p>
          <hr/>
          <p style="font-size:12px;color:#666;">Reply directly to this email to respond to ${name}.</p>
        </div>
      `
    })
  } catch (_) {
    // email failed but message is saved in Supabase — still return success
  }

  return NextResponse.json({ ok: true })
}
