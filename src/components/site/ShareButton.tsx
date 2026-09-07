'use client'

import { useState } from 'react'
import { IconShare } from '@/src/components/icons'

/** Floating share button: Web Share API on mobile, clipboard fallback on desktop. */
export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)
  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title, url })
      else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      /* user cancelled */
    }
  }
  return (
    <button type="button" onClick={share} aria-label="Condividi" className="fixed bottom-24 right-5 z-40 grid size-14 place-items-center rounded-full bg-brand text-white shadow-lg transition hover:bg-brand-dark">
      {copied ? <span className="text-[10px] font-semibold">Copiato</span> : <IconShare size={22} />}
    </button>
  )
}
