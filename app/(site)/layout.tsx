import type { Metadata } from 'next'
import { poppins } from '@/src/lib/fonts'
import { siteUrl } from '@/src/lib/env'
import { imageUrl } from '@/src/lib/media'
import { getSite } from '@/src/lib/queries'
import { PlayerProvider } from '@/src/player/PlayerProvider'
import { PlayerBar } from '@/src/player/PlayerBar'
import { Header } from '@/src/components/site/Header'
import { Footer } from '@/src/components/site/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'Milano Beat Radio', template: '%s · Milano Beat Radio' },
  description: 'Your Event and Party Station — la radio di eventi, vita notturna e cultura di Milano.',
  metadataBase: new URL(siteUrl()),
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    siteName: 'Milano Beat Radio',
    title: 'Milano Beat Radio — Your Event and Party Station',
    description: 'Your Event and Party Station — la radio di eventi, vita notturna e cultura di Milano.',
    url: siteUrl(),
    images: [
      {
        url: '/mbr-logo-v2.png',
        width: 1200,
        height: 630,
        alt: 'Milano Beat Radio',
      },
    ],
  },
  icons: {
    icon: [
      { url: '/mbr-logo-v2.png', type: 'image/png' },
    ],
    shortcut: '/mbr-logo-v2.png',
    apple: '/mbr-logo-v2.png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Milano Beat Radio — Your Event and Party Station',
    description: 'Your Event and Party Station — la radio di eventi, vita notturna e cultura di Milano.',
    images: ['/mbr-logo-v2.png'],
  },
}

/**
 * Root layout of the public site. <PlayerProvider> (and its <audio>) lives HERE and
 * nowhere else, so client-side navigation never unmounts it. Do not move it into a page.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite().catch(() => null)
  return (
    <html lang="it" className={poppins.variable}>
      <body className="min-h-dvh pb-[70px]">
        <PlayerProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <PlayerBar logoUrl={imageUrl(site?.logo, 'thumb')} />
        </PlayerProvider>
      </body>
    </html>
  )
}
