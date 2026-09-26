import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { DraftBanner } from '@/src/components/site/DraftBanner'
import { PageHero } from '@/src/components/site/PageHero'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookie Policy | Milano Beat Radio',
  description: 'Informativa estesa sull\'utilizzo dei cookie e tecnologie tecniche di Milano Beat Radio.',
}

export const revalidate = 3600

export default async function CookiePolicyPage() {
  const isDraft = (await draftMode()).isEnabled

  return (
    <>
      {isDraft && <DraftBanner path="/cookie-policy" />}
      <PageHero
        title="Cookie Policy"
        kicker="Informativa Legale"
        kickerColor="pink"
        subtitle="Informativa sull'utilizzo dei cookie tecnici ai sensi della normativa europea e del Garante Privacy"
      />

      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
        <div className="space-y-10 text-white/80 leading-relaxed">
          <section className="rounded-2xl border border-white/10 bg-[#121212] p-6 sm:p-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wide">
              1. Cosa sono i Cookie
            </h2>
            <p>
              I cookie sono piccoli file di testo che i siti web visitati inviano al terminale dell&apos;utente (computer, smartphone o tablet), dove vengono memorizzati per essere poi ritrasmessi agli stessi siti alla visita successiva.
            </p>
            <p>
              Esistono diverse tipologie di cookie: cookie <strong className="text-white">tecnici</strong> (necessari per il funzionamento del sito), cookie <strong className="text-white">analitici anonimi</strong> e cookie di <strong className="text-white">profilazione</strong> (utilizzati per tracciare la navigazione e mostrare annunci pubblicitari personalizzati).
            </p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#121212] p-6 sm:p-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wide">
              2. I Cookie Utilizzati da Milano Beat Radio
            </h2>
            <p>
              Milano Beat Radio è un progetto non commerciale che rispetta la privacy dei propri ascoltatori. Per questo motivo:{' '}
              <strong className="text-brand font-semibold">
                questo sito utilizza ESCLUSIVAMENTE Cookie Tecnici e strumenti di memoria locale strettamente necessari.
              </strong>
            </p>
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/20 text-white">
                    <th className="py-2.5 pr-4 font-semibold uppercase tracking-wider text-xs text-brand">Tipologia / Nome</th>
                    <th className="py-2.5 pr-4 font-semibold uppercase tracking-wider text-xs text-brand">Finalità</th>
                    <th className="py-2.5 font-semibold uppercase tracking-wider text-xs text-brand">Durata</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-white/75">
                  <tr>
                    <td className="py-3 pr-4 font-medium text-white">Player Audio (Local Storage)</td>
                    <td className="py-3 pr-4">Memorizza il livello del volume e lo stato di ascolto della web radio per la continuità di riproduzione.</td>
                    <td className="py-3">Persistente nel browser</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-white">Sessione Amministratore (payload-token)</td>
                    <td className="py-3 pr-4">Riservato esclusivamente alla gestione della redazione e agli amministratori per l&apos;accesso al pannello CMS.</td>
                    <td className="py-3">Sessione / Scadenza token</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#121212] p-6 sm:p-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wide">
              3. Assenza di Cookie di Profilazione o Marketing
            </h2>
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 sm:p-5 space-y-2">
              <p className="font-semibold text-emerald-300">
                Nessun tracciamento pubblicitario o profilazione
              </p>
              <p className="text-sm text-white/80">
                Milano Beat Radio non installa pixel di tracciamento commerciale (come Meta Pixel o Google Ads) e non vende o cede dati ad agenzie terze. Conformemente alle linee guida del Garante Privacy e alla Direttiva ePrivacy, per i soli cookie tecnici non è richiesto il consenso preventivo tramite banner invasivo.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#121212] p-6 sm:p-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wide">
              4. Contenuti di Terze Parti e Privacy Avanzata
            </h2>
            <ul className="space-y-3 text-sm sm:text-base">
              <li>
                <strong className="text-white">Video YouTube:</strong> Quando presenti all&apos;interno delle schede del team/staff, i video sono incorporati tramite la modalità di privacy avanzata (<code className="rounded bg-black/60 px-2 py-0.5 text-xs text-brand">youtube-nocookie.com</code>), che impedisce a YouTube di memorizzare cookie di profilazione fino all&apos;interazione volontaria dell&apos;utente.
              </li>
              <li>
                <strong className="text-white">Feed Instagram:</strong> I contenuti social sono recuperati lato server e non rilasciano cookie di profilazione nel browser del visitatore.
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#121212] p-6 sm:p-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wide">
              5. Come Disabilitare i Cookie dal Browser
            </h2>
            <p>
              L&apos;utente può gestire o disabilitare i cookie in qualsiasi momento direttamente dalle impostazioni del proprio browser:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-sm text-white/75">
              <li><strong className="text-white">Google Chrome:</strong> Impostazioni &gt; Privacy e sicurezza &gt; Cookie e altri dati dei siti</li>
              <li><strong className="text-white">Mozilla Firefox:</strong> Opzioni &gt; Privacy e sicurezza &gt; Cookie e dati dei siti web</li>
              <li><strong className="text-white">Apple Safari:</strong> Preferenze &gt; Privacy &gt; Blocca tutti i cookie</li>
              <li><strong className="text-white">Microsoft Edge:</strong> Impostazioni &gt; Cookie e autorizzazioni sito</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#121212] p-6 sm:p-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wide">
              6. Titolare del Trattamento e Contatti
            </h2>
            <p>
              Per qualsiasi informazione relativa alla presente Cookie Policy o al trattamento dei dati, puoi contattare il responsabile:
            </p>
            <div className="rounded-xl border border-white/10 bg-black/50 p-4 text-sm space-y-1.5">
              <p className="font-bold text-white text-base">Cristian Dell&apos;Orto</p>
              <p className="text-white/80">Via Vittorio Veneto 44/a — 20863 Concorezzo (MB)</p>
              <p className="text-white/80">Codice Fiscale: <span className="font-mono text-white">DLLCST73R01B201L</span></p>
              <p className="pt-1">
                Email:{' '}
                <a
                  href="mailto:criss.dellorto@milanobeatradio.it"
                  className="text-brand font-medium hover:underline"
                >
                  criss.dellorto@milanobeatradio.it
                </a>
              </p>
              <p className="pt-2 text-white/60">
                Per l&apos;informativa generale completa sul trattamento dati, consulta la{' '}
                <Link href="/privacy-policy" className="text-brand hover:underline font-semibold">
                  Privacy Policy
                </Link>.
              </p>
            </div>
          </section>

          <div className="text-right text-xs text-white/50 pt-4">
            Ultimo aggiornamento: Settembre 2026
          </div>
        </div>
      </main>
    </>
  )
}
