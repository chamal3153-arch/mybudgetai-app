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
  title: 'MyBudget.AI — Free AI Budget Planner | 195 Countries',
  description: 'Free AI budget planner. Get a personalized financial plan in 60 seconds — budget breakdown, investment picks, savings strategy & 90-day action plan. Works in 195 countries.',
  manifest: '/manifest.json',
  metadataBase: new URL('https://budgetplanai.com'),
  keywords: ['AI budget planner', 'free budget planner', 'AI financial planner', 'personal finance AI', 'budget plan AI', 'financial planning tool'],
  authors: [{ name: 'CostSaver AI', url: 'https://costsaverai.com' }],
  creator: 'CostSaver AI',
  publisher: 'CostSaver AI',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: 'website',
    url: 'https://budgetplanai.com',
    title: 'MyBudget.AI — Free AI Budget Planner',
    description: 'Get a personalized AI financial plan in 60 seconds. Budget breakdown, investment picks & 90-day action plan. Free to start. Works in 195 countries.',
    siteName: 'MyBudget.AI',
    images: [{ url: 'https://budgetplanai.com/og-image.png', width: 1200, height: 630, alt: 'MyBudget.AI - AI Budget Planner' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyBudget.AI — Free AI Budget Planner',
    description: 'Get a personalized AI financial plan in 60 seconds. Free to start. Works in 195 countries.',
    images: ['https://budgetplanai.com/og-image.png'],
  },
  alternates: { canonical: 'https://budgetplanai.com' },
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
