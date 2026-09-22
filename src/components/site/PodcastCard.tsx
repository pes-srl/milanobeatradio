import Image from 'next/image'
import Link from 'next/link'
import type { Podcast, PodcastFilter } from '@/src/payload-types'
import { IconPlayOutline } from '@/src/components/icons'
import { imageAlt, imageUrl } from '@/src/lib/media'
import { StatsRow } from './StatsRow'

/** Podcast / Interview card: clean cover on top, category + title + meta in dedicated section below. */
export function PodcastCard({ podcast, priority = false }: { podcast: Podcast; priority?: boolean }) {
  const href = `/podcast/${podcast.slug}`
  const img = imageUrl(podcast.cover, 'card')
  const filter = podcast.filters?.find((f): f is PodcastFilter => typeof f === 'object')

  return (
    <article className="group relative flex flex-col w-full overflow-hidden rounded-2xl bg-[#0f0f0f] border border-white/10 transition-all duration-300 hover:border-brand/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transform-gpu">
      {/* Cover Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-black/40 sm:aspect-[16/10]">
        <Link href={href} className="relative block size-full" aria-label={podcast.title}>
          {img ? (
            <Image
              src={img}
              alt={imageAlt(podcast.cover, podcast.title)}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="size-full bg-gradient-to-br from-brand-dark/40 to-black" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f]/60 via-transparent to-black/20 opacity-80 transition duration-300 group-hover:opacity-40" />

          {/* Floating Play Button */}
          <span className="absolute right-3.5 top-3.5 z-10 grid size-10 place-items-center rounded-full border border-white/20 bg-black/75 sm:bg-black/60 text-white shadow-sm sm:shadow-md backdrop-blur-sm sm:backdrop-blur-md transition duration-200 group-hover:scale-110 group-hover:border-brand group-hover:bg-brand transform-gpu">
            <IconPlayOutline size={18} />
          </span>
        </Link>
      </div>

      {/* Info Section */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          {filter && (
            <span className="tag">
              {filter.name.replace(/podcast/gi, '').trim() || 'Intervista'}
            </span>
          )}
          <h3 className="mt-2 text-lg font-bold leading-snug text-white transition-colors group-hover:text-brand line-clamp-2">
            <Link href={href} className="hover:underline">
              {podcast.title}
            </Link>
          </h3>
        </div>

        {/* Footer meta: Stats & link */}
        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3.5">
          <StatsRow date={podcast.publishedAt} stats={podcast.stats} />
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-white/70 transition hover:text-brand"
          >
            Ascolta →
          </Link>
        </div>
      </div>
    </article>
  )
}
