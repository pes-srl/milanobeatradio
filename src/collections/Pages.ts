import type { CollectionConfig } from 'payload'
import { authenticated, publishedOrAuthenticated } from '@/src/access'
import { seoField } from '@/src/fields/seo'
import { slugField } from '@/src/fields/slug'
import { previewFor } from '@/src/lib/preview'
import { versions } from './shared'

/**
 * Free-form pages with a rich-text body (privacy policy, legal texts).
 * Designed pages (home, chi siamo, MBR events, contatti, promuoviti) are React routes,
 * not documents here.
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: { it: 'Pagina', en: 'Page' }, plural: { it: 'Pagine', en: 'Pages' } },
  admin: {
    useAsTitle: 'title',
    group: { it: 'Contenuti', en: 'Content' },
    defaultColumns: ['title', 'slug', '_status'],
    preview: previewFor((slug) => `/${slug}`),
    description: {
      it: 'Pagine di solo testo, come la privacy policy. Si pubblicano su /[slug].',
      en: 'Plain text pages, such as the privacy policy. Published at /[slug].',
    },
  },
  access: { read: publishedOrAuthenticated, create: authenticated, update: authenticated, delete: authenticated },
  versions,
  fields: [
    { name: 'title', type: 'text', label: { it: 'Titolo', en: 'Title' }, required: true },
    slugField(),
    { name: 'content', type: 'richText', label: { it: 'Contenuto', en: 'Content' } },
    seoField,
  ],
}
