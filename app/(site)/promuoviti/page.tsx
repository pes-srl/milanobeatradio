import type { Metadata } from 'next'
import { PageHero } from '@/src/components/site/PageHero'
import { ContactForm } from '@/src/components/site/ContactForm'
import { submitPromuoviti } from './actions'

export const metadata: Metadata = { title: 'Promuoviti' }

export default function PromuovitiPage() {
  return (
    <>
      <PageHero title="Raccontaci il tuo evento" size="lg" />
      <section className="mx-auto max-w-xl px-4 py-16 sm:px-8">
        <h2 className="mb-2 text-2xl font-semibold uppercase tracking-wide text-emerald-400">Il tuo evento</h2>
        <p className="mb-8 text-white/70">Promuovi gratuitamente la tua iniziativa, evento o progetto sul territorio.</p>
        <ContactForm action={submitPromuoviti} messageLabel="Raccontaci il tuo evento" submitLabel="Invia" />
      </section>
    </>
  )
}
