import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'MBR Events | Milano Beat Radio',
  description: 'MBR Events — DJ Set, musica live, atmosfera e groove. Il format radiofonico che porta Milano Beat Radio dal web alla tua location.',
}

export const revalidate = 300

const HERO_IMAGE = 'https://pub-df0e74f6b3f940c5a570551308d6944f.r2.dev/media/2.webp'

/* ──────────────────────────────────────────────────────────
   CONCETTI ESTRATTI DALLE SLIDE (filtrati: no commerciale)
   ──────────────────────────────────────────────────────────
   ✓ DJ Set · Musica live · Atmosfera
   ✓ Licenze SIAE regolari (trasparenza e rispetto delle regole)
   ✓ Presenza radiofonica / on air durante l'evento
   ✓ Promozione sul territorio e sui canali MBR
   ✓ Groove · Nightlife milanese
   ✗ Nessuna dicitura commerciale o tariffaria
   ─────────────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: '🎧',
    label: 'DJ Set',
    desc: "Musica selezionata, groove autentico. Dalla consolle al dancefloor, un'unica vibrazione.",
  },
  {
    icon: '📡',
    label: 'On Air',
    desc: "L'evento entra in onda su Milano Beat Radio. La tua serata raggiunge migliaia di ascoltatori.",
  },
  {
    icon: '🎙️',
    label: 'Interviste live',
    desc: 'Artisti, promoter e ospiti: voci vere, in diretta. Racconto autentico di ciò che succede.',
  },
  {
    icon: '📋',
    label: 'Licenze SIAE',
    desc: 'Tutto regolare, tutto in ordine. Operiamo con regolari licenze SIAE e SCF per la diffusione musicale.',
  },
  {
    icon: '📣',
    label: 'Promozione locale',
    desc: "L'evento viene comunicato sul sito MBR e sui canali social, prima e dopo la serata.",
  },
  {
    icon: '🌃',
    label: 'Nightlife milanese',
    desc: 'Radicati nel territorio. Conoscenza profonda della scena, delle location e del pubblico di Milano.',
  },
]

const VIBES = [
  { word: 'GROOVE', size: 'text-5xl sm:text-7xl', opacity: 'opacity-100', color: 'text-white' },
  { word: 'ENERGIA', size: 'text-3xl sm:text-5xl', opacity: 'opacity-60', color: 'text-brand' },
  { word: 'MILANO', size: 'text-4xl sm:text-6xl', opacity: 'opacity-80', color: 'text-white' },
  { word: 'MUSICA', size: 'text-2xl sm:text-4xl', opacity: 'opacity-50', color: 'text-white' },
  { word: 'NOTTE', size: 'text-5xl sm:text-8xl', opacity: 'opacity-90', color: 'text-brand' },
  { word: 'ATMOSFERA', size: 'text-3xl sm:text-5xl', opacity: 'opacity-70', color: 'text-white' },
  { word: 'BEAT', size: 'text-6xl sm:text-9xl', opacity: 'opacity-100', color: 'text-white' },
  { word: 'LIVE', size: 'text-3xl sm:text-6xl', opacity: 'opacity-60', color: 'text-brand' },
]

export default async function MbrEventsV2Page() {
  return (
    <div className="min-h-screen overflow-hidden bg-black text-white">

      {/* ═══════════════════════════════════════════════
          HERO — Cinematografico, immersivo
      ═══════════════════════════════════════════════ */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <Image
          src={HERO_IMAGE}
          alt="MBR Events"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Multi-layer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        {/* Glow brand */}
        <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-[400px] w-[900px] rounded-full bg-brand/15 blur-[120px]" />

        {/* Contenuto */}
        <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-12">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-2 backdrop-blur-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-brand" />
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Format MBR Events</span>
            </div>

            <h1 className="mb-4 text-6xl font-black uppercase leading-none tracking-tight sm:text-8xl lg:text-[120px]">
              <span className="block text-white">MBR</span>
              <span className="block bg-gradient-to-r from-[#e0246f] via-[#c824e3] to-[#a855f7] bg-clip-text text-transparent">
                EVENTS
              </span>
            </h1>

            <p className="mb-2 text-xl font-semibold text-white/90 sm:text-2xl">
              Molto più di un DJ set.
            </p>
            <p className="mb-8 max-w-lg text-base leading-relaxed text-white/60 sm:text-lg">
              Musica, atmosfera e groove. La radio dal vivo, nella tua location. Un&apos;esperienza
              sonora curata da chi Milano la conosce davvero.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#scopri"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_30px_rgba(200,36,227,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(200,36,227,0.7)]"
              >
                Scopri il format
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
              </a>
              <a
                href="mailto:events@milanobeatradio.it?subject=Info%20MBR%20Events"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white/10"
              >
                Scrivici
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
          <span className="text-[10px] font-bold uppercase tracking-widest">Scroll</span>
          <div className="h-8 w-px bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          VIBE WALL — Parole chiave in stile editoriale
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-y border-white/[0.06] bg-[#080808] py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(141,20,163,0.12),transparent)]" />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <p className="mb-12 text-xs font-bold uppercase tracking-[0.3em] text-white/30">L&apos;energia di MBR Events</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {VIBES.map((v) => (
              <span
                key={v.word}
                className={`font-black uppercase leading-none tracking-tight ${v.size} ${v.opacity} ${v.color} transition-opacity duration-300 hover:opacity-100`}
              >
                {v.word}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          MANIFESTO — Testo editoriale immersivo
      ═══════════════════════════════════════════════ */}
      <section id="scopri" className="mx-auto max-w-4xl px-6 py-24 sm:py-32">
        <div className="relative">
          {/* Linea decorativa */}
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand">Il progetto</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
          </div>

          <h2 className="mb-8 text-center text-4xl font-black uppercase leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            La radio che esce<br />
            <span className="bg-gradient-to-r from-[#e0246f] via-[#c824e3] to-[#a855f7] bg-clip-text text-transparent">
              dallo schermo
            </span>
          </h2>

          <div className="mx-auto max-w-2xl space-y-5 text-center text-base leading-relaxed text-white/65 sm:text-lg">
            <p>
              MBR Events nasce dall&apos;idea di portare l&apos;energia di Milano Beat Radio
              fuori dal digitale. Non solo una trasmissione, ma una presenza fisica:
              musica selezionata, atmosfera costruita con cura, il groove che si percepisce.
            </p>
            <p>
              Ogni appuntamento è un racconto sonoro del territorio milanese.
              Artisti, location, pubblico: tutto diventa parte del format.
            </p>
            <p className="text-white/45 text-sm">
              Operiamo con licenze SIAE n. 5776/I/5533 e SCF n. 812/17 — la diffusione musicale è sempre regolare.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FEATURES — 6 card in griglia
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#070707] py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-brand">Cosa porta MBR Events</p>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">Il format</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div
                key={f.label}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-all duration-500 hover:border-brand/30 hover:bg-white/[0.05]"
              >
                {/* Glow on hover */}
                <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(200,36,227,0.08),transparent)]" />

                <div className="relative z-10">
                  <span className="mb-4 block text-4xl">{f.icon}</span>
                  <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-white">{f.label}</h3>
                  <p className="text-sm leading-relaxed text-white/50 group-hover:text-white/70 transition-colors duration-300">{f.desc}</p>
                </div>

                {/* Corner number */}
                <span className="absolute bottom-4 right-5 text-5xl font-black text-white/[0.04] transition-all duration-300 group-hover:text-white/[0.08]">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TIMELINE — Come nasce un MBR Event
      ═══════════════════════════════════════════════ */}
      <section className="mx-auto max-w-3xl px-6 py-24 sm:py-32">
        <div className="mb-14 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-brand">Come funziona</p>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">Il percorso</h2>
        </div>

        <div className="relative space-y-0">
          {/* Linea verticale */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-brand/50 via-brand/20 to-transparent" />

          {[
            { n: '01', t: 'Contatto', d: 'Ci scrivi, ci racconti la tua idea, la tua location, il tipo di serata che immagini.' },
            { n: '02', t: 'Confronto', d: 'Valutiamo insieme se e come MBR Events può essere parte del progetto. Nessun impegno.' },
            { n: '03', t: 'Preparazione', d: 'Selezione musicale, comunicazione, dettagli tecnici: tutto curato con la stessa attenzione che mettiamo in radio.' },
            { n: '04', t: 'Evento', d: 'La serata prende vita. Musica, atmosfera, la voce di MBR in diretta dal dancefloor.' },
            { n: '05', t: 'On Air & Online', d: "L'evento viene raccontato sui canali MBR. Un'eco che dura oltre la notte." },
          ].map((step) => (
            <div key={step.n} className="relative flex gap-8 pb-10 last:pb-0">
              {/* Dot */}
              <div className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border border-brand/40 bg-black text-xs font-black text-brand">
                {step.n}
              </div>
              <div className="pt-2.5">
                <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-white">{step.t}</h3>
                <p className="text-sm leading-relaxed text-white/50">{step.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CTA FINALE — Incuriosire, non vendere
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#080808]">
        {/* Immagine sfondo full-bleed */}
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
        </div>

        {/* Glow centrale */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[500px] w-[800px] rounded-full bg-brand/15 blur-[150px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 py-28 text-center sm:py-40">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-brand">Ti incuriosisce?</p>
          <h2 className="mb-6 text-4xl font-black uppercase leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
            Parliamoci<span className="text-brand">.</span>
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
            Nessun modulo, nessun preventivo. Solo una conversazione per capire se
            MBR Events può fare al caso tuo.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="mailto:events@milanobeatradio.it?subject=Info%20MBR%20Events"
              className="inline-flex items-center gap-3 rounded-full bg-brand px-8 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_40px_rgba(200,36,227,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_rgba(200,36,227,0.8)]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              events@milanobeatradio.it
            </a>
            <Link
              href="/contatti"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white/80 backdrop-blur-sm transition-all duration-300 hover:border-white hover:text-white"
            >
              Altre domande? Scrivici
            </Link>
          </div>

          <p className="mt-12 text-xs text-white/25">
            Milano Beat Radio · Licenza SIAE n. 5776/I/5533 · Licenza SCF n. 812/17
          </p>
        </div>
      </section>
    </div>
  )
}
