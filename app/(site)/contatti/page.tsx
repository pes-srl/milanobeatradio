import type { Metadata } from 'next'
import { PageHero } from '@/src/components/site/PageHero'
import { ContactForm } from '@/src/components/site/ContactForm'
import { submitContact } from './actions'

export const metadata: Metadata = { title: 'Contatti' }

export default function ContattiPage() {
  return (
    <>
      <PageHero title="Contact Us" kicker="What's up?" kickerColor="pink" size="lg" />
      <section className="mx-auto max-w-xl px-4 py-16 sm:px-8">
        <h2 className="mb-2 text-2xl font-semibold uppercase tracking-wide">Contacts</h2>
        <p className="mb-8 text-white/70">Seriously, we want to hear about you</p>
        <ContactForm action={submitContact} />
      </section>
    </>
  )
}
