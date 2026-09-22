'use client'

import { useEffect, useRef, useState } from 'react'
import type { Site } from '@/src/payload-types'
import { IconExternal, IconInstagram } from '@/src/components/icons'
import { SectionTitle } from './SectionTitle'

type Props = {
  site?: Site | null
}

const INSTAGRAM_URL = 'https://www.instagram.com/milanobeatradio_mbr/'

export function InstagramFeed({ site }: Props) {
  const instagramLink = site?.instagram || INSTAGRAM_URL
  const containerRef = useRef<HTMLElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  // Lazy load Instagram embed script only when user scrolls near the section
  useEffect(() => {
    if (shouldLoad) {
      const processEmbed = () => {
        const win = typeof window !== 'undefined' ? (window as unknown as { instgrm?: { Embeds?: { process: () => void } } }) : null
        if (win?.instgrm?.Embeds) {
          win.instgrm.Embeds.process()
          return
        }

        const existingScript = document.getElementById('instagram-embed-script')
        if (!existingScript) {
          const script = document.createElement('script')
          script.id = 'instagram-embed-script'
          script.src = 'https://www.instagram.com/embed.js'
          script.async = true
          script.onload = () => {
            const w = window as unknown as { instgrm?: { Embeds?: { process: () => void } } }
            w.instgrm?.Embeds?.process()
          }
          document.body.appendChild(script)
        } else {
          const w = window as unknown as { instgrm?: { Embeds?: { process: () => void } } }
          w.instgrm?.Embeds?.process()
        }
      }

      processEmbed()
      return
    }

    const el = containerRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '300px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [shouldLoad])

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-to-b from-black via-[#0b0517] to-black px-4 py-24 sm:px-8"
    >
      {/* Lightweight GPU-friendly ambient radial background (zero blur shaders) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_15%_25%,rgba(200,36,227,0.12),transparent_70%),radial-gradient(ellipse_70%_50%_at_85%_75%,rgba(224,36,111,0.12),transparent_70%)]" />

      <div className="relative mx-auto max-w-[1440px]">
        {/* Eyebrow badge */}
        <div className="mb-4 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink/40 bg-pink/10 px-5 py-1.5 sm:backdrop-blur-md shadow-[0_0_12px_rgba(224,36,111,0.25)] sm:shadow-[0_0_20px_rgba(224,36,111,0.25)] transform-gpu">
            <span className="size-2 rounded-full bg-pink animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-pink sm:text-sm">
              Live Instagram Feed & Social Hub
            </span>
          </div>
        </div>

        <SectionTitle>MBR on Instagram</SectionTitle>

        {/* Top Profile Summary Card */}
        <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-white/15 bg-[#0e071a] sm:bg-white/[0.04] p-6 sm:backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.8)] sm:shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(200,36,227,0.15)] sm:p-8 transform-gpu">
          <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              {/* Instagram Stories Gradient Ring Avatar */}
              <a
                href={instagramLink}
                target="_blank"
                rel="noreferrer"
                className="group relative flex size-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-[3px] shadow-[0_0_20px_rgba(220,39,67,0.35)] transition-transform duration-300 hover:scale-105"
                aria-label="Profilo Instagram Milano Beat Radio"
              >
                <div className="flex size-full items-center justify-center rounded-full bg-black p-2 transition-transform duration-300 group-hover:scale-95">
                  <IconInstagram size={36} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                </div>
                <span className="absolute bottom-0 right-0 flex size-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white ring-2 ring-black">
                  ✓
                </span>
              </a>

              <div>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <a
                    href={instagramLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xl font-bold tracking-tight text-white transition-colors hover:text-pink sm:text-2xl"
                  >
                    @milanobeatradio_mbr
                  </a>
                  <span className="rounded-full bg-pink/20 px-2.5 py-0.5 text-[11px] font-semibold text-pink">
                    Official Page
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold sm:justify-start">
                  <span className="text-white font-bold">11.6K <span className="text-white/60 font-normal">Follower</span></span>
                  <span className="text-white font-bold">295 <span className="text-white/60 font-normal">Post</span></span>
                  <span className="text-white font-bold">883 <span className="text-white/60 font-normal">Seguiti</span></span>
                </div>

                <p className="mt-2 text-xs sm:text-sm text-white/80 max-w-xl">
                  📻 Web City Radio, based Milano. Un 🤝 partner che amplifica e realizza i tuoi eventi! 🎊🎉 Eventi aziendali 🎧 djset 🕵🏻home🏠parties, soft clubbing.
                </p>
              </div>
            </div>

            {/* Follow Button */}
            <a
              href={instagramLink}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] px-7 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-[0_4px_20px_rgba(225,48,108,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(225,48,108,0.7)] active:scale-95 shrink-0"
            >
              <IconInstagram size={18} variant="glyph" className="text-white" />
              <span>Segui su IG</span>
            </a>
          </div>

          {/* Quick Actions Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 border-t border-white/10 pt-5 sm:justify-start">
            <a
              href="https://www.instagram.com/milanobeatradio_mbr/reels/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:border-brand hover:bg-brand/20 hover:text-white"
            >
              <span>⚡ Guarda i Reel</span>
              <IconExternal size={14} />
            </a>
            <a
              href="https://www.instagram.com/milanobeatradio_mbr/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:border-pink hover:bg-pink/20 hover:text-white"
            >
              <span>📸 Post & Foto</span>
              <IconExternal size={14} />
            </a>
            <span className="hidden sm:inline-block text-xs font-medium text-white/50">
              #MBRFRIENDS · Taggaci nelle tue storie per essere ripubblicato
            </span>
          </div>
        </div>

        {/* Instagram Live Embed Container */}
        <div className="relative mx-auto mt-12 max-w-[540px]">
          {/* Subtle logo pink backlight ring without expensive blur */}
          <div className="pointer-events-none absolute -inset-3 rounded-[28px] bg-gradient-to-tr from-pink/20 to-brand/15 opacity-60" />

          {/* Clean Instagram Embed Box with touch-pan-y */}
          <div className="ig-embed-wrapper relative z-10 flex min-h-[480px] items-center justify-center overflow-hidden rounded-[22px] transition-transform duration-300 transform-gpu touch-pan-y">
            {shouldLoad ? (
              <blockquote
                className="instagram-media"
                data-instgrm-permalink={instagramLink}
                data-instgrm-version="14"
                style={{
                  background: 'transparent',
                  border: 0,
                  borderRadius: '20px',
                  margin: '0 auto',
                  maxWidth: '540px',
                  minWidth: '300px',
                  padding: 0,
                  width: '100%',
                }}
              >
                <div style={{ padding: '24px' }} className="text-center text-white/60">
                  <a
                    href={instagramLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: 'transparent',
                      lineHeight: 0,
                      padding: '0 0',
                      textAlign: 'center',
                      textDecoration: 'none',
                      width: '100%',
                    }}
                    className="font-medium text-white/80"
                  >
                    Caricamento post da @milanobeatradio_mbr…
                  </a>
                </div>
              </blockquote>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 p-8 text-center text-white/60">
                <IconInstagram size={40} className="text-pink/70 animate-pulse" />
                <p className="text-sm font-medium text-white/80">Caricamento contenuti Instagram…</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA Button */}
        <div className="mt-14 text-center">
          <a
            href={instagramLink}
            target="_blank"
            rel="noreferrer"
            className="btn-pill inline-flex items-center gap-3 px-8 py-3.5 shadow-[0_0_20px_rgba(200,36,227,0.35)]"
          >
            <IconInstagram size={20} />
            <span>Visita il profilo completo @milanobeatradio_mbr</span>
          </a>
        </div>
      </div>
    </section>
  )
}
