import type { Metadata } from 'next'
import { PageHero } from '@/src/components/site/PageHero'
import { ContactForm } from '@/src/components/site/ContactForm'
import { getMediaByFilename } from '@/src/lib/queries'
import { submitPromuoviti } from './actions'

export const metadata: Metadata = { title: 'Promuoviti' }
export const revalidate = 300

export default async function PromuovitiPage() {
  const heroImage = await getMediaByFilename('8.webp').catch(() => null)

  return (
    <>
      <PageHero
        image={heroImage ?? '/media/8.webp'}
        size="lg"
        title={
          <span className="flex flex-col items-center">
            <span className="block text-2xl font-semibold uppercase tracking-wider text-white sm:text-4xl lg:text-5xl">
              Raccontaci il tuo
            </span>
            <span className="mt-2 block bg-gradient-to-r from-[#e0246f] via-[#c824e3] to-[#a855f7] bg-clip-text text-5xl font-black uppercase tracking-tight text-transparent drop-shadow-[0_0_40px_rgba(200,36,227,0.7)] sm:text-7xl lg:text-8xl">
              EVENTO
            </span>
          </span>
        }
      />
      <section className="bg-black py-16">
        <div className="mx-auto max-w-xl px-4 sm:px-8">
          <h2 className="mb-2 text-2xl font-semibold uppercase tracking-wide text-brand">Il tuo evento</h2>
          <p className="mb-8 text-white/70">Promuovi gratuitamente la tua iniziativa, evento o progetto sul territorio.</p>
          <ContactForm action={submitPromuoviti} messageLabel="Raccontaci il tuo evento" submitLabel="Invia" />
        </div>
      </section>
    </>
  )
}
