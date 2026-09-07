/**
 * Moves every local media document to R2 by re-running its ORIGINAL file through
 * Payload's normal upload path (payload.update with a `file`). That is exactly what
 * happens for a new upload: the s3Storage adapter regenerates thumb/card/hero sizes
 * with sharp and pushes all of them to R2, and Payload rewrites the doc's url/sizes
 * fields to the R2 public URL. No need to reverse-engineer the storage plugin's key
 * layout by hand.
 *
 * NOTE: once R2_ENABLED=true, Payload's `generateFileURL` computes every doc's `url`
 * as an R2 URL on READ, regardless of whether the object was actually uploaded — so
 * `doc.url` cannot be used to detect "already migrated". This script re-uploads every
 * document unconditionally; it is idempotent (same content, same key) so running it
 * twice is harmless, just redundant bandwidth.
 *
 * Requires R2_ENABLED=true and valid R2 credentials in .env.local.
 *
 *   pnpm migrate:media-to-r2
 */
import './load-env'

import { readFileSync, existsSync } from 'node:fs'
import { getPayload } from 'payload'
import payloadConfig from '../payload.config'

const MIME: Record<string, string> = {
  webp: 'image/webp',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  mp3: 'audio/mpeg',
  pdf: 'application/pdf',
}

async function run() {
  if (process.env.R2_ENABLED === 'false' || !process.env.R2_ACCOUNT_ID) {
    throw new Error('R2 is disabled or R2_ACCOUNT_ID is missing — set R2_ENABLED=true and the R2_* vars first.')
  }

  const payload = await getPayload({ config: payloadConfig })
  let page = 1
  let migrated = 0
  let skipped = 0
  const failed: string[] = []

  for (;;) {
    const { docs, hasNextPage } = await payload.find({ collection: 'media', limit: 25, page, depth: 0 })
    if (docs.length === 0) break

    for (const doc of docs) {
      const filename = doc.filename
      if (!filename) {
        skipped += 1
        continue
      }
      // A doc migrated by an earlier partial run got renamed by Payload's collision
      // resolver (e.g. MHF.webp -> MHF-1.webp) while the local file kept its old name.
      // Fall back to stripping that "-<n>" suffix to find the original on disk.
      let localPath = `media/${filename}`
      if (!existsSync(localPath)) {
        const dashN = filename.replace(/-\d+(\.\w+)$/, '$1')
        if (dashN !== filename && existsSync(`media/${dashN}`)) localPath = `media/${dashN}`
      }
      if (!existsSync(localPath)) {
        payload.logger.warn(`missing local file, skipping: ${localPath}`)
        failed.push(filename)
        continue
      }
      const ext = filename.split('.').pop()?.toLowerCase() ?? ''
      try {
        const data = readFileSync(localPath)
        await payload.update({
          collection: 'media',
          id: doc.id,
          data: {},
          file: { data, mimetype: MIME[ext] ?? 'application/octet-stream', name: filename, size: data.length },
        })
        migrated += 1
        payload.logger.info(`migrated ${migrated}: ${filename}`)
      } catch (err) {
        failed.push(filename)
        payload.logger.error(`failed: ${filename} — ${(err as Error).message}`)
      }
    }

    if (!hasNextPage) break
    page += 1
  }

  payload.logger.info(`Done. migrated=${migrated} skipped(already on R2)=${skipped} failed=${failed.length}`)
  if (failed.length) payload.logger.info(`Failed files: ${failed.join(', ')}`)
  process.exit(failed.length ? 1 : 0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
