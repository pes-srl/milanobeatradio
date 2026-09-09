'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { Site } from '@/src/payload-types'
import { imageAlt, imageUrl } from '@/src/lib/media'
import { IconChevronLeft, IconChevronRight, IconClose, IconExpand } from '@/src/components/icons'

/** Fashion Image Mosaic on the home with fullscreen lightbox */
export function Mosaic({ site }: { site: Site | null }) {
  const images = (() => {
    const list = (site?.gallery ?? [])
      .map((g) => g.image)
      .filter((m): m is NonNullable<typeof m> => Boolean(m && imageUrl(m, 'card')))

    if (list.length >= 4) {
      const first = list[0]
      const fourth = list[3]
      if (first && fourth) {
        // Invert positions: il dj a sx (pos 0) e la sala a dx (pos 3)
        const reordered = [...list]
        reordered[0] = fourth
        reordered[3] = first
        return reordered
      }
    }
    return list
  })()

  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const touchStartX = useRef<number | null>(null)

  const total = images.length
  const isOpen = activeIdx !== null && activeIdx >= 0 && activeIdx < total

  const prev = useCallback(() => {
    setActiveIdx((curr) => (curr === null ? null : curr === 0 ? total - 1 : curr - 1))
  }, [total])

  const next = useCallback(() => {
    setActiveIdx((curr) => (curr === null ? null : curr === total - 1 ? 0 : curr + 1))
  }, [total])

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (!isOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveIdx(null)
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, prev, next])

  // Touch swipe support in lightbox
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0]
    if (touchStartX.current === null || !touch) return
    const diff = touchStartX.current - touch.clientX
    if (diff > 50) next()
    else if (diff < -50) prev()
    touchStartX.current = null
  }

  if (total === 0) return null

  const activeImage = isOpen ? images[activeIdx] : null
  const activeFullUrl = activeImage ? imageUrl(activeImage, 'hero') || imageUrl(activeImage, 'card') : null

  return (
    <section aria-label="Galleria foto" className="relative px-4 py-8 sm:px-8 sm:py-14">
      {/* Background ambient lighting aura */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(200,36,227,0.12),transparent_70%)]" />

      <div className="mx-auto max-w-[1440px]">
        {/* Fashion balanced 4-column grid (2 rows of 4 for 8 photos) */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {images.map((m, i) => {
            const cardUrl = imageUrl(m, 'card')!
            const alt = imageAlt(m, `MBR Experience photo ${i + 1}`)
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIdx(i)}
                aria-label={`Ingrandisci foto ${i + 1}`}
                className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/15 bg-zinc-900/80 text-left shadow-[0_10px_30px_rgba(0,0,0,0.7)] transition-all duration-500 hover:-translate-y-1.5 hover:border-brand/70 hover:shadow-[0_0_35px_rgba(200,36,227,0.35)] sm:rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <Image
                  src={cardUrl}
                  alt={alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Dark gradient overlay for fashion contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-40 transition-opacity duration-300 group-hover:opacity-15" />

                {/* Expand icon pill appearing on hover */}
                <div className="absolute right-3.5 top-3.5 flex size-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white/90 opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 scale-90 sm:size-10">
                  <IconExpand size={18} />
                </div>

                {/* Bottom subtle brand accent glow line */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-brand to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </button>
            )
          })}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isOpen && activeImage && activeFullUrl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Galleria foto a schermo intero"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-black/95 p-4 sm:p-6 backdrop-blur-xl animate-fade-in"
          onClick={() => setActiveIdx(null)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Top action bar */}
          <div
            className="flex w-full max-w-6xl items-center justify-between py-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/80 backdrop-blur">
              <span>Foto</span>
              <span className="font-bold text-brand">{String(activeIdx + 1).padStart(2, '0')}</span>
              <span>/</span>
              <span>{String(total).padStart(2, '0')}</span>
            </div>

            <button
              type="button"
              onClick={() => setActiveIdx(null)}
              aria-label="Chiudi galleria"
              className="flex size-11 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-lg backdrop-blur transition duration-300 hover:scale-105 hover:border-brand hover:bg-brand"
            >
              <IconClose size={24} />
            </button>
          </div>

          {/* Prev Navigation Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
            aria-label="Foto precedente"
            className="absolute left-3 top-1/2 z-50 -translate-y-1/2 flex size-12 items-center justify-center rounded-full border border-white/20 bg-black/75 text-white shadow-xl backdrop-blur transition duration-300 hover:scale-110 hover:border-brand hover:bg-brand sm:left-6 sm:size-14"
          >
            <IconChevronLeft size={28} />
          </button>

          {/* Next Navigation Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              next()
            }}
            aria-label="Foto successiva"
            className="absolute right-3 top-1/2 z-50 -translate-y-1/2 flex size-12 items-center justify-center rounded-full border border-white/20 bg-black/75 text-white shadow-xl backdrop-blur transition duration-300 hover:scale-110 hover:border-brand hover:bg-brand sm:right-6 sm:size-14"
          >
            <IconChevronRight size={28} />
          </button>

          {/* Main image presentation */}
          <div
            className="relative flex w-full max-w-5xl flex-1 items-center justify-center py-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[65vh] w-full overflow-hidden rounded-2xl border border-white/20 bg-black/50 shadow-[0_0_60px_rgba(200,36,227,0.25)] sm:h-[72vh] sm:rounded-3xl">
              <Image
                src={activeFullUrl}
                alt={imageAlt(activeImage, 'Foto Milano Beat Experience')}
                fill
                priority
                sizes="(max-width: 1280px) 95vw, 1200px"
                className="object-contain"
              />
            </div>
          </div>

          {/* Thumbnail strip for quick jump */}
          <div
            className="flex max-w-full items-center justify-center gap-2 overflow-x-auto px-4 py-2 sm:gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((m, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIdx(i)}
                aria-label={`Vai a foto ${i + 1}`}
                className={`relative aspect-[4/3] w-12 shrink-0 overflow-hidden rounded-lg border transition duration-300 sm:w-16 ${
                  activeIdx === i
                    ? 'border-brand scale-105 ring-2 ring-brand'
                    : 'border-white/20 opacity-40 hover:opacity-90'
                }`}
              >
                <Image
                  src={imageUrl(m, 'thumb') || imageUrl(m, 'card')!}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
