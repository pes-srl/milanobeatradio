import Image from 'next/image'
import type { MediaRef } from '@/src/lib/media'
import { imageAlt, imageUrl } from '@/src/lib/media'

type Props = {
  title: string
  image?: MediaRef | string | null
  kicker?: string
  kickerColor?: 'pink' | 'white'
  children?: React.ReactNode
  size?: 'md' | 'lg'
  uppercase?: boolean
}

/** Page/detail hero: darkened cover image, optional kicker/tag, big title, extra content. */
export function PageHero({ title, image, kicker, kickerColor = 'pink', children, size = 'md', uppercase = true }: Props) {
  const src = typeof image === 'string' ? image : imageUrl(image, 'hero')
  const alt = typeof image === 'string' ? '' : imageAlt(image, '')
  return (
    <section className={`relative flex items-center justify-center overflow-hidden bg-black text-center ${size === 'lg' ? 'min-h-[520px] sm:min-h-[680px]' : 'min-h-[360px] sm:min-h-[510px]'}`}>
      {src && <Image src={src} alt={alt} fill priority sizes="100vw" className="object-cover opacity-60" />}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-16">
        {kicker && (
          <span className={`mb-4 inline-block px-2 py-0.5 text-sm ${kickerColor === 'pink' ? 'bg-pink' : 'rounded-full border-2 border-white font-semibold'}`}>{kicker}</span>
        )}
        <h1 className={`text-4xl font-medium leading-tight drop-shadow-lg sm:text-6xl lg:text-7xl ${uppercase ? 'uppercase' : ''} ${size === 'lg' ? 'tracking-wide' : ''}`}>{title}</h1>
        {children}
      </div>
    </section>
  )
}
