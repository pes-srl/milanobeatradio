import type { CollectionConfig } from 'payload'
import { authenticated, isAdmin, isAdminField, publishedOrAuthenticated } from '@/src/access'
import { seoField } from '@/src/fields/seo'
import { slugField } from '@/src/fields/slug'
import { statsField } from '@/src/fields/stats'
import { previewFor } from '@/src/lib/preview'
import { dayOfWeekOptions, validateHHMM, versions } from './shared'

/**
 * Radio shows + weekly recurring schedule (palinsesto).
 * Slots are local Europe/Rome times ("HH:mm"); gaps between slots are allowed.
 */
export const Shows: CollectionConfig = {
  slug: 'shows',
  labels: { singular: { it: 'Programma', en: 'Show' }, plural: { it: 'Programmi', en: 'Shows' } },
  admin: {
    useAsTitle: 'title',
    group: { it: 'Radio', en: 'Radio' },
    defaultColumns: ['title', 'genres', 'hosts', '_status'],
    preview: previewFor((slug) => `/programmi/${slug}`),
    description: {
      it: 'I programmi della radio: palinsesto su /programmi, scheda su /programmi/[slug].',
      en: 'Radio shows: schedule at /programmi, detail at /programmi/[slug].',
    },
  },
  access: { read: publishedOrAuthenticated, create: isAdmin, update: isAdmin, delete: isAdmin },
  versions,
  fields: [
    { name: 'title', type: 'text', label: { it: 'Titolo', en: 'Title' }, required: true },
    slugField(),
    { name: 'subtitle', type: 'text', label: { it: 'Sottotitolo', en: 'Subtitle' } },
    { name: 'description', type: 'richText', label: { it: 'Descrizione', en: 'Description' } },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      label: { it: 'Copertina', en: 'Cover' },
      filterOptions: { mimeType: { contains: 'image' } },
    },
    {
      name: 'genres',
      type: 'relationship',
      relationTo: 'genres',
      hasMany: true,
      label: { it: 'Generi', en: 'Genres' },
      admin: { position: 'sidebar' },
    },
    {
      name: 'hosts',
      type: 'relationship',
      relationTo: 'staff',
      hasMany: true,
      label: { it: 'Conduttori', en: 'Hosts' },
      admin: { position: 'sidebar' },
    },
    {
      name: 'slots',
      type: 'array',
      label: { it: 'Palinsesto settimanale', en: 'Weekly slots' },
      labels: { singular: { it: 'Fascia', en: 'Slot' }, plural: { it: 'Fasce', en: 'Slots' } },
      admin: {
        description: {
          it: 'Orari locali (Europa/Roma). Le fasce possono avere buchi tra loro.',
          en: 'Local times (Europe/Rome). Gaps between slots are allowed.',
        },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'dayOfWeek',
              type: 'select',
              label: { it: 'Giorno', en: 'Day' },
              required: true,
              options: dayOfWeekOptions,
              admin: { width: '40%' },
            },
            {
              name: 'start',
              type: 'text',
              label: { it: 'Inizio', en: 'Start' },
              required: true,
              validate: validateHHMM,
              admin: { width: '30%', placeholder: '06:00' },
            },
            {
              name: 'end',
              type: 'text',
              label: { it: 'Fine', en: 'End' },
              required: true,
              validate: validateHHMM,
              admin: { width: '30%', placeholder: '07:00' },
            },
          ],
        },
      ],
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
