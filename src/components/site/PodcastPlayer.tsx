'use client'

import { useRef } from 'react'
import { usePlayer } from '@/src/player/PlayerProvider'

/** On-demand audio for podcasts. Starting it pauses the live stream so the two never overlap. */
export function PodcastPlayer({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLAudioElement>(null)
  const radio = usePlayer()
  return (
    <audio
      ref={ref}
      controls
      preload="none"
      src={src}
      aria-label={`Ascolta: ${title}`}
      className="w-full accent-brand"
      onPlay={() => {
        if (radio.status === 'playing' || radio.status === 'loading') radio.pause()
      }}
    />
  )
}
