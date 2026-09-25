'use server'

import { getPosts, getEvents, getPodcasts } from './queries'
import type { Post, Event, Podcast } from '@/src/payload-types'

export async function loadMorePosts(page: number, tag?: string): Promise<{ docs: Post[]; hasNextPage: boolean }> {
  const res = await getPosts({ limit: 6, page, tag })
  return {
    docs: JSON.parse(JSON.stringify(res.docs)),
    hasNextPage: res.hasNextPage,
  }
}

export async function loadMoreEvents(page: number, mode: 'upcoming' | 'past' = 'upcoming'): Promise<{ docs: Event[]; hasNextPage: boolean }> {
  const res = mode === 'past'
    ? await getEvents({ past: true, limit: 4, page })
    : await getEvents({ upcoming: true, limit: 4, page })
  return {
    docs: JSON.parse(JSON.stringify(res.docs)),
    hasNextPage: res.hasNextPage,
  }
}

export async function loadMorePodcasts(page: number): Promise<{ docs: Podcast[]; hasNextPage: boolean }> {
  const res = await getPodcasts({ filter: 'intervista', limit: 6, page })
  return {
    docs: JSON.parse(JSON.stringify(res.docs)),
    hasNextPage: res.hasNextPage,
  }
}
