import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/src/components/site/PageHero'
import { FlashNewsGrid } from '@/src/components/site/FlashNewsGrid'
import { getPosts } from '@/src/lib/queries'

export const metadata: Metadata = { title: 'Flash News' }
export const revalidate = 60

export default async function FlashNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>
}) {
  const { tag } = await searchParams
  const posts = await getPosts({ limit: 6, page: 1, tag })

  return (
    <>
      <PageHero
        overtitle="Ultime Notizie"
        title="Flash News"
        subtitle="News, tendenze, nightlife e aggiornamenti in tempo reale da Milano."
      />

      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8">
        {/* Active tag filter banner */}
        {tag && (
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-white/60">Stai visualizzando il tag:</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand bg-brand/10 px-4 py-1.5 text-sm font-bold text-brand">
              #{tag}
            </span>
            <Link
              href="/flash-news"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              × Tutti gli articoli
            </Link>
          </div>
        )}

        {posts.docs.length > 0 ? (
          <FlashNewsGrid
            initialPosts={posts.docs}
            initialHasNextPage={posts.hasNextPage}
            tag={tag}
          />
        ) : (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <p className="text-lg font-semibold text-white/60">
              Nessun articolo trovato{tag ? ` per il tag "#${tag}"` : ''}.
            </p>
            {tag && (
              <Link
                href="/flash-news"
                className="inline-flex items-center gap-2 rounded-xl border border-brand/40 bg-brand/10 px-5 py-2.5 text-sm font-bold text-brand transition hover:bg-brand hover:text-white"
              >
                ← Vedi tutti gli articoli
              </Link>
            )}
          </div>
        )}
      </section>
    </>
  )
}
