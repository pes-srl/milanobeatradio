import type { MetadataRoute } from 'next'
import { getEvents, getPodcasts, getPosts, getShows, getStaff } from '@/src/lib/queries'

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://milanobeatradio.it').replace(/\/$/, '')

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, events, podcasts, shows, staff] = await Promise.all([
    getPosts({ limit: 1000 }),
    getEvents({ limit: 1000 }),
    getPodcasts({ limit: 1000 }),
    getShows(),
    getStaff(),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/flash-news`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/eventi`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/interviste`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/programmi`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/staff`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/mbr-events`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/chi-siamo`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/contatti`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE}/promuoviti`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE}/privacy-policy`, changeFrequency: 'yearly', priority: 0.2 },
  ]

  const entry = (path: string, updatedAt?: string | null): MetadataRoute.Sitemap[number] => ({
    url: `${BASE}${path}`,
    lastModified: updatedAt ? new Date(updatedAt) : undefined,
    changeFrequency: 'monthly',
    priority: 0.7,
  })

  return [
    ...staticPages,
    ...posts.docs.map((d) => entry(`/flash-news/${d.slug}`, d.updatedAt)),
    ...events.docs.map((d) => entry(`/eventi/${d.slug}`, d.updatedAt)),
    ...podcasts.docs.map((d) => entry(`/podcast/${d.slug}`, d.updatedAt)),
    ...shows.docs.map((d) => entry(`/programmi/${d.slug}`, d.updatedAt)),
    ...staff.docs.map((d) => entry(`/staff/${d.slug}`, d.updatedAt)),
  ]
}
