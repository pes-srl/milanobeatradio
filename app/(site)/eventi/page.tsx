import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RenderStamp } from '@/src/components/RenderStamp'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Eventi' }

/** Placeholder list (phase 0): proves Payload Local API + navigation without audio drop. */
export default async function EventiPage() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'events',
    sort: 'startDate',
    limit: 20,
    depth: 0,
  })

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold uppercase tracking-wider">City Events</h1>
      {docs.length === 0 ? (
        <p className="text-white/60">Nessun evento. Esegui <code>pnpm seed:demo</code>.</p>
      ) : (
        <ul className="space-y-2">
          {docs.map((e) => (
            <li key={e.id} className="border-l-2 border-brand pl-3">
              <span className="font-medium">{e.title}</span>
              <span className="ml-2 text-sm text-white/60">
                {new Date(e.startDate).toLocaleString('it-IT', { timeZone: 'Europe/Rome' })}
                {e.venueName ? ` · ${e.venueName}` : ''}
              </span>
            </li>
          ))}
        </ul>
      )}
      <RenderStamp label="Eventi" />
    </section>
  )
}
