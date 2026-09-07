/** Minimal Resend client (no SDK dependency beyond the one Payload already installs). */
export async function sendEmail(opts: { to: string; subject: string; text: string; replyTo?: string }) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL ?? 'noreply@milanobeatradio.it'
  if (!apiKey) {
    console.log('[email:dev]', { from, ...opts })
    return
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: `Milano Beat Radio <${from}>`, to: [opts.to], reply_to: opts.replyTo, subject: opts.subject, text: opts.text }),
  })
  if (!res.ok) throw new Error(`Resend error ${res.status}: ${await res.text()}`)
}
