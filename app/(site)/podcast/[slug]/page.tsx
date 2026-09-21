import Image from 'next/image'
import Link from 'next/link'
import { draftMode } from 'next/headers'
import { DraftBanner } from '@/src/components/site/DraftBanner'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@/src/components/site/RichText'
import { PodcastPlayer } from '@/src/components/site/PodcastPlayer'
import { StatsBar } from '@/src/components/site/StatsBar'
import { ShareButtons } from '@/src/components/site/ShareButtons'
import { IconCalendar } from '@/src/components/icons'
import { fmtDate } from '@/src/lib/format'
import { imageAlt, imageUrl } from '@/src/lib/media'
import { getPodcast } from '@/src/lib/queries'

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const podcast = await getPodcast(slug)
  if (!podcast) return {}

  const img = imageUrl(podcast.cover, 'hero')
  const description = 'Ascolta l\'intervista e lo speciale esclusivo su Milano Beat Radio.'

  return {
    title: podcast.title,
    description,
    openGraph: {
      title: podcast.title,
      description,
      type: 'article',
      url: `/podcast/${slug}`,
      images: img ? [{ url: img, width: 1200, height: 630, alt: podcast.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: podcast.title,
      description,
      images: img ? [img] : undefined,
    },
  }
}

export default async function PodcastPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const isDraft = (await draftMode()).isEnabled
  const podcast = await getPodcast(slug, isDraft)
  if (!podcast) notFound()

  const audioFile = typeof podcast.audioFile === 'object' ? podcast.audioFile : null
  const src = audioFile?.url || podcast.audioUrl
  const filter = podcast.filters?.find((f): f is Extract<typeof podcast.filters[number], object> => typeof f === 'object')
  const img = imageUrl(podcast.cover, 'hero')

  return (
    <div className="relative min-h-screen bg-black text-white">
      {isDraft && <DraftBanner path={`/podcast/${slug}`} />}

      {/* Ambient background glow */}
      {img && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] overflow-hidden opacity-25">
          <Image
            src={img}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover blur-3xl scale-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-black" />
        </div>
      )}

      <main className="relative z-10 mx-auto max-w-6xl px-4 pt-8 pb-20 sm:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/interviste"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/60 transition hover:text-brand"
          >
            ← Tutte le interviste
          </Link>
        </div>

        {/* Main Showcase Grid */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 items-start lg:items-center">
          {/* Left Column: Full Clean Cover Photo */}
          <div className="mx-auto w-full max-w-[540px] lg:max-w-none">
            <div className="relative aspect-video sm:aspect-[16/10] lg:aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f0f] shadow-[0_15px_50px_rgba(0,0,0,0.9)]">
              {img ? (
                <Image
                  src={img}
                  alt={imageAlt(podcast.cover, podcast.title)}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover"
                />
              ) : (
                <div className="size-full bg-gradient-to-br from-brand-dark to-black" />
              )}
            </div>
          </div>

          {/* Right Column: Dedicated Info & Audio Player */}
          <div className="flex flex-col space-y-5">
            {/* Filter / Category Badge */}
            {filter?.name && (
              <div>
                <span className="inline-block rounded-full border border-brand/40 bg-brand/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand">
                  {filter.name.replace(/podcast/gi, '').trim() || 'Intervista'}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
              {podcast.title}
            </h1>

            {/* Meta: Published Date */}
            {podcast.publishedAt && (
              <div className="flex items-center gap-2 text-sm font-semibold text-white/70">
                <IconCalendar size={16} className="text-brand" />
                <span>{fmtDate(podcast.publishedAt)}</span>
              </div>
            )}

            {/* Dedicated Audio Player Box */}
            {src && (
              <div className="rounded-2xl border border-brand/30 bg-[#121212] p-5 shadow-xl space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-brand">
                  Ascolta l'intervista
                </p>
                <PodcastPlayer src={src} title={podcast.title} />
              </div>
            )}

            {/* Share Buttons */}
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-white/50">Condividi</p>
              <ShareButtons title={podcast.title} />
            </div>

            {/* Stats Bar */}
            <div className="border-t border-white/10 pt-4">
              <StatsBar
                collection="podcasts"
                id={podcast.id}
                title={podcast.title}
                views={podcast.stats?.views}
                likes={podcast.stats?.likes}
                shares={podcast.stats?.shares}
              />
            </div>
          </div>
        </div>

        {/* Content / Description (if any) */}
        {podcast.description && (
          <div className="mt-14 border-t border-white/10 pt-10">
            <h2 className="mb-6 text-2xl font-bold uppercase tracking-wider text-white">Dettagli Intervista</h2>
            <article className="prose prose-invert max-w-none text-white/90">
              <RichText data={podcast.description} />
            </article>
          </div>
        )}
      </main>
    </div>
  )
}
