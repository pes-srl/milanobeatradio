'use client'

import Image from 'next/image'
import { IconMute, IconPause, IconPlay, IconVolume } from '@/src/components/icons'
import { usePlayer } from './PlayerProvider'

type Props = { logoUrl?: string | null }

/** Fixed bottom player, laid out like the original: play · station + song · logo · listeners · volume. */
export function PlayerBar({ logoUrl }: Props) {
  const { status, volume, muted, nowPlaying, toggle, setVolume, toggleMute } = usePlayer()
  const np = nowPlaying.data
  const song = np?.now_playing.song
  const isLive = np?.live.is_live ?? false
  const isOn = status === 'playing' || status === 'loading'

  const title = song?.text || song?.title || ''
  const statusLabel = status === 'loading' ? 'Connessione…' : status === 'error' ? 'Stream non disponibile · riprova' : null

  return (
    <div role="region" aria-label="Player radio" className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black text-white">
      <div className="flex h-[70px] items-stretch">
        <button
          type="button"
          onClick={toggle}
          aria-label={isOn ? 'Pausa' : 'Play'}
          aria-pressed={isOn}
          className="grid w-[70px] shrink-0 place-items-center border-r border-white/15 text-brand transition hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
        >
          {status === 'loading' ? (
            <span className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-brand" aria-hidden />
          ) : isOn ? (
            <IconPause size={26} />
          ) : (
            <IconPlay size={30} />
          )}
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-4 px-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-[15px] font-medium text-brand">{np?.station.name ?? 'Milano Beat Radio'}</span>
              {isLive && (
                <span className="rounded-sm bg-red-600 px-1.5 py-px text-[10px] font-semibold tracking-wider text-white">
                  LIVE{np?.live.streamer_name ? ` · ${np.live.streamer_name}` : ''}
                </span>
              )}
            </div>
            <div className="marquee text-sm text-white/90" aria-live="polite">
              <span className="marquee__track">
                <span>{statusLabel ?? title ?? 'Ora in onda'}</span>
                {!statusLabel && title && <span aria-hidden>{title}</span>}
              </span>
            </div>
          </div>

          {logoUrl && (
            <Image src={logoUrl} alt="" width={64} height={64} sizes="64px" className="hidden size-14 shrink-0 sm:block" />
          )}

          <div className="hidden shrink-0 items-center gap-1 text-xs text-brand md:flex" title="Ascoltatori">
            <span className="font-semibold">{np ? np.listeners.current : '–'}</span>
            <span className="text-white/50">in ascolto</span>
          </div>

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
