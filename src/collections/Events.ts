import type { CollectionConfig } from 'payload'
import { authenticated, publishedOrAuthenticated } from '@/src/access'
import { seoField } from '@/src/fields/seo'
import { slugField } from '@/src/fields/slug'
import { statsField } from '@/src/fields/stats'
import { versions } from './shared'

const rome = { pickerAppearance: 'dayAndTime' as const, displayFormat: 'dd/MM/yyyy HH:mm' }

/** City events agenda. Public URL: /eventi/[slug]. Dates stored in UTC, edited in Europe/Rome. */
export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: { it: 'Evento', en: 'Event' }, plural: { it: 'Eventi', en: 'Events' } },
  admin: {
    useAsTitle: 'title',
    group: { it: 'Contenuti', en: 'Content' },
    defaultColumns: ['title', 'startDate', 'venueName', '_status'],
    description: {
      it: 'Gli eventi in città: lista su /eventi, scheda su /eventi/[slug]. In home compaiono solo quelli non ancora passati.',
      en: 'City events: list at /eventi, detail at /eventi/[slug]. Only upcoming ones appear on the home page.',
    },
  },
  access: { read: publishedOrAuthenticated, create: authenticated, update: authenticated, delete: authenticated },
  versions,
  fields: [
    { name: 'title', type: 'text', label: { it: 'Titolo', en: 'Title' }, required: true },
    slugField(),
    { name: 'content', type: 'richText', label: { it: 'Descrizione', en: 'Content' } },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      label: { it: 'Immagine di copertina', en: 'Cover image' },
      filterOptions: { mimeType: { contains: 'image' } },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          label: { it: 'Inizio', en: 'Start' },
          required: true,
          index: true,
          timezone: true,
          admin: { date: rome, width: '50%' },
        },
        {
          name: 'endDate',
          type: 'date',
          label: { it: 'Fine', en: 'End' },
          timezone: true,
          admin: { date: rome, width: '50%' },
          validate: (value, { siblingData }) => {
            const start = (siblingData as { startDate?: string })?.startDate
            if (value && start && new Date(value) < new Date(start)) return 'La fine deve essere dopo l’inizio.'
            return true
          },
        },
      ],
    },
    { name: 'artists', type: 'text', label: { it: 'Artisti / line-up', en: 'Artists / line-up' }, admin: { description: { it: 'Es. "Luuk van Dijk - Jaden Thompson"', en: 'E.g. "Luuk van Dijk - Jaden Thompson"' } } },
    {
      type: 'row',
      fields: [
        { name: 'venueName', type: 'text', label: { it: 'Luogo', en: 'Venue' }, admin: { width: '60%' } },
        { name: 'city', type: 'text', label: { it: 'Città', en: 'City' }, defaultValue: 'Milano', admin: { width: '40%' } },
      ],
    },
    { name: 'address', type: 'text', label: { it: 'Indirizzo completo', en: 'Full address' } },
    {
      type: 'row',
      fields: [
        { name: 'lat', type: 'number', label: 'Lat', min: -90, max: 90, admin: { width: '50%' } },
        { name: 'lng', type: 'number', label: 'Lng', min: -180, max: 180, admin: { width: '50%' } },
      ],
    },
    { name: 'externalUrl', type: 'text', label: { it: 'Link esterno (biglietti / info)', en: 'External URL' } },
    {
      name: 'eventType',
      type: 'relationship',
      relationTo: 'event-types',
      label: { it: 'Tipo evento', en: 'Event type' },
      admin: { position: 'sidebar' },
    },
    statsField,
    {
      name: 'legacyPath',
      type: 'text',
      label: { it: 'URL WordPress (legacy)', en: 'Legacy WordPress path' },
      index: true,
      admin: { readOnly: true, position: 'sidebar', description: { it: 'Percorso sul vecchio sito, usato per i redirect 301.', en: 'Path on the old site, used for 301 redirects.' } },
    },
    seoField,
  ],
}
