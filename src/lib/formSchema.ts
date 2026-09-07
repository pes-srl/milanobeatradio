import { z } from 'zod'

export const contactSchema = z.object({
  nome: z.string().trim().min(1, 'Il nome è richiesto').max(200),
  email: z.email('Email non valida').max(200),
  oggetto: z.string().trim().max(200).optional().default(''),
  messaggio: z.string().trim().min(1, 'Il messaggio è richiesto').max(5000),
  website: z.string().max(0, 'Richiesta non valida').optional().default(''), // honeypot
})

export type FormState = { status: 'idle' | 'success' | 'error'; message?: string }
