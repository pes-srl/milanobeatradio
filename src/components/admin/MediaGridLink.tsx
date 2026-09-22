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
    <Link href={href} className="mbr-grid__alt">
      Vista a griglia
    </Link>
  )
}
