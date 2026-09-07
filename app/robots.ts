import type { MetadataRoute } from 'next'
import { siteUrl } from '@/src/lib/env'

const BASE = siteUrl()

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api'] }],
    sitemap: `${BASE}/sitemap.xml`,
  }
}
