import Link from 'next/link'
import { RenderStamp } from '@/src/components/RenderStamp'

export const dynamic = 'force-dynamic'

/** Placeholder home (phase 0). Real sections: IN CITTA' → FLASH NEWS → CITY EVENTS → PARTNERS. */
export default function HomePage() {
  return (
    <section className="space-y-6">
      <p className="text-xs uppercase tracking-[0.3em] text-white/60">Your Event and Party Station</p>
      <h1 className="text-3xl font-bold uppercase tracking-wider">Milano Beat Radio</h1>
      <p className="max-w-prose text-white/80">
        Pagina segnaposto della fase 0. Premi Play nella barra in basso, poi naviga tra{' '}
        <Link href="/eventi" className="text-brand underline">Eventi</Link> e{' '}
        <Link href="/flash-news" className="text-brand underline">Flash News</Link>: l’audio non si interrompe.
      </p>
      <RenderStamp label="Home" />
    </section>
  )
}
