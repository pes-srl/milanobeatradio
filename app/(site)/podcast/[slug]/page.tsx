import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageHero } from '@/src/components/site/PageHero'
import { RichText } from '@/src/components/site/RichText'
import { PodcastPlayer } from '@/src/components/site/PodcastPlayer'
import { ShareButton } from '@/src/components/site/ShareButton'
import { fmtDate } from '@/src/lib/format'
import { imageUrl } from '@/src/lib/media'
import { getPodcast } from '@/src/lib/queries'

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const podcast = await getPodcast(slug)
  if (!podcast) return {}
  return { title: podcast.title, openGraph: { images: imageUrl(podcast.cover, 'hero') ? [imageUrl(podcast.cover, 'hero')!] : undefined } }
}

export default async function PodcastPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const podcast = await getPodcast(slug)
  if (!podcast) notFound()

  const audioFile = typeof podcast.audioFile === 'object' ? podcast.audioFile : null
  const src = audioFile?.url || podcast.audioUrl
  const filter = podcast.filters?.find((f): f is Extract<typeof podcast.filters[number], object> => typeof f === 'object')

  return (
    <>
      <PageHero title={podcast.title} image={podcast.cover} kicker={filter?.name} size="lg" uppercase={false} />
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
        {podcast.publishedAt && <p className="mb-6 text-sm font-semibold text-white/60">{fmtDate(podcast.publishedAt)}</p>}
        {src && (
          <div className="mb-10 rounded-lg bg-white/5 p-4">
            <PodcastPlayer src={src} title={podcast.title} />
          </div>
        )}
        {podcast.description && <RichText data={podcast.description} />}
      </article>
      <ShareButton title={podcast.title} />
    </>
  )
}
