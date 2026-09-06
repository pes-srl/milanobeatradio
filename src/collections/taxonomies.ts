import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/src/access'
import { slugField } from '@/src/fields/slug'

type Labels = { singular: { it: string; en: string }; plural: { it: string; en: string } }

/** Simple taxonomy factory: name, slug, optional description. No drafts (they are lookup tables). */
const taxonomy = (slug: string, labels: Labels): CollectionConfig => ({
  slug,
  labels,
  admin: { useAsTitle: 'name', group: { it: 'Tassonomie', en: 'Taxonomies' }, defaultColumns: ['name', 'slug'] },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  fields: [
    { name: 'name', type: 'text', label: { it: 'Nome', en: 'Name' }, required: true },
    slugField('name'),
    { name: 'description', type: 'textarea', label: { it: 'Descrizione', en: 'Description' } },
  ],
})

export const Categories = taxonomy('categories', {
  singular: { it: 'Categoria', en: 'Category' },
  plural: { it: 'Categorie', en: 'Categories' },
})

export const EventTypes = taxonomy('event-types', {
  singular: { it: 'Tipo evento', en: 'Event type' },
  plural: { it: 'Tipi evento', en: 'Event types' },
})

export const PodcastFilters = taxonomy('podcast-filters', {
  singular: { it: 'Filtro podcast', en: 'Podcast filter' },
  plural: { it: 'Filtri podcast', en: 'Podcast filters' },
})

export const Genres = taxonomy('genres', {
  singular: { it: 'Genere', en: 'Genre' },
  plural: { it: 'Generi', en: 'Genres' },
})
