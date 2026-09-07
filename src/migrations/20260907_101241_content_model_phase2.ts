import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"content" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_content" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "site_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "site_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "site_mbr_events_posters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "site" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"claim" varchar DEFAULT 'Your Event and Party Station',
  	"hashtag" varchar DEFAULT '#MBRFRIENDS',
  	"license_text" varchar,
  	"mbr_events_hero_id" integer,
  	"instagram" varchar DEFAULT 'https://instagram.com/milanobeatradio_mbr',
  	"facebook" varchar DEFAULT 'https://facebook.com/milanobeatradio',
  	"app_store_url" varchar,
  	"play_store_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "posts" ADD COLUMN "author_id" integer;
  ALTER TABLE "posts" ADD COLUMN "legacy_path" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_author_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_legacy_path" varchar;
  ALTER TABLE "events" ADD COLUMN "artists" varchar;
  ALTER TABLE "events" ADD COLUMN "city" varchar DEFAULT 'Milano';
  ALTER TABLE "events" ADD COLUMN "legacy_path" varchar;
  ALTER TABLE "_events_v" ADD COLUMN "version_artists" varchar;
  ALTER TABLE "_events_v" ADD COLUMN "version_city" varchar DEFAULT 'Milano';
  ALTER TABLE "_events_v" ADD COLUMN "version_legacy_path" varchar;
  ALTER TABLE "podcasts" ADD COLUMN "legacy_path" varchar;
  ALTER TABLE "_podcasts_v" ADD COLUMN "version_legacy_path" varchar;
  ALTER TABLE "shows" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "shows" ADD COLUMN "legacy_path" varchar;
  ALTER TABLE "shows_rels" ADD COLUMN "genres_id" integer;
  ALTER TABLE "_shows_v" ADD COLUMN "version_subtitle" varchar;
  ALTER TABLE "_shows_v" ADD COLUMN "version_legacy_path" varchar;
  ALTER TABLE "_shows_v_rels" ADD COLUMN "genres_id" integer;
  ALTER TABLE "staff" ADD COLUMN "socials_linkedin" varchar;
  ALTER TABLE "staff" ADD COLUMN "legacy_path" varchar;
  ALTER TABLE "_staff_v" ADD COLUMN "version_socials_linkedin" varchar;
  ALTER TABLE "_staff_v" ADD COLUMN "version_legacy_path" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_hero_slides" ADD CONSTRAINT "site_hero_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_hero_slides" ADD CONSTRAINT "site_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_gallery" ADD CONSTRAINT "site_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_gallery" ADD CONSTRAINT "site_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_mbr_events_posters" ADD CONSTRAINT "site_mbr_events_posters_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_mbr_events_posters" ADD CONSTRAINT "site_mbr_events_posters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site" ADD CONSTRAINT "site_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site" ADD CONSTRAINT "site_mbr_events_hero_id_media_id_fk" FOREIGN KEY ("mbr_events_hero_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_seo_seo_og_image_idx" ON "pages" USING btree ("seo_og_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_seo_version_seo_og_image_idx" ON "_pages_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "site_hero_slides_order_idx" ON "site_hero_slides" USING btree ("_order");
  CREATE INDEX "site_hero_slides_parent_id_idx" ON "site_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "site_hero_slides_image_idx" ON "site_hero_slides" USING btree ("image_id");
  CREATE INDEX "site_gallery_order_idx" ON "site_gallery" USING btree ("_order");
  CREATE INDEX "site_gallery_parent_id_idx" ON "site_gallery" USING btree ("_parent_id");
  CREATE INDEX "site_gallery_image_idx" ON "site_gallery" USING btree ("image_id");
  CREATE INDEX "site_mbr_events_posters_order_idx" ON "site_mbr_events_posters" USING btree ("_order");
  CREATE INDEX "site_mbr_events_posters_parent_id_idx" ON "site_mbr_events_posters" USING btree ("_parent_id");
  CREATE INDEX "site_mbr_events_posters_image_idx" ON "site_mbr_events_posters" USING btree ("image_id");
  CREATE INDEX "site_logo_idx" ON "site" USING btree ("logo_id");
  CREATE INDEX "site_mbr_events_hero_idx" ON "site" USING btree ("mbr_events_hero_id");
  ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shows_rels" ADD CONSTRAINT "shows_rels_genres_fk" FOREIGN KEY ("genres_id") REFERENCES "public"."genres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_shows_v_rels" ADD CONSTRAINT "_shows_v_rels_genres_fk" FOREIGN KEY ("genres_id") REFERENCES "public"."genres"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_author_idx" ON "posts" USING btree ("author_id");
  CREATE INDEX "posts_legacy_path_idx" ON "posts" USING btree ("legacy_path");
  CREATE INDEX "_posts_v_version_version_author_idx" ON "_posts_v" USING btree ("version_author_id");
  CREATE INDEX "_posts_v_version_version_legacy_path_idx" ON "_posts_v" USING btree ("version_legacy_path");
  CREATE INDEX "events_legacy_path_idx" ON "events" USING btree ("legacy_path");
  CREATE INDEX "_events_v_version_version_legacy_path_idx" ON "_events_v" USING btree ("version_legacy_path");
  CREATE INDEX "podcasts_legacy_path_idx" ON "podcasts" USING btree ("legacy_path");
  CREATE INDEX "_podcasts_v_version_version_legacy_path_idx" ON "_podcasts_v" USING btree ("version_legacy_path");
  CREATE INDEX "shows_legacy_path_idx" ON "shows" USING btree ("legacy_path");
  CREATE INDEX "shows_rels_genres_id_idx" ON "shows_rels" USING btree ("genres_id");
  CREATE INDEX "_shows_v_version_version_legacy_path_idx" ON "_shows_v" USING btree ("version_legacy_path");
  CREATE INDEX "_shows_v_rels_genres_id_idx" ON "_shows_v_rels" USING btree ("genres_id");
  CREATE INDEX "staff_legacy_path_idx" ON "staff" USING btree ("legacy_path");
  CREATE INDEX "_staff_v_version_version_legacy_path_idx" ON "_staff_v" USING btree ("version_legacy_path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_hero_slides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_mbr_events_posters" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "site_hero_slides" CASCADE;
  DROP TABLE "site_gallery" CASCADE;
  DROP TABLE "site_mbr_events_posters" CASCADE;
  DROP TABLE "site" CASCADE;
  ALTER TABLE "posts" DROP CONSTRAINT "posts_author_id_users_id_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_author_id_users_id_fk";
  
  ALTER TABLE "shows_rels" DROP CONSTRAINT "shows_rels_genres_fk";
  
  ALTER TABLE "_shows_v_rels" DROP CONSTRAINT "_shows_v_rels_genres_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pages_fk";
  
  DROP INDEX "posts_author_idx";
  DROP INDEX "posts_legacy_path_idx";
  DROP INDEX "_posts_v_version_version_author_idx";
  DROP INDEX "_posts_v_version_version_legacy_path_idx";
  DROP INDEX "events_legacy_path_idx";
  DROP INDEX "_events_v_version_version_legacy_path_idx";
  DROP INDEX "podcasts_legacy_path_idx";
  DROP INDEX "_podcasts_v_version_version_legacy_path_idx";
  DROP INDEX "shows_legacy_path_idx";
  DROP INDEX "shows_rels_genres_id_idx";
  DROP INDEX "_shows_v_version_version_legacy_path_idx";
  DROP INDEX "_shows_v_rels_genres_id_idx";
  DROP INDEX "staff_legacy_path_idx";
  DROP INDEX "_staff_v_version_version_legacy_path_idx";
  DROP INDEX "payload_locked_documents_rels_pages_id_idx";
  ALTER TABLE "posts" DROP COLUMN "author_id";
  ALTER TABLE "posts" DROP COLUMN "legacy_path";
  ALTER TABLE "_posts_v" DROP COLUMN "version_author_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_legacy_path";
  ALTER TABLE "events" DROP COLUMN "artists";
  ALTER TABLE "events" DROP COLUMN "city";
  ALTER TABLE "events" DROP COLUMN "legacy_path";
  ALTER TABLE "_events_v" DROP COLUMN "version_artists";
  ALTER TABLE "_events_v" DROP COLUMN "version_city";
  ALTER TABLE "_events_v" DROP COLUMN "version_legacy_path";
  ALTER TABLE "podcasts" DROP COLUMN "legacy_path";
  ALTER TABLE "_podcasts_v" DROP COLUMN "version_legacy_path";
  ALTER TABLE "shows" DROP COLUMN "subtitle";
  ALTER TABLE "shows" DROP COLUMN "legacy_path";
  ALTER TABLE "shows_rels" DROP COLUMN "genres_id";
  ALTER TABLE "_shows_v" DROP COLUMN "version_subtitle";
  ALTER TABLE "_shows_v" DROP COLUMN "version_legacy_path";
  ALTER TABLE "_shows_v_rels" DROP COLUMN "genres_id";
  ALTER TABLE "staff" DROP COLUMN "socials_linkedin";
  ALTER TABLE "staff" DROP COLUMN "legacy_path";
  ALTER TABLE "_staff_v" DROP COLUMN "version_socials_linkedin";
  ALTER TABLE "_staff_v" DROP COLUMN "version_legacy_path";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pages_id";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_status";`)
}
