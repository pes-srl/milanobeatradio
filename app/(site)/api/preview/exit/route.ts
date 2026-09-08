import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

/** Leaves draft mode and returns to the same page, now showing the published version. */
export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get('path')
  const safe = path && path.startsWith('/') && !path.startsWith('//') ? path : '/'

  const draft = await draftMode()
  draft.disable()
  redirect(safe)
}
