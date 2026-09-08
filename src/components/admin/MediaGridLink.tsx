import Link from 'next/link'

/** Button in the media list header that leads to the grid view. */
export function MediaGridLink() {
  return (
    <Link href="/admin/collections/media/grid" className="mbr-grid__alt">
      Vista a griglia
    </Link>
  )
}
