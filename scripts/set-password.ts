/**
 * Sets a new admin-panel password for one user, through the Local API so the value
 * is hashed exactly as a real login expects. Needed while the Resend domain is not
 * verified yet and "Password dimenticata?" cannot deliver its email.
 *
 *   pnpm set-password c.dellorto@pes-srl.it            # random password
 *   pnpm set-password c.dellorto@pes-srl.it 'Chosen!1' # a chosen one
 *
 * The password is printed once and appended to secrets.local.md (git-ignored).
 * Passwords are stored hashed: an existing one can never be read back, only replaced.
 */
import './load-env'

import { randomBytes } from 'node:crypto'
import { appendFileSync } from 'node:fs'
import { getPayload } from 'payload'
import payloadConfig from '../payload.config'

async function run() {
  const [email, given] = process.argv.slice(2)
  if (!email) throw new Error('Usage: pnpm set-password <email> [password]')

  const payload = await getPayload({ config: payloadConfig })
  const { docs } = await payload.find({ collection: 'users', where: { email: { equals: email.toLowerCase() } }, limit: 1 })
  const user = docs[0]
  if (!user) throw new Error(`No user with email ${email}`)

  const password = given || randomBytes(12).toString('base64url')
  await payload.update({ collection: 'users', id: user.id, data: { password } })

  const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ')
  appendFileSync('secrets.local.md', `\n## Password reset ${stamp}\n${user.email.padEnd(34)} ${password}   # ${user.name ?? ''} · ${user.role}\n`)
  payload.logger.info(`password set for ${user.email} (${user.role}) — also appended to secrets.local.md`)
  console.log(`\n  ${user.email}\n  ${password}\n`)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
