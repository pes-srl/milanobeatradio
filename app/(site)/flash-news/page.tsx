import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PageHero } from '@/src/components/site/PageHero'
import { FlashNewsBrowser } from '@/src/components/site/FlashNewsBrowser'
import { FlashNewsGrid } from '@/src/components/site/FlashNewsGrid'
import { getPosts } from '@/src/lib/queries'

export const metadata: Metadata = { title: 'City News' }
// Static page served from the CDN. The real refresh is on-demand (Posts afterChange/afterDelete
// hooks); this is only a safety net. The `?tag=` filter is handled client-side in FlashNewsBrowser.
export const revalidate = 86400

export default async function FlashNewsPage() {
  const posts = await getPosts({ limit: 6, page: 1 })

  return (
    <>
      <PageHero
        overtitle="Ultime Notizie"
        title="City News"
        subtitle="News, tendenze, nightlife e aggiornamenti in tempo reale da Milano."
      />

      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8">
        {/* useSearchParams needs a Suspense boundary; the fallback is the same static list. */}
        <Suspense
          fallback={
            posts.docs.length > 0 ? (
              <FlashNewsGrid initialPosts={posts.docs} initialHasNextPage={posts.hasNextPage} />
            ) : null
          }
        >
          <FlashNewsBrowser initialPosts={posts.docs} initialHasNextPage={posts.hasNextPage} />
        </Suspense>
      </section>
    </>
  )
}
