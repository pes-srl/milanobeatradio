import Link from 'next/link'
import type { Metadata } from 'next'
import { HomeHero } from '@/src/components/site/HomeHero'
import { SectionTitle } from '@/src/components/site/SectionTitle'
import { PostCard } from '@/src/components/site/PostCard'
import { InstagramFeed } from '@/src/components/site/InstagramFeed'
import { EventItem } from '@/src/components/site/EventItem'
import { Mosaic } from '@/src/components/site/Mosaic'
import { PartnerLogos } from '@/src/components/site/PartnerLogos'
import { getEvents, getPartners, getPosts, getSite } from '@/src/lib/queries'
import { getInstagramFeed } from '@/src/lib/instagram'

export const metadata: Metadata = { title: 'Milano Beat Radio — Your Event and Party Station' }
export const revalidate = 300

/** Home. Section order: hero → CITY EVENTS → INSTAGRAM FEED → CITY NEWS → PARTNERS → mosaic. */
export default async function HomePage() {
  const [site, posts, events, partners, instagramFeed] = await Promise.all([
    getSite().catch(() => null),
    getPosts({ limit: 6 }),
    getEvents({ upcoming: true, limit: 4, minCount: 4 }),
    getPartners(),
    getInstagramFeed().catch(() => null),
  ])

  return (
    <>
      <HomeHero site={site} />

      <section className="px-4 py-20 sm:px-8">
        <SectionTitle>City Events</SectionTitle>
        {events.docs.length > 0 ? (
          <div className="mx-auto mt-10 grid max-w-[1440px] gap-8 sm:grid-cols-2">
            {events.docs.slice(0, 4).map((e, i) => (
              <EventItem key={e.id} event={e} priority={i === 0} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-center text-white/60">Nessun evento in programma.</p>
        )}
        <div className="mt-10 text-center">
          <Link href="/eventi" className="btn-pill">Tutti gli eventi</Link>
        </div>
      </section>

      <InstagramFeed site={site} feed={instagramFeed} />

      <section className="bg-[#050505] px-4 py-20 sm:px-8">
        <SectionTitle>City News</SectionTitle>
        {posts.docs.length > 0 ? (
          <>
            <div className="mx-auto mt-10 grid max-w-[1440px] gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {posts.docs.map((p, i) => (
                <PostCard key={p.id} post={p} priority={i < 3} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/flash-news" className="btn-pill">Tutte le news</Link>
            </div>
          </>
        ) : (
          <p className="mt-10 text-center text-white/60">Nessuna news pubblicata.</p>
        )}
      </section>

      <section className="px-4 py-20 sm:px-8 sm:py-28">
        <SectionTitle>Partners</SectionTitle>
        <div className="mt-16 sm:mt-24">
          <PartnerLogos partners={partners.docs} />
        </div>
      </section>

      <Mosaic site={site} />
    </>
  )
}
