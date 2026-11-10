'use server'

import { headers } from 'next/headers'
import { contactSchema, type FormState } from '@/src/lib/formSchema'
import { rateLimited } from '@/src/lib/rateLimit'
import { sendEmail, type EmailAttachment } from '@/src/lib/resend'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function submitPromuoviti(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Dati non validi.' }
  }
  if (parsed.data.website) return { status: 'success' } // honeypot

  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (rateLimited(`promuoviti:${ip}`)) {
    return { status: 'error', message: 'Troppe richieste. Riprova tra qualche minuto.' }
  }

  const to = process.env.CONTACT_TO_EMAIL || 'redazione@milanobeatradio.it'
  const { nome, email, oggetto, messaggio } = parsed.data

  // Gestione file locandina
  const file = formData.get('locandina') as File | null
  const attachments: EmailAttachment[] = []
  let hasLocandina = false
  let locandinaName = ''

  if (file && typeof file === 'object' && 'size' in file && file.size > 0) {
    const MAX_SIZE = 8 * 1024 * 1024 // 8 MB
    if (file.size > MAX_SIZE) {
      return { status: 'error', message: 'La locandina supera gli 8 MB. Scegli un file più leggero.' }
    }

    const allowedMime = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
    const ext = file.name ? file.name.split('.').pop()?.toLowerCase() : ''
    const allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'pdf']

    if (!allowedMime.includes(file.type) && (!ext || !allowedExts.includes(ext))) {
      return { status: 'error', message: 'Formato locandina non supportato. Puoi caricare JPG, PNG, WEBP o PDF.' }
    }

    try {
      const arrayBuffer = await file.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString('base64')
      locandinaName = file.name || 'locandina'
      hasLocandina = true
      attachments.push({
        filename: locandinaName,
        content: base64,
        contentType: file.type || 'application/octet-stream',
      })
    } catch (fileErr) {
      console.error('[promuoviti] Errore lettura file locandina:', fileErr)
      return { status: 'error', message: 'Impossibile elaborare il file della locandina. Riprova.' }
    }
  }

  // 1. Invio email alla redazione MBR
  try {
    const editorialSubject = `[Promuoviti] ${oggetto || 'Nuovo evento'} — ${nome}`
    const editorialText = [
      `Nuova segnalazione evento ricevuta dal form "Promuoviti" di Milano Beat Radio:`,
      ``,
      `Referente: ${nome}`,
      `Email: ${email}`,
      `Titolo/Oggetto: ${oggetto || 'Non specificato'}`,
      `Locandina: ${hasLocandina ? `${locandinaName} (allegata a questa email)` : 'Nessuna locandina allegata'}`,
      ``,
      `Dettagli / Messaggio:`,
      messaggio,
      ``,
      `--------------------------------------------------`,
      `Rispondendo direttamente a questa email scriverai a ${nome} (${email}).`,
    ].join('\n')

    const editorialHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #222; max-width: 600px; line-height: 1.5;">
        <h2 style="color: #c824e3; margin-bottom: 6px;">Nuova Segnalazione Evento (Promuoviti)</h2>
        <p style="margin-top: 0; color: #666; font-size: 14px;">Ricevuta tramite il sito web di Milano Beat Radio.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
          <tr><td style="padding: 6px 0; font-weight: bold; width: 140px; color: #444;">Nome referente:</td><td>${escapeHtml(nome)}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold; color: #444;">Email:</td><td><a href="mailto:${escapeHtml(email)}" style="color: #c824e3;">${escapeHtml(email)}</a></td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold; color: #444;">Titolo evento:</td><td>${escapeHtml(oggetto || 'Non specificato')}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold; color: #444;">Locandina:</td><td>${hasLocandina ? `<strong>${escapeHtml(locandinaName)}</strong> (in allegato)` : '<em>Nessuna locandina allegata</em>'}</td></tr>
        </table>
        <h3 style="margin-top: 20px; margin-bottom: 8px; font-size: 15px; color: #111;">Dettagli evento:</h3>
        <div style="background: #f7f7f9; border-left: 4px solid #c824e3; padding: 12px 16px; border-radius: 4px; white-space: pre-wrap; font-size: 14px; color: #333;">${escapeHtml(messaggio)}</div>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 24px 0 12px;" />
        <p style="font-size: 12px; color: #888;">Cliccando su "Rispondi" nel tuo programma di posta risponderai direttamente a <strong>${escapeHtml(email)}</strong>.</p>
      </div>
    `

    await sendEmail({
      to,
      replyTo: email,
      subject: editorialSubject,
      text: editorialText,
      html: editorialHtml,
      attachments,
    })
  } catch (err) {
    console.error('[promuoviti] Errore invio email a redazione:', err)
    return {
      status: 'error',
      message: 'Servizio email temporaneamente non disponibile. Riprova più tardi o contattaci sui nostri canali social.',
    }
  }

  // 2. Invio email di conferma automatica all'utente
  try {
    const userSubject = `Ricevuta segnalazione evento: "${oggetto || 'Nuovo Evento'}" — Milano Beat Radio`
    const userText = [
      `Ciao ${nome},`,
      ``,
      `grazie per aver segnalato il tuo evento a Milano Beat Radio!`,
      `Abbiamo ricevuto la tua proposta${hasLocandina ? ' e la relativa locandina' : ''}.`,
      ``,
      `Riepilogo della segnalazione:`,
      `- Evento: ${oggetto || 'Non specificato'}`,
      `- Locandina: ${hasLocandina ? `${locandinaName} (ricevuta con successo)` : 'Nessuna locandina allegata'}`,
      `- Dettagli:`,
      messaggio,
      ``,
      `Cosa succede adesso?`,
      `La redazione valuta periodicamente tutte le proposte ricevute. Se l'iniziativa risulterà coerente con lo spirito e la linea editoriale di MBR, l'evento verrà inserito gratuitamente nel nostro calendario sul sito e/o rilanciato sui canali social della radio.`,
      ``,
      `Per qualsiasi modifica, rettifica o integrazione, puoi rispondere direttamente a questa email oppure scriverci a ${to}.`,
      ``,
      `A presto e viva la musica!`,
      `La Redazione di Milano Beat Radio`,
      `https://milanobeatradio.it`,
    ].join('\n')

    const userHtml = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0b0f; color: #ffffff; padding: 24px 12px; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #141419; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); padding: 32px 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #c824e3; background: rgba(200,36,227,0.12); padding: 6px 14px; border-radius: 999px;">Milano Beat Radio</span>
            <h1 style="color: #ffffff; font-size: 22px; margin: 16px 0 8px; font-weight: 800; letter-spacing: -0.5px;">Abbiamo ricevuto il tuo evento!</h1>
            <p style="color: rgba(255,255,255,0.65); font-size: 14px; margin: 0;">Conferma di avvenuta ricezione della tua segnalazione</p>
          </div>

          <div style="background-color: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <p style="color: rgba(255,255,255,0.9); font-size: 15px; margin-top: 0;">Ciao <strong>${escapeHtml(nome)}</strong>,</p>
            <p style="color: rgba(255,255,255,0.75); font-size: 14px; line-height: 1.6;">
              grazie per aver condiviso la tua iniziativa con noi. Ti confermiamo che la segnalazione per <strong>${escapeHtml(oggetto || 'il tuo evento')}</strong> è stata recapitata correttamente alla redazione${hasLocandina ? ' <strong>insieme alla locandina</strong>' : ''}.
            </p>
            
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 13px; color: rgba(255,255,255,0.65);">
              <p style="margin: 4px 0;"><strong style="color: rgba(255,255,255,0.9);">Titolo:</strong> ${escapeHtml(oggetto || 'Non specificato')}</p>
              <p style="margin: 4px 0;"><strong style="color: rgba(255,255,255,0.9);">Locandina:</strong> ${hasLocandina ? `<span style="color: #c824e3; font-weight: 600;">✓ ${escapeHtml(locandinaName)}</span> (ricevuta)` : 'Nessuna locandina allegata'}</p>
              <p style="margin: 12px 0 4px;"><strong style="color: rgba(255,255,255,0.9);">Dettagli inviati:</strong></p>
              <blockquote style="margin: 4px 0; padding: 10px 14px; background: rgba(0,0,0,0.5); border-left: 3px solid #c824e3; border-radius: 4px; font-style: normal; white-space: pre-wrap; color: rgba(255,255,255,0.85);">${escapeHtml(messaggio)}</blockquote>
            </div>
          </div>

          <div style="font-size: 13px; line-height: 1.6; color: rgba(255,255,255,0.65); margin-bottom: 24px;">
            <p style="margin-bottom: 6px;"><strong style="color: rgba(255,255,255,0.9);">Come procediamo:</strong></p>
            <p style="margin: 0;">
              La redazione valuta periodicamente tutte le segnalazioni. Se la proposta sarà coerente con la nostra programmazione, l&apos;evento verrà inserito gratuitamente nella sezione eventi del sito e/o rilanciato sui canali social di MBR.
            </p>
          </div>

          <div style="text-align: center; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; font-size: 12px; color: rgba(255,255,255,0.45);">
            <p style="margin: 0 0 6px;">Hai bisogno di fare una rettifica o integrare info? Rispondi direttamente a questa email o scrivi a <a href="mailto:${to}" style="color: #c824e3; text-decoration: none;">${to}</a></p>
            <p style="margin: 0;">Milano Beat Radio — Musica ed Eventi a Milano e Brianza</p>
          </div>

        </div>
      </body>
      </html>
    `

    await sendEmail({
      to: email,
      replyTo: to,
      subject: userSubject,
      text: userText,
      html: userHtml,
    })
  } catch (userEmailErr) {
    // Non blocchiamo l'esito positivo se la redazione ha comunque ricevuto la richiesta
    console.warn('[promuoviti] Impossibile recapitare email di conferma all utente:', userEmailErr)
  }

  return { status: 'success' }
}
