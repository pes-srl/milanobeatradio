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
const MAX_RETRIES = 3

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

  const play = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    wantPlaying.current = true
    setStatus('loading')
    // Fresh URL each time so we join the live edge instead of a stale buffer.
    audio.src = `${STREAM_URL}?_=${Date.now()}`
    audio.load()
    audio.play().catch(() => {
      // Autoplay policy or network: surface an error state, listener can retry.
      if (wantPlaying.current) setStatus('error')
    })
  }, [])

  const pause = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    wantPlaying.current = false
    retries.current = 0
    audio.pause()
    // Live stream: drop the connection instead of buffering forever in the background.
    audio.removeAttribute('src')
    audio.load()
    setStatus('paused')
  }, [])

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

  // <audio> event wiring, including auto-retry with backoff when the stream drops.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    let retryTimer: ReturnType<typeof setTimeout> | null = null

    const onPlaying = () => {
      retries.current = 0
      setStatus('playing')
    }
    const onWaiting = () => {
      if (wantPlaying.current) setStatus('loading')
    }
    const onError = () => {
      if (!wantPlaying.current) return
      if (retries.current < MAX_RETRIES) {
        const delay = 2000 * 2 ** retries.current
        retries.current += 1
        setStatus('loading')
        retryTimer = setTimeout(() => wantPlaying.current && play(), delay)
      } else {
        setStatus('error')
      }
    }

    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('stalled', onWaiting)
    audio.addEventListener('error', onError)
    return () => {
      if (retryTimer) clearTimeout(retryTimer)
      audio.removeEventListener('playing', onPlaying)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('stalled', onWaiting)
      audio.removeEventListener('error', onError)
    }
  }, [play])

  // Media Session API: lock-screen / headset / car controls on mobile.
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return
    const song = nowPlaying.data?.now_playing.song
    const live = nowPlaying.data?.live
    const title = live?.is_live && live.streamer_name ? `LIVE · ${live.streamer_name}` : song?.title || song?.text || 'Milano Beat Radio'
    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist: song?.artist || 'Milano Beat Radio',
      album: 'Your Event and Party Station',
      artwork: song?.art ? [{ src: song.art, sizes: '512x512', type: 'image/jpeg' }] : [],
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
  }, [nowPlaying.data, status, play, pause])

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
