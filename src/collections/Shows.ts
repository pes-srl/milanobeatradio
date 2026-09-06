import type { CollectionConfig } from 'payload'
import { authenticated, publishedOrAuthenticated } from '@/src/access'
import { seoField } from '@/src/fields/seo'
import { slugField } from '@/src/fields/slug'
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
    defaultColumns: ['title', 'genre', 'hosts', '_status'],
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
      name: 'genre',
      type: 'relationship',
      relationTo: 'genres',
      label: { it: 'Genere', en: 'Genre' },
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
    seoField,
  ],
}
