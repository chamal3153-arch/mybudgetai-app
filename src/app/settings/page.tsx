export const runtime = 'edge'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import SettingsForm from './SettingsForm'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
  const { data: purchase } = await supabase.from('purchases').select('*').eq('user_id', user.id).limit(1).maybeSingle()

  return (
    <>
      <Navbar user={user} />
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif,serif)', fontSize: 28, letterSpacing: '-0.02em', marginBottom: 4 }}>Settings</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 32 }}>Manage your account and notification preferences</p>
        <SettingsForm user={user} profile={profile} purchase={purchase} />
      </div>
    </>
  )
}

