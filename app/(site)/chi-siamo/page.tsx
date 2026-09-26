import type { Metadata } from 'next'
import { PageHero } from '@/src/components/site/PageHero'
import { SectionTitle } from '@/src/components/site/SectionTitle'
import { PartnerLogos } from '@/src/components/site/PartnerLogos'
import { AppDownload } from '@/src/components/site/AppDownload'
import { getPartners, getSite } from '@/src/lib/queries'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Chi siamo | Milano Beat Radio',
  description: 'Scopri il progetto Milano Beat Radio: promozione culturale e musicale a titolo gratuito del territorio di Milano e Monza Brianza.',
}
export const revalidate = 300

export default async function ChiSiamoPage() {
  const [site, partners] = await Promise.all([getSite().catch(() => null), getPartners()])
  return (
    <>
      <PageHero
        overtitle="Milano Beat Radio"
        title="Chi siamo"
        subtitle={site?.claim ?? 'Your Event and Party Station'}
        size="lg"
      />

      {/* Manifesto Territoriale & Missione Gratuita */}
      <section className="bg-black py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-8 space-y-12">
          <div className="text-center space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand">La Nostra Missione</p>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              Dare voce ed energia al territorio
            </h2>
            <p className="mx-auto max-w-2xl text-base sm:text-lg text-white/70 leading-relaxed">
              Milano Beat Radio è un progetto editoriale e radiofonico privato, amatoriale e senza scopo di lucro nato dalla passione per la musica e per il nostro territorio.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 space-y-3">
              <span className="text-3xl">📍</span>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                Milano, Provincia e Monza Brianza
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Il nostro focus geografico ed editoriale valorizza l&apos;intera area metropolitana di Milano e la provincia di Monza e della Brianza, raccontandone l&apos;anima viva, dinamica, culturale e notturna.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 space-y-3">
              <span className="text-3xl">🎁</span>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                Promozione a Titolo Gratuito
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Tutte le attività di informazione, segnalazione di eventi, format e notizie avvengono a titolo interamente gratuito, senza compensi economici né fini commerciali, con il solo obiettivo di promuovere il territorio.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 space-y-3">
              <span className="text-3xl">🎭</span>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                Musica, Cultura e Nightlife
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Diamo visibilità a locali, teatri, spettacoli dal vivo, festival, clubbing e iniziative culturali spontanee, valorizzando chi ogni giorno genera intrattenimento ed espressione artistica.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 space-y-3">
              <span className="text-3xl">⚖️</span>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                Libertà di Racconto e Tutela Marchi
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                MBR non costituisce testata giornalistica (Legge 62/2001) in quanto priva di periodicità. La divulgazione di notizie ed eventi è esercitata ai sensi dell&apos;Art. 21 della Costituzione Italiana a tutela della libertà di pensiero e informazione. Marchi e loghi appartengono ai rispettivi legittimi titolari (fair use descrittivo).
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-brand/20 bg-brand/5 p-6 sm:p-8 text-center space-y-3">
            <h4 className="text-base font-bold uppercase tracking-wider text-white">
              Vuoi segnalarci un&apos;iniziativa o richiedere informazioni?
            </h4>
            <p className="text-sm text-white/70 max-w-xl mx-auto">
              Se gestisci un locale, organizzi un evento o desideri aggiornare o rettificare una segnalazione, scrivici liberamente. Siamo a completa disposizione degli operatori locali.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Link href="/promuoviti" className="btn-pill">
                Segnala un evento
              </Link>
              <Link href="/contatti" className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:border-white hover:bg-white/10">
                Contatta la redazione
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-8 border-t border-white/10">
        <SectionTitle>I nostri partner</SectionTitle>
        <div className="mt-10">
          <PartnerLogos partners={partners.docs} variant="grid" />
        </div>
      </section>

      <AppDownload site={site} />
    </>
  )
}
