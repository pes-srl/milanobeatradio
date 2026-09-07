import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageHero } from '@/src/components/site/PageHero'
import { RichText } from '@/src/components/site/RichText'
import { StatsBar } from '@/src/components/site/StatsBar'
import { IconCalendarAdd, IconExternal, IconPin } from '@/src/components/icons'
import { fmtLong, fmtTime, googleCalendarUrl } from '@/src/lib/format'
import { imageUrl } from '@/src/lib/media'
import { getEvent } from '@/src/lib/queries'

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event) return {}
  return { title: event.title, openGraph: { images: imageUrl(event.cover, 'hero') ? [imageUrl(event.cover, 'hero')!] : undefined } }
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event) notFound()

  const eventType = typeof event.eventType === 'object' ? event.eventType : null
  const address = [event.venueName, event.address].filter(Boolean).join(' — ')

  return (
    <>
      <PageHero title={event.title} image={event.cover} kicker={eventType?.name} kickerColor="white" size="lg" uppercase>
        <p className="mt-6 text-lg">{fmtLong(event.startDate)} · {fmtTime(event.startDate)}</p>
        {event.artists && <p className="mt-2 text-brand">{event.artists}</p>}
      </PageHero>

      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-16 sm:px-8 lg:grid-cols-[1fr_280px]">
        <article>
          {event.content && <RichText data={event.content} />}
        </article>

        <aside className="space-y-6">
          <StatsBar collection="events" id={event.id} title={event.title} views={event.stats?.views} likes={event.stats?.likes} shares={event.stats?.shares} />
          {address && (
            <div className="flex items-start gap-3 text-sm">
              <IconPin size={18} className="mt-0.5 shrink-0 text-brand" />
              <p>{address}</p>
            </div>
          )}
          <a
            href={googleCalendarUrl({ title: event.title, startDate: event.startDate, endDate: event.endDate, address: event.address, venueName: event.venueName })}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            <IconCalendarAdd size={16} /> Aggiungi al calendario
          </a>
          {event.externalUrl && (
            <a href={event.externalUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 text-sm font-semibold text-brand hover:underline">
              <IconExternal size={16} /> Biglietti / info
            </a>
          )}
        </aside>
      </div>
    </>
  )
}
