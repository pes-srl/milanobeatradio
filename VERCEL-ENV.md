# VERCEL-ENV.md — variables de entorno para Vercel (copiar y pegar)

> El repo es PÚBLICO desde 2026-09-08. Los identificadores de infraestructura
> (ref de Supabase, host del pooler, account id de R2) están sustituidos por
> marcadores a propósito: los valores reales viven en `.env.local`, fuera de git.

Vercel → Project → Settings → Environment Variables. Marca **Production** y **Preview**.
Los valores reales están en `.env.local` (no en git). Aquí solo el nombre, el valor
cuando no es secreto, y de dónde sale.

| Variable | Valor | Origen / nota |
|---|---|---|
| `DATABASE_URI` | `postgres://postgres.<SUPABASE-REF>:<DB-PASSWORD>@<POOLER-HOST>:6543/postgres` | **Falta la contraseña de la base de datos.** Supabase → Project Settings → Database. Puerto 6543 (transaction pooler), NO 5432. |
| `PAYLOAD_SECRET` | *(el de `.env.local`)* | 64 hex. Si se cambia, todas las sesiones del admin caducan. |
| `R2_ACCOUNT_ID` | `<R2-ACCOUNT-ID>` | Cloudflare account. |
| `R2_ENABLED` | `true` | |
| `R2_ACCESS_KEY_ID` | *(el de `.env.local`)* | Confirmado con permiso de escritura. |
| `R2_SECRET_ACCESS_KEY` | *(el de `.env.local`)* | |
| `R2_BUCKET` | `mbr-media` | |
| `R2_PUBLIC_URL` | `https://pub-df0e74f6b3f940c5a570551308d6944f.r2.dev` | Provisional: es la Public Development URL. Cuando conectes el dominio `media.milanobeatradio.it` al bucket, cambia este valor y añade su hostname a `next.config.ts`. |
| `RESEND_API_KEY` | *(el de `.env.local`)* | Resend. El dominio `milanobeatradio.it` debe estar verificado en Resend para enviar. |
| `RESEND_FROM_EMAIL` | `noreply@milanobeatradio.it` | Remitente. |
| `CONTACT_TO_EMAIL` | `info@milanobeatradio.it` | Destino de los formularios contatti y promuoviti. |
| `NEXT_PUBLIC_AZURACAST_BASE` | `https://canali.pesstream.eu` | |
| `NEXT_PUBLIC_AZURACAST_STATION` | `mbr` | |
| `NEXT_PUBLIC_SITE_URL` | *(dejar SIN definir hasta el cambio de dominio)* | Mientras el sitio viva en la URL de Vercel, **no la pongas**: sin ella el código usa la URL del propio despliegue. Si la fijas a `https://milanobeatradio.it` antes de tiempo, el sitemap, las URLs canónicas y el botón «Anteprima» del panel apuntarán al WordPress viejo. El día del cambio de dominio, ponla. |

Build command en Vercel (cuando Supabase tenga la contraseña): `pnpm migrate && pnpm build`.

**No subir a Vercel:** las claves de la API de Supabase (anon, service_role, publishable) ni el
token `cfat_…` de la API de Cloudflare. La app no los usa: Payload habla con Postgres directamente
y con R2 por S3. Están guardados comentados en `.env.local` por si hacen falta en el futuro.
