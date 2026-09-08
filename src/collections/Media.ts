import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/src/access'

const webp = (quality: number) => ({ format: 'webp' as const, options: { quality } })

/**
 * Media library. Stored on Cloudflare R2 through @payloadcms/storage-s3 when
 * R2 credentials are present (see payload.config.ts), otherwise on local disk.
 * Every image is re-encoded to WebP; three responsive sizes are generated.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: { it: 'Media', en: 'Media' }, plural: { it: 'Media', en: 'Media' } },
  admin: {
    group: { it: 'Contenuti', en: 'Content' },
    description: {
      it: 'Tutte le immagini e gli audio del sito. I file vengono caricati su Cloudflare R2, convertiti in WebP e salvati in tre misure (400, 800 e 1920 px): il sito sceglie da solo quella giusta per ogni schermo.',
      en: 'Every image and audio file on the site. Files are uploaded to Cloudflare R2, converted to WebP and stored in three sizes (400, 800 and 1920 px); the site picks the right one per screen.',
    },
  },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  upload: {
    // Local fallback dir (git-ignored). Ignored when the S3 adapter is enabled.
    staticDir: 'media',
    mimeTypes: ['image/*', 'audio/mpeg', 'audio/mp4', 'audio/aac', 'application/pdf'],
    focalPoint: true,
    adminThumbnail: 'thumb',
    // Original image is re-encoded to WebP too (audio/PDF are left untouched by sharp).
    formatOptions: webp(85),
    imageSizes: [
      { name: 'thumb', width: 400, withoutEnlargement: true, formatOptions: webp(80) },
      { name: 'card', width: 800, withoutEnlargement: true, formatOptions: webp(82) },
      { name: 'hero', width: 1920, withoutEnlargement: true, formatOptions: webp(85) },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: { it: 'Testo alternativo', en: 'Alt text' },
      required: true,
      admin: { description: { it: 'Descrizione per accessibilità e SEO.', en: 'Accessibility / SEO description.' } },
    },
    { name: 'caption', type: 'text', label: { it: 'Didascalia', en: 'Caption' } },
    {
      name: 'legacyUrl',
      type: 'text',
      label: { it: 'URL originale (WordPress)', en: 'Legacy URL (WordPress)' },
      index: true,
      admin: { readOnly: true, position: 'sidebar', description: { it: 'Compilato dalla migrazione.', en: 'Filled by the migration.' } },
    },
  ],
}
