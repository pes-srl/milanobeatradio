'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchNowPlaying, type NowPlaying } from '@/src/lib/azuracast'

export type NowPlayingState = {
  data: NowPlaying | null
  /** True when the last poll failed; `data` keeps the last good value. */
  stale: boolean
  updatedAt: number | null
}

/**
 * Polls AzuraCast every `intervalMs` (default 15 s). Polling stops while the tab is
 * hidden and resumes with an immediate fetch when it becomes visible again.
 */
export function useNowPlaying(intervalMs = 15_000): NowPlayingState {
  const [state, setState] = useState<NowPlayingState>({ data: null, stale: false, updatedAt: null })
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const controller = useRef<AbortController | null>(null)

  const poll = useCallback(async () => {
    controller.current?.abort()
    controller.current = new AbortController()
    const data = await fetchNowPlaying(controller.current.signal)
    if (controller.current.signal.aborted) return
    setState((prev) =>
      data ? { data, stale: false, updatedAt: Date.now() } : { ...prev, stale: true },
    )
  }, [])

  useEffect(() => {
    const start = () => {
      stop()
      void poll()
      timer.current = setInterval(() => void poll(), intervalMs)
    }
    const stop = () => {
      if (timer.current) clearInterval(timer.current)
      timer.current = null
    }
    const onVisibility = () => (document.hidden ? stop() : start())

    start()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      stop()
      controller.current?.abort()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [intervalMs, poll])

  return state
}
