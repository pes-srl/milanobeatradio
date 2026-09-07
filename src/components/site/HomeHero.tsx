import Image from 'next/image'
import type { Site } from '@/src/payload-types'
import { imageAlt, imageUrl } from '@/src/lib/media'
import { AscoltaButton } from './AscoltaButton'

/** Slideshow timing copied from the original Elementor background slideshow. */
const SLIDE_MS = 5000
const FADE_MS = 500

/** Full-height hero with a CSS crossfade slideshow and the brand captions. */
export function HomeHero({ site }: { site: Site | null }) {
  const slides = (site?.heroSlides ?? []).map((s) => s.image).filter((m) => imageUrl(m, 'hero'))
  const total = slides.length * SLIDE_MS
  const animated = slides.length > 1
  // Keyframes are generated here because the fade windows depend on how many
  // slides the editor loaded: each one is on screen SLIDE_MS and hands over in FADE_MS.
  const pct = (ms: number) => ((ms / total) * 100).toFixed(3)
  const keyframes = `@keyframes hero-slide{0%{opacity:0}${pct(FADE_MS)}%{opacity:1}${pct(SLIDE_MS)}%{opacity:1}${pct(SLIDE_MS + FADE_MS)}%{opacity:0}100%{opacity:0}}`

  return (
    <section className="relative flex min-h-[calc(100svh-138px)] items-center justify-center overflow-hidden bg-black text-center">
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
        <h3 className="text-2xl font-semibold tracking-[0.12em] drop-shadow sm:text-4xl">Event and Party Radio Station</h3>
        <h1 className="mt-6 text-5xl font-bold leading-none tracking-[0.06em] drop-shadow-lg sm:text-7xl lg:text-[86px]">
          Milano Beat Radio
          <span className="mt-2 block text-3xl tracking-[0.1em] sm:text-5xl lg:text-6xl">MBR</span>
        </h1>
        <AscoltaButton className="mt-8" />

        <div className="mt-14 space-y-4">
          <p className="caption bg-violet text-2xl sm:text-4xl"><span>Ascoltaci anche senza app - press play</span></p>
          <div className="space-y-2">
            <p className="caption bg-pink text-lg sm:text-2xl"><span>Anche in negozio!</span></p>
            <br />
            <p className="caption bg-pink text-lg sm:text-2xl"><span>Nella tua attivita&#39; commerciale</span></p>
            <br />
            <p className="caption bg-pink text-2xl sm:text-4xl"><span>In citta&#39;</span></p>
          </div>
          <p className="caption bg-violet text-sm sm:text-base"><span>{site?.hashtag ?? '#MBRFRIENDS'}</span></p>
        </div>
      </div>
    </section>
  )
}
