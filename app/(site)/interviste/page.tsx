import type { Metadata } from 'next'
import { PageHero } from '@/src/components/site/PageHero'
import { PodcastCard } from '@/src/components/site/PodcastCard'
import { Pagination } from '@/src/components/site/Pagination'
import { getPodcasts } from '@/src/lib/queries'

export const metadata: Metadata = { title: 'Interviste' }
export const revalidate = 300

/** "Interviste" is a filtered view of the podcasts collection, not its own content type. */
export default async function IntervistePage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams
  // The WordPress term slug is singular ("intervista"), unlike the page path.
  const podcasts = await getPodcasts({ filter: 'intervista', limit: 12, page: Number(page) || 1 })

  return (
    <>
      <PageHero
        overtitle="MBR Podcast & Special"
        title="Interviste"
        subtitle="Le voci dei protagonisti della musica, della notte e dei grandi eventi."
      />
      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8">
        {podcasts.docs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {podcasts.docs.map((p, i) => (
              <PodcastCard key={p.id} podcast={p} priority={i < 3} />
            ))}
          </div>
        ) : (
          <p className="text-center text-white/60">Nessuna intervista pubblicata.</p>
        )}
        <Pagination page={podcasts.page ?? 1} totalPages={podcasts.totalPages ?? 1} basePath="/interviste" />
      </section>
    </>
  )
}
