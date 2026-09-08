/**
 * Reads an environment variable, treating an empty or whitespace-only value the same as
 * a missing one.
 *
 * `process.env.X ?? fallback` is not enough: a variable declared but left blank in the
 * hosting dashboard comes through as `''`, which `??` happily passes along. That is how
 * the first Vercel build failed — `new URL('')` threw and took the whole build down.
 */
export const env = (value: string | undefined, fallback: string): string => {
  const trimmed = value?.trim()
  return trimmed ? trimmed : fallback
}

/**
 * Public site origin, without a trailing slash. Never empty.
 *
 * The Vercel fallback matters while the site is not on its domain yet: without it a
 * deployment with no NEXT_PUBLIC_SITE_URL would build a sitemap, canonical URLs and an
 * "Anteprima" button all pointing at the OLD WordPress site. Set the variable explicitly
 * on the day the domain is switched over; until then the deployment describes itself.
 */
export const siteUrl = (): string => {
  const explicit = env(process.env.NEXT_PUBLIC_SITE_URL, '')
  if (explicit) return explicit.replace(/\/$/, '')
  const vercel = env(process.env.VERCEL_PROJECT_PRODUCTION_URL, '')
  return vercel ? `https://${vercel}` : 'https://milanobeatradio.it'
}
