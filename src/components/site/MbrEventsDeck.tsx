'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { IconChevronLeft, IconChevronRight, IconClose, IconExpand } from '@/src/components/icons'

type PosterItem = {
  url: string
  alt: string
}

type Props = {
  posters: PosterItem[]
}

export function MbrEventsDeck({ posters }: Props) {
  const [current, setCurrent] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const total = posters.length
  if (total === 0) return null

  const prev = useCallback(() => {
    setCurrent((c) => (c === 0 ? total - 1 : c - 1))
  }, [total])

  const next = useCallback(() => {
    setCurrent((c) => (c === total - 1 ? 0 : c + 1))
  }, [total])

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape' && lightboxOpen) setLightboxOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [prev, next, lightboxOpen])

  // Touch swipe support
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

  const prevIndex = current === 0 ? total - 1 : current - 1
  const nextIndex = current === total - 1 ? 0 : current + 1

  const currentPoster = posters[current] ?? posters[0]!
  const prevPoster = posters[prevIndex] ?? currentPoster
  const nextPoster = posters[nextIndex] ?? currentPoster

  return (
    <div className="relative w-full bg-black py-12 md:py-20">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_35%,rgba(141,20,163,0.25),transparent_70%)]" />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8">
        {/* Header indicator */}
        <div className="mb-8 text-center sm:mb-12">
          <span className="inline-block rounded-full border border-brand/40 bg-brand/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand">
            Format MBR Events · Deck di Presentazione
          </span>
          <h2 className="mt-4 text-2xl font-bold uppercase tracking-wide text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] sm:text-4xl lg:text-5xl">
            Sfoglia MBR Events
          </h2>
          <div className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-white/60">
            <span>Slide</span>
            <span className="text-brand font-bold">{String(current + 1).padStart(2, '0')}</span>
            <span>/</span>
            <span>{String(total).padStart(2, '0')}</span>
          </div>
        </div>

        {/* 3D Showcase Stage */}
        <div
          className="relative flex items-center justify-center gap-4 md:gap-8"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Previous slide preview (desktop) */}
          <button
            type="button"
            onClick={prev}
            aria-label="Slide precedente"
            className="group relative hidden aspect-[2/3] w-48 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-white/10 opacity-30 transition-all duration-300 hover:scale-95 hover:border-brand/40 hover:opacity-70 lg:block xl:w-64"
          >
            <Image
              src={prevPoster.url}
              alt={prevPoster.alt}
              fill
              sizes="260px"
              className="object-cover blur-[0.5px]"
            />
            <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/10" />
          </button>

          {/* Nav arrow left */}
          <button
            type="button"
            onClick={prev}
            aria-label="Slide precedente"
            className="absolute left-2 z-20 flex size-12 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white shadow-lg backdrop-blur transition hover:border-brand hover:bg-brand hover:text-white sm:left-4 sm:size-14 md:size-16"
          >
            <IconChevronLeft size={28} />
          </button>

          {/* Active Main Slide */}
          <div className="relative aspect-[2/3] w-full max-w-[420px] shrink-0 overflow-hidden rounded-2xl border-2 border-brand/50 bg-black shadow-[0_0_60px_rgba(200,36,227,0.35)] sm:max-w-[500px] md:max-w-[540px] lg:max-w-[580px]">
            <Image
              src={currentPoster.url}
              alt={currentPoster.alt}
              fill
              priority
              sizes="(max-width: 640px) 95vw, 600px"
              className="object-contain sm:object-cover"
            />

            {/* Click to expand overlay */}
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label="Ingrandisci a schermo intero"
              className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full bg-black/70 text-white/80 backdrop-blur transition hover:bg-brand hover:text-white sm:size-11"
            >
              <IconExpand size={20} />
            </button>
          </div>

          {/* Nav arrow right */}
          <button
            type="button"
            onClick={next}
            aria-label="Slide successiva"
            className="absolute right-2 z-20 flex size-12 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white shadow-lg backdrop-blur transition hover:border-brand hover:bg-brand hover:text-white sm:right-4 sm:size-14 md:size-16"
          >
            <IconChevronRight size={28} />
          </button>

          {/* Next slide preview (desktop) */}
          <button
            type="button"
            onClick={next}
            aria-label="Slide successiva"
            className="group relative hidden aspect-[2/3] w-48 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-white/10 opacity-30 transition-all duration-300 hover:scale-95 hover:border-brand/40 hover:opacity-70 lg:block xl:w-64"
          >
            <Image
              src={nextPoster.url}
              alt={nextPoster.alt}
              fill
              sizes="260px"
              className="object-cover blur-[0.5px]"
            />
            <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/10" />
          </button>
        </div>

        {/* Navigation Dots / Pills */}
        <div className="mt-8 flex items-center justify-center gap-2 sm:gap-3">
          {posters.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Vai alla slide ${i + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                current === i ? 'w-10 bg-brand shadow-[0_0_12px_rgba(200,36,227,0.8)]' : 'w-2.5 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Thumbnail strip */}
        <div className="mt-6 flex justify-center gap-2 overflow-x-auto px-2 py-2 sm:gap-4">
          {posters.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Seleziona slide ${i + 1}`}
              className={`relative aspect-[2/3] w-14 shrink-0 overflow-hidden rounded-md border transition sm:w-20 ${
                current === i ? 'border-brand ring-2 ring-brand' : 'border-white/20 opacity-40 hover:opacity-80'
              }`}
            >
              <Image src={p.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>

        {/* High Impact Call To Action Section */}
        <div className="mt-20 overflow-hidden rounded-3xl border border-brand/30 bg-gradient-to-b from-[#1c0636] to-black p-8 text-center shadow-[0_0_50px_rgba(141,20,163,0.3)] sm:p-12 md:p-16">
          <h3 className="text-3xl font-extrabold uppercase tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] sm:text-4xl lg:text-5xl">
            MBR Events nella tua location
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/80 sm:text-lg">
            DJ Set elegante, regolarizzazione licenze SIAE, service audio e luci, interviste in onda e promozione sul territorio.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <a
              href="mailto:events@milanobeatradio.it?subject=Richiesta%20Informazioni%20Format%20MBR%20Events"
              className="inline-flex items-center justify-center rounded-full bg-brand px-8 py-4 text-base font-bold uppercase tracking-wider text-white shadow-[0_0_30px_rgba(200,36,227,0.6)] transition duration-300 hover:scale-105 hover:bg-brand-dark"
            >
              Richiedi una proposta
            </a>
            <Link
              href="/promuoviti"
              className="inline-flex items-center justify-center rounded-full border-2 border-white/40 px-8 py-4 text-base font-semibold uppercase tracking-wider text-white transition hover:border-white hover:bg-white/10"
            >
              Promuovi il tuo evento
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 border-t border-white/10 pt-8 text-xs text-white/60 sm:text-sm">
            <p>
              Email Eventi:{' '}
              <a href="mailto:events@milanobeatradio.it" className="font-semibold text-brand hover:underline">
                events@milanobeatradio.it
              </a>
            </p>
            <span>•</span>
            <p>
              Redazione:{' '}
              <a href="mailto:redazione@milanobeatradio.it" className="font-semibold text-brand hover:underline">
                redazione@milanobeatradio.it
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Chiudi ingrandimento"
            className="absolute right-6 top-6 z-50 flex size-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-brand"
          >
            <IconClose size={26} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
            aria-label="Precedente"
            className="absolute left-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-brand sm:left-8"
          >
            <IconChevronLeft size={32} />
          </button>

          <div
            className="relative aspect-[2/3] h-[85vh] max-w-[90vw] overflow-hidden rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentPoster.url}
              alt={currentPoster.alt}
              fill
              priority
              sizes="90vw"
              className="object-contain"
            />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              next()
            }}
            aria-label="Successiva"
            className="absolute right-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-brand sm:right-8"
          >
            <IconChevronRight size={32} />
          </button>
        </div>
      )}
    </div>
  )
}
