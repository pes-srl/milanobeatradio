import type { CollectionConfig } from 'payload'
import { authenticated } from '@/src/access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: { it: 'Utente', en: 'User' }, plural: { it: 'Utenti', en: 'Users' } },
  auth: true,
  admin: { useAsTitle: 'email', group: { it: 'Sistema', en: 'System' } },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    { name: 'name', type: 'text', label: { it: 'Nome', en: 'Name' } },
  ],
}
