import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/plan/', '/settings', '/api/'],
      },
    ],
    sitemap: 'https://budgetplanai.com/sitemap.xml',
  }
}
