import Link from 'next/link'
import { IconFacebook, IconInstagram } from '@/src/components/icons'
import { getSite } from '@/src/lib/queries'
import { MAIN_NAV, MORE_NAV } from './nav'

export async function Footer() {
  const site = await getSite().catch(() => null)
  return (
    <footer className="footer-wedge relative mt-24 pt-40">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 pb-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-semibold text-white/80">{site?.licenseText ?? ''}</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {[...MAIN_NAV, ...MORE_NAV.slice(0, 2)].map((item) => (
            <Link key={item.href} href={item.href} className="text-xs font-semibold uppercase tracking-wide text-white/90 hover:text-brand">
              {item.label}
            </Link>
          ))}
          <span className="ml-2 flex items-center gap-3 text-white/90">
            {site?.instagram && (
              <a href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-brand"><IconInstagram size={16} /></a>
            )}
            {site?.facebook && (
              <a href={site.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-brand"><IconFacebook size={16} /></a>
            )}
          </span>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-3 text-center text-[11px] text-white/50">
        © {new Date().getFullYear()} Milano Beat Radio · <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
      </div>
    </footer>
  )
}
