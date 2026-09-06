import type { CollectionConfig } from 'payload'
import { authenticated, publishedOrAuthenticated } from '@/src/access'
import { seoField } from '@/src/fields/seo'
import { slugField } from '@/src/fields/slug'
import { versions } from './shared'

const social = (name: string, label: string) => ({
  name,
  type: 'text' as const,
  label,
  admin: { placeholder: 'https://…' },
})

/** Team members. Public URL: /staff/[slug]. `role` is intentionally optional: unknown in the source site. */
export const Staff: CollectionConfig = {
  slug: 'staff',
  labels: { singular: { it: 'Membro dello staff', en: 'Staff member' }, plural: { it: 'Staff', en: 'Staff' } },
  admin: {
    useAsTitle: 'title',
    group: { it: 'Radio', en: 'Radio' },
    defaultColumns: ['title', 'role', '_status'],
  },
  access: { read: publishedOrAuthenticated, create: authenticated, update: authenticated, delete: authenticated },
  versions,
  fields: [
    { name: 'title', type: 'text', label: { it: 'Nome', en: 'Name' }, required: true },
    slugField(),
    {
      name: 'role',
      type: 'text',
      label: { it: 'Ruolo', en: 'Role' },
      admin: { description: { it: 'TODO: ruoli non presenti nel vecchio sito.', en: 'TODO: roles missing in the legacy site.' } },
    },
    { name: 'bio', type: 'richText', label: { it: 'Biografia', en: 'Bio' } },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: { it: 'Foto', en: 'Photo' },
      filterOptions: { mimeType: { contains: 'image' } },
    },
    {
      name: 'socials',
      type: 'group',
      label: { it: 'Social', en: 'Socials' },
      fields: [
        social('instagram', 'Instagram'),
        social('facebook', 'Facebook'),
        social('tiktok', 'TikTok'),
        social('spotify', 'Spotify'),
      ],
    },
    seoField,
  ],
}
