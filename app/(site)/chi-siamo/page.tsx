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
      <PageHero title="Milano Beat Radio" size="lg">
        <p className="mt-6 text-lg text-white/90">{site?.claim ?? 'Your Event and Party Station'}</p>
      </PageHero>

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
