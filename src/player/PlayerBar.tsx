'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { IconMute, IconPause, IconPlay, IconVolume } from '@/src/components/icons'
import { usePlayer } from './PlayerProvider'

type Props = { logoUrl?: string | null }

const TICKER_MESSAGES = [
  'WELCOME ON MBR',
  'YOUR PARTY & EVENT STATION',
  'SEGUICI SUI SOCIAL',
]

/** Fixed bottom player, laid out like the original: play · station + rotating message · logo · volume. */
export function PlayerBar({ logoUrl }: Props) {
  const { status, volume, muted, nowPlaying, toggle, setVolume, toggleMute } = usePlayer()
  const [msgIndex, setMsgIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const np = nowPlaying.data
  const isLive = np?.live.is_live ?? false
  const isOn = status === 'playing' || status === 'loading'

  useEffect(() => {
    let fadeTimeout: ReturnType<typeof setTimeout> | null = null
    const timer = setInterval(() => {
      setVisible(false)
      fadeTimeout = setTimeout(() => {
        setMsgIndex((prev) => (prev + 1) % TICKER_MESSAGES.length)
        setVisible(true)
      }, 250)
    }, 3500)

    return () => {
      clearInterval(timer)
      if (fadeTimeout) clearTimeout(fadeTimeout)
    }
  }, [])

  const statusLabel =
    status === 'loading' ? 'CONNESSIONE…' : status === 'error' ? 'STREAM NON DISPONIBILE · RIPROVA' : null

  return (
    <div role="region" aria-label="Player radio" className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#0a0a0f]/95 text-white backdrop-blur-xl shadow-[0_-8px_32px_rgba(0,0,0,0.8)]">
      <div className="flex h-[72px] items-center">
        <div className="flex h-full w-[78px] sm:w-[88px] shrink-0 items-center justify-center border-r border-white/10 px-2 sm:px-3">
          <button
            type="button"
            onClick={toggle}
            aria-label={isOn ? 'Pausa' : 'Play'}
            aria-pressed={isOn}
            className={`group relative flex size-12 sm:size-13 items-center justify-center rounded-2xl border transition-all duration-300 hover:scale-110 active:scale-95 ${
              isOn
                ? 'border-brand bg-gradient-to-br from-[#e0246f] via-[#ff2a85] to-brand text-white shadow-[0_0_28px_rgba(200,36,227,0.75)] ring-2 ring-brand/40 ring-offset-2 ring-offset-black'
                : 'border-white/25 bg-gradient-to-br from-brand/35 via-white/[0.08] to-brand/15 text-white backdrop-blur-md shadow-[0_0_20px_rgba(200,36,227,0.4)] hover:border-brand hover:from-[#e0246f] hover:to-brand hover:shadow-[0_0_30px_rgba(200,36,227,0.7)]'
            }`}
          >
            {status === 'loading' ? (
              <span className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden />
            ) : isOn ? (
              <IconPause size={22} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] transition-transform duration-200 group-hover:scale-105" />
            ) : (
              <IconPlay size={24} className="ml-0.5 text-white drop-shadow-[0_0_10px_rgba(224,36,111,0.9)] transition-transform duration-200 group-hover:scale-105" />
            )}
          </button>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-4 px-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-[15px] font-medium text-brand">MBR - Milano Beat Radio</span>
              {isLive && (
                <span className="rounded-sm bg-red-600 px-1.5 py-px text-[10px] font-semibold tracking-wider text-white">
                  LIVE{np?.live.streamer_name ? ` · ${np.live.streamer_name}` : ''}
                </span>
              )}
            </div>
            <div className="h-5 overflow-hidden text-sm text-white/90" aria-live="polite">
              {statusLabel ? (
                <span className="text-white/70">{statusLabel}</span>
              ) : (
                <span
                  className={`inline-block font-medium tracking-wide transition-all duration-300 ${
                    visible ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0'
                  }`}
                >
                  {TICKER_MESSAGES[msgIndex]}
                </span>
              )}
            </div>
          </div>

          {logoUrl && (
            <Image src={logoUrl} alt="" width={64} height={64} sizes="64px" className="hidden size-14 shrink-0 sm:block" />
          )}


          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <button type="button" onClick={toggleMute} aria-label={muted ? 'Riattiva audio' : 'Silenzia'} className="text-white/70 hover:text-white">
              {muted || volume === 0 ? <IconMute size={18} /> : <IconVolume size={18} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.02}
              value={muted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="Volume"
              className="w-24 accent-brand"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
