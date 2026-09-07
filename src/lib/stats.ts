import { z } from 'zod'

/** Collections that carry a `stats` group. The map doubles as an allowlist: the table
 *  name is never taken from user input, so the counter SQL cannot be injected into. */
export const STATS_TABLES = {
  posts: 'posts',
  events: 'events',
  podcasts: 'podcasts',
  shows: 'shows',
  staff: 'staff',
} as const

export type StatsCollection = keyof typeof STATS_TABLES

/** Column per action. Same reasoning as above: fixed strings, never interpolated input. */
export const STATS_COLUMNS = {
  view: 'stats_views',
  like: 'stats_likes',
  unlike: 'stats_likes',
  share: 'stats_shares',
} as const

export type StatsAction = keyof typeof STATS_COLUMNS

export const statsRequestSchema = z.object({
  collection: z.enum(Object.keys(STATS_TABLES) as [StatsCollection, ...StatsCollection[]]),
  id: z.number().int().positive(),
  action: z.enum(Object.keys(STATS_COLUMNS) as [StatsAction, ...StatsAction[]]),
})

/**
 * Crawlers and preview fetchers must not inflate the counters. The beacon is fired from
 * client JavaScript, which already filters most bots; this catches the ones that do run JS
 * and the obvious library user-agents.
 */
const BOT_PATTERN =
  /bot|crawl|spider|slurp|bing|duckduck|baidu|yandex|facebookexternalhit|whatsapp|telegram|preview|headless|lighthouse|pagespeed|gtmetrix|pingdom|curl|wget|python-requests|axios|node-fetch|monitor|scrape/i

export const isBot = (userAgent: string | null): boolean => !userAgent || BOT_PATTERN.test(userAgent)
