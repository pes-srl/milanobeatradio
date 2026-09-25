'use client'

import { useState } from 'react'
import type { Event } from '@/src/payload-types'
import { EventItem } from './EventItem'
import { loadMoreEvents } from '@/src/lib/actions'

type Props = {
  initialEvents: Event[]
  initialHasNextPage: boolean
}

export function EventsGrid({ initialEvents, initialHasNextPage }: Props) {
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage)
  const [loading, setLoading] = useState(false)

  const handleLoadMore = async () => {
    if (loading || !hasNextPage) return
    setLoading(true)
    try {
      const nextPage = page + 1
      const res = await loadMoreEvents(nextPage)
      setEvents((prev) => {
        const existingIds = new Set(prev.map((e) => e.id))
        const newDocs = res.docs.filter((e) => !existingIds.has(e.id))
        return [...prev, ...newDocs]
      })
      setPage(nextPage)
      setHasNextPage(res.hasNextPage)
    } catch (err) {
      console.error('Errore nel caricamento degli eventi:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="grid gap-8 sm:grid-cols-2">
        {events.map((e, i) => (
          <EventItem key={e.id} event={e} priority={i === 0} />
        ))}
      </div>

      {hasNextPage && (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loading}
            className="btn-pill cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Caricamento...
              </span>
            ) : (
              'Altri eventi'
            )}
          </button>
        </div>
      )}
    </>
  )
}
