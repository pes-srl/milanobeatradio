'use client'

import { useEffect, useState } from 'react'

/**
 * Custom Logout button for Milano Beat Radio admin header.
 * Ensures complete session termination by:
 * 1. Invoking Payload API with credentials: 'include' so HttpOnly cookies are passed & cleared
 * 2. Invoking /api/logout to purge Next.js server cookie store
 * 3. Expiring all possible client cookie path combinations
 * 4. Navigating to /admin/login via hard page reload
 */
export function LogoutButton() {
  const [loggingOut, setLoggingOut] = useState(false)

  const performLogout = async () => {
    if (loggingOut) return
    setLoggingOut(true)

    try {
      // 1. Call Payload native logout endpoint with credentials
      await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
    } catch {}

    try {
      // 2. Call Next.js hard cookie purge endpoint
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch {}

    // 3. Expire any accessible client cookies across all paths and subdomains
    if (typeof window !== 'undefined') {
      const cookiesToClear = ['payload-token', 'users-payload-token', 'payload-lng']
      const paths = ['/', '/admin', '/api']
      cookiesToClear.forEach((name) => {
        paths.forEach((path) => {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${window.location.hostname};`
        })
      })

      try {
        localStorage.clear()
        sessionStorage.clear()
      } catch {}

      // 4. Hard page navigation purges Next.js App Router client caches
      window.location.href = '/admin/login?logout=' + Date.now()
    }
  }

  // Auto-trigger hard logout if user lands directly on /admin/logout
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname.endsWith('/logout')) {
      performLogout()
    }
  }, [])

  return (
    <button
      type="button"
      onClick={performLogout}
      className="mbr-logout-btn"
      disabled={loggingOut}
      title="Disconnettiti dall'amministrazione"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      <span>{loggingOut ? 'Uscita...' : 'Logout'}</span>
    </button>
  )
}
