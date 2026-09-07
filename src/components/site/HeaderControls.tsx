'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { usePlayer } from '@/src/player/PlayerProvider'
import { IconClose, IconFacebook, IconInstagram, IconMenu, IconMute, IconPause, IconPlayOutline, IconVolume } from '@/src/components/icons'
import { MAIN_NAV, MORE_NAV } from './nav'

type Props = { instagram?: string | null; facebook?: string | null }

/** Header button cluster (social · menu · play · volume) + off-canvas menu. Client-only: needs the player. */
export function HeaderControls({ instagram, facebook }: Props) {
  const { status, toggle, muted, toggleMute, volume, setVolume } = usePlayer()
  const [open, setOpen] = useState(false)
  const [volumeOpen, setVolumeOpen] = useState(false)
  const volumeRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const isOn = status === 'playing' || status === 'loading'
  const level = muted ? 0 : volume

  // Close the menu on navigation. Adjusting state during render (not an effect) per
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [lastPathname, setLastPathname] = useState(pathname)
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setOpen(false)
  }

  // Close the volume slider on outside click or Escape.
  useEffect(() => {
    if (!volumeOpen) return
    const onPointerDown = (e: PointerEvent) => {
      if (!volumeRef.current?.contains(e.target as Node)) setVolumeOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setVolumeOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [volumeOpen])

  // Lock body scroll while the menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <div className="flex items-center gap-2">
        {instagram && (
          <a href={instagram} target="_blank" rel="noreferrer" className="hdr-btn hidden md:inline-flex" aria-label="Instagram">
            <IconInstagram size={20} />
          </a>
        )}
        {facebook && (
          <a href={facebook} target="_blank" rel="noreferrer" className="hdr-btn hidden text-white md:inline-flex" aria-label="Facebook">
            <IconFacebook size={20} />
          </a>
        )}
        <button type="button" onClick={() => setOpen(true)} className="hdr-btn" aria-label="Apri il menu" aria-expanded={open}>
          <IconMenu size={20} />
        </button>
        <button type="button" onClick={toggle} className="hdr-btn gap-2 px-4 text-white" aria-label={isOn ? 'Pausa' : 'Play'} aria-pressed={isOn}>
          {status === 'loading' ? (
            <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-brand" aria-hidden />
          ) : isOn ? (
            <IconPause size={18} className="text-brand" />
          ) : (
            <IconPlayOutline size={18} className="text-brand" />
          )}
          <span className="font-bold">{isOn ? 'Pausa' : 'Play'}</span>
        </button>
        <div ref={volumeRef} className="relative hidden md:block">
          <button
            type="button"
            onClick={() => setVolumeOpen((v) => !v)}
            onDoubleClick={toggleMute}
            className={`hdr-btn hdr-btn--solid ${volumeOpen ? 'rounded-b-none' : ''}`}
            aria-label="Volume"
            aria-expanded={volumeOpen}
          >
            {level === 0 ? <IconMute size={20} /> : <IconVolume size={20} />}
          </button>
          {volumeOpen && (
            <div className="volume-panel">
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={level}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="volume-range"
                style={{ '--fill': `${level * 100}%` } as CSSProperties}
                aria-label="Volume"
                aria-valuetext={`${Math.round(level * 100)}%`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Off-canvas menu */}
      <div className={`fixed inset-0 z-[60] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
        <div className={`absolute inset-0 bg-black/70 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={() => setOpen(false)} />
        <nav
          aria-label="Menu completo"
          className={`absolute right-0 top-0 flex h-full w-80 max-w-[85vw] flex-col bg-topbar p-6 shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <button type="button" onClick={() => setOpen(false)} className="self-end text-white/70 hover:text-white" aria-label="Chiudi il menu">
            <IconClose size={26} />
          </button>
          <ul className="mt-6 space-y-4">
            {MAIN_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-lg font-semibold uppercase tracking-wider hover:text-brand">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-8 space-y-3 border-t border-white/10 pt-6">
            {MORE_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm uppercase tracking-wider text-white/70 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex gap-3 pt-6">
            {instagram && (
              <a href={instagram} target="_blank" rel="noreferrer" className="hdr-btn" aria-label="Instagram"><IconInstagram size={20} /></a>
            )}
            {facebook && (
              <a href={facebook} target="_blank" rel="noreferrer" className="hdr-btn" aria-label="Facebook"><IconFacebook size={20} /></a>
            )}
          </div>
        </nav>
      </div>
    </>
  )
}
