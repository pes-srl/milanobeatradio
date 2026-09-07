import type { Metadata } from 'next'
import { PageHero } from '@/src/components/site/PageHero'
import { Schedule } from '@/src/components/site/Schedule'
import { getShows } from '@/src/lib/queries'

export const metadata: Metadata = { title: 'Programmi' }
export const revalidate = 300

export default async function ProgrammiPage() {
  const shows = await getShows()
  return (
    <>
      <PageHero title="Palinsesto" />
      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8">
        <Schedule shows={shows.docs} />
      </section>
    </>
  )
}
