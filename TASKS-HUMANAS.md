# TASKS-HUMANAS.md — lo que necesito de ti y no puedo hacer yo

Marca cada línea cuando esté hecha. Lo que sea secreto va a `secrets.local.md`
o a `.env.local` (ambos ignorados por git), nunca a este archivo.

## BLOQUEANTE PARA FASE 0 (pasos 3 y 4 no arrancan sin esto)

- [ ] **Supabase.** Crear proyecto (región Frankfurt). Copiar de
      Project Settings → Database → Connection string → **Transaction pooler**
      (puerto **6543**, no el directo 5432). Pegarla en `.env.local` como `DATABASE_URI`.
      Hasta que no la tenga, Payload no arranca y las migraciones no corren.
- [ ] **Cloudflare R2.** Bucket `mbr-media`, dominio público
      `media.milanobeatradio.it`, API Token con Object Read & Write limitado al bucket.
      Necesito en `.env.local`: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`.
      Sin esto el paso 4 (colección media) solo se puede probar con almacenamiento local.
- [ ] **Git.** ¿Hago yo `git init` en esta carpeta y creo el primer commit, o ya tienes
      un repo remoto (GitHub) que quieras que use? Dime la URL si existe.
      Los commits los haré uno por punto de la lista, como pediste.

## NECESARIO PARA FASE 0 PERO NO BLOQUEANTE

- [ ] **Poppins en woff2.** Déjalos en `public/fonts/` (mínimo Regular 400,
      SemiBold 600, Bold 700; Light 300 si lo usáis). Hasta entonces uso la
      fuente del sistema como fallback y no descargo nada de Google Fonts.
- [ ] **Logo** en SVG (ideal) o PNG a máxima resolución → `public/brand/`.
      Lo necesito para el reproductor (Media Session muestra artwork) y el favicon.

## NECESARIO PARA FASES POSTERIORES (puedes ir preparándolo)

- [ ] **Export de WordPress** → `./migration/export.xml`
      (Strumenti → Esporta → Tutto il contenuto). Fase 2.
- [ ] **`/wp-content/uploads` completo** → `./migration/uploads/` (2,28 GB). Fase 3.
- [ ] **Vercel Pro** conectado al repo. Fase 1 en adelante (primer deploy).
- [ ] **Resend.** API key + dominio `milanobeatradio.it` verificado para enviar
      desde `noreply@milanobeatradio.it`. Fase 4 (formularios).
- [ ] **Email destino de los formularios** (`CONTACT_TO_EMAIL`). Contact Form 7
      no lo revela; solo tú lo sabes. ¿Es el mismo para /contatti y /promuoviti,
      o dos distintos?
- [ ] **Enlace real de la app móvil** (App Store / Google Play), si existe.
      La home y "Chi siamo" la anuncian ("ASCOLTACI DALLA NOSTRA APP - SCARICALA").
      Si no hay app publicada, dímelo y quitamos ese bloque en vez de enlazar a nada.

## DATOS DE CONTENIDO QUE NO ESTÁN EN LA WEB (los dejo vacíos con TODO)

- [ ] **Roles del staff.** No aparecen en el sitio actual. Necesito uno por persona:
      | Persona | Slug | Role |
      |---|---|---|
      | Criss Dell'Orto | `criss` | |
      | Luca | `luca` | |
      | Emilio | `emilio` | |
      | Tati | `tati` | |
      | Selene Amelio | `selene-amelio` | |
      | Il vostro Mike di fiduccia | `il-vostro-mike-di-fiducia` | |
      Nota: el nombre lleva "fiduccia" (doble c) en la web y el slug "fiducia".
      ¿Mantengo el nombre tal cual o corrijo a "fiducia"?
- [ ] **Partner "Coming Soon".** Es un placeholder en el sitio viejo. ¿Lo migro
      como partner inactivo (`active: false`) o lo descarto?
- [ ] **Slots del palinsesto para martes → domingo.** Solo tengo verificado el lunes.
      Los sacaré del XML en fase 2; si el XML no los trae, te pediré la parrilla completa.

## DECISIONES QUE NECESITO CONFIRMAR ANTES DEL PASO 5

- [ ] **Zona horaria de los slots de shows.** Asumo que "06:00-07:00" es hora de
      Milán (Europe/Rome) y que el palinsesto sigue el cambio de hora local.
      Confírmalo; guardaré los slots como `HH:mm` locales, no en UTC.
- [ ] **Usuario admin de Payload.** Al arrancar por primera vez Payload pide crear
      el primer usuario. Lo creo yo con `admin@milanobeatradio.it` y una contraseña
      temporal que te paso por `secrets.local.md`, o me das tú el email que prefieras.
