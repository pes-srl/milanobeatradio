import Image from 'next/image'
import Link from 'next/link'
import type { Genre, Show } from '@/src/payload-types'
import { imageAlt, imageUrl } from '@/src/lib/media'

type Props = { show: Show; start?: string; end?: string; onAir?: boolean }

/** Schedule / show card: cover, genre tag, title, time range, optional "Ora in onda". */
export function ShowCard({ show, start, end, onAir = false }: Props) {
  const img = imageUrl(show.cover, 'card')
  const genre = show.genres?.find((g): g is Genre => typeof g === 'object')
  return (
    <article className="group relative aspect-video overflow-hidden bg-[#0f0f0f]">
      <Link href={`/programmi/${show.slug}`} className="absolute inset-0" aria-label={show.title}>
        {img && <Image src={img} alt={imageAlt(show.cover, show.title)} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px" className="object-cover transition duration-500 group-hover:scale-105" />}
        <div className="overlay absolute inset-0" />
      </Link>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
        {onAir && <span className="mb-1 inline-block bg-white/90 px-1.5 text-[11px] font-medium text-black">Ora in onda</span>}
        <br />
        {genre && <span className="tag">{genre.name}</span>}
        <h3 className="mt-1 text-lg font-medium leading-snug">
          <Link href={`/programmi/${show.slug}`} className="pointer-events-auto hover:text-brand">{show.title}</Link>
        </h3>
        {start && end && <p className="mt-1 text-xs font-bold">{start} - {end}</p>}
      </div>
    </article>
  )
}
