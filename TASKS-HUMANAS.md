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

## BLOQUEANTE AHORA MISMO (3 cosas pequeñas)

- [ ] **Contraseña de la base de datos de Supabase.** Tengo el proyecto (`<SUPABASE-REF>`),
      la región (eu-west-1) y la cadena del pooler montada en `.env.local`, pero la contraseña de
      Postgres no está entre las claves que me pasaste (anon/service_role son de la API, no de la DB).
      Supabase → Project Settings → Database → "Reset database password" → pégala en `.env.local`
      sustituyendo `[DB-PASSWORD]`. Hasta entonces el proyecto corre contra el Postgres local.
- [x] **Token de R2 con escritura**: confirmado, tiene permiso completo (probado con subida real).
- [ ] **Dominio público del bucket** `media.milanobeatradio.it`. Activaste la "Public Development URL"
      (`pub-df0e74f6b3f940c5a570551308d6944f.r2.dev`), que ya uso y funciona, pero Cloudflare avisa
      de que tiene límite de peticiones y no la recomienda para producción. Para el dominio propio:
      Cloudflare → R2 → `mbr-media` → Settings → Public access → Custom domain → escribe
      `media.milanobeatradio.it`. Cuando lo actives, solo tengo que cambiar una variable de entorno.
- [ ] **Repo remoto.** He hecho `git init` local. Dime la URL de GitHub cuando exista y hago el push.

## NECESARIO PARA FASES POSTERIORES (puedes ir preparándolo)

- [ ] **Vercel Pro** conectado al repo. Fase 1 en adelante (primer deploy).
- [ ] **Resend: verificar el dominio.** API key recibida. Falta añadir en Resend el dominio
      `milanobeatradio.it` (registros DNS en Cloudflare) para poder enviar desde `noreply@`.
      Lo necesita ya el "Password dimenticata?" del admin, no solo los formularios.
- [x] **Email destino de los formularios**: `info@milanobeatradio.it` (ambos formularios).
- [ ] **Enlace real de la app móvil** (App Store / Google Play), si existe.
      La home y "Chi siamo" la anuncian ("ASCOLTACI DALLA NOSTRA APP - SCARICALA").
      Si no hay app publicada, dímelo y quitamos ese bloque en vez de enlazar a nada.

## DECISIONES QUE NECESITO DE TI

- [x] **Color de marca**: morado #C824E3 + negro (decidido 2026-09-07).
- [x] **Versión de Next.** Decidido: Next 16.3.4 (hecho el 2026-09-07).
- [x] **Borradores del XML.** Decidido: se ignoran por completo, en todos los CPT. Solo `publish`.
- [ ] **Slug del show "Back2 the Classic"**: en el origen es `detroit-sessions` (herencia
      de la demo). ¿Lo dejo así o creo `back2-the-classic` + 301?
- [x] **Nombre "fiduccia"**: se corrige a "fiducia".
- [x] **Usuarios del admin**: migrados de wp-admin/users.php (5 reales; Igor y proradio son del
      proveedor del tema y se excluyen). Contraseñas temporales en `secrets.local.md`.
- [ ] **Roles del STAFF (otra cosa distinta de los usuarios).** Los usuarios son quien entra al panel.
      El staff es la página pública /staff con Criss, Luca, Emilio, Tati, Selene y Mike: solo dos
      de ellos son usuarios. Sigue faltando qué poner debajo de cada nombre (ej. "Speaker",
      "Direttore artistico", "DJ"). Si no lo tienes, lo dejo vacío y la ficha no muestra rol.
- [x] **Audio de los podcast**: URL pegada a mano + opción de subir el archivo (decidido 2026-09-07).
- [x] **Zona horaria del palinsesto**: hora de Milán (confirmado 2026-09-07).
- [x] **Usuario admin de Payload (local).** Creado por el seed: `admin@milanobeatradio.it`,
      contraseña en `secrets.local.md`. En producción se creará uno nuevo con el email que me digas.
