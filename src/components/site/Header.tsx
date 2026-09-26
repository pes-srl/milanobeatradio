import Image from 'next/image'
import Link from 'next/link'
import { IconBell, IconFacebook, IconInstagram } from '@/src/components/icons'
import { imageUrl } from '@/src/lib/media'
import { getSite } from '@/src/lib/queries'
import { HeaderControls } from './HeaderControls'
import { SIDE_NAV } from './nav'

/** Top bar (claim + socials) and sticky main header (logo · controls · menu). */
export async function Header() {
  const site = await getSite().catch(() => null)
  const logo = imageUrl(site?.logo, 'thumb')

  return (
    <>
      <div className="relative z-40 bg-topbar">
        <div className="flex h-12 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <p className="flex items-center gap-2 text-sm font-semibold sm:text-base">
            <IconBell size={14} className="text-white/80" />
            {site?.claim ?? 'Your Event & Party Station'}
          </p>
          <div className="flex items-center gap-3">
            {site?.instagram && (
              <a
                href={site.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="transition-transform duration-200 hover:scale-110 active:scale-95"
              >
                <IconInstagram size={20} />
              </a>
            )}
            {site?.facebook && (
              <a
                href={site.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="transition-transform duration-200 hover:scale-110 active:scale-95"
              >
                <IconFacebook size={20} />
              </a>
            )}
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-black sm:bg-black/60 sm:backdrop-blur-xl border-b border-white/[0.08] shadow-sm sm:shadow-[0_4px_30px_rgba(0,0,0,0.5)] transform-gpu will-change-transform">
        <div className="flex h-[64px] w-full items-center justify-between gap-3 px-4 sm:h-[70px] sm:gap-4 sm:px-6 lg:h-[78px] lg:px-8">
          <Link href="/" className="group shrink-0 flex items-center gap-2 sm:gap-2.5" aria-label="Milano Beat Radio — Home">
            <span className="text-xl font-black tracking-tight uppercase bg-gradient-to-r from-[#e0246f] via-[#c824e3] to-[#a855f7] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(200,36,227,0.45)] transition-transform duration-300 group-hover:scale-105 sm:text-2xl lg:text-[28px]">
              MBR
            </span>
            {logo && (
              <Image
                src={logo}
                alt="Milano Beat Radio"
                width={128}
                height={128}
                sizes="(max-width: 1024px) 64px, 72px"
                priority
                className="size-[48px] sm:size-[56px] lg:size-[64px] object-contain transition-transform duration-300 group-hover:scale-105"
              />
            )}
          </Link>

          <HeaderControls instagram={site?.instagram} facebook={site?.facebook} />

          <nav aria-label="Principale" className="hidden items-center gap-3.5 lg:flex xl:gap-6 2xl:gap-8">
            {SIDE_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative whitespace-nowrap py-2 text-[14px] font-bold uppercase tracking-wider text-white/90 transition-colors duration-300 hover:text-white xl:text-[15px] 2xl:text-base"
              >
                <span className="relative z-10 transition-transform duration-200 group-hover:drop-shadow-[0_0_12px_rgba(200,36,227,0.75)]">
                  {item.label}
                </span>
                <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-brand to-[#e0246f] shadow-[0_0_8px_rgba(200,36,227,0.8)] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  )
}
