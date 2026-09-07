/**
 * Moves podcast MP3s off the old WordPress server and onto R2.
 *
 * After the content import, every podcast's `audioUrl` still points at
 * milanobeatradio.it/wp-content/uploads/... — if that host goes away, all podcast
 * audio breaks. This downloads each file, stores it as a media document (so it lands
 * on R2 through the normal upload path) and repoints the podcast at `audioFile`.
 *
 * Idempotent: podcasts already holding an audioFile are skipped.
 *
 *   pnpm migrate:podcast-audio
 */
import './load-env'

import { getPayload } from 'payload'
import payloadConfig from '../payload.config'

async function run() {
  if (process.env.R2_ENABLED === 'false' || !process.env.R2_ACCOUNT_ID) {
    throw new Error('R2 is disabled or R2_ACCOUNT_ID is missing — set R2_ENABLED=true and the R2_* vars first.')
  }

  const payload = await getPayload({ config: payloadConfig })
  const { docs } = await payload.find({ collection: 'podcasts', limit: 200, depth: 0 })

  let migrated = 0
  let skipped = 0
  const failed: string[] = []

  for (const doc of docs) {
    if (doc.audioFile) {
      skipped += 1
      continue
    }
    const source = doc.audioUrl
    if (!source || !source.startsWith('http')) {
      skipped += 1
      continue
    }

    try {
      const res = await fetch(source, { headers: { 'user-agent': 'mbr-migration/1.0' } })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = Buffer.from(await res.arrayBuffer())
      const name = decodeURIComponent(source.split('/').pop() ?? `${doc.slug}.mp3`)

      // Reuse an already-imported file if this script ran before and only partly finished.
      const existing = await payload.find({ collection: 'media', where: { legacyUrl: { equals: source } }, limit: 1, depth: 0 })
      const media =
        existing.docs[0] ??
        (await payload.create({
          collection: 'media',
          data: { alt: doc.title, legacyUrl: source },
          file: { data, mimetype: 'audio/mpeg', name, size: data.length },
        }))

      await payload.update({
        collection: 'podcasts',
        id: doc.id,
        // audioUrl stays as the legacy reference; audioFile is what the site now plays.
        data: { audioFile: media.id },
      })
      migrated += 1
      payload.logger.info(`migrated ${migrated}: ${name} (${(data.length / 1024 / 1024).toFixed(1)} MB)`)
    } catch (err) {
      failed.push(doc.title)
      payload.logger.error(`failed: ${doc.title} — ${(err as Error).message}`)
    }
  }

  payload.logger.info(`Done. migrated=${migrated} skipped=${skipped} failed=${failed.length}`)
  if (failed.length) payload.logger.info(`Failed: ${failed.join(', ')}`)
  process.exit(failed.length ? 1 : 0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
