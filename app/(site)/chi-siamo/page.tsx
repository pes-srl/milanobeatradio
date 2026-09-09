import type { Metadata } from 'next'
import { PageHero } from '@/src/components/site/PageHero'
import { SectionTitle } from '@/src/components/site/SectionTitle'
import { PartnerLogos } from '@/src/components/site/PartnerLogos'
import { AppDownload } from '@/src/components/site/AppDownload'
import { getPartners, getSite } from '@/src/lib/queries'

export const metadata: Metadata = { title: 'Chi siamo' }
export const revalidate = 300

export default async function ChiSiamoPage() {
  const [site, partners] = await Promise.all([getSite().catch(() => null), getPartners()])
  return (
    <>
      <PageHero
        overtitle="Milano Beat Radio"
        title="Chi siamo"
        subtitle={site?.claim ?? 'Your Event and Party Station'}
        size="lg"
      />

      <section className="px-4 py-20 sm:px-8">
        <SectionTitle>I nostri partner</SectionTitle>
        <div className="mt-10">
          <PartnerLogos partners={partners.docs} variant="grid" />
        </div>
      </section>

      <AppDownload site={site} />
    </>
  )
}
