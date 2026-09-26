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

        {/* Nota editoriale interviste */}
        <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6 text-center max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
            Tutte le interviste e gli approfondimenti su Milano Beat Radio sono realizzati a titolo completamente gratuito, con l&apos;unico scopo di promuovere la musica, gli artisti e la cultura del territorio di Milano, provincia e Monza Brianza (attività non periodica ex L. 62/2001, svolta ai sensi dell&apos;Art. 21 Cost.).
          </p>
        </div>
      </section>
    </>
  )
}
