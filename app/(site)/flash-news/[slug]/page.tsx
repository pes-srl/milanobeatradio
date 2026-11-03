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
import { getPost, getPosts, getPublishedSlugs } from '@/src/lib/queries'

// Pre-rendered at build time and served from the CDN. Long revalidate as a safety net: the
// real refresh is on-demand, triggered by the collection's afterChange/afterDelete hooks.
export const revalidate = 86400
export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs('posts').catch(() => [])
  return slugs.map((slug) => ({ slug }))
}

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
  const [post, relatedRes] = await Promise.all([
    getPost(slug, isDraft),
    getPosts({ limit: 4 }).catch(() => null),
  ])
  if (!post) notFound()

  const relatedPosts = (relatedRes?.docs ?? []).filter((p) => p.id !== post.id).slice(0, 3)

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
                <>
                  {/* Sfondo sfumato d'ambiente per riempire i lati senza bande nere */}
                  <Image
                    src={img}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="(max-width: 1024px) 100vw, 600px"
                    className="pointer-events-none object-cover blur-xl scale-125 opacity-40 brightness-75"
                  />
                  {/* Foto / locandina intera senza ritagli */}
                  <Image
                    src={img}
                    alt={imageAlt(post.cover, post.title)}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 600px"
                    className="z-[1] object-contain"
                  />
                </>
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

        {/* Article Content + Editorial Sticky Hub Layout */}
        <div className="mt-16 border-t border-white/15 pt-12 sm:pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Editorial Content (lg:col-span-8) */}
            <div className="lg:col-span-8 space-y-10 min-w-0">
              {post.content && (
                <article>
                  <RichText data={post.content} />
                </article>
              )}

              {/* Author + Tags Footer */}
              {(author?.name || tags.length > 0) && (
                <div className="border-t border-white/10 pt-8 space-y-5">
                  {author?.name && (
                    <div className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/20 text-brand font-bold text-sm">
                        {author.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs text-white/50 uppercase font-bold tracking-wider">Articolo a cura di</p>
                        <p className="text-sm font-bold text-white">{author.name}</p>
                      </div>
                    </div>
                  )}

                  {tags.length > 0 && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3">Argomenti correlati</p>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Link
                            key={tag.id}
                            href={`/flash-news?tag=${tag.slug}`}
                            className="inline-block rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-semibold text-white/80 transition hover:border-brand hover:bg-brand/10 hover:text-brand"
                          >
                            #{tag.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Editorial Disclaimer & Brand Protection */}
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 text-xs text-white/50 space-y-1.5">
                <p className="font-semibold text-white/70">
                  Nota editoriale e promozione territoriale:
                </p>
                <p className="leading-relaxed">
                  Questo contenuto è pubblicato a titolo interamente gratuito nell&apos;ambito dell&apos;attività di divulgazione informativa e culturale di Milano Beat Radio su Milano, provincia e Monza Brianza (non costituisce testata giornalistica ai sensi della L. 62/2001, attività svolta ai sensi dell&apos;Art. 21 Cost.). Marchi, loghi, denominazioni di locali, teatri, spettacoli e format citati appartengono ai rispettivi proprietari e sono menzionati a solo scopo descrittivo (diritto di cronaca). Per richieste di integrazione, rettifica o rimozione:{' '}
                  <a href="mailto:info@milanobeatradio.it" className="text-brand hover:underline font-medium">
                    info@milanobeatradio.it
                  </a>.
                </p>
              </div>
            </div>

            {/* Right Column: Sticky Hub (lg:col-span-4) */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
              
              {/* Card 1: Scheda Rapida Flash News */}
              <div className="rounded-2xl border border-white/10 bg-[#121212] p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-brand animate-pulse" />
                    In Evidenza
                  </span>
                  {post.publishedAt && (
                    <span className="text-xs font-medium text-white/50">{fmtDate(post.publishedAt)}</span>
                  )}
                </div>

                {cat && (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-white/50">Canale</p>
                    <p className="text-sm font-bold text-white mt-0.5">{cat.name}</p>
                  </div>
                )}

                {post.excerpt && (
                  <div className="rounded-xl border-l-2 border-brand/80 bg-brand/5 p-3 text-xs leading-relaxed text-white/85">
                    {post.excerpt}
                  </div>
                )}

                <div className="pt-1">
                  <a
                    href="#top"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand/50 bg-brand/15 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand hover:shadow-[0_0_20px_rgba(200,36,227,0.4)]"
                  >
                    Torna all&apos;inizio ↑
                  </a>
                </div>
              </div>

              {/* Card 2: City Events Hub */}
              <div className="rounded-2xl border border-brand/30 bg-gradient-to-br from-[#1c0636] to-[#0a0a0a] p-5 shadow-xl space-y-3">
                <div className="flex items-center gap-2 text-brand">
                  <span className="text-lg">🎉</span>
                  <p className="text-xs font-bold uppercase tracking-wider text-white">Milano Beat Radio</p>
                </div>
                <p className="text-xs text-white/75 leading-relaxed">
                  Concerti, party esclusivi, festival e tutti i migliori appuntamenti dal vivo a Milano e Lombardia.
                </p>
                <div className="pt-2">
                  <Link
                    href="/eventi"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-[#e0246f] py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:opacity-95"
                  >
                    ▶ Esplora City Events
                  </Link>
                </div>
              </div>

              {/* Card 3: Ultime Notizie Correlate */}
              {relatedPosts.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-[#121212] p-5 shadow-xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-4 flex items-center justify-between">
                    <span>Ultime Notizie</span>
                    <Link href="/flash-news" className="text-brand hover:underline text-[11px] font-semibold">
                      Tutte →
                    </Link>
                  </h4>
                  <div className="divide-y divide-white/5 space-y-3">
                    {relatedPosts.map((rel) => {
                      const relImg = imageUrl(rel.cover, 'thumb')
                      return (
                        <Link
                          key={rel.id}
                          href={`/flash-news/${rel.slug}`}
                          className="group block pt-3 first:pt-0 transition"
                        >
                          <div className="flex gap-3 items-center">
                            {relImg && (
                              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black">
                                <Image
                                  src={relImg}
                                  alt={rel.title}
                                  fill
                                  sizes="56px"
                                  className="object-cover transition duration-300 group-hover:scale-105"
                                />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-white group-hover:text-brand line-clamp-2 transition">
                                {rel.title}
                              </p>
                              {rel.publishedAt && (
                                <p className="text-[11px] text-white/40 mt-1">
                                  {fmtDate(rel.publishedAt)}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}

            </aside>

          </div>
        </div>
      </main>
    </div>
  )
}
