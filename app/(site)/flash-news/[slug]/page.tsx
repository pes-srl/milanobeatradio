import { draftMode } from 'next/headers'
import { DraftBanner } from '@/src/components/site/DraftBanner'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageHero } from '@/src/components/site/PageHero'
import { RichText } from '@/src/components/site/RichText'
import { StatsBar } from '@/src/components/site/StatsBar'
import { fmtDate } from '@/src/lib/format'
import { imageUrl } from '@/src/lib/media'
import { getPost } from '@/src/lib/queries'

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return {
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt || undefined,
    openGraph: { images: imageUrl(post.seo?.ogImage || post.cover, 'hero') ? [imageUrl(post.seo?.ogImage || post.cover, 'hero')!] : undefined },
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const isDraft = (await draftMode()).isEnabled
  const post = await getPost(slug, isDraft)
  if (!post) notFound()

  const cat = post.category?.find((c): c is Extract<typeof post.category[number], object> => typeof c === 'object')

  return (
    <>
      {isDraft && <DraftBanner path={`/flash-news/${slug}`} />}
      <PageHero title={post.title} image={post.cover} kicker={cat?.name} size="lg" uppercase={false} />
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          {post.publishedAt && <p className="text-sm font-semibold text-white/60">{fmtDate(post.publishedAt)}</p>}
          <StatsBar collection="posts" id={post.id} title={post.title} views={post.stats?.views} likes={post.stats?.likes} shares={post.stats?.shares} />
        </div>
        <RichText data={post.content} />
      </article>
    </>
  )
}
