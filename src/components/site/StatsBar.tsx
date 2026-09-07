'use client'

import { IconEye, IconHeart, IconShare } from '@/src/components/icons'
import type { StatsCollection } from '@/src/lib/stats'
import { useLike, useShare, useViewCount } from '@/src/lib/useStats'

type Props = {
  collection: StatsCollection
  id: number
  title: string
  views?: number | null
  likes?: number | null
  shares?: number | null
}

/**
 * Live counters on a detail page: registers the view, and lets the reader like or share.
 * The numbers shown are the ones stored on the document, updated in place after each action.
 */
export function StatsBar({ collection, id, title, views = 0, likes = 0, shares = 0 }: Props) {
  const target = { collection, id }
  const viewCount = useViewCount(target, views ?? 0)
  const { likes: likeCount, liked, toggle } = useLike(target, likes ?? 0)
  const { shares: shareCount, registerShare } = useShare(target, shares ?? 0)

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title, url })
      else await navigator.clipboard.writeText(url)
      await registerShare()
    } catch {
      /* the reader cancelled the share sheet: nothing to count */
    }
  }

  return (
    <div className="flex items-center gap-5 text-sm font-semibold text-white/80">
      <span className="flex items-center gap-1.5" title="Visualizzazioni">
        <IconEye size={16} className="text-brand" />
        {viewCount}
      </span>

      <button
        type="button"
        onClick={toggle}
        aria-pressed={liked}
        aria-label={liked ? 'Togli mi piace' : 'Mi piace'}
        className={`flex items-center gap-1.5 transition hover:text-white ${liked ? 'text-brand' : ''}`}
      >
        <IconHeart size={16} className={liked ? 'fill-current text-brand' : 'text-brand'} />
        {likeCount}
      </button>

      <button type="button" onClick={share} aria-label="Condividi" className="flex items-center gap-1.5 transition hover:text-white">
        <IconShare size={16} className="text-brand" />
        {shareCount}
      </button>
    </div>
  )
}
