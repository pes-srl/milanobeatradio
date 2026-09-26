import type { Metadata } from 'next'
import { ContactForm } from '@/src/components/site/ContactForm'
import { getMediaByFilename } from '@/src/lib/queries'
import { submitPromuoviti } from './actions'
import Image from 'next/image'
import { imageUrl } from '@/src/lib/media'

export const metadata: Metadata = {
  title: 'Segnala il tuo Evento | Milano Beat Radio',
  description: 'Segnala gratuitamente il tuo evento a Milano Beat Radio. Le migliori segnalazioni vengono pubblicate sul sito e sui canali MBR.',
}
export const revalidate = 300

const WHY_ITEMS = [
  {
    icon: '📡',
    title: 'Visibilità gratuita',
    desc: 'Gli eventi selezionati vengono pubblicati sul sito e condivisi sui canali social di MBR, senza costi.',
  },
  {
    icon: '🎯',
    title: 'Pubblico mirato',
    desc: 'Raggiungi un pubblico appassionato di musica, eventi e nightlife milanese già fidelizzato.',
  },
  {
    icon: '✅',
    title: 'Selezione editoriale',
    desc: 'La redazione valuta ogni segnalazione autonomamente. Pubblichiamo solo eventi coerenti con lo spirito MBR.',
  },
]

export default async function PromuovitiPage() {
  const heroImage = await getMediaByFilename('8.webp').catch(() => null)
  const heroSrc = heroImage ? (imageUrl(heroImage, 'hero') ?? '/media/8.webp') : '/media/8.webp'

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
        {/* Immagine di sfondo */}
        <Image
          src={heroSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        {/* Gradiente overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black" />

        {/* Glow viola */}
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-0">
          <div className="h-[300px] w-[700px] rounded-full bg-brand/20 blur-[100px]" />
        </div>

        {/* Contenuto hero */}
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-brand">
            Milano Beat Radio
          </p>
          <h1 className="flex flex-col items-center gap-2">
            <span className="text-3xl font-semibold uppercase tracking-wider text-white/90 sm:text-4xl lg:text-5xl">
              Raccontaci il tuo
            </span>
            <span className="bg-gradient-to-r from-[#e0246f] via-[#c824e3] to-[#a855f7] bg-clip-text text-6xl font-black uppercase tracking-tight text-transparent drop-shadow-[0_0_60px_rgba(200,36,227,0.8)] sm:text-8xl lg:text-9xl">
              EVENTO
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-base text-white/60 sm:text-lg">
            Segnala gratuitamente il tuo evento. Le segnalazioni più interessanti vengono
            pubblicate sul sito e sui canali social di MBR.
          </p>

          {/* CTA scroll */}
          <a
            href="#segnala"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-all duration-300 hover:bg-brand/25 hover:border-brand"
          >
            <span>Segnala ora</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
          </a>
        </div>
      </section>

      {/* ── PERCHÉ SEGNALARE ─────────────────────────────── */}
      <section className="border-y border-white/10 bg-[#0a0a0a] py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <p className="mb-10 text-center text-xs font-bold uppercase tracking-[0.25em] text-brand">Perché segnalarci il tuo evento</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {WHY_ITEMS.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors duration-300 hover:border-brand/30 hover:bg-white/[0.05]"
              >
                <div className="mb-3 text-3xl">{item.icon}</div>
                <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-white/55">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM ─────────────────────────────────────────── */}
      <section id="segnala" className="mx-auto max-w-6xl px-4 py-16 sm:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-20">

          {/* Form principale */}
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-brand">Redazione MBR</p>
            <h2 className="mb-2 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Segnala il tuo evento
            </h2>
            <p className="mb-8 text-white/60">
              Hai organizzato un evento a Milano o sul territorio? Compila il modulo: la redazione
              valuterà la tua segnalazione sulla base dell&apos;interesse editoriale.
            </p>
            <ContactForm
              action={submitPromuoviti}
              messageLabel="Raccontaci il tuo evento (data, luogo, artisti, link...)"
              submitLabel="Invia segnalazione"
            />
          </div>

          {/* Colonna info */}
          <aside className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-brand/20 bg-brand/5 p-6 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-brand">Come funziona</p>
              <ol className="space-y-3 text-sm text-white/70">
                <li className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand/20 text-xs font-bold text-brand">1</span>
                  <span>Compili il modulo con i dettagli del tuo evento.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand/20 text-xs font-bold text-brand">2</span>
                  <span>La redazione MBR valuta la segnalazione in autonomia.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand/20 text-xs font-bold text-brand">3</span>
                  <span>Se selezionato, il tuo evento viene pubblicato gratuitamente sul sito e sui social MBR.</span>
                </li>
              </ol>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Cosa includere</p>
              <ul className="space-y-1.5 text-xs text-white/50">
                <li>• Nome e data dell&apos;evento</li>
                <li>• Location e città</li>
                <li>• Artisti / line-up</li>
                <li>• Link biglietti o pagina ufficiale</li>
                <li>• Contatto per eventuali domande</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
              <p className="text-xs leading-relaxed text-white/35">
                Il servizio è completamente gratuito. MBR è un progetto editoriale indipendente e si riserva il diritto di non pubblicare segnalazioni non coerenti con la propria linea editoriale.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
