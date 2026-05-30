'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { LayoutDashboard, Settings, LogOut, Menu, X, Plus } from 'lucide-react'

export default function Navbar({ user }: { user: { email?: string } | null }) {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link href={user ? '/dashboard' : '/'} style={{ fontFamily: 'var(--font-serif, serif)', fontSize: 20, color: 'var(--accent)', textDecoration: 'none', letterSpacing: '-0.02em' }}>
          MyBudget.AI
        </Link>

        {/* Desktop nav */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/plan/new" style={navBtn(pathname === '/plan/new')}>
              <Plus size={15} /> New Plan
            </Link>
            <Link href="/dashboard" style={navBtn(pathname === '/dashboard')}>
              <LayoutDashboard size={15} /> Dashboard
            </Link>
            <Link href="/settings" style={navBtn(pathname === '/settings')}>
              <Settings size={15} /> Settings
            </Link>
            <button onClick={signOut} style={{ ...navBtn(false), background: 'none', cursor: 'pointer', border: '1px solid var(--border)', borderRadius: 8 }}>
              <LogOut size={15} /> Sign out
            </button>
          </div>
        )}

        {!user && (
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/login" style={navBtn(false)}>Sign in</Link>
            <Link href="/signup" style={{ ...navBtn(false), background: 'var(--accent)', color: '#09090b', borderRadius: 8 }}>Get started</Link>
          </div>
        )}
      </div>
    </nav>
  )
}

function navBtn(active: boolean) {
  return {
    display: 'inline-flex' as const,
    alignItems: 'center' as const,
    gap: 6,
    padding: '7px 14px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    color: active ? 'var(--accent)' : 'var(--muted)',
    background: active ? 'rgba(200,240,96,0.08)' : 'transparent',
    textDecoration: 'none',
    border: 'none',
    fontFamily: 'inherit',
    transition: 'all 0.15s',
  }
}
