export const runtime = 'edge'
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/settings', '/api/'],
      },
    ],
    sitemap: 'https://budgetplanai.com/sitemap.xml',
    host: 'https://budgetplanai.com',
  }
}
