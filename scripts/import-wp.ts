/**
 * WordPress → Payload import (phase 2 + media of phase 3).
 *
 *   pnpm import:wp            # everything
 *   pnpm import:wp posts      # one step: media-site | taxonomies | staff | shows | posts | events | podcasts | partners | pages
 *
 * Source: migration/export.xml (WXR). Only `<wp:status>publish` items are migrated
 * (client decision 2026-09-07: drafts are ignored). Pro.Radio fields live ONLY in
 * <wp:postmeta>. Idempotent: documents are matched by `legacyPath` / `legacyUrl`.
 *
 * Media: only files referenced by migrated documents are downloaded (orphan filtering),
 * uploaded through Payload so sizes/WebP are generated, and stored wherever the media
 * collection is configured (local ./media until the R2 write token exists).
 */
import './load-env'

import { readFileSync, appendFileSync } from 'node:fs'
import { JSDOM } from 'jsdom'
import { unserialize } from 'php-serialize'
import { getPayload, type Payload } from 'payload'
import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import payloadConfig from '../payload.config'
import { slugify } from '../src/fields/slug'

// ----------------------------------------------------------------------------
// WXR parsing (regex-based on purpose: the export is 18 MB of CDATA-heavy XML and
// every field we need is a flat tag or a meta key/value pair).
// ----------------------------------------------------------------------------
type Item = { raw: string; id: string; type: string; status: string; title: string; slug: string; link: string; content: string; excerpt: string; dateGmt: string; creator: string; menuOrder: number; meta: Record<string, string>; terms: { domain: string; slug: string; name: string }[] }

const xml = readFileSync('migration/export.xml', 'utf8')
const tag = (src: string, name: string) => {
  const m = src.match(new RegExp(`<${name}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${name}>`))
  return m?.[1] ?? ''
}
const parseItem = (raw: string): Item => {
  const meta: Record<string, string> = {}
  for (const m of raw.matchAll(/<wp:meta_key><!\[CDATA\[([\s\S]*?)\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[([\s\S]*?)\]\]><\/wp:meta_value>/g)) meta[m[1]!] = m[2]!
  const terms = [...raw.matchAll(/<category domain="([^"]+)" nicename="([^"]+)"><!\[CDATA\[([\s\S]*?)\]\]><\/category>/g)].map((m) => ({ domain: m[1]!, slug: m[2]!, name: m[3]! }))
  return {
    raw,
    id: tag(raw, 'wp:post_id'),
    type: tag(raw, 'wp:post_type'),
    status: tag(raw, 'wp:status'),
    title: decodeEntities(tag(raw, 'title')),
    slug: tag(raw, 'wp:post_name'),
    link: tag(raw, 'link'),
    content: tag(raw, 'content:encoded'),
    excerpt: tag(raw, 'excerpt:encoded'),
    dateGmt: tag(raw, 'wp:post_date_gmt'),
    creator: tag(raw, 'dc:creator'),
    menuOrder: Number(tag(raw, 'wp:menu_order') || 0),
    meta,
    terms,
  }
}
const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => parseItem(m[1]!))
const byId = new Map(items.map((i) => [i.id, i]))
const published = (type: string) => items.filter((i) => i.type === type && i.status === 'publish')
const attachmentUrl = (id?: string) => (id ? tag(byId.get(id)?.raw ?? '', 'wp:attachment_url') || null : null)

/** Term names as defined in the channel (<wp:category>, <wp:term>). */
const termNames = new Map<string, string>()
for (const m of xml.matchAll(/<wp:category>[\s\S]*?<wp:category_nicename><!\[CDATA\[(.*?)\]\]>[\s\S]*?<wp:cat_name><!\[CDATA\[(.*?)\]\]>[\s\S]*?<\/wp:category>/g)) termNames.set(`category:${m[1]}`, decodeEntities(m[2]!))
for (const m of xml.matchAll(/<wp:term>[\s\S]*?<wp:term_taxonomy><!\[CDATA\[(.*?)\]\]>[\s\S]*?<wp:term_slug><!\[CDATA\[(.*?)\]\]>[\s\S]*?<wp:term_name><!\[CDATA\[(.*?)\]\]>[\s\S]*?<\/wp:term>/g)) termNames.set(`${m[1]}:${m[2]}`, decodeEntities(m[3]!))

function decodeEntities(s: string) {
  return s.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#8217;|&rsquo;/g, '’').replace(/&#8220;|&ldquo;/g, '“').replace(/&#8221;|&rdquo;/g, '”').replace(/&nbsp;/g, ' ')
}

/** Old-site path, normalised (no host, no ?swcfpc=1, trailing slash). */
const legacyPath = (link: string) => {
  try {
    const u = new URL(link)
    return u.pathname.endsWith('/') ? u.pathname : `${u.pathname}/`
  } catch {
    return link
  }
}

/** Europe/Rome wall time → ISO UTC. */
const romeIso = (date: string, time = '00:00') => {
  const probe = new Date(`${date}T${time}:00Z`)
  const offsetMin = (new Date(probe.toLocaleString('en-US', { timeZone: 'Europe/Rome' })).getTime() - new Date(probe.toLocaleString('en-US', { timeZone: 'UTC' })).getTime()) / 60_000
  return new Date(probe.getTime() - offsetMin * 60_000).toISOString()
}
const gmtIso = (dateGmt: string) => (dateGmt && !dateGmt.startsWith('0000') ? new Date(`${dateGmt.replace(' ', 'T')}Z`).toISOString() : new Date().toISOString())

// ----------------------------------------------------------------------------
// Payload helpers
// ----------------------------------------------------------------------------
type Ctx = { payload: Payload; editorConfig: Awaited<ReturnType<typeof editorConfigFactory.default>>; mediaCache: Map<string, number | null>; log: (s: string) => void }

const UPLOADS = 'https://milanobeatradio.it/wp-content/uploads/'
const SIZE_SUFFIX = /-\d{2,4}x\d{2,4}(?=\.[a-z]{3,4}$)/i

/** Download one legacy upload and create a media doc (cached by legacyUrl). Returns the media id or null. */
async function importMedia(ctx: Ctx, url: string | null | undefined, alt: string): Promise<number | null> {
  if (!url || !url.startsWith(UPLOADS)) return null
  const original = url.replace(SIZE_SUFFIX, '')
  if (ctx.mediaCache.has(original)) return ctx.mediaCache.get(original)!
  const existing = await ctx.payload.find({ collection: 'media', where: { legacyUrl: { equals: original } }, limit: 1, depth: 0 })
  if (existing.docs[0]) {
    ctx.mediaCache.set(original, existing.docs[0].id)
    return existing.docs[0].id
  }
  const candidates = original === url ? [original] : [original, url]
  for (const candidate of candidates) {
    try {
      const res = await fetch(candidate, { headers: { 'user-agent': 'mbr-migration/1.0' } })
      if (!res.ok) continue
      const data = Buffer.from(await res.arrayBuffer())
      const mimetype = res.headers.get('content-type')?.split(';')[0] || 'application/octet-stream'
      const name = decodeURIComponent(candidate.split('/').pop()!)
      const doc = await ctx.payload.create({
        collection: 'media',
        data: { alt: alt.slice(0, 200) || name, legacyUrl: original },
        file: { data, mimetype, name, size: data.length },
      })
      ctx.mediaCache.set(original, doc.id)
      ctx.log(`  media + ${name} (${(data.length / 1024).toFixed(0)} KB)`)
      return doc.id
    } catch (err) {
      ctx.log(`  media ! ${candidate}: ${(err as Error).message}`)
    }
  }
  ctx.mediaCache.set(original, null)
  appendFileSync('MIGRATION-NOTES.md', `\n- media non scaricabile: ${original}`)
  return null
}

/** Clean legacy HTML: WP block comments, data-* attrs, srcset; inline images → /media/<file>. */
async function htmlToLexical(ctx: Ctx, html: string) {
  let clean = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|iframe|video|audio|object|embed|form|svg)[\s\S]*?<\/\1>/gi, '')
    .replace(/<\/?(figure|figcaption|div|span|section|article|font|center)[^>]*>/gi, '')
    .replace(/<table[\s\S]*?<\/table>/gi, (t) => t.replace(/<\/(td|th|tr)>/gi, ' ').replace(/<[^>]+>/g, '').trim() ? `<p>${t.replace(/<\/(td|th)>/gi, ' · ').replace(/<\/tr>/gi, '</p><p>').replace(/<[^>]+>/g, '')}</p>` : '')
    .replace(/<(h[1-6])[^>]*>\s*<\/\1>/gi, '')
    .replace(/<p[^>]*>(\s|&nbsp;)*<\/p>/gi, '')
    .replace(/\s(?:srcset|sizes|decoding|loading|data-[\w-]+)="[^"]*"/g, '')
    .replace(/\[caption[^\]]*\]([\s\S]*?)\[\/caption\]/g, '$1')
    .replace(/\[\/?[a-z_]+[^\]]*\]/g, '') // leftover shortcodes
  // Inline images → Lexical upload nodes (the converter reads data-lexical-upload-* attributes).
  for (const m of [...clean.matchAll(/<img\b[^>]*\bsrc="([^"]+)"[^>]*>/g)]) {
    const src = m[1]!
    const id = src.startsWith(UPLOADS) ? await importMedia(ctx, src, '') : null
    clean = clean.replace(m[0], id ? `<img data-lexical-upload-relation-to="media" data-lexical-upload-id="${id}" src="${src}">` : '')
  }
  // An <img> wrapped in <a> or <p> must stand alone: upload nodes are block-level.
  clean = clean.replace(/<a\b[^>]*>\s*(<img[^>]*>)\s*<\/a>/gi, '$1').replace(/<p\b[^>]*>\s*(<img[^>]*>)\s*<\/p>/gi, '$1')
  // Classic editor: double newlines are paragraphs.
  if (!/<p[\s>]/.test(clean)) clean = clean.split(/\n{2,}/).map((p) => `<p>${p.trim()}</p>`).join('')
  const state = convertHTMLToLexical({ editorConfig: ctx.editorConfig, html: clean, JSDOM })
  coerceUploadIds(state.root)
  hoistUploadsOutOfParagraphs(state.root as LexNode)
  return state
}

/** Postgres ids are numbers; the DOM importer yields strings. */
function coerceUploadIds(node: unknown) {
  if (!node || typeof node !== 'object') return
  const n = node as { type?: string; value?: unknown; children?: unknown[] }
  if (n.type === 'upload' && typeof n.value === 'string' && /^\d+$/.test(n.value)) n.value = Number(n.value)
  for (const c of n.children ?? []) coerceUploadIds(c)
}

type LexNode = { type?: string; children?: LexNode[]; [k: string]: unknown }

/**
 * An <img> inline inside a WordPress paragraph converts to an upload node nested inside a
 * paragraph node. Our upload renderer emits a block-level <figure>, and <figure> cannot be
 * a descendant of <p> — invalid HTML that Chrome silently repairs, causing a hydration
 * mismatch. Fix at the tree level: hoist every upload node out of its paragraph, splitting
 * the paragraph around it so surrounding text keeps its own paragraph.
 */
function hoistUploadsOutOfParagraphs(root: LexNode) {
  const out: LexNode[] = []
  for (const child of root.children ?? []) {
    if (child.type !== 'paragraph' || !child.children?.some((c) => c.type === 'upload')) {
      out.push(child)
      continue
    }
    let bucket: LexNode[] = []
    const flush = () => {
      if (bucket.length) out.push({ ...child, children: bucket })
      bucket = []
    }
    for (const inline of child.children ?? []) {
      if (inline.type === 'upload') {
        flush()
        out.push(inline)
      } else {
        bucket.push(inline)
      }
    }
    flush()
  }
  root.children = out
}

/** Plain-text fallback: one Lexical paragraph per source paragraph. */
const plainLexical = (ctx: Ctx, html: string) => {
  const paragraphs = html.split(/<\/p>|<br\s*\/?>|\n{2,}/i).map((p) => textOf(p)).filter(Boolean)
  return convertHTMLToLexical({ editorConfig: ctx.editorConfig, html: paragraphs.map((p) => `<p>${p.replace(/</g, '&lt;')}</p>`).join(''), JSDOM })
}

/**
 * Engagement counters from the Pro.Radio theme. Historical values only: they are
 * imported once so the numbers on the new cards match what readers saw before.
 */
const readStats = (item: Item) => ({
  views: Number(item.meta.proradio_reaktions_views ?? 0) || 0,
  likes: Number(item.meta.proradio_reaktions_votes_count ?? 0) || 0,
  shares: Number(item.meta.proradio_reaktions_shares_count ?? 0) || 0,
})

const textOf = (html: string) => decodeEntities(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
const excerptOf = (item: Item) => textOf(item.excerpt || item.content).slice(0, 280)

async function upsertByLegacy<T extends 'posts' | 'events' | 'podcasts' | 'shows' | 'staff'>(ctx: Ctx, collection: T, path: string, data: Record<string, unknown>, html = '') {
  if (html) sourceHtml.set(data, html)
  const existing = await ctx.payload.find({ collection, where: { legacyPath: { equals: path } }, limit: 1, depth: 0 })
  const save = async (d: Record<string, unknown>) => {
    const payloadData = { ...d, legacyPath: path } as never
    if (existing.docs[0]) return (await ctx.payload.update({ collection, id: existing.docs[0].id, data: payloadData, draft: false })).id
    return (await ctx.payload.create({ collection, data: payloadData, draft: false })).id
  }
  try {
    return await save(data)
  } catch (err) {
    const e = err as { data?: { errors?: { path?: string; message?: string }[] } }
    const fields = e.data?.errors?.map((x) => `${x.path}: ${x.message}`).join('; ') ?? (err as Error).message
    const richKey = (['content', 'description', 'bio'] as const).find((k) => k in data && e.data?.errors?.some((x) => x.path === k))
    if (richKey && sourceHtml.has(data)) {
      ctx.log(`  ! ${collection} ${path} rich text rejected (${fields}) → plain-text fallback`)
      appendFileSync('MIGRATION-NOTES.md', `\n- rich text semplificato (fallback testo): ${collection} ${path} — ${fields}`)
      return await save({ ...data, [richKey]: plainLexical(ctx, sourceHtml.get(data)!) })
    }
    throw new Error(`${collection} ${path}: ${fields}`)
  }
}
/** Original HTML of the rich field, remembered per data object for the fallback path. */
const sourceHtml = new WeakMap<Record<string, unknown>, string>()

async function upsertTerm(ctx: Ctx, collection: 'categories' | 'event-types' | 'podcast-filters' | 'genres', slug: string, name: string) {
  const existing = await ctx.payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, depth: 0 })
  if (existing.docs[0]) return existing.docs[0].id
  return (await ctx.payload.create({ collection, data: { name, slug } })).id
}

const termIds = async (ctx: Ctx, item: Item, domain: string, collection: 'categories' | 'event-types' | 'podcast-filters' | 'genres') => {
  const ids: number[] = []
  for (const t of item.terms.filter((t) => t.domain === domain)) ids.push(await upsertTerm(ctx, collection, t.slug, termNames.get(`${domain}:${t.slug}`) ?? t.name))
  return ids
}

// ----------------------------------------------------------------------------
// Steps
// ----------------------------------------------------------------------------
async function stepSiteAssets(ctx: Ctx) {
  const u = (p: string) => `${UPLOADS}2020/06/${p}`
  const logo = await importMedia(ctx, `${UPLOADS}2021/04/Logo-solo-cerchio-no-sfondo-bianco-600-600.png`, 'Milano Beat Radio')
  // Home hero slideshow (order as on the live site). The theme demo asset EVENT-radio-wordpress-theme-64.jpg is excluded on purpose.
  const heroSlides: number[] = []
  for (const p of ['2020/06/8.png', '2020/06/Milano-Beat-Radio-metro.jpg', '2020/06/9.png', '2025/12/Fontana-di-Galatea-Villa-Litta.png', '2020/06/2.png', '2020/06/11.png', '2020/06/3.png', '2020/06/5.png', '2020/06/4.png', '2020/06/7.png', '2020/06/10.png', '2020/06/1.png', '2020/06/6.png']) {
    const id = await importMedia(ctx, `${UPLOADS}${p}`, 'Milano Beat Radio')
    if (id) heroSlides.push(id)
  }
  const gallery: number[] = []
  for (const n of ['5', '7', '2', '10', '1', '11', '3', '8']) {
    const id = await importMedia(ctx, u(`${n}.png`), 'Milano Beat Radio in città')
    if (id) gallery.push(id)
  }
  const mbrHero = await importMedia(ctx, u('MBR-EVENTS-COVER-per-SITO.png'), 'MBR Events')
  const posters: number[] = []
  for (const n of ['2-1', '3-1', '4b', '5-2', '6-2', '10-per-sito']) {
    const id = await importMedia(ctx, u(`${n}.png`), 'MBR Events')
    if (id) posters.push(id)
  }
  await ctx.payload.updateGlobal({
    slug: 'site',
    data: {
      logo,
      heroSlides: heroSlides.map((image) => ({ image })),
      claim: 'Your Event and Party Station',
      hashtag: '#MBRFRIENDS',
      licenseText: 'Licenza Siae n° 5776/I/5533 - Licenza SCF n° 812/17',
      gallery: gallery.map((image) => ({ image })),
      mbrEventsHero: mbrHero,
      mbrEventsPosters: posters.map((image) => ({ image })),
      instagram: 'https://instagram.com/milanobeatradio_mbr',
      facebook: 'https://facebook.com/milanobeatradio',
    },
  })
  ctx.log(`site global: logo ${logo}, hero slides ${heroSlides.length}, gallery ${gallery.length}, posters ${posters.length}`)
}

async function stepTaxonomies(ctx: Ctx) {
  // Only terms actually used by published items (the 8 empty categories are never created).
  let n = 0
  for (const p of published('post')) n += (await termIds(ctx, p, 'category', 'categories')).length
  for (const e of published('event')) n += (await termIds(ctx, e, 'eventtype', 'event-types')).length
  for (const p of published('podcast')) n += (await termIds(ctx, p, 'podcastfilter', 'podcast-filters')).length
  for (const s of published('shows')) n += (await termIds(ctx, s, 'genre', 'genres')).length
  ctx.log(`taxonomies: ${n} term links processed`)
}

const userIds = new Map<string, number>()
async function loadUsers(ctx: Ctx) {
  const users = await ctx.payload.find({ collection: 'users', limit: 100, depth: 0 })
  for (const u of users.docs) if (u.legacyLogin) userIds.set(u.legacyLogin, u.id)
}

async function stepStaff(ctx: Ctx) {
  for (const m of published('members')) {
    const title = m.title.replace(/fiduccia/i, 'fiducia')
    const id = await upsertByLegacy(ctx, 'staff', legacyPath(m.link), {
      title,
      slug: m.slug,
      role: m.meta.member_role || undefined,
      bio: m.content.trim() ? await htmlToLexical(ctx, m.content) : undefined,
      photo: await importMedia(ctx, attachmentUrl(m.meta._thumbnail_id), title),
      socials: {
        instagram: m.meta.QT_instagram && m.meta.QT_instagram !== '#' ? m.meta.QT_instagram : undefined,
        facebook: m.meta.QT_facebook && m.meta.QT_facebook !== '#' ? m.meta.QT_facebook : undefined,
        linkedin: m.meta.QT_linkedin && m.meta.QT_linkedin !== '#' ? m.meta.QT_linkedin : undefined,
      },
      stats: readStats(m),
      _status: 'published',
    }, m.content)
    ctx.log(`staff ${title} → ${id}`)
  }
}

/** Schedule CPT: one item per weekday, slots serialized in `track_repeatable` (show_id + times). */
function scheduleSlots(): Map<string, { dayOfWeek: string; start: string; end: string }[]> {
  const dayMap: Record<string, string> = { mon: '1', tue: '2', wed: '3', thu: '4', fri: '5', sat: '6', sun: '0' }
  const out = new Map<string, { dayOfWeek: string; start: string; end: string }[]>()
  for (const s of published('schedule')) {
    const day = (unserialize(s.meta.week_day ?? 'a:0:{}') as string[])[0]
    const dow = dayMap[day ?? '']
    if (!dow) continue
    const rows = unserialize(s.meta.track_repeatable ?? 'a:0:{}') as Record<string, { show_id: string[]; show_time: string; show_time_end: string }>
    for (const row of Object.values(rows)) {
      const showId = row.show_id?.[0]
      if (!showId || !row.show_time || !row.show_time_end) continue
      if (!out.has(showId)) out.set(showId, [])
      out.get(showId)!.push({ dayOfWeek: dow, start: row.show_time, end: row.show_time_end })
    }
  }
  return out
}

async function stepShows(ctx: Ctx) {
  const slots = scheduleSlots()
  for (const s of published('shows')) {
    const id = await upsertByLegacy(ctx, 'shows', legacyPath(s.link), {
      title: s.title,
      slug: slugify(s.title), // clean slug (legacy one like "detroit-sessions" is kept in legacyPath for 301s)
      subtitle: s.meta.subtitle || undefined,
      description: s.content.trim() ? await htmlToLexical(ctx, s.content) : undefined,
      cover: await importMedia(ctx, attachmentUrl(s.meta._thumbnail_id), s.title),
      genres: await termIds(ctx, s, 'genre', 'genres'),
      slots: (slots.get(s.id) ?? []).sort((a, b) => a.dayOfWeek.localeCompare(b.dayOfWeek) || a.start.localeCompare(b.start)),
      stats: readStats(s),
      _status: 'published',
    }, s.content)
    ctx.log(`show ${s.title} (${(slots.get(s.id) ?? []).length} slots) → ${id}`)
  }
}

async function stepPosts(ctx: Ctx) {
  const posts = published('post')
  let i = 0
  for (const p of posts) {
    i += 1
    const id = await upsertByLegacy(ctx, 'posts', legacyPath(p.link), {
      title: p.title,
      slug: p.slug,
      excerpt: excerptOf(p),
      content: await htmlToLexical(ctx, p.content),
      cover: await importMedia(ctx, attachmentUrl(p.meta._thumbnail_id), p.title),
      category: await termIds(ctx, p, 'category', 'categories'),
      author: userIds.get(p.creator),
      stats: readStats(p),
      publishedAt: gmtIso(p.dateGmt),
      seo: { description: p.meta.rank_math_description?.slice(0, 160) || undefined, title: p.meta.rank_math_title?.replace(/%.*$/, '').trim().slice(0, 70) || undefined },
      _status: 'published',
    }, p.content)
    ctx.log(`post ${i}/${posts.length} ${p.title.slice(0, 50)} → ${id}`)
  }
}

async function stepEvents(ctx: Ctx) {
  for (const e of published('event')) {
    const m = e.meta
    if (!m.proradio_date) {
      appendFileSync('MIGRATION-NOTES.md', `\n- evento senza data, saltato: ${e.title}`)
      continue
    }
    const id = await upsertByLegacy(ctx, 'events', legacyPath(e.link), {
      title: e.title,
      slug: e.slug,
      content: e.content.trim() ? await htmlToLexical(ctx, e.content) : undefined,
      cover: await importMedia(ctx, attachmentUrl(m._thumbnail_id), e.title),
      startDate: romeIso(m.proradio_date, m.proradio_time || '00:00'),
      startDate_tz: 'Europe/Rome',
      endDate: m.proradio_date_end ? romeIso(m.proradio_date_end, m.proradio_time_end || '00:00') : undefined,
      endDate_tz: 'Europe/Rome',
      artists: m.proradio_artists || undefined,
      venueName: m.proradio_location || m.qt_location || undefined,
      city: m.proradio_city || m.qt_city || 'Milano',
      address: m.proradio_address || undefined,
      externalUrl: m.proradio_link || undefined,
      eventType: (await termIds(ctx, e, 'eventtype', 'event-types'))[0],
      stats: readStats(e),
      publishedAt: gmtIso(e.dateGmt),
      _status: 'published',
    }, e.content)
    ctx.log(`event ${e.title.slice(0, 50)} → ${id}`)
  }
}

async function stepPodcasts(ctx: Ctx) {
  for (const p of published('podcast')) {
    // _podcast_resourceurl is an ATTACHMENT ID, not a URL (enclosure points at the theme's demo site, unusable).
    const audio = attachmentUrl(p.meta._podcast_resourceurl)
    if (!audio) {
      appendFileSync('MIGRATION-NOTES.md', `\n- podcast senza audio, saltato: ${p.title}`)
      continue
    }
    const id = await upsertByLegacy(ctx, 'podcasts', legacyPath(p.link), {
      title: p.title,
      slug: p.slug,
      description: p.content.trim() ? await htmlToLexical(ctx, p.content) : undefined,
      cover: await importMedia(ctx, attachmentUrl(p.meta._thumbnail_id), p.title),
      audioUrl: audio, // still on the old host: phase 3 moves the mp3 to R2 and rewrites this
      publishedAt: p.meta._podcast_date ? romeIso(p.meta._podcast_date) : gmtIso(p.dateGmt),
      filters: await termIds(ctx, p, 'podcastfilter', 'podcast-filters'),
      stats: readStats(p),
      _status: 'published',
    }, p.content)
    ctx.log(`podcast ${p.title.slice(0, 50)} → ${id}`)
  }
}

async function stepPartners(ctx: Ctx) {
  const sponsors = published('qtsponsor').sort((a, b) => a.menuOrder - b.menuOrder || Number(a.id) - Number(b.id))
  for (const s of sponsors) {
    const name = s.title.replace('Factrory', 'Factory').replace('Luce verde', 'Luce Verde')
    const existing = await ctx.payload.find({ collection: 'partners', where: { name: { equals: name } }, limit: 1, depth: 0 })
    const data = {
      name,
      logo: await importMedia(ctx, attachmentUrl(s.meta._thumbnail_id), name),
      url: s.meta.linkurl || undefined,
      active: true,
      _status: 'published' as const,
    }
    const id = existing.docs[0]
      ? (await ctx.payload.update({ collection: 'partners', id: existing.docs[0].id, data })).id
      : (await ctx.payload.create({ collection: 'partners', data })).id
    ctx.log(`partner ${name} → ${id}`)
  }
}

async function stepPages(ctx: Ctx) {
  const privacy = items.find((i) => i.type === 'page' && i.slug === 'privacy-policy-2')
  if (!privacy) return
  const existing = await ctx.payload.find({ collection: 'pages', where: { slug: { equals: 'privacy-policy' } }, limit: 1, depth: 0 })
  const data = { title: 'Privacy Policy', slug: 'privacy-policy', content: await htmlToLexical(ctx, privacy.content), _status: 'published' as const }
  const id = existing.docs[0] ? (await ctx.payload.update({ collection: 'pages', id: existing.docs[0].id, data })).id : (await ctx.payload.create({ collection: 'pages', data })).id
  ctx.log(`page privacy-policy → ${id}`)
}

// ----------------------------------------------------------------------------
async function run() {
  const only = process.argv[2]
  const payload = await getPayload({ config: payloadConfig })
  const ctx: Ctx = {
    payload,
    editorConfig: await editorConfigFactory.default({ config: payload.config }),
    mediaCache: new Map(),
    log: (s) => payload.logger.info(s),
  }
  await loadUsers(ctx)
  const steps: Record<string, (c: Ctx) => Promise<void>> = {
    'media-site': stepSiteAssets,
    taxonomies: stepTaxonomies,
    staff: stepStaff,
    shows: stepShows,
    posts: stepPosts,
    events: stepEvents,
    podcasts: stepPodcasts,
    partners: stepPartners,
    pages: stepPages,
  }
  for (const [name, fn] of Object.entries(steps)) {
    if (only && only !== name) continue
    ctx.log(`=== ${name} ===`)
    await fn(ctx)
  }
  ctx.log('Import finished.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
