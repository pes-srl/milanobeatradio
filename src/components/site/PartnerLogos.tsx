import Image from 'next/image'
import type { Partner } from '@/src/payload-types'
import { imageAlt, imageUrl } from '@/src/lib/media'

type Props = { partners: Partner[]; variant?: 'marquee' | 'grid' }

/** Partner logos: endless strip on the home, static grid on "Chi siamo". */
export function PartnerLogos({ partners, variant = 'marquee' }: Props) {
  // Only show partners with actual logos, excluding venue/club photos (e.g. Wimpy)
  const items = partners.filter((p) => {
    if (!imageUrl(p.logo)) return false
    const name = p.name?.toLowerCase().trim() ?? ''
    const url = imageUrl(p.logo) ?? ''
    if (name === 'wimpy' || url.includes('4-10')) return false
    return true
  })

  if (items.length === 0) return null

  const Logo = ({ p }: { p: Partner }) => {
    const img = (
      <Image
        src={imageUrl(p.logo, 'thumb')!}
        alt={imageAlt(p.logo, p.name)}
        width={200}
        height={115}
        sizes="200px"
        className="max-h-12 sm:max-h-14 w-auto max-w-[125px] sm:max-w-[140px] object-contain brightness-0 invert opacity-75 transition duration-300 hover:opacity-100"
      />
    )
    return p.url ? (
      <a
        href={p.url}
        target="_blank"
        rel="noreferrer"
        aria-label={p.name}
        className="flex h-16 sm:h-20 w-[120px] sm:w-[145px] shrink-0 items-center justify-center transition-transform duration-300 hover:scale-105"
      >
        {img}
      </a>
    ) : (
      <div className="flex h-16 sm:h-20 w-[120px] sm:w-[145px] shrink-0 items-center justify-center">
        {img}
      </div>
    )
  }

  if (variant === 'grid') {
    return (
      <ul className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
        {items.map((p) => (
          <li key={p.id}><Logo p={p} /></li>
        ))}
      </ul>
    )
  }

  // Ensure enough items so each half has at least 8 items for a seamless marquee loop
  let baseItems = [...items]
  while (baseItems.length < 8) {
    baseItems = [...baseItems, ...items]
  }
  const trackItems = [...baseItems, ...baseItems]
  const duration = Math.max(25, baseItems.length * 4)

  return (
    <div className="relative mx-auto max-w-[1070px] overflow-hidden px-4" aria-label="Partner">
      {/* Side gradient fade masks */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 sm:w-20 bg-gradient-to-r from-black via-black/80 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 sm:w-20 bg-gradient-to-l from-black via-black/80 to-transparent"
        aria-hidden="true"
      />

      <div
        className="logos__track items-center transform-gpu py-2"
        style={{ animationDuration: `${duration}s` }}
      >
        {trackItems.map((p, i) => (
          <Logo key={`${p.id}-${i}`} p={p} />
        ))}
      </div>
    </div>
  )
}
