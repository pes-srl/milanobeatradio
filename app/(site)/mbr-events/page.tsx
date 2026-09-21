import type { Metadata } from 'next'
import { imageAlt, imageUrl } from '@/src/lib/media'
import { getSite } from '@/src/lib/queries'
import { PageHero } from '@/src/components/site/PageHero'
import { MbrEventsDeck } from '@/src/components/site/MbrEventsDeck'

export const metadata: Metadata = { title: 'MBR Events' }
export const revalidate = 300

const HERO_IMAGE_URL = 'https://pub-df0e74f6b3f940c5a570551308d6944f.r2.dev/media/2.webp'

/**
 * MBR Events: promotional page for the radio's own event/party services.
 * The presentation slides are displayed via an interactive high-impact lookbook deck + CTA.
 */
export default async function MbrEventsPage() {
  const site = await getSite().catch(() => null)

  const heroSrc = HERO_IMAGE_URL

  const posterItems = (site?.mbrEventsPosters ?? [])
    .map((p) => {
      const url = imageUrl(p.image, 'hero') || imageUrl(p.image, 'card')
      const alt = imageAlt(p.image, 'MBR Events Slide')
      return url ? { url, alt } : null
    })
    .filter((item): item is { url: string; alt: string } => item !== null)

  return (
    <>
      <PageHero
        overtitle="Musica · Atmosfera · Groove"
        title="MBR Events"
        subtitle="Molto più di un DJ set"
        image={heroSrc}
        size="lg"
      />

      {posterItems.length > 0 && <MbrEventsDeck posters={posterItems} />}
    </>
  )
}
