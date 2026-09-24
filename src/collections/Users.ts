import type { Access, CollectionConfig } from 'payload'
import { APIError } from 'payload'
import type { User } from '@/src/payload-types'
import { hideForNonAdmin } from '@/src/access'
import { sendEmail } from '@/src/lib/resend'

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
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  admin: {
    hidden: hideForNonAdmin,
    useAsTitle: 'email',
    group: { it: 'Sistema', en: 'System' },
    defaultColumns: ['name', 'surname', 'email', 'role', 'active'],
    description: {
      it: 'Chi può entrare in questo pannello. Amministratore: accesso completo, utenti compresi. Editore: solo i contenuti.',
      en: 'Who can sign in to this panel. Administrator: full access, users included. Editor: content only.',
    },
  },
  access: {
    read: selfOrAdmin,
    create: isAdmin,
    update: selfOrAdmin,
    delete: isAdmin,
    admin: ({ req }) => Boolean(req.user) && (req.user as User).active !== false,
  },
  hooks: {
    beforeLogin: [
      async ({ user }) => {
        // Prevent login if account is explicitly disabled
        const u = user as User | undefined
        if (u && u.active === false) {
          throw new APIError('Questo account è disabilitato. Contatta l\'amministratore.', 403, undefined, true)
        }
        return user
      },
    ],
    afterLogin: [
      async ({ req, user }) => {
        const u = user as User | undefined
        // Send email alert only for editor logins
        if (u && u.role === 'editor') {
          try {
            const to = process.env.CONTACT_TO_EMAIL || 'info@milanobeatradio.it'
            const ip =
              req.headers?.get('x-forwarded-for')?.split(',')[0]?.trim() ||
              req.headers?.get('x-real-ip') ||
              'N/D'
            const userAgent = req.headers?.get('user-agent') || 'N/D'

            const now = new Date()
            const formattedDate = new Intl.DateTimeFormat('it-IT', {
              dateStyle: 'full',
              timeStyle: 'medium',
              timeZone: 'Europe/Rome',
            }).format(now)

            const fullName = [u.name, u.surname].filter(Boolean).join(' ') || 'N/D'
            const userEmail = u.email || 'N/D'

            const subject = `[MBR Admin] Accesso Editor: ${fullName}`
            const text = [
              `È stato registrato un nuovo accesso al pannello di amministrazione:`,
              ``,
              `• Utente: ${fullName}`,
              `• Email: ${userEmail}`,
              `• Ruolo: Editore`,
              `• Data e ora: ${formattedDate} (ora italiana)`,
              `• Indirizzo IP: ${ip}`,
              `• Dispositivo/Browser: ${userAgent}`,
            ].join('\n')

            const html = `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; color: #1a1a1a; line-height: 1.5;">
                <h2 style="color: #6366f1; margin-bottom: 16px;">Accesso Editor al Pannello</h2>
                <p>È stato registrato un nuovo accesso al pannello di amministrazione:</p>
                <table style="width: 100%; border-collapse: collapse; margin-top: 16px; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 8px 12px; border: 1px solid #e5e7eb; font-weight: bold; width: 140px; background: #f9fafb;">Utente</td>
                    <td style="padding: 8px 12px; border: 1px solid #e5e7eb;">${fullName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 12px; border: 1px solid #e5e7eb; font-weight: bold; background: #f9fafb;">Email</td>
                    <td style="padding: 8px 12px; border: 1px solid #e5e7eb;"><a href="mailto:${userEmail}">${userEmail}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 12px; border: 1px solid #e5e7eb; font-weight: bold; background: #f9fafb;">Ruolo</td>
                    <td style="padding: 8px 12px; border: 1px solid #e5e7eb;">Editore</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 12px; border: 1px solid #e5e7eb; font-weight: bold; background: #f9fafb;">Data e ora</td>
                    <td style="padding: 8px 12px; border: 1px solid #e5e7eb;">${formattedDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 12px; border: 1px solid #e5e7eb; font-weight: bold; background: #f9fafb;">Indirizzo IP</td>
                    <td style="padding: 8px 12px; border: 1px solid #e5e7eb;"><code>${ip}</code></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 12px; border: 1px solid #e5e7eb; font-weight: bold; background: #f9fafb;">Dispositivo</td>
                    <td style="padding: 8px 12px; border: 1px solid #e5e7eb; font-size: 13px; color: #4b5563;">${userAgent}</td>
                  </tr>
                </table>
                <p style="font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 12px;">
                  Questa notifica è stata generata automaticamente dal sistema di sicurezza di Milano Beat Radio.
                </p>
              </div>
            `

            await sendEmail({
              to,
              subject,
              text,
              html,
            })
          } catch (err) {
            req.payload.logger.error({
              err,
              msg: `Impossibile inviare la notifica di login per l'utente ${u.email}`,
            })
          }
        }
        return user
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', label: { it: 'Nome', en: 'Name' }, required: true },
    { name: 'surname', type: 'text', label: { it: 'Cognome', en: 'Surname' }, required: false },
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
      name: 'active',
      type: 'checkbox',
      label: { it: 'Abilitato all\'accesso', en: 'Access enabled' },
      defaultValue: true,
      required: true,
      // Only admins can enable/disable users.
      access: { update: ({ req }) => req.user?.role === 'admin' },
      admin: {
        position: 'sidebar',
        description: {
          it: 'Se disattivato, l\'utente non potrà accedere al pannello.',
          en: 'If disabled, the user cannot sign in to the panel.',
        },
      },
    },
    {
      name: 'legacyLogin',
      type: 'text',
      label: { it: 'Login WordPress (legacy)', en: 'WordPress login (legacy)' },
      admin: { readOnly: true, position: 'sidebar', description: { it: 'Usato dalla migrazione per attribuire gli articoli.', en: 'Used by the migration to attribute posts.' } },
    },
  ],
}
