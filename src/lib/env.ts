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

/** Public site origin, without a trailing slash. Never empty. */
export const siteUrl = (): string =>
  env(process.env.NEXT_PUBLIC_SITE_URL, 'https://milanobeatradio.it').replace(/\/$/, '')
