import Image from 'next/image'
import Link from 'next/link'
import { draftMode } from 'next/headers'
import { DraftBanner } from '@/src/components/site/DraftBanner'
import type { Metadata } from 'next'
import type { Tag } from '@/src/payload-types'
import { notFound } from 'next/navigation'
import { RichText } from '@/src/components/site/RichText'
import { StatsBar } from '@/src/components/site/StatsBar'
import { ShareButtons } from '@/src/components/site/ShareButtons'
import { IconCalendar, IconPerson } from '@/src/components/icons'
import { fmtDate } from '@/src/lib/format'
import { imageAlt, imageUrl } from '@/src/lib/media'
import { getPost } from '@/src/lib/queries'

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}

  const title = post.seo?.title || post.title
  const description = post.seo?.description || post.excerpt || 'Notizia da Milano Beat Radio'
  const img = imageUrl(post.seo?.ogImage || post.cover, 'hero')

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `/flash-news/${slug}`,
      images: img ? [{ url: img, width: 1200, height: 630, alt: title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: img ? [img] : undefined,
    },
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const isDraft = (await draftMode()).isEnabled
  const post = await getPost(slug, isDraft)
  if (!post) notFound()

  const cat = post.category?.find((c): c is Extract<typeof post.category[number], object> => typeof c === 'object')
  const author = post.author && typeof post.author === 'object' ? post.author : null
  const tags = (post.tags ?? []).filter((t): t is Tag => typeof t === 'object' && t !== null)
  const img = imageUrl(post.cover, 'hero')

  return (
    <div className="relative min-h-screen bg-black text-white">
      {isDraft && <DraftBanner path={`/flash-news/${slug}`} />}

      {/* Ambient background glow */}
      {img && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] overflow-hidden opacity-25">
          <Image
            src={img}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover blur-3xl scale-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-black" />
        </div>
      )}

      <main className="relative z-10 mx-auto max-w-6xl px-4 pt-8 pb-20 sm:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/flash-news"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/60 transition hover:text-brand"
          >
            ← Tutte le news
          </Link>
        </div>

        {/* Main News Showcase Grid */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 items-start lg:items-center">
          {/* Left Column: Full Clean Cover Photo */}
          <div className="mx-auto w-full max-w-[540px] lg:max-w-none">
            <div className="relative aspect-video sm:aspect-[16/10] lg:aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f0f] shadow-[0_15px_50px_rgba(0,0,0,0.9)]">
              {img ? (
                <Image
                  src={img}
                  alt={imageAlt(post.cover, post.title)}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover"
                />
              ) : (
                <div className="size-full bg-gradient-to-br from-brand-dark to-black" />
              )}
            </div>
          </div>

          {/* Right Column: Dedicated Info & Title */}
          <div className="flex flex-col space-y-5">
            {/* Category Badge */}
            {cat && (
              <div>
                <span className="inline-block rounded-full border border-brand/40 bg-brand/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand">
                  {cat.name}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
              {post.title}
            </h1>

            {/* Meta Row: Date & Author */}
            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-white/70">
              {post.publishedAt && (
                <div className="flex items-center gap-2">
                  <IconCalendar size={16} className="text-brand" />
                  <span>{fmtDate(post.publishedAt)}</span>
                </div>
              )}
              {author?.name && (
                <div className="flex items-center gap-2">
                  <IconPerson size={16} className="text-brand" />
                  <span>{author.name}</span>
                </div>
              )}
            </div>

            {/* Excerpt if present */}
            {post.excerpt && (
              <p className="text-base sm:text-lg font-medium leading-relaxed text-white/85 border-l-2 border-brand/60 pl-4 py-1">
                {post.excerpt}
              </p>
            )}

            {/* Share Buttons */}
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-white/50">Condividi</p>
              <ShareButtons title={post.title} />
            </div>

            {/* Stats Bar */}
            <div className="border-t border-white/10 pt-4">
              <StatsBar
                collection="posts"
                id={post.id}
                title={post.title}
                views={post.stats?.views}
                likes={post.stats?.likes}
                shares={post.stats?.shares}
              />
            </div>
          </div>
        </div>

        {/* Article Content Section */}
        {post.content && (
          <div className="mt-14 border-t border-white/10 pt-10">
            <article className="prose prose-invert max-w-none text-white/90">
              <RichText data={post.content} />
            </article>
          </div>
        )}

        {/* Author + Tags Footer */}
        {(author?.name || tags.length > 0) && (
          <div className="mt-12 border-t border-white/10 pt-10 space-y-6">
            {/* Author */}
            {author?.name && (
              <p className="text-sm font-semibold text-white/70">
                Scritto da:{' '}
                <span className="font-bold text-brand">{author.name}</span>
              </p>
            )}

            {/* Tag Pills */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/flash-news?tag=${tag.slug}`}
                    className="inline-block rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white/80 transition hover:border-brand hover:bg-brand/10 hover:text-brand"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
