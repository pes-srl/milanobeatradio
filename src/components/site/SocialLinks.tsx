import { IconFacebook, IconInstagram, IconLinkedin, IconSpotify, IconTiktok } from '@/src/components/icons'
import type { Staff } from '@/src/payload-types'

type Socials = Staff['socials']

const ITEMS = [
  ['instagram', 'Instagram', IconInstagram],
  ['facebook', 'Facebook', IconFacebook],
  ['linkedin', 'LinkedIn', IconLinkedin],
  ['tiktok', 'TikTok', IconTiktok],
  ['spotify', 'Spotify', IconSpotify],
] as const

/** Round brand-colored social buttons. */
export function SocialLinks({ socials, size = 'md' }: { socials: Socials; size?: 'sm' | 'md' }) {
  const links = ITEMS.filter(([key]) => socials?.[key])
  if (links.length === 0) return null
  const cls = size === 'sm' ? 'size-7' : 'size-9'
  return (
    <ul className="flex items-center justify-center gap-2">
      {links.map(([key, label, Icon]) => (
        <li key={key}>
          <a href={socials![key]!} target="_blank" rel="noreferrer" aria-label={label} className={`grid ${cls} place-items-center rounded-full bg-brand text-white transition hover:bg-brand-dark`}>
            <Icon size={size === 'sm' ? 13 : 16} />
          </a>
        </li>
      ))}
    </ul>
  )
}
