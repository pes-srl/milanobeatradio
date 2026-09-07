# TASKS-HUMANAS.md — lo que necesito de ti y no puedo hacer yo

Marca cada línea cuando esté hecha. Lo que sea secreto va a `secrets.local.md`
o a `.env.local` (ambos ignorados por git), nunca a este archivo.

## YA RESUELTO POR CLAUDE (no hace falta que lo hagas)
- [x] Export de WordPress → `migration/export.xml` (18 MB, 2026-09-06). Script en
      `migration/scripts/wp-export.mjs`, reutilizable.
- [x] Uploads: NO hace falta bajar los 2,28 GB por FTP. En fase 3 descargo por HTTP solo
      los ficheros referenciados por los registros que se migran (ver MIGRATION-NOTES.md).
- [x] Logo: encontrado en uploads (`MBR-LOGO-JPG.jpg.png`, 2109×2084 con alfa) y variante
      circular. Copias en `migration/downloads/logo-candidates/`.
- [x] Poppins: fuente libre (OFL), la sirvo self-hosted desde el paquete `@fontsource/poppins`.
- [x] Partner "Coming Soon": es un partner real (comingsoon.it). Se migra activo.

## BLOQUEANTE PARA FASE 0 (pasos 3 y 4 no se pueden verificar del todo sin esto)

- [ ] **Supabase.** Crear proyecto (región Frankfurt). Copiar de
      Project Settings → Database → Connection string → **Transaction pooler**
      (puerto **6543**, no el directo 5432). Pegarla en `.env.local` como `DATABASE_URI`.
      Mientras tanto uso un Postgres local de desarrollo (mismo adaptador, misma config)
      para que las migraciones corran. Cuando me des la URI, las ejecuto contra Supabase.
- [ ] **Cloudflare R2.** Bucket `mbr-media`, dominio público
      `media.milanobeatradio.it`, API Token con Object Read & Write limitado al bucket.
      Necesito en `.env.local`: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`.
      Sin esto la colección media se prueba con disco local; el código de R2 queda listo.
- [ ] **Repo remoto.** He hecho `git init` local. Dime la URL de GitHub cuando exista y
      hago el push.

## NECESARIO PARA FASES POSTERIORES (puedes ir preparándolo)

- [ ] **Vercel Pro** conectado al repo. Fase 1 en adelante (primer deploy).
- [ ] **Resend.** API key + dominio `milanobeatradio.it` verificado para enviar
      desde `noreply@milanobeatradio.it`. Fase 4 (formularios).
- [ ] **Email destino de los formularios** (`CONTACT_TO_EMAIL`). Contact Form 7
      no lo revela; solo tú lo sabes. ¿Es el mismo para /contatti y /promuoviti,
      o dos distintos?
- [ ] **Enlace real de la app móvil** (App Store / Google Play), si existe.
      La home y "Chi siamo" la anuncian ("ASCOLTACI DALLA NOSTRA APP - SCARICALA").
      Si no hay app publicada, dímelo y quitamos ese bloque en vez de enlazar a nada.

## DECISIONES QUE NECESITO DE TI

- [ ] **Color de marca.** El brief dice acento magenta #E6007E, pero el logo oficial es
      VERDE (#3DAE49 aprox.) y negro, y no hay magenta en ningún asset. ¿Magenta es una
      decisión nueva de rebranding o hay que usar el verde del logo? Hoy no afecta
      (fase 0 no tiene diseño), pero lo necesito antes de fase 1.
- [x] **Versión de Next.** Decidido: Next 16.3.4 (hecho el 2026-09-07).
- [x] **Borradores del XML.** Decidido: se ignoran por completo, en todos los CPT. Solo `publish`.
- [ ] **Slug del show "Back2 the Classic"**: en el origen es `detroit-sessions` (herencia
      de la demo). ¿Lo dejo así o creo `back2-the-classic` + 301?
- [ ] **Roles del staff.** No aparecen en el sitio actual. Necesito uno por persona:
      | Persona | Slug | Role |
      |---|---|---|
      | Criss Dell'Orto | `criss` | |
      | Luca | `luca` | |
      | Emilio | `emilio` | |
      | Tati | `tati` | |
      | Selene Amelio | `selene-amelio` | |
      | Il vostro Mike di fiduccia | `il-vostro-mike-di-fiducia` | |
      Nota: el nombre lleva "fiduccia" (doble c) y el slug "fiducia".
      ¿Mantengo el nombre tal cual o corrijo a "fiducia"?
- [ ] **Audio de los podcast.** El brief pide `audioUrl` (texto). Así está hecho, pero desde el admin
      no se puede subir un MP3: hay que pegar la URL de R2. ¿Lo dejamos así (fase 3 rellena las URLs)
      o prefieres un campo de subida de archivo que lo mande a R2 solo?
- [ ] **Zona horaria de los slots de shows.** Asumo que "06:00-07:00" es hora de
      Milán (Europe/Rome). Guardo los slots como `HH:mm` locales, no en UTC. Confírmalo.
- [x] **Usuario admin de Payload (local).** Creado por el seed: `admin@milanobeatradio.it`,
      contraseña en `secrets.local.md`. En producción se creará uno nuevo con el email que me digas.
