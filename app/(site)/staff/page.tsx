import type { Metadata } from 'next'
import { PageHero } from '@/src/components/site/PageHero'
import { StaffCard } from '@/src/components/site/StaffCard'
import { getStaff } from '@/src/lib/queries'

export const metadata: Metadata = { title: 'Staff' }
export const revalidate = 300

export default async function StaffPage() {
  const staff = await getStaff()
  return (
    <>
      <PageHero title="Staff" />
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
