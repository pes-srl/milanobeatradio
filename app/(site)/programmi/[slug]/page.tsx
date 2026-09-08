import { draftMode } from 'next/headers'
import { DraftBanner } from '@/src/components/site/DraftBanner'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageHero } from '@/src/components/site/PageHero'
import { RichText } from '@/src/components/site/RichText'
import { SocialLinks } from '@/src/components/site/SocialLinks'
import { StatsBar } from '@/src/components/site/StatsBar'
import { imageUrl } from '@/src/lib/media'
import { getShow } from '@/src/lib/queries'
import type { Genre, Staff } from '@/src/payload-types'

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const show = await getShow(slug)
  if (!show) return {}
  return { title: show.title, openGraph: { images: imageUrl(show.cover, 'hero') ? [imageUrl(show.cover, 'hero')!] : undefined } }
}

export default async function ShowPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const isDraft = (await draftMode()).isEnabled
  const show = await getShow(slug, isDraft)
  if (!show) notFound()

  const hosts = (show.hosts ?? []).filter((h): h is Staff => typeof h === 'object')
  const genres = (show.genres ?? []).filter((g): g is Genre => typeof g === 'object')

  return (
    <>
      {isDraft && <DraftBanner path={`/programmi/${slug}`} />}
      <PageHero title={show.title} image={show.cover} kicker={genres[0]?.name} kickerColor="white" size="lg">
        {show.subtitle && <p className="mt-4 text-lg italic text-white/90">{show.subtitle}</p>}
      </PageHero>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
        <div className="mb-8 border-b border-white/10 pb-5">
          <StatsBar collection="shows" id={show.id} title={show.title} views={show.stats?.views} likes={show.stats?.likes} shares={show.stats?.shares} />
        </div>
        {show.description && <RichText data={show.description} />}
        {hosts.length > 0 && (
          <div className="mt-12 border-t border-white/10 pt-8">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/60">Conduttori</p>
            <ul className="flex flex-wrap gap-6">
              {hosts.map((h) => (
                <li key={h.id} className="text-center">
                  <p className="font-medium">{h.title}</p>
                  <div className="mt-1"><SocialLinks socials={h.socials} size="sm" /></div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </>
  )
}
