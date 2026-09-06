'use client'

import { usePlayer } from './PlayerProvider'

/** Fixed bottom bar. Functional only: the visual design comes in phase 1. */
export function PlayerBar() {
  const { status, volume, muted, nowPlaying, toggle, setVolume, toggleMute } = usePlayer()
  const np = nowPlaying.data
  const song = np?.now_playing.song
  const isLive = np?.live.is_live ?? false
  const isOn = status === 'playing' || status === 'loading'

  const title = song?.text || song?.title || (nowPlaying.stale ? 'Milano Beat Radio' : 'Ora in onda')
  const statusLabel =
    status === 'loading' ? 'Connessione…' : status === 'error' ? 'Stream non disponibile · riprova' : null

  return (
    <div
      role="region"
      aria-label="Player radio"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/95 text-white backdrop-blur"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-3 sm:gap-4 sm:px-4">
        <button
          type="button"
          onClick={toggle}
          aria-label={isOn ? 'Pausa' : 'Play'}
          aria-pressed={isOn}
          className="grid size-11 shrink-0 place-items-center rounded-full bg-brand text-black transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {status === 'loading' ? (
            <span className="size-4 animate-spin rounded-full border-2 border-black/30 border-t-black" aria-hidden />
          ) : isOn ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden><rect x="2" y="2" width="4" height="12" /><rect x="10" y="2" width="4" height="12" /></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden><path d="M3 2l11 6-11 6z" /></svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-white/60">
            <span>Ora in onda</span>
            {isLive && (
              <span className="rounded-sm bg-red-600 px-1.5 py-px text-[10px] font-semibold tracking-wider text-white">
                LIVE{np?.live.streamer_name ? ` · ${np.live.streamer_name}` : ''}
              </span>
            )}
          </div>
          <div className="marquee text-sm font-medium" aria-live="polite">
            <span className="marquee__track">
              <span>{statusLabel ?? title}</span>
              {!statusLabel && <span aria-hidden>{title}</span>}
            </span>
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-1 text-xs text-white/70 sm:flex" title="Ascoltatori">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden><circle cx="8" cy="5" r="3" /><path d="M2 14c0-3 3-5 6-5s6 2 6 5z" /></svg>
          <span>{np ? np.listeners.current : '–'}</span>
        </div>

        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <button type="button" onClick={toggleMute} aria-label={muted ? 'Riattiva audio' : 'Silenzia'} className="text-white/70 hover:text-white">
            {muted || volume === 0 ? '🔇' : '🔊'}
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
  )
}
