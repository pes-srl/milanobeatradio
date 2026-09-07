/**
 * Creates the admin-panel users from the real WordPress accounts (`<wp:author>` in
 * migration/export.xml), excluding theme-vendor accounts. Each user gets a random
 * temporary password, appended to secrets.local.md (git-ignored); they reset it
 * through "Password dimenticata?" on /admin/login once Resend is active.
 *
 *   pnpm import:users
 *
 * Idempotent: existing emails are updated (name/role), never re-passworded.
 */
import './load-env'

import { randomBytes } from 'node:crypto'
import { appendFileSync, existsSync, readFileSync } from 'node:fs'
import { getPayload } from 'payload'
import payloadConfig from '../payload.config'
import type { UserRole } from '../src/collections/Users'

type WpUser = { login: string; name: string; email: string; role: UserRole }

/** Theme / plugin vendor accounts present in the old site: never migrated. */
const EXCLUDED_LOGINS = new Set(['Igor', 'proradio'])

/** Roles come from wp-admin/users.php (not in the export): verified 2026-09-07. */
const ROLES: Record<string, UserRole> = {
  criss: 'admin',
  'Redazione MBR': 'admin',
  'Alice Fusari': 'editor',
  Selene: 'editor',
  Tommaso: 'editor',
}

function parseAuthors(xml: string): WpUser[] {
  const users: WpUser[] = []
  for (const block of xml.match(/<wp:author>[\s\S]*?<\/wp:author>/g) ?? []) {
    const get = (tag: string) =>
      block.match(new RegExp(`<wp:author_${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</wp:author_${tag}>`))?.[1]?.trim() ?? ''
    const login = get('login')
    if (!login || EXCLUDED_LOGINS.has(login)) continue
    const first = get('first_name')
    const last = get('last_name')
    const name = first && last && !/^reda$/i.test(first) ? `${first} ${last}` : get('display_name')
    users.push({ login, name: name || login, email: get('email').toLowerCase(), role: ROLES[login] ?? 'editor' })
  }
  return users
}

async function run() {
  const xmlPath = 'migration/export.xml'
  if (!existsSync(xmlPath)) throw new Error(`${xmlPath} not found`)
  const users = parseAuthors(readFileSync(xmlPath, 'utf8'))
  const payload = await getPayload({ config: payloadConfig })
  const created: string[] = []

  for (const u of users) {
    const existing = await payload.find({ collection: 'users', where: { email: { equals: u.email } }, limit: 1 })
    const doc = existing.docs[0]
    if (doc) {
      await payload.update({ collection: 'users', id: doc.id, data: { name: u.name, role: u.role, legacyLogin: u.login } })
      payload.logger.info(`updated  ${u.email} (${u.role})`)
      continue
    }
    const password = randomBytes(12).toString('base64url')
    await payload.create({
      collection: 'users',
      data: { email: u.email, password, name: u.name, role: u.role, legacyLogin: u.login },
    })
    created.push(`${u.email.padEnd(34)} ${password}   # ${u.name} · ${u.role}`)
    payload.logger.info(`created  ${u.email} (${u.role})`)
  }

  if (created.length) {
    appendFileSync('secrets.local.md', `\n## Payload users imported ${new Date().toISOString().slice(0, 10)} (temporary passwords)\n${created.join('\n')}\n`)
    payload.logger.info(`${created.length} temporary password(s) appended to secrets.local.md`)
  }
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
