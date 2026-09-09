import type { Metadata } from 'next'
import { PageHero } from '@/src/components/site/PageHero'
import { StaffCard } from '@/src/components/site/StaffCard'
import { getMediaByFilename, getStaff } from '@/src/lib/queries'

export const metadata: Metadata = { title: 'Staff' }
export const revalidate = 300

export default async function StaffPage() {
  const [staff, heroMedia] = await Promise.all([
    getStaff(),
    getMediaByFilename('logo party no sfondo FB_1080x1080_4.webp').catch(() => null),
  ])

  const heroSrc =
    heroMedia ??
    'https://pub-df0e74f6b3f940c5a570551308d6944f.r2.dev/media/logo%20party%20no%20sfondo%20FB_1080x1080_4.webp'

  return (
    <>
      <PageHero
        overtitle="Milano Beat Radio Team"
        title="Staff"
        subtitle="I resident DJ, gli speaker e la squadra ufficiale di Milano Beat Radio."
        image={heroSrc}
        size="lg"
      />
      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8">
        {staff.docs.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {staff.docs.map((m, i) => (
              <StaffCard key={m.id} member={m} priority={i < 3} />
            ))}
          </div>
        ) : (
          <p className="text-center text-white/60">Nessun membro pubblicato.</p>
        )}
      </section>
    </>
  )
}
