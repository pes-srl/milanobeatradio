import type { CollectionConfig, TextFieldValidation } from 'payload'
import { authenticated, isAdmin, isAdminField, publishedOrAuthenticated } from '@/src/access'
import { seoField } from '@/src/fields/seo'
import { slugField } from '@/src/fields/slug'
import { statsField } from '@/src/fields/stats'
import { previewFor } from '@/src/lib/preview'
import { versions } from './shared'

/**
 * Podcasts. "Interviste" is NOT a separate content type: it is a podcast filter,
 * and /interviste is a filtered view of this collection.
 *
 * Audio source (client decision 2026-09-07): a pasted URL (`audioUrl`) is the primary
 * option, an uploaded file (`audioFile`, stored on R2 through the media collection)
 * is the alternative. At least one of the two is required.
 */
export const Podcasts: CollectionConfig = {
  slug: 'podcasts',
  labels: { singular: { it: 'Podcast', en: 'Podcast' }, plural: { it: 'Podcast', en: 'Podcasts' } },
  admin: {
    useAsTitle: 'title',
    group: { it: 'Contenuti', en: 'Content' },
    defaultColumns: ['title', 'filters', 'publishedAt', '_status'],
    preview: previewFor((slug) => `/podcast/${slug}`),
    description: {
      it: 'Le interviste. Scheda su /podcast/[slug]; la pagina /interviste è questa stessa lista filtrata.',
      en: 'Podcasts. Detail at /podcast/[slug]; the /interviste page is this same list, filtered.',
    },
  },
  access: { read: publishedOrAuthenticated, create: isAdmin, update: isAdmin, delete: isAdmin },
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
      label: { it: 'URL audio (MP3)', en: 'Audio URL (MP3)' },
      admin: {
        description: {
          it: 'Incolla l’URL pubblico del file MP3. In alternativa carica il file qui sotto.',
          en: 'Paste the public MP3 URL. Alternatively upload the file below.',
        },
      },
      validate: ((value, { siblingData }) => {
        const hasFile = Boolean((siblingData as { audioFile?: unknown })?.audioFile)
        if (!value && !hasFile) return 'Inserisci un URL audio oppure carica un file.'
        if (value && !/^https?:\/\/\S+$/.test(value)) return 'URL non valido (https://…).'
        return true
      }) satisfies TextFieldValidation,
    },
    {
      name: 'audioFile',
      type: 'upload',
      relationTo: 'media',
      label: { it: 'Oppure carica il file audio', en: 'Or upload the audio file' },
      filterOptions: { mimeType: { contains: 'audio' } },
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
