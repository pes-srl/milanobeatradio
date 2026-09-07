import Image from 'next/image'
import Link from 'next/link'
import type { Category, Post } from '@/src/payload-types'
import { IconLink } from '@/src/components/icons'
import { imageAlt, imageUrl } from '@/src/lib/media'
import { StatsRow } from './StatsRow'

type Props = { post: Post; priority?: boolean; variant?: 'grid' | 'feature' | 'small' }

const firstCategory = (post: Post): Category | null => {
  const c = post.category?.[0]
  return c && typeof c === 'object' ? c : null
}

/** Flash News card: image on top, category tag, title, date. */
export function PostCard({ post, priority = false, variant = 'grid' }: Props) {
  const href = `/flash-news/${post.slug}`
  const cat = firstCategory(post)
  const img = imageUrl(post.cover, variant === 'feature' ? 'hero' : 'card')
  const overlay = variant !== 'grid'

  return (
    <article className={`group relative overflow-hidden bg-[#0f0f0f] ${overlay ? 'h-full' : ''}`}>
      <Link href={href} className={`block ${overlay ? 'absolute inset-0' : 'relative aspect-video'}`} aria-label={post.title}>
        {img ? (
          <Image
            src={img}
            alt={imageAlt(post.cover, post.title)}
            fill
            priority={priority}
            sizes={variant === 'feature' ? '(max-width: 1024px) 100vw, 640px' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px'}
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-dark to-black" />
        )}
        {overlay && <div className="overlay absolute inset-0" />}
        <span className="absolute right-4 top-4 grid size-11 place-items-center rounded-full border-2 border-white bg-black/40 text-white transition group-hover:bg-brand">
          <IconLink size={18} />
        </span>
      </Link>
      <div className={overlay ? 'pointer-events-none absolute inset-x-0 bottom-0 p-5' : 'p-5'}>
        {cat && <span className="tag">{cat.name}</span>}
        <h3 className={`mt-2 font-medium leading-snug ${variant === 'feature' ? 'text-2xl sm:text-3xl' : 'text-lg'}`}>
          <Link href={href} className="pointer-events-auto hover:text-brand">
            {post.title}
          </Link>
        </h3>
        {variant === 'grid' && <StatsRow date={post.publishedAt} stats={post.stats} className="mt-3" />}
      </div>
    </article>
  )
}
