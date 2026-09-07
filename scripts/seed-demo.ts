/**
 * Demo seed: 2 records per collection so the site can be developed before the real
 * WordPress import (phase 2). Idempotent: re-running updates the same slugs.
 *
 *   pnpm seed:demo
 *
 * All data is clearly marked [DEMO]; nothing here is real editorial content.
 */
import './load-env'

import { getPayload, type Payload } from 'payload'
import sharp from 'sharp'
import payloadConfig from '../payload.config'

type Slugged = 'posts' | 'events' | 'podcasts' | 'shows' | 'staff' | 'categories' | 'event-types' | 'podcast-filters' | 'genres'

/** Minimal Lexical document with one paragraph. */
const rich = (text: string) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: [
      {
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        textFormat: 0,
        children: [{ type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 }],
      },
    ],
  },
})

const romeIso = (date: string, time: string) => {
  // Interpret a local Europe/Rome wall time and store it as UTC.
  const probe = new Date(`${date}T${time}:00Z`)
  const offsetMin =
    (new Date(probe.toLocaleString('en-US', { timeZone: 'Europe/Rome' })).getTime() -
      new Date(probe.toLocaleString('en-US', { timeZone: 'UTC' })).getTime()) /
    60_000
  return new Date(probe.getTime() - offsetMin * 60_000).toISOString()
}

async function upsert<T extends Slugged>(payload: Payload, collection: T, slug: string, data: Record<string, unknown>) {
  const existing = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, depth: 0 })
  const doc = existing.docs[0]
  const payloadData = { ...data, slug } as never
  if (doc) {
    await payload.update({ collection, id: doc.id, data: payloadData })
    return doc.id
  }
  const created = await payload.create({ collection, data: payloadData })
  return created.id
}

async function upsertMedia(payload: Payload, name: string, alt: string, color: string, size: [number, number]) {
  const existing = await payload.find({ collection: 'media', where: { filename: { like: name.replace(/\.png$/, '') } }, limit: 1 })
  if (existing.docs[0]) return existing.docs[0].id
  const data = await sharp({ create: { width: size[0], height: size[1], channels: 3, background: color } }).png().toBuffer()
  const created = await payload.create({
    collection: 'media',
    data: { alt },
    file: { data, mimetype: 'image/png', name, size: data.length },
  })
  return created.id
}

async function upsertPartner(payload: Payload, name: string, data: Record<string, unknown>) {
  const existing = await payload.find({ collection: 'partners', where: { name: { equals: name } }, limit: 1, depth: 0 })
  const doc = existing.docs[0]
  if (doc) return (await payload.update({ collection: 'partners', id: doc.id, data: data as never })).id
  return (await payload.create({ collection: 'partners', data: { name, ...data } as never })).id
}

async function run() {
  const payload = await getPayload({ config: payloadConfig })
  const published = { _status: 'published' as const }

  // --- media ---------------------------------------------------------------
  const cover1 = await upsertMedia(payload, 'demo-cover-1.png', '[DEMO] Copertina viola', '#C824E3', [1600, 900])
  const cover2 = await upsertMedia(payload, 'demo-cover-2.png', '[DEMO] Copertina verde', '#3DAE49', [1600, 900])

  // --- taxonomies ----------------------------------------------------------
  const catFlash = await upsert(payload, 'categories', 'flashnews', { name: 'FlashNews' })
  const catCultura = await upsert(payload, 'categories', 'cultura', { name: 'Cultura' })
  const typeClub = await upsert(payload, 'event-types', 'club', { name: 'Club' })
  const typeConcerto = await upsert(payload, 'event-types', 'concerto', { name: 'Concerto' })
  const filterInterviste = await upsert(payload, 'podcast-filters', 'interviste', { name: 'Interviste' })
  await upsert(payload, 'podcast-filters', 'speciali', { name: 'Speciali' })
  const genreHouse = await upsert(payload, 'genres', 'house', { name: 'House' })
  const genreClassic = await upsert(payload, 'genres', 'classic', { name: 'Classic' })

  // --- staff ---------------------------------------------------------------
  const criss = await upsert(payload, 'staff', 'criss', {
    title: "Criss Dell'Orto",
    bio: rich('[DEMO] TODO: biografia dal sito reale (fase 2).'),
    photo: cover1,
    socials: { instagram: 'https://instagram.com/milanobeatradio_mbr' },
    ...published,
  })
  const luca = await upsert(payload, 'staff', 'luca', {
    title: 'Luca',
    bio: rich('[DEMO] TODO: biografia dal sito reale (fase 2).'),
    photo: cover2,
    ...published,
  })

  // --- shows (Monday slots are the real ones from the brief) ---------------
  await upsert(payload, 'shows', 'playlist-mbr', {
    title: 'Playlist MBR',
    description: rich('[DEMO] TODO: descrizione dal sito reale (fase 2).'),
    cover: cover1,
    genre: genreHouse,
    hosts: [criss],
    slots: [
      { dayOfWeek: '1', start: '06:00', end: '07:00' },
      { dayOfWeek: '1', start: '07:30', end: '08:00' },
      { dayOfWeek: '1', start: '08:30', end: '14:00' },
      { dayOfWeek: '1', start: '14:30', end: '18:00' },
    ],
    ...published,
  })
  await upsert(payload, 'shows', 'back2-the-classic', {
    title: 'Back2 the Classic',
    description: rich('I Classici della nostra vita'),
    cover: cover2,
    genre: genreClassic,
    hosts: [luca],
    slots: [{ dayOfWeek: '1', start: '07:00', end: '07:30' }],
    ...published,
  })

  // --- posts ---------------------------------------------------------------
  await upsert(payload, 'posts', 'demo-flash-news-1', {
    title: '[DEMO] Flash News numero uno',
    excerpt: 'Articolo di prova per lo sviluppo. Verrà sostituito dai contenuti reali in fase 2.',
    content: rich('[DEMO] Contenuto di prova. TODO: import dal XML.'),
    cover: cover1,
    category: [catFlash],
    publishedAt: new Date().toISOString(),
    ...published,
  })
  await upsert(payload, 'posts', 'demo-cultura-1', {
    title: '[DEMO] Cultura a Milano',
    excerpt: 'Secondo articolo di prova.',
    content: rich('[DEMO] Contenuto di prova. TODO: import dal XML.'),
    cover: cover2,
    category: [catCultura, catFlash],
    publishedAt: new Date(Date.now() - 86_400_000).toISOString(),
    ...published,
  })

  // --- events (first one mirrors the real HOUSE NIGHT record) --------------
  await upsert(payload, 'events', 'house-night-amnesia-milano-14-febbraio-2026', {
    title: 'HOUSE NIGHT @ Amnesia Milano – 14 Febbraio 2026',
    content: rich('Lineup: Luuk van Dijk · Jaden Thompson · Not From Here'),
    cover: cover1,
    startDate: romeIso('2026-02-14', '23:00'),
    startDate_tz: 'Europe/Rome',
    endDate: romeIso('2026-02-15', '05:00'),
    endDate_tz: 'Europe/Rome',
    venueName: 'Amnesia Milano',
    address: 'Via Alfonso Gatto angolo Viale Forlanini, 20134 Milano (MI) Italy',
    externalUrl: 'https://it.ra.co/events/2348877',
    eventType: typeClub,
    ...published,
  })
  await upsert(payload, 'events', 'demo-concerto-2', {
    title: '[DEMO] Concerto in città',
    content: rich('[DEMO] Evento di prova.'),
    cover: cover2,
    startDate: romeIso('2026-10-10', '21:00'),
    startDate_tz: 'Europe/Rome',
    venueName: '[DEMO] Venue',
    address: 'Milano',
    eventType: typeConcerto,
    ...published,
  })

  // --- podcasts ------------------------------------------------------------
  await upsert(payload, 'podcasts', 'demo-intervista-1', {
    title: 'INTERVISTA "[DEMO] Ospite uno"',
    description: rich('[DEMO] Podcast di prova.'),
    cover: cover1,
    audioUrl: 'https://media.milanobeatradio.it/podcasts/demo-1.mp3',
    duration: 1800,
    publishedAt: new Date().toISOString(),
    filters: [filterInterviste],
    ...published,
  })
  await upsert(payload, 'podcasts', 'demo-intervista-2', {
    title: 'INTERVISTA "[DEMO] Ospite due"',
    description: rich('[DEMO] Podcast di prova.'),
    cover: cover2,
    audioUrl: 'https://media.milanobeatradio.it/podcasts/demo-2.mp3',
    duration: 2400,
    publishedAt: new Date(Date.now() - 86_400_000).toISOString(),
    filters: [filterInterviste],
    ...published,
  })

  // --- partners ------------------------------------------------------------
  await upsertPartner(payload, 'PES', { logo: cover1, url: 'https://www.pes-srl.it/', active: true, ...published })
  await upsertPartner(payload, 'Phonogram', { logo: cover2, url: 'https://phonogram.net/', active: true, ...published })

  // --- admin user ----------------------------------------------------------
  const email = 'admin@milanobeatradio.it'
  const users = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
  if (users.docs[0]) {
    await payload.update({ collection: 'users', id: users.docs[0].id, data: { name: 'Admin (dev)', role: 'admin' } })
  } else {
    await payload.create({ collection: 'users', data: { email, password: 'Mbr-dev-2026!', name: 'Admin (dev)', role: 'admin' } })
    payload.logger.info(`Created admin user ${email} (password in secrets.local.md)`)
  }

  payload.logger.info('Seed completed.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
