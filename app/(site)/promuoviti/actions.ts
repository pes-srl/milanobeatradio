'use server'

import { headers } from 'next/headers'
import { contactSchema, type FormState } from '@/src/lib/formSchema'
import { rateLimited } from '@/src/lib/rateLimit'
import { sendEmail } from '@/src/lib/resend'

export async function submitPromuoviti(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Dati non validi.' }
  if (parsed.data.website) return { status: 'success' }

  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (rateLimited(`promuoviti:${ip}`)) return { status: 'error', message: 'Troppe richieste. Riprova tra qualche minuto.' }

  const to = process.env.CONTACT_TO_EMAIL
  if (!to) return { status: 'error', message: 'Modulo non configurato. Riprova più tardi.' }

  const { nome, email, oggetto, messaggio } = parsed.data
  await sendEmail({
    to,
    replyTo: email,
    subject: `[Promuoviti] ${oggetto || 'Nuovo evento'} — ${nome}`,
    text: `Nome: ${nome}\nEmail: ${email}\nOggetto: ${oggetto}\n\n${messaggio}`,
  })
  return { status: 'success' }
}
