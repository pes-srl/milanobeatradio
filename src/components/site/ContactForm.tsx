'use client'

import { useActionState } from 'react'
import type { FormState } from '@/src/lib/formSchema'

type Props = {
  action: (state: FormState, formData: FormData) => Promise<FormState>
  messageLabel?: string
  submitLabel?: string
}

const initialState: FormState = { status: 'idle' }

/** Shared nome/email/oggetto/messaggio form (Contact Form 7 field parity) + honeypot. */
export function ContactForm({ action, messageLabel = 'Messaggio', submitLabel = 'Invia' }: Props) {
  const [state, formAction, pending] = useActionState(action, initialState)

  if (state.status === 'success') {
    return <p className="rounded bg-emerald-900/40 px-4 py-3 text-emerald-200">Grazie! Il tuo messaggio è stato inviato.</p>
  }

  return (
    <form action={formAction} className="space-y-4">
      {/* Honeypot: hidden from real users, bots tend to fill every field. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <div>
        <label htmlFor="nome" className="mb-1 block text-sm font-medium">Nome (richiesto)</label>
        <input id="nome" name="nome" required className="w-full rounded border border-white/20 bg-white/5 px-3 py-2.5 text-white focus:border-brand focus:outline-none" />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">Email (richiesta)</label>
        <input id="email" name="email" type="email" required className="w-full rounded border border-white/20 bg-white/5 px-3 py-2.5 text-white focus:border-brand focus:outline-none" />
      </div>
      <div>
        <label htmlFor="oggetto" className="mb-1 block text-sm font-medium">Oggetto</label>
        <input id="oggetto" name="oggetto" className="w-full rounded border border-white/20 bg-white/5 px-3 py-2.5 text-white focus:border-brand focus:outline-none" />
      </div>
      <div>
        <label htmlFor="messaggio" className="mb-1 block text-sm font-medium">{messageLabel}</label>
        <textarea id="messaggio" name="messaggio" required rows={5} className="w-full rounded border border-white/20 bg-white/5 px-3 py-2.5 text-white focus:border-brand focus:outline-none" />
      </div>

      {state.status === 'error' && <p className="text-sm text-red-400">{state.message}</p>}

      <button type="submit" disabled={pending} className="btn-pill disabled:opacity-50">
        {pending ? 'Invio…' : submitLabel}
      </button>
    </form>
  )
}
