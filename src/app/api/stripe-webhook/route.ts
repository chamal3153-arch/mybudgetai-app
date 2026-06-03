export const runtime = 'edge'
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// Web Crypto version of HMAC verification (edge compatible)
async function verifyWebhook(payload: string, signature: string, secret: string) {
  const parts = Object.fromEntries(signature.split(',').map(p => p.split('=')))
  const timestamp = parts['t'], v1 = parts['v1']
  if (!timestamp || !v1) throw new Error('Invalid signature')
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) throw new Error('Timestamp too old')
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(`${timestamp}.${payload}`))
  const expected = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2,'0')).join('')
  if (expected !== v1) throw new Error('Signature mismatch')
  const expected = crypto.createHmac('sha256', secret).update(`${timestamp}.${payload}`).digest('hex')
  if (expected !== v1) throw new Error('Signature mismatch')
  return JSON.parse(payload)
}

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') || ''
  const secret = process.env.STRIPE_WEBHOOK_SECRET || ''

  let event: any
  try { event = await verifyWebhook(body, sig, secret) }
  catch (e: any) { return NextResponse.json({ error: e.message }, { status: 400 }) }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const email = session.customer_details?.email?.toLowerCase()
    if (!email) return NextResponse.json({ received: true })

    const supabase = await createServiceClient()

    // Find user by email
    const { data: authUsers } = await supabase.auth.admin.listUsers()
    const user = authUsers?.users?.find((u: any) => u.email?.toLowerCase() === email)

    await supabase.from('purchases').upsert({
      email,
      user_id: user?.id || null,
      stripe_session_id: session.id,
      amount_cents: session.amount_total,
    }, { onConflict: 'stripe_session_id' })

    // Mark all existing plans as premium for this user
    if (user?.id) {
      await supabase.from('plans').update({ is_premium: true }).eq('user_id', user.id)
    }
  }

  return NextResponse.json({ received: true })
}

