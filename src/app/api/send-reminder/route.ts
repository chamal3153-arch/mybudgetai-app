import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  // This endpoint is called by a cron job (Vercel Cron or manual trigger)
  const { authorization } = Object.fromEntries(req.headers)
  if (authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const supabase = await createServiceClient()

  // Get all users with reminders enabled and at least one plan
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email, email_reminders')
    .eq('email_reminders', true)

  if (!profiles) return NextResponse.json({ sent: 0 })

  let sent = 0
  for (const profile of profiles) {
    const { data: plans } = await supabase
      .from('plans')
      .select('goal, timeframe, country, free_data, premium_data')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(1)

    if (!plans || plans.length === 0) continue
    const plan = plans[0]
    const actions = plan.premium_data?.action_plan?.month_1 || []

    try {
      await resend.emails.send({
        from: 'MyBudget.AI <reminders@mybudget.ai>',
        to: profile.email,
        subject: `📊 Your ${plan.goal} action items this week`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#09090b;color:#e4e4e7;padding:32px 24px;border-radius:12px;">
            <h2 style="color:#c8f060;font-size:22px;margin-bottom:8px;">MyBudget.AI</h2>
            <h3 style="font-size:20px;margin-bottom:6px;">Your weekly financial check-in 👋</h3>
            <p style="color:#71717a;font-size:14px;margin-bottom:24px;">Goal: <strong style="color:#e4e4e7">${plan.goal}</strong> in ${plan.timeframe} · ${plan.country}</p>
            ${actions.length > 0 ? `
              <div style="background:#111116;border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:18px 20px;margin-bottom:20px;">
                <div style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#71717a;margin-bottom:12px;">Your action items</div>
                ${actions.map((a: string) => `<div style="display:flex;gap:10px;margin-bottom:8px;font-size:14px;line-height:1.5;"><span style="color:#c8f060;flex-shrink:0;">→</span><span>${a}</span></div>`).join('')}
              </div>
            ` : ''}
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="display:inline-block;padding:12px 24px;background:#c8f060;color:#09090b;border-radius:8px;font-weight:600;text-decoration:none;font-size:14px;">View My Dashboard →</a>
            <p style="margin-top:24px;font-size:11px;color:#71717a;">You're receiving this because you enabled weekly reminders in settings. <a href="${process.env.NEXT_PUBLIC_SITE_URL}/settings" style="color:#71717a;">Unsubscribe</a></p>
          </div>
        `
      })
      sent++
    } catch (e) {
      console.error(`Failed to send to ${profile.email}:`, e)
    }
  }

  return NextResponse.json({ sent })
}
