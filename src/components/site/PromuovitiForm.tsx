'use client'

import { useActionState, useState, useRef } from 'react'
import type { FormState } from '@/src/lib/formSchema'
import Link from 'next/link'

type Props = {
  action: (state: FormState, formData: FormData) => Promise<FormState>
}

const initialState: FormState = { status: 'idle' }
const MAX_FILE_SIZE = 8 * 1024 * 1024 // 8 MB

export function PromuovitiForm({ action }: Props) {
  const [state, formAction, pending] = useActionState(action, initialState)
  const [isSuccessDismissed, setIsSuccessDismissed] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [clientResetKey, setClientResetKey] = useState(0)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File | null) => {
    setFileError(null)
    if (!file) {
      setSelectedFile(null)
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError('Il file supera gli 8 MB. Scegli un file più leggero o comprimilo.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    const ext = file.name ? file.name.split('.').pop()?.toLowerCase() : ''
    const allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'pdf']

    if (!allowedTypes.includes(file.type) && (!ext || !allowedExts.includes(ext))) {
      setFileError('Formato non supportato. Puoi caricare immagini JPG, PNG, WEBP o PDF.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setSelectedFile(file)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    if (file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file))
    } else {
      setPreviewUrl(null)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setFileError(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleResetForm = () => {
    handleRemoveFile()
    setIsSuccessDismissed(true)
    setClientResetKey((k) => k + 1)
  }

  if (state.status === 'success' && !isSuccessDismissed) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-8 text-center space-y-4">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold uppercase tracking-tight text-white">
          Segnalazione Inviata!
        </h3>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-white/80">
          Grazie per aver proposto il tuo evento. Abbiamo inviato un&apos;<strong>email di conferma</strong> all&apos;indirizzo che hai indicato con tutti i dettagli e la locandina ricevuta.
        </p>
        <p className="text-xs text-white/50">
          La redazione di Milano Beat Radio valuterà la proposta al più presto.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={handleResetForm}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:border-brand hover:bg-brand/20"
          >
            Invia un&apos;altra segnalazione
          </button>
        </div>
      </div>
    )
  }

  return (
    <form key={clientResetKey} action={formAction} className="space-y-5">
      {/* Honeypot anti-spam */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <div>
        <label htmlFor="nome" className="mb-1 block text-sm font-medium text-white/90">
          Nome o Referente <span className="text-brand">*</span>
        </label>
        <input
          id="nome"
          name="nome"
          required
          placeholder="Es. Mario Rossi o Nome Organizzazione"
          className="w-full rounded-xl border border-white/20 bg-white/5 px-3.5 py-2.5 text-white placeholder-white/30 transition-colors focus:border-brand focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-white/90">
          Email <span className="text-brand">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="nome@dominio.it (riceverai qui la conferma)"
          className="w-full rounded-xl border border-white/20 bg-white/5 px-3.5 py-2.5 text-white placeholder-white/30 transition-colors focus:border-brand focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="oggetto" className="mb-1 block text-sm font-medium text-white/90">
          Titolo / Nome dell&apos;evento
        </label>
        <input
          id="oggetto"
          name="oggetto"
          placeholder="Es. Milano Sunset Fest, Serata Techno Clubbing..."
          className="w-full rounded-xl border border-white/20 bg-white/5 px-3.5 py-2.5 text-white placeholder-white/30 transition-colors focus:border-brand focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="messaggio" className="mb-1 block text-sm font-medium text-white/90">
          Raccontaci il tuo evento (data, luogo, artisti, link...) <span className="text-brand">*</span>
        </label>
        <textarea
          id="messaggio"
          name="messaggio"
          required
          rows={5}
          placeholder="Inserisci data, orari, location, generi musicali, artisti e se disponibile un link al sito o alla prevendita biglietti..."
          className="w-full rounded-xl border border-white/20 bg-white/5 px-3.5 py-2.5 text-white placeholder-white/30 transition-colors focus:border-brand focus:outline-none"
        />
      </div>

      {/* Upload Locandina */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="locandina" className="block text-sm font-medium text-white/90">
            Locandina dell&apos;evento <span className="text-xs text-white/50 font-normal">(opzionale)</span>
          </label>
          <span className="text-[11px] text-white/40">Max 8 MB (JPG, PNG, WEBP, PDF)</span>
        </div>

        <input
          ref={fileInputRef}
          id="locandina"
          name="locandina"
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null
            handleFile(f)
          }}
        />

        {!selectedFile ? (
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={(e) => {
              e.preventDefault()
              setIsDragging(false)
            }}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragging(false)
              const f = e.dataTransfer.files?.[0] ?? null
              if (f) {
                if (fileInputRef.current) {
                  const dataTransfer = new DataTransfer()
                  dataTransfer.items.add(f)
                  fileInputRef.current.files = dataTransfer.files
                }
                handleFile(f)
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200 ${
              isDragging
                ? 'border-brand bg-brand/10 scale-[1.01]'
                : 'border-white/20 bg-white/[0.02] hover:border-brand/60 hover:bg-white/[0.04]'
            }`}
          >
            <div className="mb-3 flex size-12 items-center justify-center rounded-xl border border-brand/30 bg-brand/10 text-brand transition-transform duration-200 group-hover:scale-105">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-white group-hover:text-brand transition-colors">
              Trascina qui la locandina o <span className="underline decoration-brand/60 underline-offset-4">sfoglia i file</span>
            </p>
            <p className="mt-1 text-xs text-white/50">
              Formati ammessi: JPG, PNG, WEBP o PDF. Verrà inviata direttamente alla redazione.
            </p>
          </div>
        ) : (
          <div className="relative flex items-center gap-4 rounded-2xl border border-brand/40 bg-brand/5 p-4">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Anteprima locandina"
                className="size-16 rounded-lg object-cover border border-white/20 shrink-0"
              />
            ) : (
              <div className="flex size-16 shrink-0 items-center justify-center rounded-lg border border-brand/30 bg-black/60 text-brand">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Pronta per l&apos;invio
                </span>
              </div>
              <p className="truncate text-sm font-semibold text-white">{selectedFile.name}</p>
              <p className="text-xs text-white/50">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'file'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleRemoveFile}
              className="rounded-xl border border-white/20 bg-black/40 p-2 text-white/70 transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
              title="Rimuovi locandina"
              aria-label="Rimuovi locandina"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {fileError && <p className="mt-2 text-xs text-red-400">{fileError}</p>}
      </div>

      <div className="flex items-start gap-3 pt-2">
        <input
          type="checkbox"
          id="privacy"
          name="privacy"
          required
          className="mt-1 shrink-0 rounded border-white/20 bg-white/5 text-brand focus:ring-brand"
        />
        <label htmlFor="privacy" className="text-xs leading-relaxed text-white/70">
          Dichiaro di aver letto la{' '}
          <Link href="/privacy-policy" className="text-brand hover:underline font-medium" target="_blank">
            Privacy Policy
          </Link>{' '}
          e acconsento al trattamento dei dati personali per gestire questa richiesta e ricevere la conferma di ricezione.
        </label>
      </div>

      {state.status === 'error' && (
        <div className="rounded-xl border border-red-500/30 bg-red-950/20 px-4 py-3 text-sm text-red-400">
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-pill w-full sm:w-auto min-w-[200px] justify-center disabled:opacity-50"
      >
        {pending ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
            Invio in corso…
          </span>
        ) : (
          'Invia segnalazione evento'
        )}
      </button>
    </form>
  )
}
