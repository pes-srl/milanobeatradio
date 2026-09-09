/** Main menu (top bar and main off-canvas list). */
export const MAIN_NAV = [
  { href: '/mbr-events', label: 'MBR Events' },
  { href: '/eventi', label: 'Eventi' },
  { href: '/flash-news', label: 'Flash News' },
  { href: '/interviste', label: 'Interviste' },
  { href: '/staff', label: 'Staff' },
  { href: '/promuoviti', label: 'Promuoviti' },
] as const

/** Secondary links (none currently). */
export const MORE_NAV: readonly { href: string; label: string }[] = []
