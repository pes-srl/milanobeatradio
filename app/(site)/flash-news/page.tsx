import type { Metadata } from 'next'
import { PageHero } from '@/src/components/site/PageHero'
import { PostCard } from '@/src/components/site/PostCard'
import { Pagination } from '@/src/components/site/Pagination'
import { getPosts } from '@/src/lib/queries'

export const metadata: Metadata = { title: 'Flash News' }
export const revalidate = 300

export default async function FlashNewsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams
  const posts = await getPosts({ limit: 12, page: Number(page) || 1 })

  return (
    <>
      <PageHero title="Flash News" />
      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8">
        {posts.docs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.docs.map((p, i) => (
              <PostCard key={p.id} post={p} priority={i < 3} />
            ))}
          </div>
        ) : (
          <p className="text-center text-white/60">Nessun articolo pubblicato.</p>
        )}
        <Pagination page={posts.page ?? 1} totalPages={posts.totalPages ?? 1} basePath="/flash-news" />
      </section>
    </>
  )
}
