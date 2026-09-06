import type { CollectionConfig } from 'payload'

/** Drafts + versions, shared by every content collection. */
export const versions: NonNullable<CollectionConfig['versions']> = {
  drafts: { autosave: { interval: 1500 }, schedulePublish: true },
  maxPerDoc: 25,
}

/** Day-of-week options. 0 = Sunday (JavaScript `Date.getDay()` convention). */
export const dayOfWeekOptions = [
  { value: '1', label: { it: 'Lunedì', en: 'Monday' } },
  { value: '2', label: { it: 'Martedì', en: 'Tuesday' } },
  { value: '3', label: { it: 'Mercoledì', en: 'Wednesday' } },
  { value: '4', label: { it: 'Giovedì', en: 'Thursday' } },
  { value: '5', label: { it: 'Venerdì', en: 'Friday' } },
  { value: '6', label: { it: 'Sabato', en: 'Saturday' } },
  { value: '0', label: { it: 'Domenica', en: 'Sunday' } },
]

export const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/

export const validateHHMM = (value: unknown) =>
  typeof value === 'string' && HHMM.test(value) ? true : 'Formato orario non valido: usa HH:mm (es. 07:30).'
