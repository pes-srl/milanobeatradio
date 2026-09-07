import { NextResponse } from 'next/server'
import { payloadClient } from '@/src/lib/payload'
import { rateLimited } from '@/src/lib/rateLimit'
import { isBot, statsRequestSchema, STATS_COLUMNS, STATS_TABLES } from '@/src/lib/stats'

type Pool = { query: (text: string, values?: unknown[]) => Promise<{ rows: { value: string }[] }> }

/**
 * Engagement counters (views / likes / shares).
 *
 * Deliberately bypasses the Payload document API and increments the column directly
 * through the adapter's connection pool. Two reasons, both about not wrecking the data:
 *   - every content collection has drafts + autosave, so `payload.update` on each view
 *     would write a new version row per page view and the versions table would explode;
 *   - `SET col = col + 1` is atomic, whereas read-then-write loses counts under
 *     concurrent traffic.
 * Table and column names come from fixed allowlists in src/lib/stats.ts, never from the
 * request body, so nothing user-controlled reaches the SQL string.
 */
export async function POST(request: Request) {
  const parsed = statsRequestSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'bad request' }, { status: 400 })

  if (isBot(request.headers.get('user-agent'))) {
    // Silently accept so crawlers get a normal response and do not retry.
    return NextResponse.json({ ok: true, counted: false })
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (rateLimited(`stats:${ip}`, 60, 60_000)) {
    return NextResponse.json({ error: 'too many requests' }, { status: 429 })
  }

  const { collection, id, action } = parsed.data
  const table = STATS_TABLES[collection]
  const column = STATS_COLUMNS[action]
  const delta = action === 'unlike' ? -1 : 1

  const payload = await payloadClient()
  const pool = (payload.db as unknown as { pool: Pool }).pool

  const result = await pool.query(
    `UPDATE ${table} SET ${column} = GREATEST(COALESCE(${column}, 0) + $1, 0) WHERE id = $2 RETURNING ${column} AS value`,
    [delta, id],
  )
  if (result.rows.length === 0) return NextResponse.json({ error: 'not found' }, { status: 404 })

  return NextResponse.json({ ok: true, counted: true, value: Number(result.rows[0]!.value) })
}
