import Image from 'next/image'
import Link from 'next/link'
import type { Event } from '@/src/payload-types'
import { IconCalendarAdd } from '@/src/components/icons'
import { fmtDay, fmtMonthYear, googleCalendarUrl } from '@/src/lib/format'
import { imageAlt, imageUrl } from '@/src/lib/media'
import { StatsRow } from './StatsRow'

/** Event list item as on the original: big day, month, venue — city, title, artists, calendar icon. */
export function EventItem({ event, priority = false }: { event: Event; priority?: boolean }) {
  const href = `/eventi/${event.slug}`
  const img = imageUrl(event.cover, 'hero')
  return (
    <article className="group relative mx-auto aspect-[16/10] w-full max-w-[610px] overflow-hidden bg-[#0f0f0f] sm:aspect-[16/9]">
      <Link href={href} className="absolute inset-0" aria-label={event.title}>
        {img && (
          <Image src={img} alt={imageAlt(event.cover, event.title)} fill priority={priority} sizes="(max-width: 640px) 100vw, 610px" className="object-cover opacity-70 transition duration-500 group-hover:scale-105 group-hover:opacity-90" />
        )}
        <div className="overlay absolute inset-0" />
      </Link>
      <div className="pointer-events-none absolute left-5 top-5">
        <p className="text-6xl font-light leading-none">{fmtDay(event.startDate)}</p>
        <p className="mt-1 text-lg">{fmtMonthYear(event.startDate)}</p>
      </div>
      <a
        href={googleCalendarUrl({ title: event.title, startDate: event.startDate, endDate: event.endDate, address: event.address, venueName: event.venueName })}
        target="_blank"
        rel="noreferrer"
        aria-label="Aggiungi al calendario"
        className="absolute right-5 top-5 grid size-11 place-items-center rounded-full border-2 border-white bg-black/40 text-white transition hover:bg-brand"
      >
        <IconCalendarAdd size={18} />
      </a>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6">
        {(event.venueName || event.city) && (
          <p className="text-xs font-bold">
            {event.venueName}
            {event.venueName && event.city ? ' — ' : ''}
            {event.city}
          </p>
        )}
        <h3 className="mt-1 text-2xl font-medium leading-tight sm:text-3xl">
          <Link href={href} className="pointer-events-auto hover:text-brand">
            {event.title}
          </Link>
        </h3>
        {event.artists && <p className="mt-2 text-brand">{event.artists}</p>}
        <StatsRow stats={event.stats} className="mt-2" />
      </div>
    </article>
  )
}
