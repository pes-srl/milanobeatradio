import Image from 'next/image'
import Link from 'next/link'
import type { Podcast, PodcastFilter } from '@/src/payload-types'
import { IconPlayOutline } from '@/src/components/icons'
import { imageAlt, imageUrl } from '@/src/lib/media'
import { StatsRow } from './StatsRow'

export function PodcastCard({ podcast, priority = false }: { podcast: Podcast; priority?: boolean }) {
  const href = `/podcast/${podcast.slug}`
  const img = imageUrl(podcast.cover, 'card')
  const filter = podcast.filters?.find((f): f is PodcastFilter => typeof f === 'object')
  return (
    <article className="group relative aspect-[4/5] overflow-hidden bg-[#0f0f0f]">
      <Link href={href} className="absolute inset-0" aria-label={podcast.title}>
        {img && (
          <Image src={img} alt={imageAlt(podcast.cover, podcast.title)} fill priority={priority} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px" className="object-cover transition duration-500 group-hover:scale-105" />
        )}
        <div className="overlay absolute inset-0" />
        <span className="absolute right-4 top-4 grid size-11 place-items-center rounded-full border-2 border-white bg-black/40 text-white transition group-hover:bg-brand">
          <IconPlayOutline size={18} />
        </span>
      </Link>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
        {filter && <span className="tag">{filter.name}</span>}
        <h3 className="mt-2 text-lg font-medium leading-snug">
          <Link href={href} className="pointer-events-auto hover:text-brand">{podcast.title}</Link>
        </h3>
        <StatsRow date={podcast.publishedAt} stats={podcast.stats} className="mt-2" />
      </div>
    </article>
  )
}
