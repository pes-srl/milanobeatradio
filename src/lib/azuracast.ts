import { z } from 'zod'
import { env } from './env'

/**
 * AzuraCast (external, read-only). Base + station come from public env vars so the
 * client can poll directly; no proxy through our server.
 */
const BASE = env(process.env.NEXT_PUBLIC_AZURACAST_BASE, 'https://canali.pesstream.eu').replace(/\/$/, '')
const STATION = env(process.env.NEXT_PUBLIC_AZURACAST_STATION, 'mbr')

export const STREAM_URL = `${BASE}/listen/${STATION}/stream`
export const NOW_PLAYING_URL = `${BASE}/api/nowplaying/${STATION}`
export const HISTORY_URL = `${BASE}/api/station/${STATION}/history`

const songSchema = z.looseObject({
  text: z.string().catch(''),
  artist: z.string().catch(''),
  title: z.string().catch(''),
  art: z.string().catch(''),
})

/** Only the fields we use. `looseObject` keeps unknown keys instead of failing on them. */
export const nowPlayingSchema = z.looseObject({
  station: z.looseObject({ name: z.string().catch('Milano Beat Radio') }),
  listeners: z.looseObject({ current: z.number().int().nonnegative().catch(0) }),
  live: z.looseObject({
    is_live: z.boolean().catch(false),
    streamer_name: z.string().nullable().catch(null),
  }),
  now_playing: z.looseObject({ song: songSchema }),
  playing_next: z
    .looseObject({ song: z.looseObject({ text: z.string().catch('') }) })
    .nullable()
    .catch(null),
})

export type NowPlaying = z.infer<typeof nowPlayingSchema>

/**
 * Fetches and validates the now-playing payload. Returns `null` on any failure
 * (network, HTTP, schema): callers must degrade gracefully, never throw at the listener.
 */
export async function fetchNowPlaying(signal?: AbortSignal): Promise<NowPlaying | null> {
  try {
    const res = await fetch(NOW_PLAYING_URL, { signal, cache: 'no-store' })
    if (!res.ok) return null
    const parsed = nowPlayingSchema.safeParse(await res.json())
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}
