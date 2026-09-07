import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { resendAdapter } from '@payloadcms/email-resend'
import { en } from '@payloadcms/translations/languages/en'
import { it } from '@payloadcms/translations/languages/it'
import sharp from 'sharp'

import { collections } from './src/collections'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const databaseUri = process.env.DATABASE_URI ?? ''
const isLocalDb = /localhost|127\.0\.0\.1/.test(databaseUri)
const isProduction = process.env.NODE_ENV === 'production'

// R2 is enabled only when credentials exist; otherwise media falls back to ./media on disk (dev).
const r2Enabled = Boolean(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY)
const r2PublicUrl = (process.env.R2_PUBLIC_URL ?? '').replace(/\/$/, '')

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET ?? '',
  serverURL: process.env.NEXT_PUBLIC_SITE_URL,
  typescript: { outputFile: path.resolve(dirname, 'src/payload-types.ts') },

  admin: {
    user: 'users',
    importMap: { baseDir: path.resolve(dirname) },
    dateFormat: 'dd/MM/yyyy HH:mm',
    timezones: {
      defaultTimezone: 'Europe/Rome',
      // Payload's default list has no Italian timezone: add it in front.
      supportedTimezones: ({ defaultTimezones }) => [{ label: '(GMT+1) Roma / Milano', value: 'Europe/Rome' }, ...defaultTimezones],
    },
    meta: { titleSuffix: ' · Milano Beat Radio' },
  },

  // Admin UI in Italian by default; English available as a fallback.
  i18n: { supportedLanguages: { it, en }, fallbackLanguage: 'it' },

  editor: lexicalEditor(),

  // Transactional email (admin password reset now, contact forms in phase 4).
  // Without RESEND_API_KEY Payload logs emails to the console instead of sending.
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromAddress: process.env.RESEND_FROM_EMAIL ?? 'noreply@milanobeatradio.it',
        defaultFromName: 'Milano Beat Radio',
      })
    : undefined,
  sharp,
  collections,

  /**
   * Supabase Postgres via the TRANSACTION pooler (Supavisor, port 6543).
   * See README "Postgres driver flags" for why each option is set.
   */
  db: postgresAdapter({
    pool: {
      connectionString: databaseUri,
      // Transaction pooler + serverless: keep per-instance pools tiny, drop idle sockets fast.
      max: isProduction ? 5 : 10,
      idleTimeoutMillis: 20_000,
      connectionTimeoutMillis: 10_000,
      // Supabase pooler requires TLS; its chain is not in Node's default CA store.
      ssl: isLocalDb ? false : { rejectUnauthorized: false },
    },
    // Dev: drizzle "push" keeps the schema in sync without migration files.
    // Prod: schema changes ONLY through migration files (`pnpm migrate`).
    push: !isProduction && process.env.PAYLOAD_DB_PUSH !== 'false',
    migrationDir: path.resolve(dirname, 'src/migrations'),
  }),

  plugins: [
    s3Storage({
      enabled: r2Enabled,
      bucket: process.env.R2_BUCKET ?? 'mbr-media',
      config: {
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        region: 'auto',
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
        },
      },
      collections: {
        media: {
          prefix: 'media',
          // Serve straight from the R2 public domain, never through the Next.js server.
          generateFileURL: ({ filename, prefix }) => `${r2PublicUrl}/${prefix ? `${prefix}/` : ''}${filename}`,
        },
      },
    }),
  ],
})
