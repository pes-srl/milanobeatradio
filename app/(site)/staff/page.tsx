import type { Metadata } from 'next'
import { PageHero } from '@/src/components/site/PageHero'
import { StaffCard } from '@/src/components/site/StaffCard'
import { getStaff } from '@/src/lib/queries'

export const metadata: Metadata = { title: 'Team' }
export const revalidate = 300

const STAFF_ORDER = ['criss', 'luca', 'emilio', 'selene-amelio', 'tom', 'tati']

export default async function StaffPage() {
  const staff = await getStaff()

  const sortedStaff = [...staff.docs].sort((a, b) => {
    const idxA = STAFF_ORDER.indexOf(a.slug)
    const idxB = STAFF_ORDER.indexOf(b.slug)
    if (idxA !== -1 && idxB !== -1) return idxA - idxB
    if (idxA !== -1) return -1
    if (idxB !== -1) return 1
    return 0
  })

  return (
    <>
      <PageHero
        overtitle="Milano Beat Radio"
        title="Team"
      />
      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8">
        {sortedStaff.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedStaff.map((m, i) => (
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
