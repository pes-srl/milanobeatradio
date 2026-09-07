import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageHero } from '@/src/components/site/PageHero'
import { RichText } from '@/src/components/site/RichText'
import { SocialLinks } from '@/src/components/site/SocialLinks'
import { StatsBar } from '@/src/components/site/StatsBar'
import { imageUrl } from '@/src/lib/media'
import { getStaffMember } from '@/src/lib/queries'

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const member = await getStaffMember(slug)
  if (!member) return {}
  return { title: member.title, openGraph: { images: imageUrl(member.photo, 'hero') ? [imageUrl(member.photo, 'hero')!] : undefined } }
}

export default async function StaffMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const member = await getStaffMember(slug)
  if (!member) notFound()

  return (
    <>
      <PageHero title={member.title} image={member.photo} kicker={member.role ?? undefined} kickerColor="white" size="lg" uppercase>
        <div className="mt-6"><SocialLinks socials={member.socials} /></div>
      </PageHero>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
        <div className="mb-8 border-b border-white/10 pb-5">
          <StatsBar collection="staff" id={member.id} title={member.title} views={member.stats?.views} likes={member.stats?.likes} shares={member.stats?.shares} />
        </div>
        {member.bio && <RichText data={member.bio} />}
      </article>
    </>
  )
}
