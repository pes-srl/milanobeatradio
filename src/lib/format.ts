const TZ = 'Europe/Rome'

export const DAY_NAMES_IT = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'] as const
/** Monday-first order used by the schedule tabs. */
export const WEEK_ORDER = ['1', '2', '3', '4', '5', '6', '0'] as const

export const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: TZ })
export const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', timeZone: TZ })
export const fmtDay = (iso: string) => new Date(iso).toLocaleDateString('it-IT', { day: '2-digit', timeZone: TZ })
export const fmtMonthYear = (iso: string) => {
  const s = new Date(iso).toLocaleDateString('it-IT', { month: 'short', year: 'numeric', timeZone: TZ }).replace('.', '')
  return s.charAt(0).toUpperCase() + s.slice(1)
}
export const fmtLong = (iso: string) => new Date(iso).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: TZ })

/** Current Rome weekday ('0'..'6') and "HH:mm". */
export function nowInRome(): { dayOfWeek: string; time: string } {
  const now = new Date()
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(now)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  const map: Record<string, string> = { Sun: '0', Mon: '1', Tue: '2', Wed: '3', Thu: '4', Fri: '5', Sat: '6' }
  return { dayOfWeek: map[get('weekday')] ?? '1', time: `${get('hour').padStart(2, '0')}:${get('minute')}` }
}

export type Slot = { dayOfWeek: string; start: string; end: string }

/** True when the slot covers the given local time (slots crossing midnight are supported). */
export function slotIsOn(slot: Slot, at = nowInRome()): boolean {
  if (slot.dayOfWeek !== at.dayOfWeek) return false
  if (slot.start <= slot.end) return at.time >= slot.start && at.time < slot.end
  return at.time >= slot.start || at.time < slot.end
}

/** Google Calendar "add event" URL. */
export function googleCalendarUrl(e: { title: string; startDate: string; endDate?: string | null; address?: string | null; venueName?: string | null; description?: string }) {
  const f = (iso: string) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, '')
  const end = e.endDate ?? new Date(new Date(e.startDate).getTime() + 3 * 3600_000).toISOString()
  const q = new URLSearchParams({ action: 'TEMPLATE', text: e.title, dates: `${f(e.startDate)}/${f(end)}`, location: [e.venueName, e.address].filter(Boolean).join(', '), details: e.description ?? '' })
  return `https://calendar.google.com/calendar/render?${q}`
}
