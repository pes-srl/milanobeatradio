import { IconFacebook, IconInstagram, IconLinkedin, IconSpotify, IconTiktok } from '@/src/components/icons'
import type { Staff } from '@/src/payload-types'

type Socials = Staff['socials']

type SocialConfig = {
  label: string
  Icon: (p: { size?: number; className?: string; variant?: 'badge' | 'glyph' }) => React.ReactNode
  hoverCls: string
}

const PLATFORMS: Record<string, SocialConfig> = {
  instagram: {
    label: 'Instagram',
    Icon: IconInstagram,
    hoverCls: 'hover:border-[#E1306C]/70 hover:shadow-[0_0_14px_rgba(225,48,108,0.4)]',
  },
  facebook: {
    label: 'Facebook',
    Icon: IconFacebook,
    hoverCls: 'hover:border-[#1877F2]/70 hover:shadow-[0_0_14px_rgba(24,119,242,0.4)]',
  },
  linkedin: {
    label: 'LinkedIn',
    Icon: IconLinkedin,
    hoverCls: 'hover:border-[#0A66C2]/70 hover:shadow-[0_0_14px_rgba(10,102,194,0.4)]',
  },
  tiktok: {
    label: 'TikTok',
    Icon: IconTiktok,
    hoverCls: 'hover:border-[#00F2FE]/70 hover:shadow-[0_0_14px_rgba(0,242,254,0.4)]',
  },
  spotify: {
    label: 'Spotify',
    Icon: IconSpotify,
    hoverCls: 'hover:border-[#1DB954]/70 hover:shadow-[0_0_14px_rgba(29,185,84,0.4)]',
  },
}

const KEYS = ['instagram', 'facebook', 'linkedin', 'tiktok', 'spotify'] as const

/** Transparent social buttons with subtle white outline and authentic brand logo inside. */
export function SocialLinks({ socials, size = 'md' }: { socials: Socials; size?: 'sm' | 'md' }) {
  const links = KEYS.filter((k) => socials?.[k])
  if (links.length === 0) return null
  const cls = size === 'sm' ? 'size-8' : 'size-10'
  const iconSize = size === 'sm' ? 16 : 20

  return (
    <ul className="flex items-center justify-center gap-2">
      {links.map((key) => {
        const item = PLATFORMS[key]
        if (!item) return null
        const { label, Icon, hoverCls } = item
        return (
          <li key={key}>
            <a
              href={socials![key]!}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className={`grid ${cls} place-items-center rounded-full border border-white/25 bg-black/40 backdrop-blur-md shadow-sm shadow-black/50 transition-all duration-300 hover:scale-110 hover:bg-black/60 active:scale-95 ${hoverCls}`}
            >
              <Icon size={iconSize} variant="glyph" />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
