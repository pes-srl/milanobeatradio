import type { CollectionConfig } from 'payload'
import { authenticated, publishedOrAuthenticated } from '@/src/access'
import { seoField } from '@/src/fields/seo'
import { slugField } from '@/src/fields/slug'
import { versions } from './shared'

/**
 * Podcasts. "Interviste" is NOT a separate content type: it is a podcast filter,
 * and /interviste is a filtered view of this collection.
 */
export const Podcasts: CollectionConfig = {
  slug: 'podcasts',
  labels: { singular: { it: 'Podcast', en: 'Podcast' }, plural: { it: 'Podcast', en: 'Podcasts' } },
  admin: {
    useAsTitle: 'title',
    group: { it: 'Contenuti', en: 'Content' },
    defaultColumns: ['title', 'filters', 'publishedAt', '_status'],
  },
  access: { read: publishedOrAuthenticated, create: authenticated, update: authenticated, delete: authenticated },
  versions,
  fields: [
    { name: 'title', type: 'text', label: { it: 'Titolo', en: 'Title' }, required: true },
    slugField(),
    { name: 'description', type: 'richText', label: { it: 'Descrizione', en: 'Description' } },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      label: { it: 'Copertina', en: 'Cover' },
      filterOptions: { mimeType: { contains: 'image' } },
    },
    {
      name: 'audioUrl',
      type: 'text',
      label: { it: 'URL audio (R2)', en: 'Audio URL (R2)' },
      required: true,
      admin: { description: { it: 'URL pubblico del file MP3 su R2.', en: 'Public MP3 URL on R2.' } },
      validate: (value: unknown) =>
        typeof value === 'string' && /^https?:\/\/\S+$/.test(value) ? true : 'Inserisci un URL valido (https://…).',
    },
    {
      name: 'duration',
      type: 'number',
      label: { it: 'Durata (secondi)', en: 'Duration (seconds)' },
      min: 0,
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: { it: 'Data di pubblicazione', en: 'Published at' },
      index: true,
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd/MM/yyyy HH:mm' } },
    },
    {
      name: 'filters',
      type: 'relationship',
      relationTo: 'podcast-filters',
      hasMany: true,
      label: { it: 'Filtri', en: 'Filters' },
      admin: { position: 'sidebar' },
    },
    seoField,
  ],
}
