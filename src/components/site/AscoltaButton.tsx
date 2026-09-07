'use client'

import { IconPause, IconPlayOutline } from '@/src/components/icons'
import { usePlayer } from '@/src/player/PlayerProvider'

/** Hero CTA: starts the stream through the persistent player. */
export function AscoltaButton({ className = '' }: { className?: string }) {
  const { status, toggle } = usePlayer()
  const isOn = status === 'playing' || status === 'loading'
  return (
    <button type="button" onClick={toggle} className={`btn-pill text-lg ${className}`} aria-pressed={isOn}>
      {isOn ? <IconPause size={18} className="text-brand" /> : <IconPlayOutline size={18} className="text-brand" />}
      {isOn ? 'In ascolto' : 'Ascolta'}
    </button>
  )
}
