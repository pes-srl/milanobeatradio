import Image from 'next/image'
import type { Site } from '@/src/payload-types'
import { imageAlt, imageUrl } from '@/src/lib/media'
import { AscoltaButton } from './AscoltaButton'

/** Slideshow timing copied from the original Elementor background slideshow. */
const SLIDE_MS = 5000
const FADE_MS = 500
const ZOOM = 1.04

/** Full-height hero with a CSS crossfade slideshow and the brand captions. */
export function HomeHero({ site }: { site: Site | null }) {
  const slides = (site?.heroSlides ?? []).map((s) => s.image).filter((m) => imageUrl(m, 'hero'))
  const total = slides.length * SLIDE_MS
  const animated = slides.length > 1
  // Keyframes are generated here because the fade windows depend on how many
  // slides the editor loaded: each one is on screen SLIDE_MS and hands over in FADE_MS.
  const pct = (ms: number) => ((ms / total) * 100).toFixed(3)
  const keyframes =
    `@keyframes hero-slide{0%{opacity:0}${pct(FADE_MS)}%{opacity:1}${pct(SLIDE_MS)}%{opacity:1}${pct(SLIDE_MS + FADE_MS)}%{opacity:0}100%{opacity:0}}` +
    // Barely-there drift while the slide is on screen; it snaps back at the end of the
    // loop, when this slide is fully transparent.
    `@keyframes hero-zoom{0%{transform:scale(1)}${pct(SLIDE_MS + FADE_MS)}%,100%{transform:scale(${ZOOM})}}`

  return (
    <section className="relative flex min-h-[calc(100svh-126px)] items-center justify-center overflow-hidden bg-black text-center">
      {animated && <style dangerouslySetInnerHTML={{ __html: keyframes }} />}
      <div className="absolute inset-0" style={{ ['--slide-total' as string]: `${total}ms` }}>
        {slides.map((m, i) => (
          <div
            key={i}
            className={animated ? 'slide' : 'absolute inset-0'}
            style={{ ['--slide-delay' as string]: `${i * SLIDE_MS}ms` }}
          >
            <Image
              src={imageUrl(m, 'hero')!}
              alt={imageAlt(m, '')}
              fill
              priority={i === 0}
              fetchPriority={i === 0 ? undefined : 'low'}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 py-16">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-5 py-1.5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
          <span className="size-2 rounded-full bg-white animate-pulse" />
          <span className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.2em] text-white">
            Event and Party Radio Station
          </span>
        </div>

        {/* Main Title */}
        <h1 className="mt-6 text-center text-5xl font-black uppercase tracking-tight leading-[0.95] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] sm:text-7xl lg:text-[88px]">
          Milano Beat Radio
        </h1>

        <AscoltaButton className="mt-8" />

        {/* Fashion Caption Badges */}
        <div className="mt-14 flex flex-col items-center gap-4">
          <p className="caption caption--violet text-xl sm:text-3xl lg:text-4xl">
            <span>Ascoltaci anche senza app – press play</span>
          </p>

          <div className="flex flex-col items-center gap-2.5">
            <p className="caption caption--pink text-base sm:text-xl lg:text-2xl">
              <span>Anche in negozio!</span>
            </p>
            <p className="caption caption--pink text-base sm:text-xl lg:text-2xl">
              <span>Nella tua attività commerciale</span>
            </p>
            <p className="caption caption--pink text-xl sm:text-3xl lg:text-4xl font-black">
              <span>In città</span>
            </p>
          </div>

          <p className="caption--tag mt-2">
            <span>{site?.hashtag ?? '#MBRFRIENDS'}</span>
          </p>
        </div>
      </div>
    </section>
  )
}
