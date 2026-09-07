/** Main menu: the five entries of the original site, same order. */
export const MAIN_NAV = [
  { href: '/mbr-events', label: 'MBR Events' },
  { href: '/eventi', label: 'Eventi' },
  { href: '/flash-news', label: 'Flash News' },
  { href: '/interviste', label: 'Interviste' },
  { href: '/staff', label: 'Staff' },
] as const

/** Secondary links (off-canvas menu and footer). */
export const MORE_NAV = [
  { href: '/programmi', label: 'Programmi' },
  { href: '/chi-siamo', label: 'Chi siamo' },
  { href: '/promuoviti', label: 'Promuoviti' },
  { href: '/contatti', label: 'Contatti' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
] as const
