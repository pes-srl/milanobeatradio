import Image from 'next/image'
import Link from 'next/link'
import { IconBell, IconFacebook, IconInstagram } from '@/src/components/icons'
import { imageUrl } from '@/src/lib/media'
import { getSite } from '@/src/lib/queries'
import { HeaderControls } from './HeaderControls'
import { MAIN_NAV } from './nav'

/** Top bar (claim + socials) and sticky main header (logo · controls · menu). */
export async function Header() {
  const site = await getSite().catch(() => null)
  const logo = imageUrl(site?.logo, 'thumb')

  return (
    <header className="relative z-40">
      <div className="bg-topbar">
        <div className="mx-auto flex h-12 max-w-[1440px] items-center justify-between px-4 sm:px-8">
          <p className="flex items-center gap-2 text-sm font-semibold sm:text-base">
            <IconBell size={14} className="text-white/80" />
            {site?.claim ?? 'Your Event and Party Station'}
          </p>
          <div className="flex items-center gap-4 text-white/90">
            {site?.instagram && (
              <a href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-brand"><IconInstagram size={16} /></a>
            )}
            {site?.facebook && (
              <a href={site.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-brand"><IconFacebook size={16} /></a>
            )}
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-40 bg-black">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-3 px-4 sm:h-[80px] sm:gap-4 sm:px-8 lg:h-[92px]">
          <Link href="/" className="shrink-0" aria-label="Milano Beat Radio — Home">
            {logo ? (
              <Image
                src={logo}
                alt="Milano Beat Radio"
                width={128}
                height={128}
                sizes="(max-width: 1024px) 76px, 108px"
                priority
                className="size-[76px] lg:size-[108px]"
              />
            ) : (
              <span className="text-sm font-bold uppercase tracking-[0.2em]">MBR</span>
            )}
          </Link>

          <HeaderControls instagram={site?.instagram} facebook={site?.facebook} />

          <nav aria-label="Principale" className="hidden items-center gap-5 lg:flex xl:gap-8">
            {MAIN_NAV.map((item) => (
              <Link key={item.href} href={item.href} className="whitespace-nowrap text-[15px] font-bold uppercase tracking-wide text-white transition hover:text-brand xl:text-base 2xl:text-lg">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
