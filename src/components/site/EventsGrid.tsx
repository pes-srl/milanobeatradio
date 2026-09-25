'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Event } from '@/src/payload-types'
import { EventItem } from './EventItem'
import { loadMoreEvents } from '@/src/lib/actions'
import { IconCalendar, IconClock } from '@/src/components/icons'

type Props = {
  initialUpcomingEvents: Event[]
  initialUpcomingHasNext: boolean
  initialPastEvents: Event[]
  initialPastHasNext: boolean
  totalPastCount?: number
}

export function EventsGrid({
  initialUpcomingEvents,
  initialUpcomingHasNext,
  initialPastEvents,
  initialPastHasNext,
  totalPastCount = 0,
}: Props) {
  // Upcoming events state
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>(initialUpcomingEvents)
  const [upcomingPage, setUpcomingPage] = useState(1)
  const [upcomingHasNext, setUpcomingHasNext] = useState(initialUpcomingHasNext)
  const [upcomingLoading, setUpcomingLoading] = useState(false)

  // Past events state (auto-opened if no upcoming events exist)
  const hasUpcoming = initialUpcomingEvents.length > 0
  const [showPast, setShowPast] = useState(!hasUpcoming)
  const [pastEvents, setPastEvents] = useState<Event[]>(initialPastEvents)
  const [pastPage, setPastPage] = useState(1)
  const [pastHasNext, setPastHasNext] = useState(initialPastHasNext)
  const [pastLoading, setPastLoading] = useState(false)

  const handleLoadMoreUpcoming = async () => {
    if (upcomingLoading || !upcomingHasNext) return
    setUpcomingLoading(true)
    try {
      const nextPage = upcomingPage + 1
      const res = await loadMoreEvents(nextPage, 'upcoming')
      setUpcomingEvents((prev) => {
        const existingIds = new Set(prev.map((e) => e.id))
        const newDocs = res.docs.filter((e) => !existingIds.has(e.id))
        return [...prev, ...newDocs]
      })
      setUpcomingPage(nextPage)
      setUpcomingHasNext(res.hasNextPage)
    } catch (err) {
      console.error('Errore nel caricamento degli eventi in programma:', err)
    } finally {
      setUpcomingLoading(false)
    }
  }

  const handleLoadMorePast = async () => {
    if (pastLoading || !pastHasNext) return
    setPastLoading(true)
    try {
      const nextPage = pastPage + 1
      const res = await loadMoreEvents(nextPage, 'past')
      setPastEvents((prev) => {
        const existingIds = new Set(prev.map((e) => e.id))
        const newDocs = res.docs.filter((e) => !existingIds.has(e.id))
        return [...prev, ...newDocs]
      })
      setPastPage(nextPage)
      setPastHasNext(res.hasNextPage)
    } catch (err) {
      console.error('Errore nel caricamento degli eventi passati:', err)
    } finally {
      setPastLoading(false)
    }
  }

  return (
    <div className="space-y-12">
      {/* 1. UPCOMING EVENTS SECTION */}
      {hasUpcoming ? (
        <div>
          <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand">Next Up</span>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">In Programma</h2>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
              {upcomingEvents.length} {upcomingEvents.length === 1 ? 'evento' : 'eventi'}
            </span>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            {upcomingEvents.map((e, i) => (
              <EventItem key={e.id} event={e} priority={i === 0} />
            ))}
          </div>

          {upcomingHasNext && (
            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={handleLoadMoreUpcoming}
                disabled={upcomingLoading}
                className="btn-pill cursor-pointer disabled:opacity-50"
              >
                {upcomingLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Caricamento...
                  </span>
                ) : (
                  'Altri eventi in programma'
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Stylish MBR Nightlife Update Banner when editorial staff is preparing new dates */
        <div className="rounded-2xl border border-brand/30 bg-gradient-to-br from-brand/10 via-[#12051e]/80 to-black p-6 sm:p-10 text-center shadow-[0_8px_30px_rgba(200,36,227,0.15)]">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full border border-brand/40 bg-brand/10 text-brand shadow-[0_0_20px_rgba(200,36,227,0.3)]">
            <IconCalendar size={28} />
          </div>
          <span className="inline-block rounded-full border border-brand/40 bg-brand/15 px-4 py-1 text-xs font-bold uppercase tracking-wider text-brand">
            Milano Nightlife
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
            Agenda Eventi in Aggiornamento
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-white/70 leading-relaxed">
            La redazione di Milano Beat Radio sta selezionando i migliori party, serate e guest in arrivo per questo weekend nei club di Milano. Resta sintonizzato per le nuove date!
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/promuoviti" className="btn-pill">
              Segnala il tuo evento / Promuoviti ↗
            </Link>
          </div>
        </div>
      )}

      {/* 2. PAST EVENTS / ARCHIVE SECTION */}
      {pastEvents.length > 0 && (
        <div className="pt-6">
          {!showPast ? (
            <div className="flex flex-col items-center justify-center border-t border-white/10 pt-10 text-center">
              <p className="mb-4 text-sm font-medium text-white/60">
                Vuoi vedere i grandi party e le serate che abbiamo promosso a Milano?
              </p>
              <button
                type="button"
                onClick={() => setShowPast(true)}
                className="btn-pill inline-flex items-center gap-2 cursor-pointer border border-white/20 bg-white/5 hover:border-brand/40 hover:bg-brand/10 transition"
              >
                <IconClock size={16} className="text-brand" />
                <span>
                  Mostra archivio eventi passati {totalPastCount > 0 ? `(${totalPastCount})` : ''}
                </span>
              </button>
            </div>
          ) : (
            <div className="border-t border-white/10 pt-12">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand">MBR Archive</span>
                  <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Eventi Passati
                  </h3>
                </div>
                {hasUpcoming && (
                  <button
                    type="button"
                    onClick={() => setShowPast(false)}
                    className="text-xs font-semibold uppercase tracking-wider text-white/50 hover:text-white transition cursor-pointer"
                  >
                    Nascondi archivio ↑
                  </button>
                )}
              </div>

              <div className="grid gap-8 sm:grid-cols-2 opacity-90">
                {pastEvents.map((e) => (
                  <EventItem key={e.id} event={e} priority={false} />
                ))}
              </div>

              {pastHasNext && (
                <div className="mt-12 flex justify-center">
                  <button
                    type="button"
                    onClick={handleLoadMorePast}
                    disabled={pastLoading}
                    className="btn-pill cursor-pointer disabled:opacity-50"
                  >
                    {pastLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Caricamento...
                      </span>
                    ) : (
                      'Altri eventi passati'
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
