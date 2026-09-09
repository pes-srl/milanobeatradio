'use client'

import { IconPause, IconPlayOutline } from '@/src/components/icons'
import { usePlayer } from '@/src/player/PlayerProvider'

/** Hero CTA: starts the stream through the persistent player. */
export function AscoltaButton({ className = '' }: { className?: string }) {
  const { status, toggle } = usePlayer()
  const isOn = status === 'playing' || status === 'loading'
  return (
    <button
      type="button"
      onClick={toggle}
      className={`btn-pill text-base sm:text-lg ${isOn ? '!border-brand !bg-gradient-to-r !from-[#e0246f] !to-brand !shadow-[0_0_35px_rgba(200,36,227,0.6)]' : ''} ${className}`}
      aria-pressed={isOn}
    >
      {isOn ? (
        <IconPause size={20} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
      ) : (
        <IconPlayOutline size={20} className="text-pink drop-shadow-[0_0_8px_rgba(224,36,111,0.8)]" />
      )}
      <span className="font-bold tracking-wider">{isOn ? 'Pausa' : 'Play'}</span>
    </button>
  )
}
