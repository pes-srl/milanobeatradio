'use client'

import { useEffect, useState, useCallback } from 'react'
import { STREAM_URL } from '@/src/lib/azuracast'
import { DAY_NAMES_IT, nowInRome, slotIsOn, type Slot } from '@/src/lib/format'

type ShowDoc = {
  id: string
  title: string
  slots?: Slot[]
}

type AudioStatus = 'idle' | 'loading' | 'playing'
type Listener = (status: AudioStatus) => void

/**
 * Singleton audio manager that persists across Next.js SPA page transitions
 * inside the Payload Admin area.
 */
class AdminAudioManager {
  private static instance: AdminAudioManager
  private audio: HTMLAudioElement | null = null
  private status: AudioStatus = 'idle'
  private listeners = new Set<Listener>()

  private constructor() {}

  static getInstance(): AdminAudioManager {
    if (!AdminAudioManager.instance) {
      AdminAudioManager.instance = new AdminAudioManager()
    }
    return AdminAudioManager.instance
  }

  getStatus(): AudioStatus {
    return this.status
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    listener(this.status)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.status)
    }
  }

  toggle() {
    if (this.status === 'playing' || this.status === 'loading') {
      if (this.audio) {
        this.audio.pause()
        this.audio.src = ''
        this.audio.load()
      }
      this.status = 'idle'
      this.notify()
    } else {
      this.status = 'loading'
      this.notify()

      if (!this.audio) {
        this.audio = new Audio()
      }
      const audio = this.audio
      audio.src = `${STREAM_URL}?_=${Date.now()}`
      audio.preload = 'none'

      audio.onplaying = () => {
        this.status = 'playing'
        this.notify()
      }

      audio.onerror = () => {
        this.status = 'idle'
        audio.src = ''
        this.notify()
      }

      audio.onpause = () => {
        if (audio.src && this.status !== 'loading') {
          this.status = 'idle'
          this.notify()
        }
      }

      audio.play().catch(() => {
        this.status = 'idle'
        this.notify()
      })
    }
  }
}

/**
 * Persistent Live Radio Player in the Admin Top Header.
 * Stays mounted and streams audio uninterrupted across all admin sections.
 */
export function AdminHeaderPlayer() {
  const [status, setStatus] = useState<AudioStatus>(() => AdminAudioManager.getInstance().getStatus())
  const [shows, setShows] = useState<ShowDoc[]>([])
  const [currentInfo, setCurrentInfo] = useState<{
    dayTimeText: string
    showTitle: string
    slotText: string
  }>({
    dayTimeText: '',
    showTitle: 'Playlist MBR',
    slotText: '',
  })

  // 1. Subscribe to the persistent audio manager singleton
  useEffect(() => {
    const manager = AdminAudioManager.getInstance()
    const unsubscribe = manager.subscribe((newStatus) => {
      setStatus(newStatus)
    })
    return unsubscribe
  }, [])

  // 2. Fetch published shows to match against the current schedule
  useEffect(() => {
    let active = true
    async function loadShows() {
      try {
        const res = await fetch('/api/shows?where[_status][equals]=published&limit=50&depth=0')
        if (!res.ok) return
        const data = await res.json()
        if (active && data.docs) {
          setShows(data.docs)
        }
      } catch {
        // Fallback gracefully without breaking UI
      }
    }
    loadShows()
    return () => {
      active = false
    }
  }, [])

  // 3. Update now-in-Rome time and on-air show calculation every 15 seconds
  const updateOnAir = useCallback(() => {
    const now = nowInRome()
    const dayIndex = Number(now.dayOfWeek)
    const dayName = DAY_NAMES_IT[dayIndex] ?? ''
    const dayTimeText = `${dayName.toUpperCase()} ${now.time}`

    const onAir = shows
      .flatMap((show) => (show.slots ?? []).map((slot) => ({ show, slot })))
      .find(({ slot }) => slotIsOn(slot, now))

    if (onAir) {
      setCurrentInfo({
        dayTimeText,
        showTitle: onAir.show.title,
        slotText: `${onAir.slot.start} – ${onAir.slot.end}`,
      })
    } else {
      setCurrentInfo({
        dayTimeText,
        showTitle: 'Playlist MBR',
        slotText: 'Diretta Streaming',
      })
    }
  }, [shows])

  useEffect(() => {
    updateOnAir()
    const timer = setInterval(updateOnAir, 15_000)
    return () => clearInterval(timer)
  }, [updateOnAir])

  const toggle = () => {
    AdminAudioManager.getInstance().toggle()
  }

  const isPlaying = status === 'playing'
  const isLoading = status === 'loading'

  return (
    <div className="mbr-header-player">
      <div className="mbr-header-player__card">
        <div className="mbr-header-player__label">
          <span className="mbr-header-player__dot" />
          <span>ORA IN ONDA {currentInfo.dayTimeText ? `· ${currentInfo.dayTimeText}` : ''}</span>
        </div>
        <div className="mbr-header-player__info">
          <span className="mbr-header-player__title" title={currentInfo.showTitle}>
            {currentInfo.showTitle}
          </span>
          {currentInfo.slotText && (
            <span className="mbr-header-player__time">
              {currentInfo.slotText}
            </span>
          )}
        </div>
      </div>

      <div className="mbr-header-player__btn-wrap">
        <button
          type="button"
          onClick={toggle}
          className={`mbr-header-player__play-btn${isPlaying ? ' mbr-header-player__play-btn--playing' : ''}${isLoading ? ' mbr-header-player__play-btn--loading' : ''}`}
          aria-label={isPlaying ? 'Metti in pausa la radio' : 'Ascolta la radio in diretta'}
          title={isPlaying ? 'Pausa streaming' : 'Ascolta diretta streaming'}
        >
          {isLoading ? (
            <svg
              className="mbr-header-player__icon mbr-header-player__icon--spin"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
          ) : isPlaying ? (
            <svg
              className="mbr-header-player__icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <rect x="5" y="4" width="4" height="16" rx="1.5" />
              <rect x="15" y="4" width="4" height="16" rx="1.5" />
            </svg>
          ) : (
            <svg
              className="mbr-header-player__icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ transform: 'translateX(1.5px)' }}
            >
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
