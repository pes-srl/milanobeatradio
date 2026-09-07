import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }
const base = ({ size = 18, ...rest }: P) => ({ width: size, height: size, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true, ...rest })

export const IconPlay = (p: P) => (
  <svg {...base(p)}><path d="M6 3.5v17l14-8.5z" /></svg>
)
export const IconPlayOutline = (p: P) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinejoin="round"><path d="M7 4.5v15l12-7.5z" /></svg>
)
export const IconPause = (p: P) => (
  <svg {...base(p)}><rect x="5" y="4" width="5" height="16" /><rect x="14" y="4" width="5" height="16" /></svg>
)
export const IconMenu = (p: P) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
)
export const IconClose = (p: P) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
)
export const IconVolume = (p: P) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round"><path d="M4 9h4l5-4v14l-5-4H4z" /><path d="M16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11" /></svg>
)
export const IconMute = (p: P) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round"><path d="M4 9h4l5-4v14l-5-4H4z" /><path d="M17 9l4 6M21 9l-4 6" /></svg>
)
export const IconInstagram = (p: P) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
)
export const IconFacebook = (p: P) => (
  <svg {...base(p)}><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.3c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.4H7.4V14h2.8v8z" /></svg>
)
export const IconLinkedin = (p: P) => (
  <svg {...base(p)}><path d="M6.9 8.5H3.6V21h3.3zM5.2 3a1.9 1.9 0 100 3.8 1.9 1.9 0 000-3.8zM21 13.3c0-3.6-1.9-5.2-4.5-5.2-2 0-2.9 1.1-3.4 1.9V8.5H9.8V21h3.3v-6.9c0-1.8.3-3.6 2.6-3.6 2.2 0 2.2 2.1 2.2 3.7V21H21z" /></svg>
)
export const IconTiktok = (p: P) => (
  <svg {...base(p)}><path d="M16 3c.3 2.3 1.6 3.7 3.9 3.9v3.2c-1.5 0-2.8-.4-3.9-1.2v6.3A5.6 5.6 0 1110.4 9.6v3.3a2.4 2.4 0 102.4 2.4V3z" /></svg>
)
export const IconSpotify = (p: P) => (
  <svg {...base(p)}><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm4.3 14.5a.7.7 0 01-1 .2c-2.6-1.6-5.9-2-9.8-1.1a.7.7 0 11-.3-1.4c4.3-1 8-.5 10.9 1.3.3.2.4.7.2 1zm1.2-2.7a.9.9 0 01-1.2.3c-3-1.8-7.5-2.4-11-1.3a.9.9 0 11-.5-1.7c4-1.2 9-.6 12.4 1.5.4.3.5.8.3 1.2zm.1-2.9C14 8.8 8.3 8.6 4.9 9.6a1 1 0 11-.6-2c3.9-1.2 10.3-1 14.4 1.5a1 1 0 01-1.1 1.8z" /></svg>
)
export const IconCalendar = (p: P) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
)
export const IconCalendarAdd = (p: P) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4M12 13v5M9.5 15.5h5" /></svg>
)
export const IconClock = (p: P) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
)
export const IconPin = (p: P) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>
)
export const IconLink = (p: P) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round"><path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1.5 1.5" /><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1.5-1.5" /></svg>
)
export const IconShare = (p: P) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="M8.2 10.8l7.6-4.6M8.2 13.2l7.6 4.6" /></svg>
)
export const IconPerson = (p: P) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></svg>
)
export const IconBell = (p: P) => (
  <svg {...base(p)}><path d="M12 2a6 6 0 00-6 6v3.6L4 15v1h16v-1l-2-3.4V8a6 6 0 00-6-6zm0 20a2.5 2.5 0 002.5-2.5h-5A2.5 2.5 0 0012 22z" /></svg>
)
export const IconExternal = (p: P) => (
  <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1h5" /></svg>
)
export const IconAndroid = (p: P) => (
  <svg {...base(p)}><path d="M6 16a1 1 0 001 1h1v3a1.5 1.5 0 003 0v-3h2v3a1.5 1.5 0 003 0v-3h1a1 1 0 001-1V8H6zM3.5 8A1.5 1.5 0 002 9.5v5a1.5 1.5 0 003 0v-5A1.5 1.5 0 003.5 8zm17 0a1.5 1.5 0 00-1.5 1.5v5a1.5 1.5 0 003 0v-5A1.5 1.5 0 0020.5 8zM15.6 3.6l1-1.7-.6-.4-1 1.8a5.7 5.7 0 00-6 0L8 1.5l-.6.4 1 1.7A5 5 0 006 7h12a5 5 0 00-2.4-3.4zM9.5 5.5a.7.7 0 110-1.4.7.7 0 010 1.4zm5 0a.7.7 0 110-1.4.7.7 0 010 1.4z" /></svg>
)
export const IconApple = (p: P) => (
  <svg {...base(p)}><path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.6-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.3 1.2 9.7.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.6-1-2.6-3.9zM14 5.5c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.6 2.8-1.4z" /></svg>
)
