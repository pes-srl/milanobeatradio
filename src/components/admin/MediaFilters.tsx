'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useTransition } from 'react'

type Kind = 'all' | 'image' | 'audio' | 'video'

interface FilterOption {
  key: Kind
  label: string
}

const FILTERS: FilterOption[] = [
  { key: 'all', label: 'Tutti' },
  { key: 'image', label: 'Foto' },
  { key: 'audio', label: 'Audio' },
  { key: 'video', label: 'Video' },
]

/**
 * Clickable quick filters toolbar for the Media collection table view.
 * Allows editors and admins to easily toggle between All, Photos, Audio, and Video files.
 */
export function MediaFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const searchStr = searchParams ? searchParams.toString() : ''
  let activeKind: Kind = 'all'
  if (searchStr.includes('image')) {
    activeKind = 'image'
  } else if (searchStr.includes('audio')) {
    activeKind = 'audio'
  } else if (searchStr.includes('video')) {
    activeKind = 'video'
  }

  const handleSelect = useCallback(
    (kind: Kind) => {
      const params = new URLSearchParams()

      // Retain existing parameters (like search terms or limits) while resetting pagination and previous where filters
      if (searchParams) {
        searchParams.forEach((val, key) => {
          if (!key.startsWith('where') && key !== 'page') {
            params.set(key, val)
          }
        })
      }

      if (kind === 'image') {
        params.set('where[mimeType][like]', 'image')
      } else if (kind === 'audio') {
        params.set('where[mimeType][like]', 'audio')
      } else if (kind === 'video') {
        params.set('where[mimeType][like]', 'video')
      }

      const qs = params.toString()
      const targetUrl = `${pathname || '/admin/collections/media'}${qs ? `?${qs}` : ''}`

      startTransition(() => {
        router.push(targetUrl)
      })
    },
    [pathname, router, searchParams],
  )

  return (
    <div className="mbr-media-toolbar">
      <div className="mbr-media-toolbar__inner">
        <div className="mbr-media-toolbar__label-group">
          <span className="mbr-media-toolbar__dot" />
          <span className="mbr-media-toolbar__label">Filtra per tipo:</span>
        </div>

        <div className="mbr-media-toolbar__pills" role="tablist" aria-label="Filtri tipo file">
          {FILTERS.map((f) => {
            const isActive = activeKind === f.key
            return (
              <button
                key={f.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                disabled={isPending}
                className={`mbr-media-toolbar__pill ${isActive ? 'is-active' : ''}`}
                onClick={() => handleSelect(f.key)}
              >
                {f.key === 'all' && (
                  <svg className="mbr-media-toolbar__icon" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 3h7v7H3zm11 0h7v7h-7zm-11 11h7v7H3zm11 0h7v7h-7z" />
                  </svg>
                )}
                {f.key === 'image' && (
                  <svg className="mbr-media-toolbar__icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                )}
                {f.key === 'audio' && (
                  <svg className="mbr-media-toolbar__icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="16" r="3" />
                  </svg>
                )}
                {f.key === 'video' && (
                  <svg className="mbr-media-toolbar__icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                )}
                <span className="mbr-media-toolbar__name">{f.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
