'use client'

import { useState } from 'react'
import { IconFacebook, IconInstagram } from '@/src/components/icons'

interface ShareButtonsProps {
  title: string
  /** Page URL — defaults to window.location.href if omitted */
  url?: string
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const getUrl = () => {
    if (typeof window === 'undefined') return url || ''

    if (url) {
      if (url.startsWith('http://') || url.startsWith('https://')) return url
      return `${window.location.origin}${url}`
    }

    // In local development (localhost / 127.0.0.1), Facebook's cloud crawler cannot
    // connect to a private local machine. Passing a localhost URL causes Facebook
    // to discard the link and display a blank post box.
    // Falling back to the public deployment URL allows Facebook to fetch the real
    // Open Graph image, title, and preview during testing.
    const isLocal =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.endsWith('.local')

    if (isLocal) {
      return `https://milanobeatradio-lake.vercel.app${window.location.pathname}`
    }

    return window.location.href
  }

  /** Facebook: always open the sharer dialog */
  const shareOnFacebook = () => {
    const pageUrl = encodeURIComponent(getUrl())
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
      'facebook-share',
      'width=600,height=550,resizable,scrollbars',
    )
  }

  /** Instagram: use native share sheet on mobile, copy link on desktop */
  const shareOnInstagram = async () => {
    const pageUrl = getUrl()
    if (navigator.share) {
      try {
        await navigator.share({ title, url: pageUrl })
      } catch {
        // user cancelled — do nothing
      }
    } else {
      // Desktop fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(pageUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      } catch {
        // clipboard not available
      }
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Facebook */}
      <button
        type="button"
        onClick={shareOnFacebook}
        aria-label="Condividi su Facebook"
        className="inline-flex items-center gap-2.5 rounded-xl border border-[#1877F2]/40 bg-[#1877F2]/10 px-4 py-2.5 text-sm font-bold text-[#1877F2] shadow-sm transition duration-200 hover:scale-[1.03] hover:bg-[#1877F2] hover:text-white"
      >
        <IconFacebook size={20} />
        <span className="hidden sm:inline">Facebook</span>
      </button>

      {/* Instagram / Share */}
      <button
        type="button"
        onClick={shareOnInstagram}
        aria-label="Condividi su Instagram"
        className="inline-flex items-center gap-2.5 rounded-xl border border-[#E1306C]/40 bg-[#E1306C]/10 px-4 py-2.5 text-sm font-bold text-[#E1306C] shadow-sm transition duration-200 hover:scale-[1.03] hover:bg-gradient-to-r hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white hover:border-transparent"
      >
        <IconInstagram size={20} />
        <span className="hidden sm:inline">{copied ? 'Link copiato!' : 'Instagram'}</span>
      </button>
    </div>
  )
}
