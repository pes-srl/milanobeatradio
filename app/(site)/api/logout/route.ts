import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

/**
 * Hard logout route handler.
 * Deletes all authentication cookies via Next.js cookies() API and response headers.
 */
export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete('payload-token')
  cookieStore.delete('users-payload-token')

  const response = NextResponse.json({ ok: true })

  // Expire cookies via HTTP response headers
  response.headers.append(
    'Set-Cookie',
    'payload-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax',
  )
  response.headers.append(
    'Set-Cookie',
    'users-payload-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax',
  )

  return response
}

export async function GET() {
  return POST()
}
