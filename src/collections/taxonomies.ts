import type { CollectionConfig } from 'payload'
import { anyone, authenticated, isAdmin } from '@/src/access'
import { slugField } from '@/src/fields/slug'

type Labels = { singular: { it: string; en: string }; plural: { it: string; en: string } }
type Localised = { it: string; en: string }
type AccessMap = NonNullable<CollectionConfig['access']>

/** Simple taxonomy factory: name, slug, optional description. No drafts (they are lookup tables). */
const taxonomy = (slug: string, labels: Labels, description: Localised, access?: AccessMap): CollectionConfig => ({
  slug,
  labels,
  admin: {
    useAsTitle: 'name',
    group: { it: 'Tassonomie', en: 'Taxonomies' },
    defaultColumns: ['name', 'slug'],
    description,
  },
  access: access ?? { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  fields: [
    { name: 'name', type: 'text', label: { it: 'Nome', en: 'Name' }, required: true },
    slugField('name'),
    { name: 'description', type: 'textarea', label: { it: 'Descrizione', en: 'Description' } },
  ],
})

export const Categories = taxonomy(
  'categories',
  { singular: { it: 'Categoria', en: 'Category' }, plural: { it: 'Categorie', en: 'Categories' } },
  {
    it: 'Le categorie delle Flash News. Compaiono come etichetta sulle card e raggruppano gli articoli.',
    en: 'Flash News categories. Shown as the label on each card, and used to group articles.',
  },
)

export const EventTypes = taxonomy(
  'event-types',
  { singular: { it: 'Tipo evento', en: 'Event type' }, plural: { it: 'Tipi evento', en: 'Event types' } },
  {
    it: 'Servono a distinguere i tipi di evento nella pagina /eventi.',
    en: 'Used to tell event types apart on the /eventi page.',
  },
)

export const PodcastFilters = taxonomy(
  'podcast-filters',
  { singular: { it: 'Filtro podcast', en: 'Podcast filter' }, plural: { it: 'Filtri podcast', en: 'Podcast filters' } },
  {
    it: 'I filtri dei podcast. Quello chiamato «intervista» è ciò che alimenta la pagina /interviste: non cancellarlo.',
    en: 'Podcast filters. The one named «intervista» is what feeds the /interviste page: do not delete it.',
  },
  // Write operations restricted to admin: editors have no reason to change podcast filters,
  // and accidentally deleting «intervista» would break the /interviste page.
  { read: anyone, create: isAdmin, update: isAdmin, delete: isAdmin },
)

export const Genres = taxonomy(
  'genres',
  { singular: { it: 'Genere', en: 'Genre' }, plural: { it: 'Generi', en: 'Genres' } },
  {
    it: 'I generi musicali dei programmi. Compaiono come etichetta sulla card del programma.',
    en: 'Musical genres of the shows. Shown as the label on each show card.',
  },
)
