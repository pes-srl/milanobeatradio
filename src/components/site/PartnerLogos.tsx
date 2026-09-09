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
        className="h-14 w-auto max-w-[160px] object-contain brightness-0 invert opacity-80 transition duration-300 hover:opacity-100 sm:h-18"
      />
    )
    return p.url ? (
      <a
        href={p.url}
        target="_blank"
        rel="noreferrer"
        aria-label={p.name}
        className="shrink-0 transition-transform duration-300 hover:scale-105"
      >
        {img}
      </a>
    ) : (
      <span className="shrink-0">{img}</span>
    )
  }

  if (variant === 'grid') {
    return (
      <ul className="flex flex-wrap items-center justify-center gap-10 sm:gap-16">
        {items.map((p) => (
          <li key={p.id}><Logo p={p} /></li>
        ))}
      </ul>
    )
  }
  return (
    <div className="overflow-hidden" aria-label="Partner">
      <div className="logos__track items-center">
        {[...items, ...items].map((p, i) => (
          <Logo key={`${p.id}-${i}`} p={p} />
        ))}
      </div>
    </div>
  )
}
