import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { DraftBanner } from '@/src/components/site/DraftBanner'
import { notFound } from 'next/navigation'
import { PageHero } from '@/src/components/site/PageHero'
import { RichText } from '@/src/components/site/RichText'
import { getPage } from '@/src/lib/queries'

export const metadata: Metadata = { title: 'Privacy Policy' }
export const revalidate = 3600

export default async function PrivacyPolicyPage() {
  const isDraft = (await draftMode()).isEnabled
  const page = await getPage('privacy-policy', isDraft)
  if (!page) notFound()
  return (
    <>
      {isDraft && <DraftBanner path="/privacy-policy" />}
      <PageHero title="Privacy Policy" />
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
        <RichText data={page.content} />
      </article>
    </>
  )
}
