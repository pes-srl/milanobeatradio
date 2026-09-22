'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * Top-level "Dashboard" link in the left admin sidebar navigation.
 * Displayed above all collection groups for easy access back to the main dashboard.
 */
export function NavDashboardLink() {
  const pathname = usePathname()
  const href = '/admin'
  const isActive = pathname === href || pathname === `${href}/`

  return (
    <div className="mbr-nav-dashboard-wrap">
      <Link
        href={href}
        className={`nav__link mbr-nav-dashboard-link${isActive ? ' active' : ''}`}
        aria-current={isActive ? 'page' : undefined}
        id="nav-dashboard"
      >
        {isActive && <div className="nav__link-indicator" />}
        <svg
          className="mbr-nav-dashboard-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
        </svg>
        <span className="nav__link-label">Dashboard</span>
      </Link>
    </div>
  )
}
