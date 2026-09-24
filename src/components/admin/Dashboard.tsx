import Link from 'next/link'
import { headers as getHeaders } from 'next/headers'
import type { ServerProps } from 'payload'
import { siteUrl } from '@/src/lib/env'
import { DAY_NAMES_IT, nowInRome, slotIsOn } from '@/src/lib/format'
import { payloadClient } from '@/src/lib/payload'
import { AdminPlayButton } from './AdminPlayButton'

/**
 * Panel above the collection cards on /admin. Answers the three things an editor
 * opens the panel to find out: what is on air, what is waiting to be published,
 * and where to start writing.
 */
export async function Dashboard(props?: Partial<ServerProps>) {
  const payload = await payloadClient()
  const now = nowInRome()

  let user = props?.user
  if (!user) {
    try {
      const headers = await getHeaders()
      const authResult = await payload.auth({ headers })
      user = (authResult.user ?? undefined) as typeof user
    } catch {}
  }

  const userObj = user as { name?: string; email?: string; role?: string } | undefined
  const isAdmin = userObj?.role === 'admin'
  const title = isAdmin ? 'BEAT DASHBOARD' : 'REDAZIONE'
  const userName = userObj?.name?.trim() || userObj?.email?.split('@')[0] || ''

  const [shows, published, drafts, upcoming] = await Promise.all([
    payload.find({ collection: 'shows', where: { _status: { equals: 'published' } }, limit: 50, depth: 0 }),
    payload.count({ collection: 'posts', where: { _status: { equals: 'published' } } }),
    payload.count({ collection: 'posts', where: { _status: { equals: 'draft' } } }),
    payload.count({
      collection: 'events',
      where: { and: [{ _status: { equals: 'published' } }, { startDate: { greater_than_equal: new Date().toISOString() } }] },
    }),
  ])

  const onAir = shows.docs
    .flatMap((show) => (show.slots ?? []).map((slot) => ({ show, slot })))
    .find(({ slot }) => slotIsOn(slot, now))

  return (
    <section className="mbr-dash">
      <div className="mbr-dash__air-row">
        <div className="mbr-dash__air">
          <p className="mbr-dash__label">Ora in onda · {DAY_NAMES_IT[Number(now.dayOfWeek)]} {now.time}</p>
          {onAir ? (
            <p className="mbr-dash__show">
              <Link href={`/admin/collections/shows/${onAir.show.id}`}>{onAir.show.title}</Link>
              <span> {onAir.slot.start} – {onAir.slot.end}</span>
            </p>
          ) : (
            <p className="mbr-dash__show mbr-dash__show--empty">Nessun programma in palinsesto a quest’ora.</p>
          )}
        </div>
        <AdminPlayButton />
      </div>

      <div className="mbr-dash__redazione">
        <h1 className="mbr-dash__redazione-title">
          {title}
          {userName && <span className="mbr-dash__redazione-user"> · {userName}</span>}
        </h1>
      </div>

      <div className="mbr-dash__figures">
        <Link href="/admin/collections/posts?where[_status][equals]=published">
          <b>{published.totalDocs}</b>
          <span>City News pubblicate</span>
        </Link>
        <Link href="/admin/collections/posts?where[_status][equals]=draft">
          <b>{drafts.totalDocs}</b>
          <span>{drafts.totalDocs === 1 ? 'bozza da rivedere' : 'bozze da rivedere'}</span>
        </Link>
        <Link href="/admin/collections/events">
          <b>{upcoming.totalDocs}</b>
          <span>{upcoming.totalDocs === 1 ? 'evento in programma' : 'eventi in programma'}</span>
        </Link>
      </div>

      <div className="mbr-dash__links">
        <Link href="/admin/collections/posts/create" className="mbr-dash__btn mbr-dash__btn--news">
          <span className="mbr-dash__btn-icon">✍️</span>
          <span className="mbr-dash__btn-text">
            <span className="mbr-dash__btn-title">Scrivi una City News</span>
            <span className="mbr-dash__btn-desc">Crea nuovo articolo</span>
          </span>
        </Link>
        <Link href="/admin/collections/events/create" className="mbr-dash__btn mbr-dash__btn--event">
          <span className="mbr-dash__btn-icon">🎟️</span>
          <span className="mbr-dash__btn-text">
            <span className="mbr-dash__btn-title">Aggiungi un Evento</span>
            <span className="mbr-dash__btn-desc">Crea serata o party</span>
          </span>
        </Link>
        <Link href="/admin/collections/media" className="mbr-dash__btn mbr-dash__btn--media">
          <span className="mbr-dash__btn-icon">📤</span>
          <span className="mbr-dash__btn-text">
            <span className="mbr-dash__btn-title">Carica Contenuto</span>
            <span className="mbr-dash__btn-desc">Foto, flyer e immagini</span>
          </span>
        </Link>
        <a href={siteUrl()} target="_blank" rel="noreferrer" className="mbr-dash__btn mbr-dash__btn--site">
          <span className="mbr-dash__btn-icon">🌐</span>
          <span className="mbr-dash__btn-text">
            <span className="mbr-dash__btn-title">Apri il Sito ↗</span>
            <span className="mbr-dash__btn-desc">Live su milanobeatradio</span>
          </span>
        </a>
      </div>
    </section>
  )
}
