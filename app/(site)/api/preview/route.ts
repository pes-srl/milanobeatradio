import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { payloadClient } from '@/src/lib/payload'

/**
 * Entry point for the admin "Anteprima" button: turns on Next draft mode and sends the
 * editor to the real page, which then renders the newest version instead of the
 * published one (see bySlug in src/lib/queries.ts).
 *
 * Two guards, because draft mode exposes unpublished content:
 * - the caller must carry a valid Payload session (same origin, so the cookie is there);
 * - `path` must be a relative path on this site, never an absolute or protocol-relative
 *   URL, or the button would be an open redirect.
 */
export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get('path')

  if (!path || !path.startsWith('/') || path.startsWith('//')) {
    return new Response('Percorso non valido.', { status: 400 })
  }

  const payload = await payloadClient()
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) return new Response('Non autorizzato.', { status: 401 })

  const draft = await draftMode()
  draft.enable()
  redirect(path)
}
