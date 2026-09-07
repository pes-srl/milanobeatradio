import type { Metadata } from 'next'
import { PageHero } from '@/src/components/site/PageHero'
import { EventItem } from '@/src/components/site/EventItem'
import { getEvents } from '@/src/lib/queries'

export const metadata: Metadata = { title: 'Eventi' }
export const revalidate = 300

export default async function EventiPage() {
  const events = await getEvents({ upcoming: true, limit: 50 })
  return (
    <>
      <PageHero title="Eventi" />
      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8">
        {events.docs.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2">
            {events.docs.map((e, i) => (
              <EventItem key={e.id} event={e} priority={i === 0} />
            ))}
          </div>
        ) : (
          <p className="text-center text-white/60">Nessun evento in programma al momento.</p>
        )}
      </section>
    </>
  )
}
