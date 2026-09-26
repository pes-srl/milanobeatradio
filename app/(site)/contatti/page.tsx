import type { Metadata } from 'next'
import { ContactForm } from '@/src/components/site/ContactForm'
import { IconInstagram, IconFacebook } from '@/src/components/icons'
import { getSite } from '@/src/lib/queries'
import { submitContact } from './actions'

export const metadata: Metadata = {
  title: 'Contatti | Milano Beat Radio',
  description: 'Mettiti in contatto con la redazione di Milano Beat Radio.',
}

export default async function ContattiPage() {
  const site = await getSite().catch(() => null)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero compatto */}
      <section className="relative overflow-hidden border-b border-white/10 py-20 sm:py-28">
        {/* Glow decorativo */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[400px] w-[600px] rounded-full bg-brand/10 blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-brand">Milano Beat Radio</p>
          <h1 className="text-5xl font-black uppercase tracking-tight text-white sm:text-7xl">
            Contattaci
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-white/60 sm:text-lg">
            Hai una domanda, una proposta o vuoi metterti in contatto con la redazione?
            Siamo qui per ascoltarti.
          </p>
        </div>
      </section>

      {/* Layout a due colonne */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_420px] lg:gap-20">

          {/* Colonna sinistra — Form */}
          <div>
            <h2 className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-brand">Scrivi alla redazione</h2>
            <p className="mb-8 text-2xl font-semibold text-white">Invia un messaggio</p>
            <ContactForm
              action={submitContact}
              messageLabel="Il tuo messaggio"
              submitLabel="Invia messaggio"
            />
          </div>

          {/* Colonna destra — Info contatto */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">

            {/* Email */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand/15">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-white/50">Email</p>
                  <a
                    href="mailto:info@milanobeatradio.it"
                    className="text-sm font-medium text-white hover:text-brand transition-colors"
                  >
                    info@milanobeatradio.it
                  </a>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/50">Seguici sui social</p>
              <div className="flex flex-col gap-3">
                {site?.instagram && (
                  <a
                    href={site.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm font-medium text-white/80 transition-all duration-200 hover:border-[#E1306C]/50 hover:text-white hover:shadow-[0_0_20px_rgba(225,48,108,0.15)]"
                  >
                    <IconInstagram size={20} variant="badge" />
                    <span>@milanobeatradio_mbr</span>
                  </a>
                )}
                {site?.facebook && (
                  <a
                    href={site.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm font-medium text-white/80 transition-all duration-200 hover:border-[#1877F2]/50 hover:text-white hover:shadow-[0_0_20px_rgba(24,119,242,0.15)]"
                  >
                    <IconFacebook size={20} />
                    <span>Milano Beat Radio</span>
                  </a>
                )}
              </div>
            </div>

            {/* Nota editoriale */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
              <p className="text-xs leading-relaxed text-white/40">
                Milano Beat Radio è un progetto editoriale indipendente, amatoriale e senza scopo di lucro. I messaggi vengono letti dalla redazione e ricevono risposta nei limiti della disponibilità volontaria dei collaboratori.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
