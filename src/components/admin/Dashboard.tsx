import Link from 'next/link'
import { siteUrl } from '@/src/lib/env'
import { DAY_NAMES_IT, nowInRome, slotIsOn } from '@/src/lib/format'
import { payloadClient } from '@/src/lib/payload'

/**
 * Panel above the collection cards on /admin. Answers the three things an editor
 * opens the panel to find out: what is on air, what is waiting to be published,
 * and where to start writing.
 */
export async function Dashboard() {
  const payload = await payloadClient()
  const now = nowInRome()

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

      <div className="mbr-dash__figures">
        <Link href="/admin/collections/posts?where[_status][equals]=published">
          <b>{published.totalDocs}</b>
          <span>Flash News pubblicate</span>
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
        <Link href="/admin/collections/posts/create">Scrivi una Flash News</Link>
        <Link href="/admin/collections/events/create">Aggiungi un evento</Link>
        <Link href="/admin/collections/media">Carica un’immagine</Link>
        <a href={siteUrl()} target="_blank" rel="noreferrer">Apri il sito ↗</a>
      </div>
    </section>
  )
}
