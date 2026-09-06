import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RenderStamp } from '@/src/components/RenderStamp'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Flash News' }

/** Placeholder list (phase 0). */
export default async function FlashNewsPage() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'posts',
    sort: '-publishedAt',
    limit: 20,
    depth: 0,
  })

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold uppercase tracking-wider">Flash News</h1>
      {docs.length === 0 ? (
        <p className="text-white/60">Nessun articolo. Esegui <code>pnpm seed:demo</code>.</p>
      ) : (
        <ul className="space-y-2">
          {docs.map((p) => (
            <li key={p.id} className="border-l-2 border-brand pl-3">
              <span className="font-medium">{p.title}</span>
              {p.excerpt && <p className="text-sm text-white/60">{p.excerpt}</p>}
            </li>
          ))}
        </ul>
      )}
      <RenderStamp label="Flash News" />
    </section>
  )
}
