'use client'

import { useEffect, useState } from 'react'

/**
 * Custom Logout button for Milano Beat Radio admin header.
 * Fixes Next.js router cache retention by calling /api/users/logout,
 * expiring cookies, clearing client storage, and performing a hard page load.
 */
export function LogoutButton() {
  const [loggingOut, setLoggingOut] = useState(false)

  const performLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch('/api/users/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (err) {
      console.error('Logout error:', err)
    }

    // Force expire payload token cookie across all paths
    document.cookie = 'payload-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    document.cookie = 'payload-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/admin;'

    try {
      localStorage.clear()
      sessionStorage.clear()
    } catch {}

    // Hard page navigation purges Next.js App Router client caches
    window.location.href = '/admin/login?logout=success'
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
