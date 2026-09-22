'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { usePlayer } from '@/src/player/PlayerProvider'
import { IconClose, IconFacebook, IconInstagram, IconMenu, IconMute, IconPause, IconPlayOutline, IconVolume } from '@/src/components/icons'
import { MORE_NAV, SIDE_NAV } from './nav'

type Props = { instagram?: string | null; facebook?: string | null }

/** Header button cluster (social · menu · play · volume) + off-canvas menu. Client-only: needs the player. */
export function HeaderControls({ instagram, facebook }: Props) {
  const { status, toggle, muted, toggleMute, volume, setVolume } = usePlayer()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [volumeOpen, setVolumeOpen] = useState(false)
  const volumeRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const isOn = status === 'playing' || status === 'loading'
  const level = muted ? 0 : volume

  useEffect(() => {
    setMounted(true)
  }, [])

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
      <div className="flex items-center gap-2 sm:gap-2.5">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="hdr-btn group"
          aria-label="Apri il menu"
          aria-expanded={open}
        >
          <IconMenu size={20} className="transition-transform duration-300 group-hover:scale-110 group-hover:text-brand" />
        </button>
        <button
          type="button"
          onClick={toggle}
          className={`hdr-btn-play ${isOn ? 'hdr-btn-play--on' : ''}`}
          aria-label={isOn ? 'Pausa' : 'Play'}
          aria-pressed={isOn}
        >
          {status === 'loading' ? (
            <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden />
          ) : isOn ? (
            <IconPause size={18} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
          ) : (
            <IconPlayOutline size={18} className="text-pink drop-shadow-[0_0_8px_rgba(224,36,111,0.8)]" />
          )}
          <span className="font-bold">{isOn ? 'Pausa' : 'Play'}</span>
        </button>
        <div ref={volumeRef} className="relative hidden md:block">
          <button
            type="button"
            onClick={() => setVolumeOpen((v) => !v)}
            onDoubleClick={toggleMute}
            className={`hdr-btn hdr-btn--solid ${volumeOpen ? 'ring-2 ring-brand ring-offset-2 ring-offset-black' : ''}`}
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

      {/* Off-canvas menu via portal to body to avoid sticky/backdrop-filter containment */}
      {mounted &&
        createPortal(
          <div className={`fixed inset-0 z-[100] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
            <div
              className={`fixed inset-0 bg-black/40 transition-opacity duration-300 ${open ? 'opacity-100 backdrop-blur-[2px]' : 'opacity-0'}`}
              onClick={() => setOpen(false)}
            />
            <nav
              aria-label="Menu completo"
              className={`fixed right-0 top-0 flex h-full h-dvh w-84 max-w-[88vw] flex-col overflow-y-auto [-webkit-overflow-scrolling:touch] border-l border-white/[0.08] bg-[#1c0636]/50 sm:bg-[#1c0636]/60 p-6 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.9),-10px_0_30px_rgba(28,6,54,0.4)] transition-transform duration-300 transform-gpu ${open ? 'translate-x-0' : 'translate-x-full'}`}
            >
              <div className="flex shrink-0 items-center justify-between border-b border-white/10 pb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-white/50">Menu</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="hdr-btn !h-9 !min-w-9 text-white/70 hover:text-white"
                  aria-label="Chiudi il menu"
                >
                  <IconClose size={20} />
                </button>
              </div>
              <ul className="mt-6 space-y-2">
                {SIDE_NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-center justify-between rounded-xl px-4 py-3 text-base font-bold uppercase tracking-wider text-white/90 transition-all duration-200 hover:bg-white/[0.08] hover:text-brand hover:shadow-[0_0_20px_rgba(200,36,227,0.2)]"
                    >
                      <span>{item.label}</span>
                      <span className="text-white/30 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-brand">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
              {MORE_NAV.length > 0 && (
                <ul className="mt-6 space-y-2 border-t border-white/10 pt-4">
                  {MORE_NAV.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex items-center rounded-xl px-4 py-2.5 text-sm uppercase tracking-wider text-white/70 transition hover:bg-white/[0.06] hover:text-white"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-auto shrink-0 flex items-center gap-3 border-t border-white/10 pt-6">
                {instagram && (
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="hdr-btn flex-1 gap-2.5 text-xs font-semibold hover:border-[#E1306C]/60 hover:shadow-[0_0_15px_rgba(225,48,108,0.3)]"
                    aria-label="Instagram"
                  >
                    <IconInstagram size={20} />
                    <span>Instagram</span>
                  </a>
                )}
                {facebook && (
                  <a
                    href={facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="hdr-btn flex-1 gap-2.5 text-xs font-semibold hover:border-[#1877F2]/60 hover:shadow-[0_0_15px_rgba(24,119,242,0.3)]"
                    aria-label="Facebook"
                  >
                    <IconFacebook size={20} />
                    <span>Facebook</span>
                  </a>
                )}
              </div>
            </nav>
          </div>,
          document.body
        )}
    </>
  )
}
