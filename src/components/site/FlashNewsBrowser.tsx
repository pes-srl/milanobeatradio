'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import type { Post } from '@/src/payload-types'
import { FlashNewsGrid } from './FlashNewsGrid'
import { loadMorePosts } from '@/src/lib/actions'

type Props = {
  initialPosts: Post[]
  initialHasNextPage: boolean
}

type TagResult = { tag: string; docs: Post[]; hasNextPage: boolean }

/**
 * The City News archive. The page itself is static (served from the CDN), so the `?tag=` filter
 * is resolved here on the client: without a tag it shows the pre-rendered list, with a tag it
 * fetches the first page of that tag through the same server action the "Altro" button uses.
 */
export function FlashNewsBrowser({ initialPosts, initialHasNextPage }: Props) {
  const tag = useSearchParams().get('tag') || undefined
  const [result, setResult] = useState<TagResult | null>(null)

  useEffect(() => {
    if (!tag) return
    let cancelled = false
    loadMorePosts(1, tag)
      .then((res) => {
        if (!cancelled) setResult({ tag, docs: res.docs, hasNextPage: res.hasNextPage })
      })
      .catch((err) => {
        console.error('Errore nel caricamento delle notizie:', err)
        if (!cancelled) setResult({ tag, docs: [], hasNextPage: false })
      })
    return () => {
      cancelled = true
    }
  }, [tag])

  const loaded = tag ? (result?.tag === tag ? result : null) : { tag: '', docs: initialPosts, hasNextPage: initialHasNextPage }

  return (
    <>
      {/* Active tag filter banner */}
      {tag && (
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-white/60">Stai visualizzando il tag:</span>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand bg-brand/10 px-4 py-1.5 text-sm font-bold text-brand">
            #{tag}
          </span>
          <Link
            href="/flash-news"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            × Tutti gli articoli
          </Link>
        </div>
      )}

      {!loaded ? (
        <div className="flex justify-center py-20" role="status" aria-label="Caricamento">
          <span className="size-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </div>
      ) : loaded.docs.length > 0 ? (
        <FlashNewsGrid
          key={tag ?? 'all'}
          initialPosts={loaded.docs}
          initialHasNextPage={loaded.hasNextPage}
          tag={tag}
        />
      ) : (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <p className="text-lg font-semibold text-white/60">
            Nessun articolo trovato{tag ? ` per il tag "#${tag}"` : ''}.
          </p>
          {tag && (
            <Link
              href="/flash-news"
              className="inline-flex items-center gap-2 rounded-xl border border-brand/40 bg-brand/10 px-5 py-2.5 text-sm font-bold text-brand transition hover:bg-brand hover:text-white"
            >
              ← Vedi tutti gli articoli
            </Link>
          )}
        </div>
      )}
    </>
  )
}
