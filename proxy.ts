import { NextResponse, type NextRequest } from 'next/server'
import map from './src/redirects.generated.json'

/**
 * Legacy WordPress URL handling (phase 5).
 *
 * - 308 for every path a migrated document used to live at. The map is generated from
 *   the database by `pnpm generate:redirects`, never written by hand.
 * - 410 for the Pro.Radio demo pages that got indexed: telling Google the page is gone
 *   drops it from the index, whereas redirecting them to unrelated content does not.
 * - The old cache plugin appended `?swcfpc=1` to every internal link, so that parameter
 *   is stripped and never carried over to the new URL.
 *
 * Every path in the map is stored WITHOUT a trailing slash, because Next normalises
 * `/foo/` to `/foo` before the proxy runs. Old links always carried the trailing slash,
 * so they arrive here already stripped.
 */

const redirects = map.redirects as Record<string, string>
const gone = new Set(map.gone)
const gonePrefixes = map.gonePrefixes

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  if (gone.has(pathname) || gonePrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return new NextResponse(null, { status: 410, headers: { 'x-robots-tag': 'noindex' } })
  }

  const destination = redirects[pathname]
  if (destination) {
    const url = new URL(destination, request.url)
    // Carry real query params over, but drop the old cache plugin's marker.
    searchParams.forEach((value, key) => {
      if (key !== 'swcfpc') url.searchParams.set(key, value)
    })
    return NextResponse.redirect(url, 308)
  }

  // A stale ?swcfpc=1 on an otherwise valid URL: clean it out of the address bar.
  if (searchParams.has('swcfpc')) {
    const url = request.nextUrl.clone()
    url.searchParams.delete('swcfpc')
    return NextResponse.redirect(url, 308)
  }

  return NextResponse.next()
}

export const config = {
  // Skip the admin, the API, Next internals and anything with a file extension.
  matcher: ['/((?!admin|api|_next|favicon.ico|.*\\.[\\w]+$).*)'],
}
