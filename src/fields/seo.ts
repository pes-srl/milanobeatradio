import type { Field } from 'payload'

/** Reusable SEO group: title / description / ogImage. Attach to any public collection. */
export const seoField: Field = {
  name: 'seo',
  type: 'group',
  label: { it: 'SEO', en: 'SEO' },
  admin: { description: { it: 'Facoltativo. Se vuoto si usano titolo ed estratto.', en: 'Optional. Falls back to title and excerpt.' } },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: { it: 'Titolo SEO', en: 'SEO title' },
      maxLength: 70,
    },
    {
      name: 'description',
      type: 'textarea',
      label: { it: 'Descrizione', en: 'Description' },
      maxLength: 160,
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      label: { it: 'Immagine social (OG)', en: 'Social image (OG)' },
      filterOptions: { mimeType: { contains: 'image' } },
    },
  ],
}
