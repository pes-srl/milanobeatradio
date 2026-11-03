'use client'

import type { NowPlaying } from '@/src/lib/azuracast'

export type NowPlayingState = {
  data: NowPlaying | null
  /** True when the last poll failed; `data` keeps the last good value. */
  stale: boolean
  updatedAt: number | null
}

const DEFAULT_STATE: NowPlayingState = { data: null, stale: false, updatedAt: null }

/**
 * Disabled polling hook: returns a static state to avoid generating ~50,000 HTTP
 * calls/day to the AzuraCast server when track metadata is not required on the frontend.
 */
export function useNowPlaying(): NowPlayingState {
  return DEFAULT_STATE
}
