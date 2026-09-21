'use client'

import { useState, useEffect } from 'react'
import type { Post } from '@/src/payload-types'
import { PostCard } from './PostCard'
import { loadMorePosts } from '@/src/lib/actions'

type Props = {
  initialPosts: Post[]
  initialHasNextPage: boolean
  tag?: string
}

export function FlashNewsGrid({ initialPosts, initialHasNextPage, tag }: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setPosts(initialPosts)
    setPage(1)
    setHasNextPage(initialHasNextPage)
  }, [initialPosts, initialHasNextPage, tag])

  const handleLoadMore = async () => {
    if (loading || !hasNextPage) return
    setLoading(true)
    try {
      const nextPage = page + 1
      const res = await loadMorePosts(nextPage, tag)
      setPosts((prev) => [...prev, ...res.docs])
      setPage(nextPage)
      setHasNextPage(res.hasNextPage)
    } catch (err) {
      console.error('Errore nel caricamento delle notizie:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p, i) => (
          <PostCard key={p.id} post={p} priority={i < 3} />
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
