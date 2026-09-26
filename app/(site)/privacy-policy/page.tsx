import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { DraftBanner } from '@/src/components/site/DraftBanner'
import { PageHero } from '@/src/components/site/PageHero'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | Milano Beat Radio',
  description: 'Informativa sul trattamento dei dati personali (GDPR) di Milano Beat Radio.',
}

export const revalidate = 3600

export default async function PrivacyPolicyPage() {
  const isDraft = (await draftMode()).isEnabled

  return (
    <>
      {isDraft && <DraftBanner path="/privacy-policy" />}
      <PageHero
        title="Privacy Policy"
        kicker="Informativa Legale"
        kickerColor="pink"
        subtitle="Informativa sul trattamento dei dati personali ai sensi del Regolamento UE 2016/679 (GDPR)"
      />

      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
        <div className="space-y-10 text-white/80 leading-relaxed">
          <section className="rounded-2xl border border-white/10 bg-[#121212] p-6 sm:p-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wide">
              1. Titolare del Trattamento
            </h2>
            <p>
              Il Titolare del trattamento dei dati personali per il progetto radiofonico e portale web{' '}
              <strong className="text-white">Milano Beat Radio</strong> (accessibile all&apos;indirizzo{' '}
              <span className="text-brand">https://milanobeatradio.it</span>) è:
            </p>
            <div className="rounded-xl border border-white/10 bg-black/50 p-4 text-sm sm:text-base space-y-1.5">
              <p className="font-bold text-white text-base">Cristian Dell&apos;Orto</p>
              <p className="text-white/80">Via Vittorio Veneto 44/a — 20863 Concorezzo (MB)</p>
              <p className="text-white/80">Codice Fiscale: <span className="font-mono text-white">DLLCST73R01B201L</span></p>
              <p className="pt-1">
                Email di contatto:{' '}
                <a
                  href="mailto:criss.dellorto@milanobeatradio.it"
                  className="text-brand font-medium hover:underline"
                >
                  criss.dellorto@milanobeatradio.it
                </a>
              </p>
            </div>
            <p className="text-sm text-white/60">
              Milano Beat Radio è un progetto privato, amatoriale e senza scopo di lucro, operante con regolari licenze{' '}
              <strong className="text-white/80">SIAE n. 5776/I/5533</strong> e{' '}
              <strong className="text-white/80">SCF n. 812/17</strong> per la diffusione radiofonica via web.
            </p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#121212] p-6 sm:p-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wide">
              2. Tipologia di Dati Trattati e Finalità
            </h2>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-brand">A. Dati forniti volontariamente dall&apos;utente</h3>
              <p>
                L&apos;invio facoltativo ed esplicito di messaggi tramite i moduli di contatto (es. &quot;Contatti&quot; o &quot;Segnala il tuo evento / Promuoviti&quot;) o direttamente via email comporta l&apos;acquisizione dei seguenti dati:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-sm sm:text-base">
                <li>Nome e/o pseudonimo</li>
                <li>Indirizzo email</li>
                <li>Oggetto e testo del messaggio inviato</li>
              </ul>
              <p className="text-sm text-white/70">
                <strong className="text-white">Finalità e conservazione:</strong> Tali dati vengono utilizzati esclusivamente per dare riscontro alle richieste dell&apos;utente o valutare le proposte editoriali pervenute. I dati non vengono inseriti in banche dati di marketing, non vengono ceduti a terzi e vengono conservati unicamente per il tempo strettamente necessario a gestire la corrispondenza.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-lg font-semibold text-brand">B. Dati di navigazione e streaming audio (Log Tecnici)</h3>
              <p>
                I sistemi informatici e le procedure software preposte al funzionamento di questo sito web e del server di streaming audio (AzuraCast) acquisiscono, nel corso del loro normale esercizio, alcuni dati tecnici la cui trasmissione è implicita nell&apos;uso dei protocolli di comunicazione di Internet (come indirizzi IP, tipo di browser utilizzato, data e orario delle richieste).
              </p>
              <p className="text-sm text-white/70">
                <strong className="text-white">Finalità:</strong> Questi dati vengono utilizzati al solo fine di garantire la corretta trasmissione del flusso radio, ricavare informazioni statistiche anonime sull&apos;uso del servizio e per finalità di sicurezza e prevenzione di abusi o attacchi informatici.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#121212] p-6 sm:p-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wide">
              3. Cookie e Tecnologie di Tracciamento
            </h2>
            <p>
              Milano Beat Radio adotta una politica di massima tutela della riservatezza:{' '}
              <strong className="text-white">il sito NON utilizza cookie di profilazione o tracciamento pubblicitario</strong>.
            </p>
            <p>
              Vengono utilizzati esclusivamente <strong className="text-white">cookie tecnici essenziali</strong> e strumenti di memorizzazione locale (come le preferenze del volume del player radio). Per maggiori dettagli, ti invitiamo a consultare la nostra{' '}
              <Link href="/cookie-policy" className="text-brand hover:underline font-semibold">
                Cookie Policy dedicata
              </Link>.
            </p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#121212] p-6 sm:p-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wide">
              4. Integrazioni e Contenuti di Terze Parti
            </h2>
            <ul className="space-y-3 text-sm sm:text-base">
              <li>
                <strong className="text-white">YouTube (Privacy Avanzata):</strong> I video YouTube integrati nelle schede informative utilizzano il dominio ad alta protezione{' '}
                <code className="rounded bg-black/60 px-2 py-0.5 text-xs text-brand">youtube-nocookie.com</code>. In questo modo Google non installa cookie traccianti sul dispositivo dell&apos;utente finché non viene avviata la riproduzione video.
              </li>
              <li>
                <strong className="text-white">Feed Instagram:</strong> Le immagini e i contenuti del profilo social ufficiale sono acquisiti tramite le API ufficiali Meta lato server, senza installare cookie di terze parti nel browser del visitatore.
              </li>
              <li>
                <strong className="text-white">Streaming Audio AzuraCast:</strong> Il flusso radio in diretta è trasmesso tramite server streaming dedicato senza cessione o commercializzazione dei dati degli ascoltatori.
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#121212] p-6 sm:p-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wide">
              5. Diritti dell&apos;Interessato (Artt. 15-22 GDPR)
            </h2>
            <p>
              In qualità di interessato, l&apos;utente ha diritto in qualunque momento di ottenere la conferma dell&apos;esistenza o meno dei propri dati personali, di conoscerne il contenuto e l&apos;origine, verificarne l&apos;esattezza o chiederne l&apos;integrazione, l&apos;aggiornamento, la rettifica oppure la cancellazione totale.
            </p>
            <p>
              Le richieste possono essere inviate senza alcuna formalità direttamente al Titolare del trattamento all&apos;indirizzo email:{' '}
              <a
                href="mailto:criss.dellorto@milanobeatradio.it"
                className="text-brand font-medium hover:underline"
              >
                criss.dellorto@milanobeatradio.it
              </a>.
            </p>
          </section>

          <div className="text-right text-xs text-white/50 pt-4">
            Ultimo aggiornamento: Settembre 2026
          </div>
        </div>
      </main>
    </>
  )
}
