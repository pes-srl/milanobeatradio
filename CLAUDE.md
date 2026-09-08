# Milano Beat Radio — migración WordPress → Next.js + Payload

> Este archivo es la memoria persistente del proyecto entre sesiones.
> Léelo entero antes de tocar nada. Si una decisión no está aquí, PREGUNTA, no improvises.

## ESTADO ACTUAL — actualizado 2026-09-07

### Qué está HECHO y verificado
- **Fase 0** — scaffold Next 16.3.4 + Payload 3.88 + Postgres + R2, 12 colecciones, Site global,
  reproductor persistente, migraciones, seed demo, README.
- **Fase 1** — diseño completo de todas las páginas, reconstruido a partir de capturas del sitio
  real (`migration/reference/`, no versionado). Color de marca morado #C824E3.
- **Fase 2** — import real del XML: 122 Flash News · 5 eventi · 14 podcast · 6 show con
  palinsesto real · 6 staff · 11 partner · 1 pagina (privacy). Solo `publish`, borradores ignorados.
- **Fase 3** — mediateca completa en R2: 407 documentos de imagen + los 14 MP3 de los podcast
  (217 MB) movidos del WordPress viejo. Ya nada del sitio depende del servidor antiguo.
- **Fase 4 (parcial)** — formularios contatti/promuoviti (Server Actions + Zod + honeypot +
  rate limit + Resend), sitemap.xml (164 URLs) y robots.txt.
- **Fase 5 — redirecciones.** `proxy.ts` sirve 149 redirects 308 y 37 páginas con 410, más el
  borrado del parámetro `?swcfpc=1`. El mapa (`src/redirects.generated.json`) lo genera
  `pnpm generate:redirects` desde `legacyPath` de la base de datos, nunca a mano: hay que
  regenerarlo y commitearlo tras cualquier import o cambio de slug.
  Verificado una por una: 149/149 redirecciones y 37/37 páginas 410, sin bucles.
- Usuarios reales del WordPress migrados con roles admin/editor.
- **Contadores de interacción migrados Y EN VIVO**: vistas, me gusta y compartidos de
  Pro.Radio (`proradio_reaktions_*`) en posts, eventi, podcast, show y staff. Punto de
  partida real: 32.616 vistas · 1.376 like · 132 share en los 122 posts. Ahora se
  incrementan de verdad (ver más abajo).
- Verificado con Playwright: audio nunca se corta al navegar, cero errores de hidratación,
  build de producción + lint + typecheck en verde.

### Qué FALTA (por orden de importancia)
1. **Desplegar en Vercel.** El repo ya existe: github.com/mirkodgzconsulting/milanobeatradio (privado).
   Falta importarlo en Vercel (plan Pro: hay sponsors, es uso comercial), pegar las variables de
   VERCEL-ENV.md y poner como build command `pnpm migrate && pnpm build`.
2. **Dominio propio de R2** (`media.milanobeatradio.it`). Ahora se usa la Public Development URL,
   que Cloudflare no recomienda para producción. Al cambiarlo: una variable de entorno + añadir el
   hostname en `next.config.ts`. No hay que volver a migrar nada.
3. **Verificar el dominio en Resend** para que los formularios y el "password dimenticata" del
   admin envíen de verdad.
4. **Repo remoto + Vercel Pro.** `git init` local hecho, faltan la URL de GitHub y el proyecto en Vercel.
5. **Datos que solo tiene el cliente**: roles del staff para la página pública, enlaces reales de la
   app en las stores, y decidir el slug del show `detroit-sessions`.
6. **Del brief original, nunca priorizado**: contadores de visitas y "Control Room". No están hechos
   ni planificados; decidir si entran en el alcance.

### Notas de estado que conviene recordar
- Los eventos importados tienen fechas anteriores a hoy (sept. 2026), por eso la home muestra pocos
  en "City Events": el filtro de próximos funciona bien, faltan eventos futuros reales.
- `podcasts.audioUrl` conserva la URL vieja como referencia histórica; el sitio reproduce `audioFile`.

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
RESEND_API_KEY / RESEND_FROM_EMAIL / CONTACT_TO_EMAIL
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
audioUrl (URL pegada, opción principal) + audioFile (upload a media/R2, alternativa; al menos uno),
duration, publishedAt, filters (rel). DECISIÓN CLIENTE 2026-09-07.
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
Los 7 días de la semana existen (Lunedì → Domenica). Horas = hora de Milán (confirmado 2026-09-07).

**staff** — 6 registros: Criss Dell'Orto (slug `criss`) · Luca · Emilio · Tati ·
Selene Amelio · "Il vostro Mike di fiducia" (slug `il-vostro-mike-di-fiducia`).
DECISIÓN CLIENTE 2026-09-07: el nombre se CORRIGE a "fiducia" (el origen tiene "fiduccia").
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
Fondo negro. Color primario de marca **morado #C824E3** (confirmado por el cliente el 2026-09-07;
el brief original decía magenta #E6007E y el logo antiguo es verde: ambos descartados). Tipografía Poppins self-hosted en woff2.
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

- **Usuarios del admin** (`users`): rol `admin` | `editor`. Migrados desde `<wp:author>` del XML con
  `pnpm import:users`: criss y Redazione MBR = admin; Alice Fusari, Selene, Tommaso = editor.
  `Igor` (QantumThemes) y `proradio` (pro.radio) son cuentas del proveedor del tema: NO se migran.
  Contraseñas temporales en secrets.local.md; reset por email vía Resend (`@payloadcms/email-resend`).
  `users.legacyLogin` sirve en fase 2 para atribuir cada post a su autor (`<dc:creator>`).
- **Supabase**: proyecto `kscrbnarievdaaxbbudo`, región eu-west-1 (Irlanda), pooler `aws-1-eu-west-1`.
  Las API keys de Supabase (anon/service_role) NO las usa la app; solo `DATABASE_URI`.
- **R2**: account `595c1f7a9800ae3da29771e7c46a2e9a`, bucket `mbr-media`, jurisdicción EU.

# FASE 1 — decisiones de diseño (no rediscutir salvo que el cliente lo pida)
- El diseño se hizo a partir de capturas reales de milanobeatradio.it (`migration/reference/`,
  no versionado): estructura, jerarquía y proporciones iguales; CSS/assets reconstruidos desde cero
  (licencia del tema Pro.Radio lo prohíbe).
- `/interviste` filtra por el slug real del término WordPress `intervista` (singular), no `interviste`.
- La página `/mbr-events` usa la imagen de cabecera tal cual: el texto ("MBR EVENTS", "Molto più di
  un DJ set") ya está incrustado en el gráfico original. No superponer texto propio encima.
- Hero de la home: slideshow CSS puro, sin librería, con las 13 imágenes reales del origen en el
  orden que usaba Elementor. Mismos tiempos que el Background Slideshow original: 5 s por imagen,
  crossfade de 500 ms, en bucle, overlay negro al 45 %. Sin filtro grayscale: el original no lo
  tiene y varias fotos son en color. Zoom Ken Burns muy leve (scale 1 → 1,04 durante los 5,5 s
  que la slide está a la vista, pedido por el cliente el 2026-09-08); el original no lo tiene.
  Los @keyframes se generan en `HomeHero.tsx` porque los porcentajes dependen del número de
  slides que cargue el editor.
- Fix importante de Next 16: rechaza optimizar imágenes remotas que resuelven a IP privada (SSRF).
  `imageUrl()` en `src/lib/media.ts` convierte cualquier URL absoluta same-origin en relativa.
- Fix importante del importador: una imagen dentro de un párrafo genera un nodo `upload` (bloque
  `<figure>`) anidado en un `<p>`, HTML inválido que rompe la hidratación. `hoistUploadsOutOfParagraphs`
  en `scripts/import-wp.ts` saca esas imágenes fuera del párrafo antes de guardar.
- Formularios: Server Action + Zod + honeypot (`website`) + rate limit en memoria (5/min por IP).
  Sin reCAPTCHA, como pedía el brief. `CONTACT_TO_EMAIL=info@milanobeatradio.it` para ambos.

# ADMIN — tema de marca (decidido 2026-09-08)
- El panel va SIEMPRE en oscuro (`admin.theme: 'dark'`): el morado de marca está pensado para
  fondo negro. Logo de Payload sustituido por el de MBR en login y cabecera
  (`admin.components.graphics.Logo` / `.Icon` → `src/components/admin/`), más favicon propio.
- El tema NO se hace clase por clase: Payload deriva todos los colores de la rampa
  `--color-base-0…1000` y la invierte en modo oscuro, así que `app/(payload)/custom.scss`
  solo reescribe esa rampa (grises con sesgo violeta, hue 280 / sat 9 %), la tipografía
  (`--font-body` = Poppins) y los radios. Un único punto de verdad.
- Todo lo que Payload trae vive en `@layer payload-default, payload`, así que basta con
  escribir reglas sin capa para ganar siempre, sin peleas de especificidad ni `!important`,
  y sin romperse al actualizar.
- OJO al escribir selectores propios: en Payload 3.88 NO existe `.nav__link` (comprobado en
  `styles.css`). Verificar el nombre real de la clase antes de añadir una regla, o queda muerta.
- `custom.scss` se escribe en CSS plano a propósito: `sass` no es dependencia directa del
  proyecto, solo transitiva. Si algún día se usa sintaxis SCSS de verdad, hay que añadirla.
- Poppins se declara con `@font-face` en `custom.scss` porque `app/(payload)/layout.tsx` lo
  genera Payload y no se debe tocar.

# DESPLIEGUE — estado
- Supabase: proyecto `MilanoBeatRadio`, ref `kscrbnarievdaaxbbudo`, región eu-west-1 (Irlanda).
  Host del pooler: `aws-1-eu-west-1.pooler.supabase.com`. La app usa SIEMPRE el 6543
  (transaction pooler); el 5432 solo se usó una vez para cargar el volcado inicial.
- Migración de datos: `pg_dump --data-only` + carga en una sola transacción. OJO: `--disable-triggers`
  NO funciona en Supabase (requiere superusuario). Tras cargar hay que reajustar las secuencias de
  id con `setval`, o el primer alta desde el admin falla por clave duplicada.
- Repo: github.com/mirkodgzconsulting/milanobeatradio (privado). Verificado antes de subir que
  ni `.env*` ni `secrets.local.md` ni ningún secreto está en el historial.

# CONTADORES EN VIVO (vistas / like / share) — decisiones
- El endpoint es `app/(site)/api/stats/route.ts` (POST). Convive sin problema con el comodín
  `/api/[...slug]` de Payload: Next resuelve antes la ruta estática. Verificado.
- **Escribe con SQL directo por `payload.db.pool`, no con `payload.update`.** Es la única
  excepción a la regla de "todo por Local API", y es deliberada: todas las colecciones tienen
  drafts + autosave, así que un `update` por cada visita crearía una fila de versión por
  visita y reventaría la tabla `_*_v`. Además `SET col = col + 1` es atómico; leer-y-escribir
  pierde visitas con tráfico concurrente.
- Los nombres de tabla y columna salen de listas fijas en `src/lib/stats.ts`, nunca del cuerpo
  de la petición: no hay forma de inyectar SQL. Probado con `posts; DROP TABLE posts;--`.
- Defensas: filtro de user-agent de bots, límite de 60 peticiones/minuto por IP, validación Zod,
  y `GREATEST(..., 0)` para que un contador nunca baje de cero.
- Anti-inflado: una vista por documento y por pestaña (sessionStorage), enviada 1,2 s después
  de cargar para no contar rebotes. El like se recuerda en localStorage y es reversible.
- Trampa de React que costó un rato: en modo estricto los efectos corren dos veces. Marcar la
  visita ANTES de programar el envío hacía que la segunda ejecución la diera por hecha y no se
  enviara nunca. La marca va DENTRO del temporizador.
- `useSyncExternalStore` para leer localStorage en el like: leerlo en un efecto rompe la regla
  `react-hooks/set-state-in-effect` y provoca parpadeo tras la hidratación.

# FASE 5 — decisiones de redirecciones (no rediscutir salvo que el cliente lo pida)
- Todas las claves del mapa se guardan SIN barra final: Next normaliza `/foo/` a `/foo` antes de
  que corra `proxy.ts`. Guardarlas con barra provocaba que rutas que no cambian de nombre
  (`/flash-news/`, `/interviste/`, `/programmi/`, `/promuoviti/`, `/mbr-events/`) se redirigieran
  a sí mismas en bucle infinito. Esas simplemente no llevan redirección.
- `/home-07/` era la portada real del WordPress viejo, así que va a `/` con 301, no a 410.
- `/milano-beat-radio-store/` no está en la lista de demos del brief y su contenido es real pero
  sin equivalente: se manda a la home con 301 en vez de matarla. Confirmar con el cliente.
- Los CPT no migrados (`qtvideo`, `radiochannel`, `chart`) se matan por prefijo con 410.

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
