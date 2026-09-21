import type { Metadata } from 'next'
import { PageHero } from '@/src/components/site/PageHero'
import { IntervisteGrid } from '@/src/components/site/IntervisteGrid'
import { getPodcasts } from '@/src/lib/queries'

export const metadata: Metadata = { title: 'Interviste' }
export const revalidate = 300

/** "Interviste" is a filtered view of the podcasts collection, not its own content type. */
export default async function IntervistePage() {
  // The WordPress term slug is singular ("intervista"), unlike the page path.
  const podcasts = await getPodcasts({ filter: 'intervista', limit: 6, page: 1 })

  return (
    <>
      <PageHero
        overtitle="MBR Special"
        title="Interviste"
        subtitle="Le voci dei protagonisti della musica, della notte e dei grandi eventi."
      />
      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8">
        {podcasts.docs.length > 0 ? (
          <IntervisteGrid
            initialPodcasts={podcasts.docs}
            initialHasNextPage={podcasts.hasNextPage}
          />
        ) : (
          <p className="text-center text-white/60">Nessuna intervista pubblicata.</p>
        )}
      </section>
    </>
  )
}
