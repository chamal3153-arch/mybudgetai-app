import type { Metadata } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' })
const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: 'MyBudget.AI — AI-Powered Personal Budget Planner',
  description: 'Get a personalized financial plan in 60 seconds. Budget breakdown, investment picks, savings strategy & 90-day action plan — powered by AI.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'MyBudget.AI' },
  other: { 'mobile-web-app-capable': 'yes' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerif.variable}`}>
      <body className={dmSans.className}>{children}</body>
    </html>
  )
}
