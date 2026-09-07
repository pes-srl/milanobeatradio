import type { Media } from '@/src/payload-types'

export type MediaRef = Media | number | null | undefined
export type MediaSize = 'thumb' | 'card' | 'hero'

/** Resolves a populated media doc (relationships come back as numbers when depth is 0). */
export const asMedia = (m: MediaRef): Media | null => (m && typeof m === 'object' ? m : null)

/**
 * In local dev (no R2), Payload prepends `serverURL` to upload URLs, producing e.g.
 * `http://localhost:3000/api/media/file/x.webp`. Next's image optimizer refuses to fetch
 * a "remote" URL that resolves to a private/local IP (SSRF guard), so same-origin URLs
 * are stripped back to a relative path — same file, served locally, no network hop.
 */
const toRelative = (url: string): string => {
  const site = process.env.NEXT_PUBLIC_SITE_URL
  if (site && url.startsWith(site)) return url.slice(site.length) || '/'
  return url
}

/**
 * Best URL for a given size, falling back to the original. Sizes are never enlarged,
 * so small originals only have the original file.
 */
export function imageUrl(m: MediaRef, size: MediaSize = 'card'): string | null {
  const media = asMedia(m)
  if (!media) return null
  const s = media.sizes?.[size]
  const url = s?.url || media.url || null
  return url ? toRelative(url) : null
}

export const imageAlt = (m: MediaRef, fallback = '') => asMedia(m)?.alt || fallback

/** Width/height pair for next/image when the size exists. */
export function imageDims(m: MediaRef, size: MediaSize = 'card'): { width: number; height: number } {
  const media = asMedia(m)
  const s = media?.sizes?.[size]
  if (s?.width && s?.height) return { width: s.width, height: s.height }
  if (media?.width && media?.height) return { width: media.width, height: media.height }
  return { width: 1200, height: 675 }
}
