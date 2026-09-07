# Milano Beat Radio — sito + CMS

Next.js 16 (App Router) + Payload CMS 3 embedded, Postgres (Supabase), media on Cloudflare R2, deploy on Vercel.
Project memory and rules live in [CLAUDE.md](./CLAUDE.md). Open questions for the client: [TASKS-HUMANAS.md](./TASKS-HUMANAS.md).

## Local setup

Requirements: Node 22, pnpm 10, a Postgres 17 reachable from `DATABASE_URI`.

```bash
pnpm install
cp .env.example .env.local        # fill DATABASE_URI and PAYLOAD_SECRET (openssl rand -hex 32)
pnpm seed:demo                    # creates the schema (dev push) + 2 demo records per collection + admin user
pnpm dev                          # http://localhost:3000  ·  admin: http://localhost:3000/admin
```

Local Postgres without Supabase (macOS, Homebrew):

```bash
brew install postgresql@17
/opt/homebrew/opt/postgresql@17/bin/pg_ctl -D /opt/homebrew/var/postgresql@17 -l /opt/homebrew/var/log/postgresql@17.log start
/opt/homebrew/opt/postgresql@17/bin/createdb mbr_dev
# DATABASE_URI=postgres://<your-os-user>@localhost:5432/mbr_dev
```

Demo admin user created by the seed: `admin@milanobeatradio.it` (password in `secrets.local.md`, not in git).

## Scripts

| Script | What it does |
|---|---|
| `pnpm dev` | Next dev server (Turbopack). In development Payload syncs the schema with drizzle **push** (no migration files needed). |
| `pnpm build` | Production build. |
| `pnpm typecheck` | `tsc --noEmit` (strict). |
| `pnpm lint` | `eslint .` with Next 16 flat config (`next lint` no longer exists). |
| `pnpm generate:types` | Regenerates `src/payload-types.ts` after changing a collection. |
| `pnpm generate:importmap` | Regenerates `app/(payload)/admin/importMap.js` after adding admin components. |
| `pnpm migrate:create <name>` | Writes a migration to `src/migrations/` from the current schema diff. |
| `pnpm migrate` | Applies pending migrations (used in production / Vercel). |
| `pnpm seed:demo` | Idempotent demo data (2 records per collection). Marked `[DEMO]`, never real content. |

## Structure

```
app/(site)/          public site. layout.tsx owns <PlayerProvider> + <audio>: never unmounts.
app/(payload)/       Payload admin (/admin) and REST/GraphQL API (/api/*). Generated files.
payload.config.ts    Payload config: db, storage, i18n, collections.
src/collections/     one file per collection (posts, events, podcasts, shows, staff, partners, media, taxonomies, users)
src/fields/          reusable fields: slug (unique, auto), seo group (title/description/ogImage)
src/player/          PlayerProvider, PlayerBar, useNowPlaying (AzuraCast polling)
src/lib/azuracast.ts stream + now-playing URLs, Zod schema, safe fetch
scripts/             seed-demo.ts
migration/           WordPress export (git-ignored data) + export script. Phase 2/3.
```

## Postgres driver flags (Supabase transaction pooler) — read this

`DATABASE_URI` must be the **Transaction pooler** string from Supabase (Supavisor, port **6543**), never the
direct `5432` connection: Vercel functions open many short-lived connections and the direct port runs out of
slots. Transaction mode has restrictions and the adapter is configured for them in `payload.config.ts`:

| Setting | Value | Why |
|---|---|---|
| driver | `pg` (node-postgres, via `@payloadcms/db-postgres`) | `pg` only creates **named prepared statements** when a query is given a `name`, which neither Payload nor Drizzle does. So no `prepare: false` flag is needed (that flag exists for the `postgres.js` driver, which Payload does not use). Transaction-mode poolers reject named prepared statements, session variables (`SET`) and `LISTEN`; none of them are used. |
| `pool.max` | 5 in production, 10 in dev | Each Vercel function instance keeps its own pool. Small pools per instance, the pooler multiplexes them onto real connections. |
| `pool.idleTimeoutMillis` | 20 000 | Release idle sockets quickly so frozen/recycled functions don't hold pooler slots. |
| `pool.connectionTimeoutMillis` | 10 000 | Fail fast instead of hanging a request when the pooler is saturated. |
| `pool.ssl` | `{ rejectUnauthorized: false }` unless the host is localhost | Supavisor requires TLS and its certificate chain is not in Node's default CA bundle. To verify strictly, download Supabase's CA and pass `ssl: { ca }` instead. |
| `push` | `true` in dev only (`PAYLOAD_DB_PUSH=false` disables it) | Dev: schema auto-sync. Prod: schema changes ONLY through migration files, applied with `pnpm migrate`. Never run push against the production database. |
| `migrationDir` | `src/migrations` | Committed migrations. |

Workflow for schema changes: edit the collection → `pnpm dev` (push updates your local DB) → when done,
`pnpm migrate:create <name>` → commit the migration → on deploy, run `pnpm migrate` before `next build`
(set the Vercel build command to `pnpm migrate && pnpm build` once Supabase is connected).

Do not mix push and migrations on the same database: use push on a throwaway local DB, and apply the
migrations to a fresh DB (or to Supabase) to verify them.

## Media: R2 + image sizes

`@payloadcms/storage-s3` with R2's S3 endpoint (`https://<ACCOUNT_ID>.r2.cloudflarestorage.com`, region `auto`,
path-style). The plugin is enabled only when `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY`
are set; otherwise files go to `./media` (git-ignored) so local dev works without credentials.
Files are served from `R2_PUBLIC_URL` (`https://media.milanobeatradio.it`) directly, never through Next.

Every image upload is re-encoded to **WebP**; sizes generated: `thumb` 400 px, `card` 800 px, `hero` 1920 px
(never enlarged). Audio (`mp3/m4a/aac`) and PDF are stored untouched.

## Radio player

- Single `<audio>` in `app/(site)/layout.tsx` inside `<PlayerProvider>`. Pages render inside it; client
  navigation keeps it mounted and playing.
- Stream: `NEXT_PUBLIC_AZURACAST_BASE/listen/<station>/stream`. Play always re-attaches a fresh URL (join the live edge);
  Pause drops the source (no background buffering).
- Now playing: polled every 15 s, paused while `document.hidden`, validated with Zod; failures keep the last good
  value and never surface an error to the listener.
- Stream errors: 3 retries with backoff, then "Stream non disponibile · riprova".
- Media Session API: title/artist/artwork and play/pause/stop handlers for lock-screen and headset controls.

## Manual checks for phase 0

1. `pnpm dev`, open `/admin`, log in: the UI is in Italian and lists Flash News, Eventi, Podcast, Programmi, Staff, Partner, Media and the taxonomies. Editing a document shows autosave and version history.
2. Open `/`, press Play in the bottom bar, then click Eventi and Flash News in the nav: the audio keeps playing and the "renderizzata alle" timestamp changes on every page.
3. Upload an image in Media: it is stored as `.webp` with `-400x…`, `-800x…`, `-1920x…` variants (in `./media` locally, on R2 when configured).
4. Hide the tab for a minute and come back: the now-playing title refreshes immediately.
5. `pnpm migrate` against an empty database creates the whole schema from `src/migrations`.
