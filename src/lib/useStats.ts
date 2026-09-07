'use client'

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import type { StatsAction, StatsCollection } from './stats'

type Target = { collection: StatsCollection; id: number }

async function send(target: Target, action: StatsAction): Promise<number | null> {
  try {
    const res = await fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...target, action }),
      keepalive: true,
    })
    if (!res.ok) return null
    const data = (await res.json()) as { counted?: boolean; value?: number }
    return data.counted && typeof data.value === 'number' ? data.value : null
  } catch {
    return null // counters must never break the page
  }
}

/** Storage helpers that degrade quietly in private mode / blocked storage. */
const read = (storage: 'sessionStorage' | 'localStorage', key: string): string | null => {
  try {
    return window[storage].getItem(key)
  } catch {
    return null
  }
}
const write = (storage: 'sessionStorage' | 'localStorage', key: string, value: string) => {
  try {
    window[storage].setItem(key, value)
  } catch {
    /* ignore */
  }
}
const remove = (storage: 'sessionStorage' | 'localStorage', key: string) => {
  try {
    window[storage].removeItem(key)
  } catch {
    /* ignore */
  }
}

/**
 * Counts one view per document per browser tab session. Reloading the page does not
 * inflate the number, and the request is fired after paint so it never delays rendering.
 */
export function useViewCount(target: Target, initial: number) {
  const [views, setViews] = useState(initial)

  useEffect(() => {
    const key = `mbr:viewed:${target.collection}:${target.id}`
    if (read('sessionStorage', key)) return

    const timer = window.setTimeout(async () => {
      // Claim the view inside the timer, not before scheduling it: React StrictMode runs
      // effects twice in development, and marking it up front made the second run skip
      // the send entirely, so nothing was ever counted.
      if (read('sessionStorage', key)) return
      write('sessionStorage', key, '1')
      const value = await send(target, 'view')
      if (value !== null) setViews(value)
    }, 1200) // a real reader stays; a bounce does not get counted
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- target is recreated each render; its fields are the real identity
  }, [target.collection, target.id])

  return views
}

/** No external events to listen to: the only writer is this hook. */
const noopSubscribe = () => () => {}

/** Like toggle, remembered per browser so the same person cannot inflate the count. */
export function useLike(target: Target, initial: number) {
  const key = `mbr:liked:${target.collection}:${target.id}`
  const [likes, setLikes] = useState(initial)

  // localStorage does not exist while rendering on the server, so it is read through
  // useSyncExternalStore: `false` on the server, the real value once hydrated. Once the
  // reader clicks, the local override wins over what is stored.
  const stored = useSyncExternalStore(
    noopSubscribe,
    () => read('localStorage', key) !== null,
    () => false,
  )
  const [override, setOverride] = useState<boolean | null>(null)
  const liked = override ?? stored

  const toggle = useCallback(async () => {
    const next = !liked
    setOverride(next)
    setLikes((n) => Math.max(0, n + (next ? 1 : -1))) // optimistic
    if (next) write('localStorage', key, '1')
    else remove('localStorage', key)

    const value = await send(target, next ? 'like' : 'unlike')
    if (value !== null) setLikes(value)
  }, [liked, key, target])

  return { likes, liked, toggle }
}

/** Share counter: incremented when the reader actually shares, not when the page loads. */
export function useShare(target: Target, initial: number) {
  const [shares, setShares] = useState(initial)

  const registerShare = useCallback(async () => {
    setShares((n) => n + 1)
    const value = await send(target, 'share')
    if (value !== null) setShares(value)
  }, [target])

  return { shares, registerShare }
}
