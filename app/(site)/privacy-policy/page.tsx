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

          <section className="rounded-2xl border border-white/10 bg-[#121212] p-6 sm:p-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wide">
              6. Note Editoriali: Non Testata Giornalistica (L. 62/2001), Diritto al Racconto (Art. 21 Cost.) e Tutela Marchi
            </h2>
            <p>
              Uno degli scopi fondamentali e fondanti di <strong className="text-white">Milano Beat Radio</strong> è la divulgazione informativa e la valorizzazione culturale a titolo interamente gratuito del territorio, della musica, degli spettacoli, del teatro, della nightlife e delle iniziative che animano la città metropolitana di <strong className="text-white">Milano e la sua provincia</strong>, nonché la provincia di <strong className="text-white">Monza e della Brianza</strong>.
            </p>
            <div className="space-y-3 pt-2 text-sm sm:text-base">
              <div className="rounded-xl border border-brand/20 bg-brand/5 p-4 sm:p-5 space-y-2">
                <p className="font-bold text-white">
                  Esonero Legge 62/2001 e Garanzia Costituzionale al Racconto:
                </p>
                <p className="text-white/80 leading-relaxed text-sm">
                  Ai sensi dell&apos;art. 1, comma 3 della <strong className="text-white">Legge 7 marzo 2001, n. 62</strong>, si dichiara espressamente che questo sito web, il canale radiofonico e i relativi canali social <strong className="text-white">non costituiscono una testata giornalistica</strong> e non rientrano nella categoria dei prodotti editoriali periodici, in quanto aggiornati senza alcuna periodicità predeterminata e gestiti su base amatoriale, culturale e volontaria.
                </p>
                <p className="text-white/80 leading-relaxed text-sm">
                  L&apos;attività di racconto di notizie, interviste ad artisti, cronaca degli eventi e divulgazione territoriale è pienamente autorizzata e tutelata dall&apos;<strong className="text-white">Articolo 21 della Costituzione della Repubblica Italiana</strong>, che garantisce a tutti il diritto fondamentale di manifestare liberamente il proprio pensiero con la parola, lo scritto e ogni altro mezzo di diffusione.
                </p>
              </div>

              <p>
                <strong className="text-white">Finalità esclusivamente informativa e non commerciale:</strong> La pubblicazione di notizie, articoli, recensioni, locandine o segnalazioni nel calendario eventi avviene unicamente con fini divulgativi, di intrattenimento e nell&apos;esercizio del diritto di cronaca e di libera manifestazione del pensiero. Milano Beat Radio non percepisce alcun compenso economico da tali segnalazioni, che sono svolte in piena autonomia redazionale a supporto della comunità locale.
              </p>
              <p>
                <strong className="text-white">Titolarità di Marchi, Loghi e Denominazioni:</strong> Tutti i marchi registrati, loghi, denominazioni di locali, discoteche, club, teatri, rassegne, artisti e format citati sul portale o durante le trasmissioni appartengono ai rispettivi e legittimi titolari. La loro menzione ha funzione esclusivamente descrittiva e identificativa dell&apos;evento o dell&apos;attività (fair use ai sensi della normativa sulla proprietà industriale), volta a favorire la fruizione culturale da parte del pubblico.
              </p>
              <p>
                <strong className="text-white">Disponibilità a Rettifiche e Rimozioni:</strong> Nel rispetto della massima collaborazione con organizzatori, locali e titolari di diritti, qualora chiunque desiderasse aggiornare, integrare o richiedere la rimozione di informazioni, immagini o riferimenti riguardanti le proprie attività, può scrivere a{' '}
                <a
                  href="mailto:info@milanobeatradio.it"
                  className="text-brand font-medium hover:underline"
                >
                  info@milanobeatradio.it
                </a>{' '}
                o{' '}
                <a
                  href="mailto:criss.dellorto@milanobeatradio.it"
                  className="text-brand font-medium hover:underline"
                >
                  criss.dellorto@milanobeatradio.it
                </a>
                . La redazione accoglierà e processerà la richiesta tempestivamente.
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
