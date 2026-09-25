import type { Metadata } from 'next'
import { PageHero } from '@/src/components/site/PageHero'
import { EventsGrid } from '@/src/components/site/EventsGrid'
import { getEvents } from '@/src/lib/queries'

export const metadata: Metadata = { title: 'City Events' }
export const revalidate = 300

export default async function EventiPage() {
  const [upcomingEvents, pastEvents] = await Promise.all([
    getEvents({ upcoming: true, limit: 4, page: 1 }),
    getEvents({ past: true, limit: 4, page: 1 }),
  ])

  return (
    <>
      <PageHero
        overtitle="City & Nightlife"
        title="City Events"
        subtitle="I migliori eventi, serate, festival e party a Milano e dintorni."
      />
      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8">
        <EventsGrid
          initialUpcomingEvents={upcomingEvents.docs}
          initialUpcomingHasNext={upcomingEvents.hasNextPage}
          initialPastEvents={pastEvents.docs}
          initialPastHasNext={pastEvents.hasNextPage}
          totalPastCount={pastEvents.totalDocs}
        />
      </section>
    </>
  )
}
