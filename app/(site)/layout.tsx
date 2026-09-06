import type { Metadata } from 'next'
import { poppins } from '@/src/lib/fonts'
import { PlayerProvider } from '@/src/player/PlayerProvider'
import { PlayerBar } from '@/src/player/PlayerBar'
import { SiteNav } from '@/src/components/SiteNav'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'Milano Beat Radio', template: '%s · Milano Beat Radio' },
  description: 'Your Event and Party Station',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
}

/**
 * Root layout of the public site. <PlayerProvider> (and its <audio>) lives HERE and
 * nowhere else, so client-side navigation never unmounts it. Do not move it into a page.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={poppins.variable}>
      <body className="min-h-dvh pb-20">
        <PlayerProvider>
          <SiteNav />
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
          <PlayerBar />
        </PlayerProvider>
      </body>
    </html>
  )
}
