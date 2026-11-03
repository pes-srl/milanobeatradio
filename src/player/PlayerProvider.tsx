'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { STREAM_URL } from '@/src/lib/azuracast'
import { useNowPlaying, type NowPlayingState } from './useNowPlaying'

export type PlayerStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error'

type PlayerContextValue = {
  status: PlayerStatus
  volume: number
  muted: boolean
  nowPlaying: NowPlayingState
  play: () => void
  pause: () => void
  toggle: () => void
  setVolume: (v: number) => void
  toggleMute: () => void
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

const VOLUME_KEY = 'mbr:volume'
const MAX_RETRIES = 5
const STALL_TIMEOUT_MS = 12_000

/**
 * Owns the single <audio> element of the whole site. It is rendered ONCE in
 * app/(site)/layout.tsx and never unmounts on navigation: the stream never stops.
 */
export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [status, setStatus] = useState<PlayerStatus>('idle')
  const [volume, setVolumeState] = useState(1)
  const [muted, setMuted] = useState(false)
  const wantPlaying = useRef(false)
  const retries = useRef(0)
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stallTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scheduleRetryRef = useRef<() => void>(() => {})
  const nowPlaying = useNowPlaying()

  // Restore persisted volume (per browser). Deferred to a callback so hydration
  // renders the default first and React does not cascade renders inside the effect.
  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(VOLUME_KEY)
        if (saved !== null) setVolumeState(Math.min(1, Math.max(0, Number(saved))))
      } catch {
        /* storage unavailable: keep default */
      }
    }, 0)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
    audio.muted = muted
  }, [volume, muted])

  const clearTimers = useCallback(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current)
      retryTimerRef.current = null
    }
    if (stallTimerRef.current) {
      clearTimeout(stallTimerRef.current)
      stallTimerRef.current = null
    }
  }, [])

  const startStream = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    clearTimers()
    setStatus('loading')
    // Fresh URL each time so we join the live edge instead of a stale buffer.
    audio.src = `${STREAM_URL}?_=${Date.now()}`
    audio.load()
    audio.play().catch((err: unknown) => {
      if (!wantPlaying.current) return
      // User interaction blocked by browser autoplay policy
      if (err instanceof Error && err.name === 'NotAllowedError') {
        setStatus('error')
        return
      }
      scheduleRetryRef.current()
    })
  }, [clearTimers])

  const play = useCallback(() => {
    wantPlaying.current = true
    retries.current = 0
    startStream()
  }, [startStream])

  const pause = useCallback(() => {
    const audio = audioRef.current
    wantPlaying.current = false
    retries.current = 0
    clearTimers()
    if (audio) {
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
    }
    setStatus('paused')
  }, [clearTimers])

  const scheduleRetry = useCallback(() => {
    if (!wantPlaying.current) return
    clearTimers()
    if (retries.current < MAX_RETRIES) {
      const delay = Math.min(30_000, 2000 * 2 ** retries.current)
      retries.current += 1
      setStatus('loading')
      retryTimerRef.current = setTimeout(() => {
        if (wantPlaying.current) startStream()
      }, delay)
    } else {
      setStatus('error')
    }
  }, [clearTimers, startStream])

  useEffect(() => {
    scheduleRetryRef.current = scheduleRetry
  }, [scheduleRetry])

  const toggle = useCallback(() => {
    if (status === 'playing' || status === 'loading') pause()
    else play()
  }, [status, play, pause])

  const setVolume = useCallback((v: number) => {
    const clamped = Math.min(1, Math.max(0, v))
    setVolumeState(clamped)
    if (clamped > 0) setMuted(false)
    try {
      window.localStorage.setItem(VOLUME_KEY, String(clamped))
    } catch {
      /* ignore */
    }
  }, [])

  const toggleMute = useCallback(() => setMuted((m) => !m), [])

  // <audio> event wiring, watchdog for stream stalls and network online recovery.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onPlaying = () => {
      retries.current = 0
      clearTimers()
      setStatus('playing')
    }

    const onWaiting = () => {
      if (!wantPlaying.current) return
      setStatus('loading')
      // If stalled/waiting for more than 12s without resuming, reconnect to live edge
      if (!stallTimerRef.current) {
        stallTimerRef.current = setTimeout(() => {
          if (wantPlaying.current) {
            scheduleRetryRef.current()
          }
        }, STALL_TIMEOUT_MS)
      }
    }

    const onError = () => {
      if (!wantPlaying.current) return
      scheduleRetryRef.current()
    }

    const onOnline = () => {
      // Reconnect immediately when browser regains internet access
      if (wantPlaying.current) {
        retries.current = 0
        startStream()
      }
    }

    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('stalled', onWaiting)
    audio.addEventListener('error', onError)
    window.addEventListener('online', onOnline)

    return () => {
      clearTimers()
      audio.removeEventListener('playing', onPlaying)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('stalled', onWaiting)
      audio.removeEventListener('error', onError)
      window.removeEventListener('online', onOnline)
    }
  }, [clearTimers, startStream])

  // Media Session API: lock-screen / headset / car controls on mobile.
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return
    navigator.mediaSession.metadata = new MediaMetadata({
      title: 'Milano Beat Radio',
      artist: 'Your Event & Party Station',
      album: 'Milano Beat Radio',
      artwork: [{ src: '/mbr-logo-v2.png', sizes: '512x512', type: 'image/png' }],
    })
    navigator.mediaSession.playbackState = status === 'playing' ? 'playing' : status === 'paused' || status === 'idle' ? 'paused' : 'none'
    navigator.mediaSession.setActionHandler('play', play)
    navigator.mediaSession.setActionHandler('pause', pause)
    navigator.mediaSession.setActionHandler('stop', pause)
    return () => {
      navigator.mediaSession.setActionHandler('play', null)
      navigator.mediaSession.setActionHandler('pause', null)
      navigator.mediaSession.setActionHandler('stop', null)
    }
  }, [status, play, pause])

  const value = useMemo<PlayerContextValue>(
    () => ({ status, volume, muted, nowPlaying, play, pause, toggle, setVolume, toggleMute }),
    [status, volume, muted, nowPlaying, play, pause, toggle, setVolume, toggleMute],
  )

  return (
    <PlayerContext.Provider value={value}>
      {/* The one and only audio element. preload="none": nothing downloads until Play. */}
      <audio ref={audioRef} preload="none" playsInline aria-hidden="true" />
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used inside <PlayerProvider>')
  return ctx
}
