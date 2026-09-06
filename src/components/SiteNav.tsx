import Link from 'next/link'

/** Placeholder navigation (phase 0). Real menu: MBR EVENTS · EVENTI · FLASH NEWS · INTERVISTE · STAFF. */
export function SiteNav() {
  return (
    <header className="border-b border-white/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-sm font-semibold uppercase tracking-[0.2em]">
          Milano Beat Radio
        </Link>
        <nav aria-label="Principale" className="flex gap-4 text-xs uppercase tracking-widest text-white/70">
          <Link href="/" className="hover:text-white">Home</Link>
          <Link href="/eventi" className="hover:text-white">Eventi</Link>
          <Link href="/flash-news" className="hover:text-white">Flash News</Link>
        </nav>
      </div>
    </header>
  )
}
