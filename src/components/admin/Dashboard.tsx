import Link from 'next/link'
import { headers as getHeaders } from 'next/headers'
import type { ServerProps } from 'payload'
import { siteUrl } from '@/src/lib/env'
import { payloadClient } from '@/src/lib/payload'
import { CollapsibleGroups } from './CollapsibleGroups'

/**
 * Panel above the collection cards on /admin. Answers the two key things an editor
 * opens the panel to find out: what is waiting to be published,
 * and where to start writing.
 */
export async function Dashboard(props?: Partial<ServerProps>) {
  const payload = await payloadClient()

  let user = props?.user
  if (!user) {
    try {
      const headers = await getHeaders()
      const authResult = await payload.auth({ headers })
      user = (authResult.user ?? undefined) as typeof user
    } catch {}
  }

  const userObj = user as { name?: string; surname?: string; email?: string; role?: string } | undefined
  const isAdmin = userObj?.role === 'admin'
  const title = isAdmin ? 'MBR DASHBOARD' : 'REDAZIONE'
  const userName = userObj?.name?.trim() || userObj?.email?.split('@')[0] || ''

  const [published, drafts, upcoming] = await Promise.all([
    payload.count({ collection: 'posts', where: { _status: { equals: 'published' } } }),
    payload.count({ collection: 'posts', where: { _status: { equals: 'draft' } } }),
    payload.count({
      collection: 'events',
      where: { and: [{ _status: { equals: 'published' } }, { startDate: { greater_than_equal: new Date().toISOString() } }] },
    }),
  ])

  return (
    <section className="mbr-dash">
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
      <CollapsibleGroups />
    </section>
  )
}
