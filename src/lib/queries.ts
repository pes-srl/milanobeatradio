import type { Where } from 'payload'
import { payloadClient } from './payload'

const live = { _status: { equals: 'published' } } as const

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

export async function getPost(slug: string) {
  const payload = await payloadClient()
  const res = await payload.find({ collection: 'posts', where: { and: [live, { slug: { equals: slug } }] }, limit: 1, depth: 2 })
  return res.docs[0] ?? null
}

export async function getEvents(opts: { upcoming?: boolean; limit?: number } = {}) {
  const payload = await payloadClient()
  const where: Where = { and: [live] }
  if (opts.upcoming) where.and!.push({ startDate: { greater_than_equal: new Date(Date.now() - 12 * 3600_000).toISOString() } })
  return payload.find({ collection: 'events', where, sort: opts.upcoming ? 'startDate' : '-startDate', limit: opts.limit ?? 20, depth: 1 })
}

export async function getEvent(slug: string) {
  const payload = await payloadClient()
  const res = await payload.find({ collection: 'events', where: { and: [live, { slug: { equals: slug } }] }, limit: 1, depth: 2 })
  return res.docs[0] ?? null
}

export async function getPodcasts(opts: { filter?: string; limit?: number; page?: number } = {}) {
  const payload = await payloadClient()
  const where: Where = { and: [live] }
  if (opts.filter) where.and!.push({ 'filters.slug': { equals: opts.filter } })
  return payload.find({ collection: 'podcasts', where, sort: '-publishedAt', limit: opts.limit ?? 12, page: opts.page ?? 1, depth: 1 })
}

export async function getPodcast(slug: string) {
  const payload = await payloadClient()
  const res = await payload.find({ collection: 'podcasts', where: { and: [live, { slug: { equals: slug } }] }, limit: 1, depth: 2 })
  return res.docs[0] ?? null
}

export async function getShows() {
  const payload = await payloadClient()
  return payload.find({ collection: 'shows', where: live, sort: 'title', limit: 50, depth: 1 })
}

export async function getShow(slug: string) {
  const payload = await payloadClient()
  const res = await payload.find({ collection: 'shows', where: { and: [live, { slug: { equals: slug } }] }, limit: 1, depth: 2 })
  return res.docs[0] ?? null
}

export async function getStaff() {
  const payload = await payloadClient()
  return payload.find({ collection: 'staff', where: live, sort: 'createdAt', limit: 50, depth: 1 })
}

export async function getStaffMember(slug: string) {
  const payload = await payloadClient()
  const res = await payload.find({ collection: 'staff', where: { and: [live, { slug: { equals: slug } }] }, limit: 1, depth: 2 })
  return res.docs[0] ?? null
}

export async function getPartners() {
  const payload = await payloadClient()
  return payload.find({ collection: 'partners', where: { and: [live, { active: { equals: true } }] }, sort: '_order', limit: 50, depth: 1 })
}

export async function getPage(slug: string) {
  const payload = await payloadClient()
  const res = await payload.find({ collection: 'pages', where: { and: [live, { slug: { equals: slug } }] }, limit: 1, depth: 2 })
  return res.docs[0] ?? null
}
