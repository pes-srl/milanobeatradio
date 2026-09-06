# MIGRATION-NOTES.md — discrepancias entre el brief y el XML real

Export generado el 2026-09-06 por WordPress (`migration/export.xml`, 18 MB, 2.986 items).
Aquí se anota lo que NO cuadra con CLAUDE.md. No se "arregla" por cuenta propia:
se decide con el cliente en fase 2.

## Volúmenes reales (export.xml) vs. brief

| CPT | Brief | XML publish | XML draft/pending | Nota |
|---|---|---|---|---|
| post | 122 | 122 | 392 draft | Los 392 borradores NO están en el brief. ¿Migrar como draft o descartar? |
| event | 5 | 5 | 1 draft | |
| podcast | 14 | 14 | 0 | |
| shows | 6 | 6 | 0 | |
| members | 6 | 6 | 11 draft + 3 pending | Solo los 6 publicados coinciden con el brief. |
| qtsponsor | 11 | 11 | 1 draft | |
| chart | 0 | 0 | 9 pending | El brief decía 0; hay 9 pendientes. Sigue sin migrarse. |
| radiochannel | 3 | 3 | 0 | No se migra (AzuraCast). |
| schedule | (no mencionado) | 7 | 0 | **Es el palinsesto**: un registro por día (lunedi…domenica) con `week_day` serializado. Los slots están en `track_repeatable` (PHP serializado). Ver abajo. |
| qtvideo | (no mencionado) | 12 | 0 | Vídeos del tema. ¿Descartar? |
| attachment | — | 2.154 | — | 1.348 jpg · 595 png · 91 jpeg · 61 **mp3** · 49 webp · 4 pdf · resto residual. |
| page | ~35 demo | 51 | 3 draft | Separar reales (chi siamo, promuoviti, contatti, privacy) de demo (410). |
| elementor_library | — | 109 | 1 | Plantillas del tema. No se migran. |

## Campos Pro.Radio confirmados en `<wp:postmeta>` (NO por REST)

**event** (`house-night-amnesia-milano-14-febbraio-2026`):
`proradio_date` `2026-02-14` · `proradio_date_end` `2026-02-15` · `proradio_time` `23:00` ·
`proradio_time_end` `05:00` · `proradio_location` · `proradio_address` · `proradio_city` ·
`proradio_link` · `proradio_artists` (texto "A - B - C") · `_thumbnail_id`.
Ojo: en el meta las fechas ya vienen ISO `YYYY-MM-DD`, no `DD/MM/YYYY` como en el HTML.
No hay lat/lng en el meta (`qt_places_associated_place` vacío): geocodificar en fase 2 o dejar vacío.

**shows** (`Back2 the Classic`):
- El **slug real es `detroit-sessions`**, heredado de la demo del tema. El brief asume slugs
  derivados del título. Decidir: ¿nuevo slug limpio + 301 desde `/shows/detroit-sessions/`?
- `subtitle` = "I Classici della nostra vita" (campo útil, no estaba en el brief).
- `show_members_pick` vacío: no hay relación show → host en el origen.
- Imágenes de cabecera apuntan a `qantumthemes.xyz` (demo): ignorar.
- Sin slots en el show: los slots viven en el CPT `schedule`.

**schedule**: 7 registros, `week_day` = `a:1:{i:0;s:3:"mon";}`. Los slots (`track_repeatable`)
están en PHP serializado y hay que parsearlos en fase 2 (no usar `unserialize` de PHP:
usar un parser JS/py). Verificar contra los datos del lunes del brief.

**qtsponsor**: campo `linkurl`. URLs presentes: Coming Soon → comingsoon.it (es un partner
REAL, no un placeholder) · Phonogram · PES · 3B Meteo · Luce Verde. SCF, Baianita,
FM World Talkmedia, SIAE, Wimpy, Milano Hub Factrory: sin URL.

**members**: 6 publicados con los slugs exactos del brief (`criss`, `luca`, `emilio`, `tati`,
`selene-amelio`, `il-vostro-mike-di-fiducia`).

## Assets encontrados en uploads
- Logo oficial: `2020/06/MBR-LOGO-JPG.jpg.png` (2109×2084, PNG con alfa). Variante circular
  sin texto: `2021/04/Logo-solo-cerchio-no-sfondo-bianco-600-600.png`.
  **El logo es VERDE (#3DAE49 aprox.) y negro. No hay magenta en la marca.** Ver TASKS-HUMANAS.
- Poppins NO está en uploads (el tema la cargaba de Google Fonts). Es OFL: se sirve self-hosted
  desde `@fontsource/poppins` copiando los woff2 a `public/fonts/`.
- Única fuente subida: `bauhs93-webfont.woff2` (Bauhaus 93, comercial). No usar.
- Los 61 mp3 son los audios de podcasts: irán a R2 en fase 3.

## Uploads sin FTP
No hay acceso FTP/SSH. Estrategia para fase 3: descargar por HTTP solo las URLs de attachment
referenciadas por los registros que se migran (filtrado de huérfanos desde el XML), y subir a R2.
Los 2,28 GB completos no se necesitan.
