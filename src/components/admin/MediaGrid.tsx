import Link from 'next/link'
import type { Payload } from 'payload'
import type { Media } from '@/src/payload-types'

type Props = {
  payload: Payload
  searchParams?: Record<string, string | string[] | undefined>
}

const PER_PAGE = 24

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? ''

/** Thumbnails are already 400 px WebP on R2, and this is an internal tool: sending a
 *  few hundred of them through the image optimiser would cost money for nothing. */
const thumbOf = (doc: Media) => doc.sizes?.thumb?.url || doc.url || ''

const KINDS = [
  { key: 'all', label: 'Tutti', where: undefined },
  { key: 'image', label: 'Foto', where: { mimeType: { like: 'image' } } },
  { key: 'audio', label: 'Audio', where: { mimeType: { like: 'audio' } } },
  { key: 'video', label: 'Video', where: { mimeType: { like: 'video' } } },
] as const

/**
 * Grid view for the media library, at /admin/collections/media/grid.
 *
 * Added ALONGSIDE Payload's table view rather than replacing it: the table keeps
 * filters, column choice, selection and bulk upload, all of which would have to be
 * rebuilt (and kept working across upgrades) to swap it out. This view does the one
 * thing the table cannot — let you find a picture by looking at it.
 */
export async function MediaGrid({ payload, searchParams }: Props) {
  const q = one(searchParams?.q).trim()
  const kind = KINDS.find((k) => k.key === one(searchParams?.kind))?.key ?? 'all'
  const page = Math.max(1, Number(one(searchParams?.page)) || 1)

  const filters = [
    KINDS.find((k) => k.key === kind)?.where,
    q ? { or: [{ filename: { like: q } }, { alt: { like: q } }] } : undefined,
  ].filter(Boolean)

  const res = await payload.find({
    collection: 'media',
    where: filters.length ? { and: filters as never[] } : {},
    sort: '-createdAt',
    limit: PER_PAGE,
    page,
    depth: 0,
  })

  const href = (next: Record<string, string | number>) => {
    const params = new URLSearchParams()
    const merged = { q, kind, page, ...next }
    for (const [k, v] of Object.entries(merged)) {
      if (v && v !== 1 && !(k === 'kind' && v === 'all')) {
        params.set(k, String(v))
      }
    }
    const qs = params.toString()
    return `/admin/collections/media/grid${qs ? `?${qs}` : ''}`
  }

  const listHref =
    kind === 'image'
      ? '/admin/collections/media?where[mimeType][like]=image'
      : kind === 'audio'
      ? '/admin/collections/media?where[mimeType][like]=audio'
      : kind === 'video'
      ? '/admin/collections/media?where[mimeType][like]=video'
      : '/admin/collections/media'

  return (
    <div className="mbr-grid">
      <header className="mbr-grid__head">
        <div>
          <h1>Mediateca</h1>
          <p>{res.totalDocs} file · pagina {res.page} di {res.totalPages}</p>
        </div>
        <div className="mbr-media-toolbar__views">
          <span className="mbr-media-toolbar__view-label">Vista:</span>
          <div className="mbr-media-toolbar__view-switch">
            <Link
              href={listHref}
              className="mbr-media-toolbar__view-btn mbr-media-toolbar__view-btn--cta"
              title="Passa alla vista a elenco dettagliata"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              <span>Vista a elenco</span>
            </Link>

            <span className="mbr-media-toolbar__view-btn is-active" title="Vista a griglia (attiva)">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
              <span>Griglia</span>
            </span>
          </div>
        </div>
      </header>

      <form className="mbr-grid__tools" action="/admin/collections/media/grid" method="get">
        <input type="hidden" name="kind" value={kind} />
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Cerca per nome file o testo alternativo"
          aria-label="Cerca"
        />
        <button type="submit">Cerca</button>
        <nav className="mbr-grid__kinds" aria-label="Filtra per tipo">
          {KINDS.map((k) => (
            <Link
              key={k.key}
              href={href({ kind: k.key, page: 1 })}
              className={`mbr-grid__kind-btn ${k.key === kind ? 'is-on' : ''}`}
            >
              {k.key === 'all' && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3h7v7H3zm11 0h7v7h-7zm-11 11h7v7H3zm11 0h7v7h-7z" />
                </svg>
              )}
              {k.key === 'image' && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              )}
              {k.key === 'audio' && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              )}
              {k.key === 'video' && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
              )}
              <span>{k.label}</span>
            </Link>
          ))}
        </nav>
      </form>

      {res.docs.length === 0 ? (
        <p className="mbr-grid__empty">Nessun file trovato{q ? ` per «${q}»` : ''}.</p>
      ) : (
        <ul className="mbr-grid__items">
          {res.docs.map((doc) => {
            const isImage = doc.mimeType?.startsWith('image')
            const isAudio = doc.mimeType?.startsWith('audio')
            const isVideo = doc.mimeType?.startsWith('video')
            const thumb = isImage ? thumbOf(doc) : ''
            return (
              <li key={doc.id}>
                <Link href={`/admin/collections/media/${doc.id}`}>
                  <span className="mbr-grid__frame">
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb} alt="" loading="lazy" decoding="async" />
                    ) : isVideo ? (
                      <div className="mbr-grid__badge mbr-grid__badge--video">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="23 7 16 12 23 17 23 7" />
                          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                        </svg>
                        <span>VIDEO</span>
                      </div>
                    ) : isAudio ? (
                      <div className="mbr-grid__badge mbr-grid__badge--audio">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 18V5l12-2v13" />
                          <circle cx="6" cy="18" r="3" />
                          <circle cx="18" cy="16" r="3" />
                        </svg>
                        <span>AUDIO</span>
                      </div>
                    ) : (
                      <span className="mbr-grid__ext">{doc.filename?.split('.').pop()?.toUpperCase() ?? 'FILE'}</span>
                    )}
                  </span>
                  <span className="mbr-grid__name">{doc.alt || doc.filename}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}

      {res.totalPages > 1 && (
        <nav className="mbr-grid__pager" aria-label="Paginazione">
          {res.hasPrevPage ? <Link href={href({ page: page - 1 })}>← Precedente</Link> : <span>← Precedente</span>}
          <span className="mbr-grid__count">{res.page} / {res.totalPages}</span>
          {res.hasNextPage ? <Link href={href({ page: page + 1 })}>Successiva →</Link> : <span>Successiva →</span>}
        </nav>
      )}
    </div>
  )
}
