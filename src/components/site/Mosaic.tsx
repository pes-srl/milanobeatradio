import Image from 'next/image'
import type { Site } from '@/src/payload-types'
import { imageAlt, imageUrl } from '@/src/lib/media'

/** Image mosaic between CITY EVENTS and PARTNERS on the home. */
export function Mosaic({ site }: { site: Site | null }) {
  const images = (site?.gallery ?? []).map((g) => g.image).filter((m) => imageUrl(m, 'card'))
  if (images.length === 0) return null
  return (
    <section aria-label="Milano Beat Radio in città" className="mt-20 grid grid-cols-2 gap-1 sm:grid-cols-4 lg:grid-cols-5">
      {images.map((m, i) => (
        <div key={i} className="relative aspect-video overflow-hidden">
          <Image src={imageUrl(m, 'card')!} alt={imageAlt(m, '')} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw" className="object-cover transition duration-500 hover:scale-105" />
        </div>
      ))}
    </section>
  )
}
