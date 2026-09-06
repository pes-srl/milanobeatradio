import type { CollectionConfig } from 'payload'
import { authenticated, publishedOrAuthenticated } from '@/src/access'
import { seoField } from '@/src/fields/seo'
import { slugField } from '@/src/fields/slug'
import { versions } from './shared'

/** FLASH NEWS. Public URL: /flash-news/[slug]. */
export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: { it: 'Flash News', en: 'Post' }, plural: { it: 'Flash News', en: 'Posts' } },
  admin: {
    useAsTitle: 'title',
    group: { it: 'Contenuti', en: 'Content' },
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
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
    seoField,
  ],
}
