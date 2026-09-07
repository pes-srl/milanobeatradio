import Image from 'next/image'
import type { Metadata } from 'next'
import { imageAlt, imageUrl } from '@/src/lib/media'
import { getSite } from '@/src/lib/queries'

export const metadata: Metadata = { title: 'MBR Events' }
export const revalidate = 300

/**
 * MBR Events: promotional page for the radio's own event/party services.
 * The hero graphic is a designed asset with its title and tagline already baked in
 * ("MBR EVENTS — Musica, atmosfera, groove… — Molto più di un DJ set"): no text overlay needed.
 */
export default async function MbrEventsPage() {
  const site = await getSite().catch(() => null)
  const hero = imageUrl(site?.mbrEventsHero, 'hero')
  const posters = (site?.mbrEventsPosters ?? []).map((p) => p.image).filter((m) => imageUrl(m, 'card'))

  return (
    <>
      <section className="relative aspect-[16/9] w-full overflow-hidden bg-black sm:aspect-[21/9]">
        {hero && <Image src={hero} alt="MBR Events — Molto più di un DJ set" fill priority sizes="100vw" className="object-cover" />}
      </section>

      {posters.length > 0 && (
        <section className="mx-auto grid max-w-[1440px] grid-cols-2 gap-1 px-4 py-16 sm:px-8 md:grid-cols-3 lg:grid-cols-6">
          {posters.map((m, i) => (
            <div key={i} className="relative aspect-[2/3] overflow-hidden">
              <Image src={imageUrl(m, 'card')!} alt={imageAlt(m, '')} fill sizes="(max-width: 768px) 50vw, 16vw" className="object-cover transition duration-500 hover:scale-105" />
            </div>
          ))}
        </section>
      )}
    </>
  )
}
