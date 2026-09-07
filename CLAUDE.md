# Milano Beat Radio — migración WordPress → Next.js + Payload

> Este archivo es la memoria persistente del proyecto entre sesiones.
> Léelo entero antes de tocar nada. Si una decisión no está aquí, PREGUNTA, no improvises.

## ESTADO ACTUAL
**Fase 0 — COMPLETADA el 2026-09-07** (pendiente de validación del cliente).
Hecho: scaffold Next 16.3.4 + Payload 3.88 + Postgres + R2 (código listo, credenciales pendientes),
11 colecciones, reproductor persistente verificado con Playwright, seed demo, migración inicial, README.
Export de WordPress ya descargado en `migration/export.xml` (18 MB). Inventario real en MIGRATION-NOTES.md.
Local: Postgres 17 de Homebrew (`mbr_dev`), sin Supabase todavía. Ver TASKS-HUMANAS.md para lo bloqueante.
Siguiente: respuestas del cliente (color, roles, slug show, audio podcast) → fase 1 diseño, o fase 3 mediateca → R2.

Fases:
- Fase 0: scaffold, Payload, colecciones, reproductor persistente, seed demo, README ← **AQUÍ**
- Fase 1: diseño de páginas
- Fase 2: import del XML (posts, events, podcasts, shows, staff, partners)
- Fase 3: migración de mediateca a R2 con filtrado de huérfanos
- Fase 4: formularios, SEO avanzado, Control Room, contadores
- Fase 5: redirecciones 301/410 (sacar los 122 slugs de /post-sitemap.xml, nunca a mano)

---

# CONTEXTO PERSISTENTE

## Qué es
Radio online de Milán, en italiano. Enfoque: eventos, vida nocturna y cultura
de la ciudad. Claim actual: "Your Event and Party Station".
Idioma del sitio: ITALIANO. Código y comentarios: inglés.

## Stack fijado (no negociable sin preguntar)
- Next.js 16 App Router (decidido por el cliente el 2026-09-07; era 15), TypeScript strict, Tailwind CSS v4
- Payload CMS 3 embebido en la misma app. Payload es el MOTOR
  (esquema, auth, media, versiones, editor rico). Nunca acceso directo a
  Postgres desde el admin: todo por Local API para no saltarse hooks.
- Supabase Postgres, SIEMPRE por el pooler :6543 en modo transaction.
  Configura el driver para serverless (sin prepared statements).
  Esta es la trampa clásica del stack: documenta en el README qué flags usaste.
- Cloudflare R2 vía @payloadcms/storage-s3 (endpoint S3, region "auto")
- Deploy en Vercel (plan Pro: hay sponsors, es uso comercial)
- Emails transaccionales con Resend

## Radio — AzuraCast externo, NO se toca, datos ya verificados
Stream:      https://canali.pesstream.eu/listen/mbr/stream   (AAC 96 kbps)
Now playing: https://canali.pesstream.eu/api/nowplaying/mbr
Historial:   https://canali.pesstream.eu/api/station/mbr/history
Campos útiles: station.name · listeners.current · now_playing.song.{text,artist,title,art}
· playing_next.song.text · live.{is_live, streamer_name}
Valida SIEMPRE la respuesta con Zod. Si el stream cae, degrada con elegancia:
nunca una pantalla en blanco ni un error visible al oyente.

## REQUISITO NO NEGOCIABLE
El `<audio>` vive en `app/(site)/layout.tsx` dentro de `<PlayerProvider>` y
NUNCA se desmonta al navegar. La música no se corta jamás.
Esto es lo único que el WordPress actual resolvía con un plugin de carga AJAX
que además le rompía el scroll. Si alguna decisión pone esto en riesgo, PARA y
pregunta.

## Variables de entorno
```
DATABASE_URI                      # Supabase pooler :6543
PAYLOAD_SECRET
R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY
R2_BUCKET=mbr-media
R2_PUBLIC_URL=https://media.milanobeatradio.it
RESEND_API_KEY / CONTACT_TO_EMAIL
NEXT_PUBLIC_AZURACAST_BASE=https://canali.pesstream.eu
NEXT_PUBLIC_AZURACAST_STATION=mbr
NEXT_PUBLIC_SITE_URL=https://milanobeatradio.it
```

---

# MODELO DE DATOS (colecciones Payload = los antiguos CPT)

Volúmenes reales medidos en el sitio actual.

**posts** — 122 registros publicados. Es la sección FLASH NEWS.
DECISIÓN CLIENTE 2026-09-07: los BORRADORES de cualquier CPT (392 posts, 1 evento, 14 members, 1 sponsor)
se IGNORAN por completo. Solo se migra `<wp:status>publish`.
title, slug, excerpt, content (richText), cover (media), category (rel),
publishedAt, seo. Categorías reales con uso: FlashNews 102, Cultura 45,
Events 22, Arte 12, Comunità 12, Cinema 4, DJ 3, Club 2, Letteratura 2,
Mostre 2, Curiosità 1, Dance 1, Electronic music 1.
IMPORTANTE: hay 8 categorías con 0 posts (Baseball, Calcio, Featured, Food,
Green, Highlights, Ippica, Interviste). NO las migres.

**events** — 5 registros. Campos verificados en el HTML del sitio viejo:
title, slug, content, cover, startDate (datetime), endDate (datetime),
venueName, address (texto libre completo), lat, lng, externalUrl, eventType (rel).
Ejemplo real para validar el mapeo:
  "HOUSE NIGHT @ Amnesia Milano – 14 Febbraio 2026"
  inizio 14/02/2026 23:00 · fine 15/02/2026 05:00
  luogo "Amnesia Milano"
  indirizzo "Via Alfonso Gatto angolo Viale Forlanini, 20134 Milano (MI) Italy"
  link "https://it.ra.co/events/2348877"
  lineup en el cuerpo: Luuk van Dijk · Jaden Thompson · Not From Here
Las fechas del origen vienen en formato italiano DD/MM/YYYY: parsea con cuidado
y guarda en UTC con zona Europe/Rome.

**podcasts** — 14 registros. title, slug, description, cover,
audioUrl (a R2), duration, publishedAt, filters (rel).
DECISIÓN CLAVE: "INTERVISTE" **no es un tipo de contenido**, es un filtro de
podcast. Los 14 registros se llaman todos `INTERVISTA "…"`. La página /interviste
es una vista filtrada de podcasts. NO crees una colección aparte.

**shows** — 6 registros: Playlist MBR · Back2 the Classic · Back2 the Classic
(Dance Version) · Song to sing in the shower · MBR Dark Mode ·
Gintonic, Milano Deep & Drink.
title, slug, description, cover, genre (rel), hosts (rel a staff),
slots[] { dayOfWeek 0-6, start "HH:mm", end "HH:mm" }.
El palinsesto es semanal recurrente. Datos reales del lunes para validar:
06:00-07:00 Playlist MBR · 07:00-07:30 Back2 the Classic ·
07:30-08:00 Playlist MBR · 08:30-14:00 Playlist MBR · 14:30-18:00 Playlist MBR.
Hay huecos entre franjas: el modelo debe permitirlos, no asumas continuidad.
Los 7 días de la semana existen (Lunedì → Domenica).

**staff** — 6 registros: Criss Dell'Orto (slug `criss`) · Luca · Emilio · Tati ·
Selene Amelio · "Il vostro Mike di fiduccia" (slug `il-vostro-mike-di-fiducia`).
title, slug, role, bio (richText), photo, socials{instagram,facebook,tiktok,spotify}.
Los roles NO están en la web actual: déjalos vacíos (ver TASKS-HUMANAS.md).

**partners** — 11 registros (antes `qtsponsor`): Milano Hub Factory · Wimpy ·
SIAE · Luce Verde · FM World Talkmedia · Baianita · 3B Meteo · PES · Phonogram ·
SCF · Coming Soon. Campos: name, logo, url, order (drag-sort), active.
Ojo: "Milano Hub Factrory" está mal escrito en el origen; corrígelo.

**Taxonomías** como colecciones simples: categories, eventTypes, podcastFilters,
genres. Todas con name, slug, description opcional.

## NO migrar
- CPT `radiochannel`: 3 registros y 2 son de prueba (`criss-test-channel`,
  `milano-test-channel`). AzuraCast ya es la fuente de verdad.
- CPT `chart`: 0 registros. El plugin de votaciones estaba activo sin usarse.
- CPT `prdedicationslist`: fase posterior.
- Las ~35 páginas demo del tema, que hoy están indexadas y en el sitemap:
  home-01…home-18, blog-horizontal, blog-masonry, blog-no-sidebar, blog-sidebar,
  donor-dashboard-2/-3/-4, markup-and-formatting, page-with-sidebar,
  masonry-gallery, show-slider, custom-player, videos-elementor,
  charts-elementor, events-page-elementor, podcast-page-elementor,
  demo-temporary, temporary-templatest-page, promote, home-*.
  Estas deben devolver 410 Gone, no 301.

---

# ARQUITECTURA DE PÁGINAS Y TEXTOS

Menú principal (5 entradas, tal cual el original):
MBR EVENTS · EVENTI · FLASH NEWS · INTERVISTE · STAFF

Rutas nuevas y su origen:
```
/                        home            (era /)
/mbr-events              eventos propios (era /mbr-events/)
/eventi                  agenda ciudad   (era /events-archive/)
/eventi/[slug]           detalle evento  (era /event/[slug]/)
/flash-news              listado news    (era /flash-news/ y /category/flashnews/)
/flash-news/[slug]       detalle post    (era /[slug]/  ← ojo, raíz)
/interviste              podcasts filtrados (era /interviste/)
/podcast/[slug]          detalle podcast (era /podcast/[slug]/)
/programmi               palinsesto      (era /programmi/ y /shows-schedule/)
/programmi/[slug]        detalle show    (era /shows/[slug]/)
/staff                   equipo          (era /team-members/)
/staff/[slug]            ficha           (era /members/[slug]/)
/chi-siamo               sobre nosotros  (era /milano-beat-radio/)
/promuoviti              form promoción  (era /promuoviti/)
/contatti                form contacto   (era /contacts/)
/privacy-policy                          (era /privacy-policy-2/)
```
Elimina el parámetro `?swcfpc=1` que el plugin de caché añade a todos los enlaces
del sitio viejo: al generar los 301, normaliza las URLs quitándolo.

Textos de interfaz existentes que hay que conservar (son de la marca):
- Barra superior: "Your Event and Party Station"
- Hero: "Event and Party Radio Station" / "Milano Beat Radio" / "MBR"
- CTA reproductor: "Ascolta" · botón "Play"
- Hero secundario: "ASCOLTACI ANCHE SENZA APP - PRESS PLAY"
- Bloque comercios: "ANCHE IN NEGOZIO!" / "NELLA TUA ATTIVITA' COMMERCIALE"
- Secciones home, en este orden: "IN CITTA'" → "FLASH NEWS" → "CITY EVENTS"
  → "PARTNERS"
- Widget on-air: "Ora in onda"
- Página promuoviti: H1 "RACCONTACI IL TUO EVENTO", H2 "IL TUO EVENTO",
  subtítulo "Promuovi gratuitamente la tua iniziativa, evento o progetto sul
  territorio"
- Página contatti: H1 "CONTACT US", H3 "CONTACTS",
  H2 "SERIOUSLY, WE WANT TO HEAR ABOUT YOU"
- Chi siamo: "I NOSTRI PARTNER" y "ASCOLTACI DALLA NOSTRA APP - SCARICALA"
El resto del copy (cuerpos de artículo, bios, descripciones) NO lo inventes:
sale del XML en la fase 2. Donde falte, deja un TODO visible, nunca lorem ipsum.

Formularios: los dos actuales usan los mismos campos (Contact Form 7):
nome, email, oggetto, messaggio. Reimplementa con Server Actions + Zod +
honeypot + rate limit + Resend. Sin reCAPTCHA.

Redes sociales reales: instagram.com/milanobeatradio_mbr ·
facebook.com/milanobeatradio

---

# DISEÑO
Fondo negro. Acento magenta #E6007E. Tipografía Poppins self-hosted en woff2.
Headings en MAYÚSCULAS con tracking amplio. Cards con overlay en gradiente,
etiqueta de categoría con borde magenta arriba, título abajo.
Mobile-first: la mayoría del tráfico de una radio de eventos es móvil.
Reproductor fijo abajo, siempre visible.
PROHIBIDO copiar código, CSS o assets del tema Pro.Radio (licencia comercial de
QantumThemes). El diseño se reconstruye desde cero.

# PRESUPUESTO DE RENDIMIENTO (el sitio viejo era un desastre: úsalo de contraste)
Antes: 250 peticiones, 24,9 MB, TTFB 2,0 s, load 4,6 s. Ocho PNG de hero entre
1,7 y 2,8 MB cada uno. Objetivo nuevo: < 500 KB por página, LCP < 1,5 s,
< 60 peticiones. next/image siempre con `sizes` explícito, AVIF + WebP.
Nunca `<img>` a pelo. Sin librerías de animación pesadas: CSS y View Transitions.

---

# FASE 0 — checklist

1. [x] `CLAUDE.md` + `TASKS-HUMANAS.md` → mostrar y PARAR la primera vez.
2. [x] Scaffold Next.js 15 + TS strict + Tailwind v4.
       Estructura: `app/(site)` público, `app/(payload)` admin.
3. [x] Payload 3 con adaptador Postgres → Supabase pooler. Que arranque en local y
       que las migraciones corran.
4. [x] `@payloadcms/storage-s3` → R2. Colección `media` con tamaños generados:
       thumb 400, card 800, hero 1920, salida WebP, servido desde R2_PUBLIC_URL.
5. [x] TODAS las colecciones del modelo de datos, con slugs únicos, un grupo `seo`
       reutilizable (title / description / ogImage), drafts y versiones activados,
       admin en italiano.
6. [x] Reproductor persistente completo: PlayerProvider, hook useNowPlaying
       (poll 15 s, pausado si `document.hidden`, Zod), barra inferior con play/pause,
       volumen, título en marquesina, contador de oyentes, badge LIVE cuando
       `live.is_live`, y Media Session API para los controles del sistema en móvil.
7. [x] Tres rutas placeholder SIN diseño (`/`, `/eventi`, `/flash-news`) que
       demuestren que el audio sobrevive a la navegación.
8. [x] Script `pnpm seed:demo`: 2 registros de cada colección.
9. [x] README con el arranque local, los flags del driver de Postgres y por qué.

NO hacer en fase 0: diseño de páginas, import del XML, subida de la mediateca,
contadores de vistas, Control Room, SEO avanzado, formularios.

# CÓMO TRABAJAR
- Commits pequeños y descriptivos, uno por punto de la lista.
- Si una decisión no está en este documento, preguntar. No improvisar.
- Si algo del modelo de datos no cuadra con lo que se encuentre en el XML más
  adelante, anotarlo en `MIGRATION-NOTES.md` en vez de "arreglarlo".
- Al terminar cada fase: explicar cómo verificar a mano cada punto, qué variables
  hay que rellenar, y actualizar la sección ESTADO ACTUAL de este archivo.

# DECISIONES TOMADAS EN FASE 0 (no rediscutir salvo que el cliente lo pida)
- **Next 16.3.4** (cliente decidió saltar de 15.4 a 16 el 2026-09-07). Payload 3.88 soporta 15.4.x o 16.2+; 15.5 NO.
  Next 16: `next lint` ya no existe (`lint` = `eslint .`, config plana), Turbopack por defecto, `middleware` se llama `proxy`.
- `"type": "module"` en package.json: obligatorio para que Payload cargue el config como ESM.
- Taxonomías (categories, eventTypes, podcastFilters, genres) SIN drafts/versiones: son tablas de lookup.
  Todo lo demás (posts, events, podcasts, shows, staff, partners) con drafts + autosave + versiones.
- `partners` usa `orderable: true` de Payload (drag-sort nativo, campo `_order`) en vez de un `order` manual.
- `shows.slots[].dayOfWeek` guarda '0'..'6' con la convención JS (0 = Domenica). Horas `HH:mm` locales Europe/Rome.
- `events.startDate/endDate` con `timezone: true` (campo `_tz` companion) y Europe/Rome añadido a la lista de Payload.
- `podcasts.audioUrl` es un texto URL como pide el brief; no hay upload de mp3 desde el admin (pregunta abierta).
- Dev local: drizzle push sobre `mbr_dev`. Migraciones en `src/migrations/`, verificadas sobre una base vacía.
- `seed:demo` corre con `tsx` (con `payload run` el script se cerraba en silencio).
- El indicador de dev de Next se movió arriba a la derecha: tapaba el botón Play en móvil.
- Los tests e2e de fase 0 están en el scratchpad, no en el repo (se formalizarán en fase 1 si se quiere).

# AVISOS PARA FASES POSTERIORES (no perder)
- **Fase 2, XML:** los campos custom de Pro.Radio (fechas de evento, venue, lat/lng,
  slots de shows, socials de staff, url de sponsor) SOLO existen en `<wp:postmeta>`
  del `migration/export.xml`. Por REST API vuelven vacíos (verificado). NO intentar
  leerlos por REST.
- **Fase 5, redirects:** los 122 posts viven en la raíz del sitio viejo. Los slugs
  se sacan de `https://milanobeatradio.it/post-sitemap.xml` con un script, no a mano.
  Normalizar quitando `?swcfpc=1`. Páginas demo del tema → 410, no 301.
- **Fase 3, R2:** `/wp-content/uploads` pesa 2,28 GB. Subir solo lo referenciado
  desde el XML (filtrado de huérfanos); ahí está el ahorro de factura.
- Ficheros locales que NO van a git: `migration/export.xml`, `migration/uploads/`,
  `secrets.local.md`, `.env*`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
