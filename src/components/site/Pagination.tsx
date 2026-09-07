import Link from 'next/link'

export function Pagination({ page, totalPages, basePath }: { page: number; totalPages: number; basePath: string }) {
  if (totalPages <= 1) return null
  return (
    <div className="mt-12 flex justify-center">
      {page < totalPages ? (
        <Link href={`${basePath}?page=${page + 1}`} className="btn-pill">Carica altro</Link>
      ) : (
        <p className="text-sm text-white/50">Hai visto tutti i contenuti.</p>
      )}
    </div>
  )
}
