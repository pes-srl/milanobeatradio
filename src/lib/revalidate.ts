import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

/**
 * On-demand revalidation for the pre-rendered detail pages.
 *
 * The detail pages are static (generateStaticParams + a long `revalidate`), so serverless
 * functions never wake up for readers. When an editor saves, publishes, unpublishes or
 * deletes a document, these hooks purge exactly the affected paths and the CDN serves the
 * fresh version on the next request.
 */
type Config = {
  /** Public URL prefix of the detail page, e.g. '/flash-news'. */
  detailBase: string
  /** Listing pages that show this collection, e.g. ['/flash-news', '/']. */
  lists: string[]
}

function purge(config: Config, slugs: Array<string | null | undefined>) {
  try {
    for (const slug of new Set(slugs)) {
      if (slug) revalidatePath(`${config.detailBase}/${slug}`)
    }
    for (const list of config.lists) revalidatePath(list)
  } catch {
    // Outside a Next request (import scripts, seed, CLI) there is no cache to purge.
  }
}

export const revalidateAfterChange =
  (config: Config): CollectionAfterChangeHook =>
  ({ doc, previousDoc }) => {
    // Previous slug too: if it was renamed, the old URL must stop serving the stale page.
    purge(config, [doc?.slug, previousDoc?.slug])
    return doc
  }

export const revalidateAfterDelete =
  (config: Config): CollectionAfterDeleteHook =>
  ({ doc }) => {
    purge(config, [doc?.slug])
    return doc
  }
