import { env } from './env'

export type EmailAttachment = {
  filename: string
  content: string // Base64 encoded string
  contentType?: string
}

/** Minimal Resend client (no SDK dependency beyond the one Payload already installs). */
export async function sendEmail(opts: {
  to: string
  subject: string
  text: string
  html?: string
  replyTo?: string
  attachments?: EmailAttachment[]
}) {
  const apiKey = process.env.RESEND_API_KEY
  const from = env(process.env.RESEND_FROM_EMAIL, 'noreply@milanobeatradio.it')
  if (!apiKey) {
    console.log('[email:dev]', { from, ...opts })
    return
  }

  const payload: Record<string, unknown> = {
    from: `Milano Beat Radio <${from}>`,
    to: [opts.to],
    reply_to: opts.replyTo,
    subject: opts.subject,
    text: opts.text,
  }
  if (opts.html) payload.html = opts.html
  if (opts.attachments && opts.attachments.length > 0) {
    payload.attachments = opts.attachments.map((att) => ({
      filename: att.filename,
      content: att.content,
      ...(att.contentType ? { content_type: att.contentType } : {}),
    }))
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Resend error ${res.status}: ${await res.text()}`)
}
