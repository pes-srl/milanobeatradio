/**
 * Builds the legacy-URL redirect map (phase 5) from the database + the known
 * WordPress page inventory, and writes it to `src/redirects.generated.json`.
 *
 *   pnpm generate:redirects
 *
 * Every migrated document stores the exact path it had on the old site (`legacyPath`),
 * so the 301s come from the data, never from a hand-written list. Re-run after importing
 * or after changing any slug, then commit the JSON: `proxy.ts` reads it at request time.
 *
 * Two kinds of entry:
 *   - `redirects`: old path → new path, served as 308 (permanent).
 *   - `gone`: theme demo pages that must return 410, so Google drops them instead of
 *     following a redirect to unrelated content.
 */
import './load-env'

import { writeFileSync } from 'node:fs'
import { getPayload } from 'payload'
import payloadConfig from '../payload.config'

/**
 * Pages that existed on the old site and have a real equivalent now.
 * Keys are written WITHOUT a trailing slash: Next normalises `/foo/` to `/foo` before
 * the proxy runs, so a key like `/flash-news/` would never match — and, worse, entries
 * whose old and new path are identical once normalised would redirect to themselves.
 */
const PAGE_REDIRECTS: Record<string, string> = {
  '/home-07': '/', // the old front page
  '/category/flashnews': '/flash-news',
  '/events-archive': '/eventi',
  '/podcast-archive': '/interviste',
  '/shows-schedule': '/programmi',
  '/team-members': '/staff',
  '/milano-beat-radio': '/chi-siamo',
  '/milano-beat-radio-store': '/', // store page no longer exists; see TASKS-HUMANAS.md
  '/contacts': '/contatti',
  '/privacy-policy-2': '/privacy-policy',
  // /flash-news, /mbr-events, /interviste, /programmi and /promuoviti keep the exact
  // same path on the new site, so they need no redirect at all.
}

/** Pro.Radio demo pages that were indexed by mistake: they must die, not redirect. */
const GONE_PAGES = [
  ...Array.from({ length: 18 }, (_, i) => `/home-${String(i + 1).padStart(2, '0')}`).filter((p) => p !== '/home-07'),
  '/blog-horizontal',
  '/blog-masonry',
  '/blog-no-sidebar',
  '/blog-sidebar',
  '/charts-elementor',
  '/custom-player',
  '/demo-temporary',
  '/donor-dashboard-2',
  '/donor-dashboard-3',
  '/donor-dashboard-4',
  '/events-page-elementor',
  '/markup-and-formatting',
  '/masonry-gallery',
  '/page-with-sidebar',
  '/podcast-page-elementor',
  '/promote',
  '/show-slider',
  '/temporary-templatest-page',
  '/videos-archive',
  '/videos-elementor',
]

/** Content types that were deliberately not migrated (theme demos / unused plugins). */
const GONE_PREFIXES = ['/qtvideo/', '/radiochannel/', '/chart/']

type Collection = 'posts' | 'events' | 'podcasts' | 'shows' | 'staff'
const NEW_BASE: Record<Collection, string> = {
  posts: '/flash-news',
  events: '/eventi',
  podcasts: '/podcast',
  shows: '/programmi',
  staff: '/staff',
}

async function run() {
  const payload = await getPayload({ config: payloadConfig })
  const redirects: Record<string, string> = { ...PAGE_REDIRECTS }
  let fromDb = 0

  for (const collection of Object.keys(NEW_BASE) as Collection[]) {
    const { docs } = await payload.find({ collection, limit: 1000, depth: 0, pagination: false })
    for (const doc of docs) {
      if (!doc.legacyPath || !doc.slug) continue
      const from = doc.legacyPath.replace(/\/$/, '') || '/'
      const to = `${NEW_BASE[collection]}/${doc.slug}`
      if (from === to) continue // path unchanged, no redirect needed
      redirects[from] = to
      fromDb += 1
    }
  }

  const map = {
    generatedAt: new Date().toISOString(),
    redirects,
    gone: [...GONE_PAGES].sort(),
    gonePrefixes: GONE_PREFIXES,
  }

  writeFileSync('src/redirects.generated.json', `${JSON.stringify(map, null, 2)}\n`)
  payload.logger.info(`Wrote src/redirects.generated.json — ${Object.keys(redirects).length} redirects (${fromDb} from the database), ${map.gone.length} gone pages, ${GONE_PREFIXES.length} gone prefixes.`)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
