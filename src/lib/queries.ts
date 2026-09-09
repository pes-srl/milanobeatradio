import type { CollectionSlug, Where } from 'payload'
import { payloadClient } from './payload'

const live = { _status: { equals: 'published' } } as const

/**
 * One document by slug. With `draft` (the admin "Anteprima" button, via Next draft mode)
 * the newest version is returned instead of the published one, so an editor can see an
 * unpublished piece before it goes out. Access is overridden only on that path: the
 * request comes from the site, which has no Payload session of its own.
 */
async function bySlug<T extends CollectionSlug>(collection: T, slug: string, draft: boolean) {
  const payload = await payloadClient()
  const where: Where = draft ? { slug: { equals: slug } } : { and: [live, { slug: { equals: slug } }] }
  const res = await payload.find({ collection, where, limit: 1, depth: 2, draft, overrideAccess: draft })
  return res.docs[0] ?? null
}

export async function getSite() {
  const payload = await payloadClient()
  return payload.findGlobal({ slug: 'site', depth: 1 })
}

export async function getPosts(opts: { limit?: number; page?: number; category?: string } = {}) {
  const payload = await payloadClient()
  const where: Where = { and: [live] }
  if (opts.category) where.and!.push({ 'category.slug': { equals: opts.category } })
  return payload.find({ collection: 'posts', where, sort: '-publishedAt', limit: opts.limit ?? 12, page: opts.page ?? 1, depth: 1 })
}

export async function getPost(slug: string, draft = false) {
  return bySlug('posts', slug, draft)
}

export async function getEvents(opts: { upcoming?: boolean; limit?: number; minCount?: number } = {}) {
  const payload = await payloadClient()

  if (opts.upcoming) {
    const upcomingWhere: Where = {
      and: [
        live,
        { startDate: { greater_than_equal: new Date(Date.now() - 12 * 3600_000).toISOString() } },
      ],
    }
    const res = await payload.find({
      collection: 'events',
      where: upcomingWhere,
      sort: 'startDate',
      limit: opts.limit ?? 20,
      depth: 1,
    })

    const min = opts.minCount ?? 0
    const maxLimit = opts.limit ?? 20
    if (min > 0 && res.docs.length < min) {
      const allRecent = await payload.find({
        collection: 'events',
        where: { and: [live] },
        sort: '-startDate',
        limit: maxLimit,
        depth: 1,
      })
      const seenIds = new Set(res.docs.map((d) => d.id))
      for (const doc of allRecent.docs) {
        if (!seenIds.has(doc.id) && res.docs.length < maxLimit) {
          seenIds.add(doc.id)
          res.docs.push(doc)
        }
      }
    }
    if (opts.limit && res.docs.length > opts.limit) {
      res.docs = res.docs.slice(0, opts.limit)
    }
    return res
  }

  const where: Where = { and: [live] }
  return payload.find({ collection: 'events', where, sort: '-startDate', limit: opts.limit ?? 50, depth: 1 })
}

export async function getEvent(slug: string, draft = false) {
  return bySlug('events', slug, draft)
}

export async function getPodcasts(opts: { filter?: string; limit?: number; page?: number } = {}) {
  const payload = await payloadClient()
  const where: Where = { and: [live] }
  if (opts.filter) where.and!.push({ 'filters.slug': { equals: opts.filter } })
  return payload.find({ collection: 'podcasts', where, sort: '-publishedAt', limit: opts.limit ?? 12, page: opts.page ?? 1, depth: 1 })
}

export async function getPodcast(slug: string, draft = false) {
  return bySlug('podcasts', slug, draft)
}

export async function getShows() {
  const payload = await payloadClient()
  return payload.find({ collection: 'shows', where: live, sort: 'title', limit: 50, depth: 1 })
}

export async function getShow(slug: string, draft = false) {
  return bySlug('shows', slug, draft)
}

export async function getStaff() {
  const payload = await payloadClient()
  return payload.find({ collection: 'staff', where: live, sort: 'createdAt', limit: 50, depth: 1 })
}

export async function getStaffMember(slug: string, draft = false) {
  return bySlug('staff', slug, draft)
}

export async function getPartners() {
  const payload = await payloadClient()
  return payload.find({ collection: 'partners', where: { and: [live, { active: { equals: true } }] }, sort: '_order', limit: 50, depth: 1 })
}

export async function getPage(slug: string, draft = false) {
  return bySlug('pages', slug, draft)
}

export async function getMediaByFilename(filename: string) {
  const payload = await payloadClient()
  const res = await payload.find({
    collection: 'media',
    where: {
      or: [
        { filename: { equals: filename } },
        { filename: { like: filename } },
        { legacyUrl: { contains: filename } },
      ],
    },
    limit: 1,
    depth: 1,
  })
  return res.docs[0] ?? null
}
