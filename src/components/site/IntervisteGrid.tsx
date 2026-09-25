'use client'

import { useState } from 'react'
import type { Podcast } from '@/src/payload-types'
import { PodcastCard } from './PodcastCard'
import { loadMorePodcasts } from '@/src/lib/actions'

type Props = {
  initialPodcasts: Podcast[]
  initialHasNextPage: boolean
}

export function IntervisteGrid({ initialPodcasts, initialHasNextPage }: Props) {
  const [podcasts, setPodcasts] = useState<Podcast[]>(initialPodcasts)
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage)
  const [loading, setLoading] = useState(false)

  const handleLoadMore = async () => {
    if (loading || !hasNextPage) return
    setLoading(true)
    try {
      const nextPage = page + 1
      const res = await loadMorePodcasts(nextPage)
      setPodcasts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id))
        const newDocs = res.docs.filter((p) => !existingIds.has(p.id))
        return [...prev, ...newDocs]
      })
      setPage(nextPage)
      setHasNextPage(res.hasNextPage)
    } catch (err) {
      console.error('Errore nel caricamento delle interviste:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {podcasts.map((p, i) => (
          <PodcastCard key={p.id} podcast={p} priority={i < 3} />
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
              'Altro'
            )}
          </button>
        </div>
      )}
    </>
  )
}
