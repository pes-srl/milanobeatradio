'use client'

import { useEffect, useRef, useState } from 'react'
import { STREAM_URL } from '@/src/lib/azuracast'

/**
 * Circular "Play" button next to the "Ora in onda" card in the admin dashboard.
 * Streams the live radio directly with cache-busting and clean disconnect on pause.
 */
export function AdminPlayButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing'>('idle')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const toggle = () => {
    if (status === 'playing' || status === 'loading') {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
        audioRef.current.load()
      }
      setStatus('idle')
    } else {
      setStatus('loading')
      if (!audioRef.current) {
        audioRef.current = new Audio()
      }
      const audio = audioRef.current
      // Cache buster to ensure connection to current live chunk
      audio.src = `${STREAM_URL}?_=${Date.now()}`
      audio.preload = 'none'

      audio.onplaying = () => {
        setStatus('playing')
      }

      audio.onerror = () => {
        setStatus('idle')
        audio.src = ''
      }

      audio.onpause = () => {
        if (audio.src) {
          setStatus('idle')
        }
      }

      audio.play().catch(() => {
        setStatus('idle')
      })
    }
  }

  // Cleanup on unmount (e.g. navigating to another admin section)
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
        audioRef.current.load()
        audioRef.current = null
      }
    }
  }, [])

  const isPlaying = status === 'playing'
  const isLoading = status === 'loading'

  return (
    <div className="mbr-dash__player-wrap">
      <button
        type="button"
        onClick={toggle}
        className={`mbr-dash__play-btn${isPlaying ? ' mbr-dash__play-btn--playing' : ''}${isLoading ? ' mbr-dash__play-btn--loading' : ''}`}
        aria-label={isPlaying ? 'Metti in pausa la radio' : 'Ascolta la radio in diretta'}
        title={isPlaying ? 'Pausa streaming' : 'Ascolta diretta streaming'}
      >
        {isLoading ? (
          <svg
            className="mbr-dash__play-icon mbr-dash__play-icon--spin"
            width="22"
            height="22"
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
            className="mbr-dash__play-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <rect x="5" y="4" width="4" height="16" rx="1.5" />
            <rect x="15" y="4" width="4" height="16" rx="1.5" />
          </svg>
        ) : (
          <svg
            className="mbr-dash__play-icon"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ transform: 'translateX(2px)' }}
          >
            <polygon points="6 3 20 12 6 21 6 3" />
          </svg>
        )}
      </button>

      {isPlaying && (
        <div className="mbr-dash__player-badge">
          <span className="mbr-dash__player-badge-dot" />
          <span>ON AIR</span>
        </div>
      )}
    </div>
  )
}
