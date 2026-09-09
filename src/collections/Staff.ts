import type { CollectionConfig } from 'payload'
import { authenticated, isAdmin, publishedOrAuthenticated } from '@/src/access'
import { seoField } from '@/src/fields/seo'
import { slugField } from '@/src/fields/slug'
import { statsField } from '@/src/fields/stats'
import { previewFor } from '@/src/lib/preview'
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
    preview: previewFor((slug) => `/staff/${slug}`),
    description: {
      it: 'Il team: lista su /staff, scheda su /staff/[slug].',
      en: 'The team: list at /staff, detail at /staff/[slug].',
    },
  },
  access: { read: publishedOrAuthenticated, create: isAdmin, update: isAdmin, delete: isAdmin },
  versions,
  fields: [
    { name: 'title', type: 'text', label: { it: 'Nome', en: 'Name' }, required: true },
    slugField(),
    {
      name: 'role',
      type: 'text',
      label: { it: 'Ruolo', en: 'Role' },
      admin: { description: { it: 'Es. Founder, Station Manager, Photographer.', en: 'E.g. Founder, Station Manager, Photographer.' } },
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
        social('linkedin', 'LinkedIn'),
        social('tiktok', 'TikTok'),
        social('spotify', 'Spotify'),
      ],
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
