import Image from 'next/image'
import type { Partner } from '@/src/payload-types'
import { imageAlt, imageUrl } from '@/src/lib/media'

type Props = { partners: Partner[]; variant?: 'marquee' | 'grid' }

/** Partner logos: endless strip on the home, static grid on "Chi siamo". */
export function PartnerLogos({ partners, variant = 'marquee' }: Props) {
  const items = partners.filter((p) => imageUrl(p.logo))
  if (items.length === 0) return null
  const Logo = ({ p }: { p: Partner }) => {
    const img = (
      <Image src={imageUrl(p.logo, 'thumb')!} alt={imageAlt(p.logo, p.name)} width={200} height={115} sizes="200px" className="h-16 w-auto max-w-[170px] object-contain sm:h-20" />
    )
    return p.url ? (
      <a href={p.url} target="_blank" rel="noreferrer" aria-label={p.name} className="shrink-0 opacity-90 transition hover:opacity-100">{img}</a>
    ) : (
      <span className="shrink-0 opacity-90">{img}</span>
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
      <div className="logos__track">
        {[...items, ...items].map((p, i) => (
          <Logo key={`${p.id}-${i}`} p={p} />
        ))}
      </div>
    </div>
  )
}
