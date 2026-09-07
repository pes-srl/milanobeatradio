import type { Access, CollectionConfig } from 'payload'

/**
 * Admin panel users. Two roles, mirroring the WordPress site:
 * - admin:  everything, including managing users
 * - editor: content only
 */
export type UserRole = 'admin' | 'editor'

const isAdmin: Access = ({ req }) => req.user?.role === 'admin'

/** Admins see everyone; editors only themselves. */
const selfOrAdmin: Access = ({ req }) => {
  if (!req.user) return false
  if (req.user.role === 'admin') return true
  return { id: { equals: req.user.id } }
}

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: { it: 'Utente', en: 'User' }, plural: { it: 'Utenti', en: 'Users' } },
  auth: {
    // 5 failed logins → 15 minutes lock
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
  },
  admin: { useAsTitle: 'email', group: { it: 'Sistema', en: 'System' }, defaultColumns: ['name', 'email', 'role'] },
  access: {
    read: selfOrAdmin,
    create: isAdmin,
    update: selfOrAdmin,
    delete: isAdmin,
    admin: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text', label: { it: 'Nome', en: 'Name' }, required: true },
    {
      name: 'role',
      type: 'select',
      label: { it: 'Ruolo', en: 'Role' },
      required: true,
      defaultValue: 'editor',
      options: [
        { value: 'admin', label: { it: 'Amministratore', en: 'Admin' } },
        { value: 'editor', label: { it: 'Editore', en: 'Editor' } },
      ],
      // Only admins can grant roles.
      access: { update: ({ req }) => req.user?.role === 'admin' },
      admin: { position: 'sidebar' },
    },
    {
      name: 'legacyLogin',
      type: 'text',
      label: { it: 'Login WordPress (legacy)', en: 'WordPress login (legacy)' },
      admin: { readOnly: true, position: 'sidebar', description: { it: 'Usato dalla migrazione per attribuire gli articoli.', en: 'Used by the migration to attribute posts.' } },
    },
  ],
}
