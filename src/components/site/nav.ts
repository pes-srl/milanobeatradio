export type NavItem = {
  href: string
  label: string
}

/** Full site menu in requested order: HOME, MBR EVENTS, CITY NEWS, CITY EVENTS, INTERVISTE, PROMUOVITI, TEAM. */
export const SIDE_NAV: readonly NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/mbr-events', label: 'MBR Events' },
  { href: '/flash-news', label: 'City News' },
  { href: '/eventi', label: 'City Events' },
  { href: '/interviste', label: 'Interviste' },
  { href: '/promuoviti', label: 'Promuoviti' },
  { href: '/staff', label: 'Team' },
] as const

/** Main menu (excluding Home) for footer */
export const MAIN_NAV: readonly NavItem[] = SIDE_NAV.filter((item) => item.href !== '/')

/** Secondary links (none currently). */
export const MORE_NAV: readonly NavItem[] = []

/** Legal & compliance links for footer */
export const LEGAL_NAV: readonly NavItem[] = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/cookie-policy', label: 'Cookie Policy' },
  { href: '/contatti', label: 'Contatti' },
] as const

