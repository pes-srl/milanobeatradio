import Image from 'next/image'
import type { MediaRef } from '@/src/lib/media'
import { imageAlt, imageUrl } from '@/src/lib/media'

type Props = {
  title: React.ReactNode
  overtitle?: string | null
  subtitle?: string | null
  image?: MediaRef | string | null
  kicker?: string
  kickerColor?: 'pink' | 'white'
  children?: React.ReactNode
  size?: 'md' | 'lg'
  uppercase?: boolean
  variant?: 'neon' | 'standard'
}

/** Page/detail hero: darkened cover image, optional kicker/tag, big title, extra content. */
export function PageHero({
  title,
  overtitle,
  subtitle,
  image,
  kicker,
  kickerColor = 'pink',
  children,
  size = 'md',
  uppercase = true,
  variant,
}: Props) {
  const src = typeof image === 'string' ? image : imageUrl(image, 'hero')
  const alt = typeof image === 'string' ? '' : imageAlt(image, '')
  const isNeon = variant === 'neon' || Boolean(overtitle)

  return (
    <section
      className={`relative flex items-center justify-center overflow-hidden bg-black text-center ${
        size === 'lg' ? 'min-h-[520px] sm:min-h-[680px]' : 'min-h-[360px] sm:min-h-[510px]'
      }`}
    >
      {src && <Image src={src} alt={alt} fill priority sizes="100vw" className="object-cover opacity-60" />}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-16">
        {kicker && (
          <span
            className={`mb-4 inline-block px-2 py-0.5 text-sm ${
              kickerColor === 'pink' ? 'bg-pink' : 'rounded-full border-2 border-white font-semibold'
            }`}
          >
            {kicker}
          </span>
        )}

        {isNeon ? (
          <div className="flex flex-col items-center">
            {overtitle && (
              <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-white/80 drop-shadow sm:text-base">
                {overtitle}
              </span>
            )}
            <h1 className="bg-gradient-to-r from-[#e0246f] via-[#c824e3] to-[#a855f7] bg-clip-text text-5xl font-black uppercase tracking-tight text-transparent drop-shadow-[0_0_40px_rgba(200,36,227,0.7)] sm:text-7xl lg:text-8xl">
              {title}
            </h1>
          </div>
        ) : (
          <h1
            className={`text-4xl font-medium leading-tight drop-shadow-lg sm:text-6xl lg:text-7xl ${
              uppercase ? 'uppercase' : ''
            } ${size === 'lg' ? 'tracking-wide' : ''}`}
          >
            {title}
          </h1>
        )}

        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-base font-normal text-white/85 sm:text-lg">{subtitle}</p>
        )}

        {children}
      </div>
    </section>
  )
}
