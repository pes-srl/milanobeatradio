/** In-memory fixed-window rate limit. Fine for a single Vercel function instance / low-volume forms. */
const hits = new Map<string, { count: number; resetAt: number }>()

export function rateLimited(key: string, max = 5, windowMs = 60_000): boolean {
  const now = Date.now()
  const entry = hits.get(key)
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs })
    return false
  }
  entry.count += 1
  return entry.count > max
}
