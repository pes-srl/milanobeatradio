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
  { key: 'image', label: 'Immagini', where: { mimeType: { like: 'image' } } },
  { key: 'audio', label: 'Audio', where: { mimeType: { like: 'audio' } } },
  { key: 'all', label: 'Tutto', where: undefined },
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
  const kind = KINDS.find((k) => k.key === one(searchParams?.kind))?.key ?? 'image'
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
    for (const [k, v] of Object.entries(merged)) if (v && v !== 1) params.set(k, String(v))
    const qs = params.toString()
    return `/admin/collections/media/grid${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="mbr-grid">
      <header className="mbr-grid__head">
        <div>
          <h1>Mediateca</h1>
          <p>{res.totalDocs} file · pagina {res.page} di {res.totalPages}</p>
        </div>
        <Link href="/admin/collections/media" className="mbr-grid__alt">Vista a elenco</Link>
      </header>

      <form className="mbr-grid__tools" action="/admin/collections/media/grid" method="get">
        <input type="hidden" name="kind" value={kind} />
        <input type="search" name="q" defaultValue={q} placeholder="Cerca per nome file o testo alternativo" aria-label="Cerca" />
        <button type="submit">Cerca</button>
        <nav className="mbr-grid__kinds" aria-label="Tipo di file">
          {KINDS.map((k) => (
            <Link key={k.key} href={href({ kind: k.key, page: 1 })} className={k.key === kind ? 'is-on' : ''}>
              {k.label}
            </Link>
          ))}
        </nav>
      </form>

      {res.docs.length === 0 ? (
        <p className="mbr-grid__empty">Nessun file trovato{q ? ` per «${q}»` : ''}.</p>
      ) : (
        <ul className="mbr-grid__items">
          {res.docs.map((doc) => {
            const thumb = doc.mimeType?.startsWith('image') ? thumbOf(doc) : ''
            return (
              <li key={doc.id}>
                <Link href={`/admin/collections/media/${doc.id}`}>
                  <span className="mbr-grid__frame">
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb} alt="" loading="lazy" decoding="async" />
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
