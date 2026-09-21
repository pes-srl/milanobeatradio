/**
 * Helper to extract YouTube video ID and playlist ID from any YouTube URL.
 */
export function parseYoutubeUrl(url: string): string | null {
  if (!url) return null
  const clean = url.trim().replace(/\\/g, '')

  // Match video ID
  const idMatch = clean.match(/(?:youtube\.com\/(?:watch\?[^"'\s]*v=|embed\/)|youtu\.be\/)([\w-]{11})/i)
  if (!idMatch?.[1]) return null

  const videoId = idMatch[1]

  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
  })

  try {
    const parsed = new URL(clean)
    const list = parsed.searchParams.get('list')
    if (list) {
      params.set('list', list)
    }
  } catch {
    const listMatch = clean.match(/[?&]list=([\w-]+)/)
    if (listMatch?.[1]) {
      params.set('list', listMatch[1])
    }
  }

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`
}

/**
 * Extracts YouTube embed URL from Lexical richText data and cleans the bio
 * by removing paragraphs that only contain the YouTube link.
 */
export function extractYoutubeFromBio(bio: unknown): {
  embedUrl: string | null
  cleanedBio: Record<string, unknown> | null
} {
  if (!bio || typeof bio !== 'object') {
    return { embedUrl: null, cleanedBio: null }
  }

  const jsonStr = JSON.stringify(bio)
  // Search for any YouTube URL inside the serialized JSON
  const urlMatch = jsonStr.match(/https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?[^"'\s\\]*v=|embed\/)|youtu\.be\/)[\w-]{11}[^"'\s\\]*/i)

  if (!urlMatch) {
    return { embedUrl: null, cleanedBio: bio as Record<string, unknown> }
  }

  const embedUrl = parseYoutubeUrl(urlMatch[0])
  if (!embedUrl) {
    return { embedUrl: null, cleanedBio: bio as Record<string, unknown> }
  }

  // Clone and filter out paragraphs containing the YouTube link
  try {
    const clone = JSON.parse(jsonStr) as { root?: { children?: unknown[] } }
    if (clone.root?.children && Array.isArray(clone.root.children)) {
      clone.root.children = clone.root.children.filter((child: any) => {
        const text = (child.children || [])
          .map((c: any) => c.text || '')
          .join('')
          .trim()
        return !/youtube\.com|youtu\.be/i.test(text)
      })
    }
    const hasRemainingChildren = (clone.root?.children?.length ?? 0) > 0
    return { embedUrl, cleanedBio: hasRemainingChildren ? (clone as Record<string, unknown>) : null }
  } catch {
    return { embedUrl, cleanedBio: bio as Record<string, unknown> }
  }
}
