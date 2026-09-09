import type { CollectionConfig } from 'payload'
import { authenticated, isAdminField, publishedOrAuthenticated } from '@/src/access'
import { seoField } from '@/src/fields/seo'
import { slugField } from '@/src/fields/slug'
import { statsField } from '@/src/fields/stats'
import { previewFor } from '@/src/lib/preview'
import { versions } from './shared'

/** FLASH NEWS. Public URL: /flash-news/[slug]. */
export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: { it: 'Flash News', en: 'Post' }, plural: { it: 'Flash News', en: 'Posts' } },
  admin: {
    useAsTitle: 'title',
    group: { it: 'Contenuti', en: 'Content' },
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
    preview: previewFor((slug) => `/flash-news/${slug}`),
    description: {
      it: 'Le Flash News. Ogni articolo si pubblica su /flash-news/[slug]; i più recenti appaiono anche in home.',
      en: 'Flash News. Each article is published at /flash-news/[slug]; the latest also appear on the home page.',
    },
  },
  access: { read: publishedOrAuthenticated, create: authenticated, update: authenticated, delete: authenticated },
  versions,
  fields: [
    { name: 'title', type: 'text', label: { it: 'Titolo', en: 'Title' }, required: true },
    slugField(),
    {
      name: 'excerpt',
      type: 'textarea',
      label: { it: 'Estratto', en: 'Excerpt' },
      maxLength: 300,
    },
    { name: 'content', type: 'richText', label: { it: 'Contenuto', en: 'Content' } },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      label: { it: 'Immagine di copertina', en: 'Cover image' },
      filterOptions: { mimeType: { contains: 'image' } },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: { it: 'Categoria', en: 'Category' },
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      label: { it: 'Autore', en: 'Author' },
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: { it: 'Data di pubblicazione', en: 'Published at' },
      index: true,
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd/MM/yyyy HH:mm' } },
      hooks: {
        beforeChange: [
          ({ value, siblingData }) =>
            !value && siblingData?._status === 'published' ? new Date().toISOString() : value,
        ],
      },
    },
    statsField,
    {
      name: 'legacyPath',
      type: 'text',
      label: { it: 'URL WordPress (legacy)', en: 'Legacy WordPress path' },
      index: true,
      access: { read: isAdminField },
      admin: { readOnly: true, position: 'sidebar', description: { it: 'Percorso sul vecchio sito, usato per i redirect 301.', en: 'Path on the old site, used for 301 redirects.' } },
    },
    seoField,
  ],
}
