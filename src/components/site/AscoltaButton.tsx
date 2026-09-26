'use client'

import { IconPause, IconPlay } from '@/src/components/icons'
import { usePlayer } from '@/src/player/PlayerProvider'

/** Hero CTA: starts the stream through the persistent player. */
export function AscoltaButton({ className = '' }: { className?: string }) {
  const { status, toggle } = usePlayer()
  const isOn = status === 'playing' || status === 'loading'
  const isLoading = status === 'loading'

  return (
    <div className={`relative group inline-block ${className}`}>
      {/* Ambient glowing aura */}
      <div
        className={`absolute -inset-2 sm:-inset-3 rounded-full blur-2xl sm:blur-3xl transition-all duration-700 pointer-events-none ${
          isOn
            ? 'bg-gradient-to-r from-pink via-brand to-violet opacity-90 animate-pulse'
            : 'bg-gradient-to-r from-pink via-brand to-brand opacity-45 group-hover:opacity-90 group-hover:blur-3xl'
        }`}
      />

      <button
        type="button"
        onClick={toggle}
        className={`relative flex items-center gap-4 sm:gap-6 rounded-full border-2 px-8 py-3.5 sm:px-11 sm:py-5 transition-all duration-300 transform-gpu hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-2xl ${
          isOn
            ? 'border-white/40 bg-gradient-to-r from-[#e0246f] via-[#c824e3] to-[#6f2dbd] text-white shadow-[0_0_45px_rgba(200,36,227,0.7)]'
            : 'border-white/25 bg-black/70 hover:bg-black/50 text-white shadow-[0_8px_35px_rgba(0,0,0,0.6)] hover:border-white/50'
        }`}
        aria-pressed={isOn}
      >
        {/* Disc Icon wrapper */}
        <span
          className={`flex size-14 sm:size-16 md:size-18 shrink-0 items-center justify-center rounded-full transition-all duration-300 shadow-xl ${
            isOn
              ? 'bg-white text-brand shadow-[0_0_25px_rgba(255,255,255,0.85)]'
              : 'bg-gradient-to-tr from-pink to-brand text-white shadow-[0_0_22px_rgba(224,36,111,0.7)] group-hover:shadow-[0_0_35px_rgba(200,36,227,1)] group-hover:scale-105'
          }`}
        >
          {isLoading ? (
            <svg
              className="size-7 sm:size-8 animate-spin text-current"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : isOn ? (
            <IconPause size={28} className="fill-current" />
          ) : (
            <IconPlay size={28} className="ml-1 fill-current" />
          )}
        </span>

        {/* Text / Label */}
        <div className="flex flex-col items-start text-left pr-2 sm:pr-4">
          <span className="text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-white/70 group-hover:text-white/95 transition-colors">
            {isOn ? 'On Air' : 'Live Radio'}
          </span>
          <span className="text-xl sm:text-3xl md:text-4xl font-black uppercase tracking-wider leading-none text-white drop-shadow-md">
            {isOn ? 'Pausa' : 'Play'}
          </span>
        </div>

        {/* Equalizer Waveform bars when playing */}
        {isOn && (
          <div className="flex items-end gap-1.5 h-7 sm:h-8 pl-1 pr-2" aria-hidden="true">
            <span className="w-1.5 bg-white rounded-full h-full animate-pulse" />
            <span className="w-1.5 bg-white rounded-full h-3/4 animate-pulse [animation-delay:150ms]" />
            <span className="w-1.5 bg-white rounded-full h-5/6 animate-pulse [animation-delay:300ms]" />
            <span className="w-1.5 bg-white rounded-full h-1/2 animate-pulse [animation-delay:450ms]" />
          </div>
        )}
      </button>
    </div>
  )
}
