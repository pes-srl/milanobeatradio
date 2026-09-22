import Image from 'next/image'
import Link from 'next/link'
import type { Event } from '@/src/payload-types'
import { IconCalendarAdd, IconPin } from '@/src/components/icons'
import { fmtDay, fmtMonthYear, googleCalendarUrl } from '@/src/lib/format'
import { imageAlt, imageUrl } from '@/src/lib/media'
import { StatsRow } from './StatsRow'

/** Event list item: clean poster on top, date badge + title + venue/artists in dedicated section below. */
export function EventItem({ event, priority = false }: { event: Event; priority?: boolean }) {
  const href = `/eventi/${event.slug}`
  const img = imageUrl(event.cover, 'hero')

  return (
    <article className="group relative flex flex-col w-full max-w-[610px] mx-auto overflow-hidden rounded-2xl bg-[#0f0f0f] border border-white/10 transition-all duration-300 hover:border-brand/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transform-gpu">
      {/* Poster Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-black/40 sm:aspect-[16/10]">
        <Link href={href} className="relative block size-full" aria-label={event.title}>
          {img ? (
            <Image
              src={img}
              alt={imageAlt(event.cover, event.title)}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, 610px"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="size-full bg-gradient-to-br from-brand-dark/40 to-black" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f]/60 via-transparent to-black/20 opacity-80 transition duration-300 group-hover:opacity-40" />
        </Link>

        {/* Add to Google Calendar Button */}
        <a
          href={googleCalendarUrl({
            title: event.title,
            startDate: event.startDate,
            endDate: event.endDate,
            address: event.address,
            venueName: event.venueName,
          })}
          target="_blank"
          rel="noreferrer"
          aria-label="Aggiungi al calendario"
          className="absolute right-3.5 top-3.5 z-10 grid size-10 place-items-center rounded-full border border-white/20 bg-black/80 sm:bg-black/60 text-white shadow-sm sm:shadow-md sm:backdrop-blur-md transition duration-200 hover:scale-110 hover:border-brand hover:bg-brand transform-gpu"
        >
          <IconCalendarAdd size={17} />
        </a>
      </div>

      {/* Info Section */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div className="flex items-start gap-4">
          {/* Date Badge */}
          <div className="flex shrink-0 flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center min-w-[58px] transition-colors group-hover:border-brand/30 group-hover:bg-brand/10">
            <span className="text-2xl font-bold leading-none text-white tracking-tight">
              {fmtDay(event.startDate)}
            </span>
            <span className="mt-1 text-[11px] font-bold uppercase tracking-wider text-brand">
              {fmtMonthYear(event.startDate)}
            </span>
          </div>

          {/* Event Details */}
          <div className="min-w-0 flex-1">
            {(event.venueName || event.city) && (
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/60">
                <IconPin size={13} className="shrink-0 text-brand" />
                <span className="truncate">
                  {event.venueName}
                  {event.venueName && event.city ? ' — ' : ''}
                  {event.city}
                </span>
              </div>
            )}

            <h3 className="mt-1 text-lg font-bold leading-snug text-white transition-colors group-hover:text-brand sm:text-xl">
              <Link href={href} className="hover:underline">
                {event.title}
              </Link>
            </h3>

            {event.artists && (
              <p className="mt-1.5 text-sm font-medium text-brand/90 line-clamp-1">
                {event.artists}
              </p>
            )}
          </div>
        </div>

        {/* Footer info: Stats & Link */}
        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3.5">
          <StatsRow stats={event.stats} />
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-white/70 transition hover:text-brand"
          >
            Dettagli →
          </Link>
        </div>
      </div>
    </article>
  )
}
