import type { GeneratePreviewURL } from 'payload'
import { siteUrl } from './env'

/**
 * Builds the "Anteprima" button URL for a collection. The button points at
 * app/(site)/api/preview, which switches Next into draft mode before redirecting
 * to the real page — that is what lets an editor see a piece before publishing it.
 */
export const previewFor =
  (path: (slug: string) => string): GeneratePreviewURL =>
  (doc) => {
    const slug = typeof doc?.slug === 'string' ? doc.slug : null
    if (!slug) return null
    return `${siteUrl()}/api/preview?path=${encodeURIComponent(path(slug))}`
  }
