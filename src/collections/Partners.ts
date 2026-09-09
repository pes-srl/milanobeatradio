import type { CollectionConfig } from 'payload'
import { authenticated, isAdmin, publishedOrAuthenticated } from '@/src/access'
import { versions } from './shared'

/** Sponsors / partners (legacy CPT `qtsponsor`). Drag-sortable in the admin list (`orderable`). */
export const Partners: CollectionConfig = {
  slug: 'partners',
  labels: { singular: { it: 'Partner', en: 'Partner' }, plural: { it: 'Partner', en: 'Partners' } },
  orderable: true,
  admin: {
    useAsTitle: 'name',
    group: { it: 'Radio', en: 'Radio' },
    defaultColumns: ['name', 'url', 'active', '_status'],
    description: {
      it: 'I loghi mostrati in home e in Chi siamo. Si riordinano trascinando le righe. Togliendo «Attivo» spariscono dal sito senza cancellarli.',
      en: 'Logos shown on the home page and Chi siamo. Drag rows to reorder. Unticking «Active» hides one without deleting it.',
    },
  },
  access: { read: publishedOrAuthenticated, create: isAdmin, update: isAdmin, delete: isAdmin },
  versions,
  fields: [
    { name: 'name', type: 'text', label: { it: 'Nome', en: 'Name' }, required: true },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
      filterOptions: { mimeType: { contains: 'image' } },
    },
    { name: 'url', type: 'text', label: { it: 'Sito web', en: 'Website' }, admin: { placeholder: 'https://…' } },
    {
      name: 'active',
      type: 'checkbox',
      label: { it: 'Attivo (mostrato sul sito)', en: 'Active (shown on site)' },
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
}
