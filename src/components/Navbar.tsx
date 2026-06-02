'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LayoutDashboard, Settings, LogOut, Plus } from 'lucide-react'

export default function Navbar({ user }: { user: { email?: string } | null }) {
  const pathname = usePathname()
  const router = useRouter()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <style>{`
        .nav-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #a1a1aa;
          text-decoration: none;
          border: none;
          background: transparent;
          font-family: inherit;
          cursor: pointer;
          transition: color 0.15s, background 0.15s, box-shadow 0.15s;
          white-space: nowrap;
        }
        .nav-link:hover {
          color: #e4e4e7;
          background: rgba(255,255,255,0.06);
        }
        .nav-link.active {
          color: #c8f060;
          background: rgba(200,240,96,0.1);
          box-shadow: 0 0 12px rgba(200,240,96,0.15);
        }
        .nav-new {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #09090b;
          background: #c8f060;
          text-decoration: none;
          border: none;
          font-family: inherit;
          cursor: pointer;
          box-shadow: 0 0 16px rgba(200,240,96,0.35);
          transition: all 0.15s;
        }
        .nav-new:hover {
          background: #d4f570;
          box-shadow: 0 0 24px rgba(200,240,96,0.5);
          transform: translateY(-1px);
        }
        .nav-signout {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #71717a;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.08);
          font-family: inherit;
          cursor: pointer;
          transition: all 0.15s;
        }
        .nav-signout:hover {
          color: #f87171;
          border-color: rgba(248,113,113,0.3);
          background: rgba(248,113,113,0.05);
        }
      `}</style>

      <nav style={{
        background: 'rgba(17,17,22,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link href={user ? '/dashboard' : '/'} style={{
            fontFamily: 'var(--font-serif, serif)',
            fontSize: 20,
            color: '#c8f060',
            textDecoration: 'none',
            letterSpacing: '-0.02em',
            textShadow: '0 0 20px rgba(200,240,96,0.4)',
          }}>
            MyBudget.AI
          </Link>

          {/* Logged in nav */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Link href="/plan/new" className="nav-new">
                <Plus size={15} /> New Plan
              </Link>
              <Link href="/dashboard" className={`nav-link${pathname === '/dashboard' ? ' active' : ''}`}>
                <LayoutDashboard size={15} /> Dashboard
              </Link>
              <Link href="/settings" className={`nav-link${pathname === '/settings' ? ' active' : ''}`}>
                <Settings size={15} /> Settings
              </Link>
              <button onClick={signOut} className="nav-signout">
                <LogOut size={15} /> Sign out
              </button>
            </div>
          )}

          {/* Logged out nav */}
          {!user && (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link href="/login" className="nav-link">Sign in</Link>
              <Link href="/signup" className="nav-new">Get started</Link>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
