'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

/** Button in the media list header that leads to the grid view preserving the active filter. */
export function MediaGridLink() {
  const searchParams = useSearchParams()
  const searchStr = searchParams ? searchParams.toString() : ''

  let kind = 'all'
  if (searchStr.includes('image')) {
    kind = 'image'
  } else if (searchStr.includes('audio')) {
    kind = 'audio'
  } else if (searchStr.includes('video')) {
    kind = 'video'
  }

  const href = kind !== 'all' ? `/admin/collections/media/grid?kind=${kind}` : '/admin/collections/media/grid'

  return (
    <Link href={href} className="mbr-media-toolbar__view-btn mbr-media-toolbar__view-btn--cta" title="Passa alla vista a griglia">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
      <span>Vista a griglia</span>
    </Link>
  )
}
