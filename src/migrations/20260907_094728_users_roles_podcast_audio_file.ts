import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "podcasts" ADD COLUMN "audio_file_id" integer;
  ALTER TABLE "_podcasts_v" ADD COLUMN "version_audio_file_id" integer;
  ALTER TABLE "media" ADD COLUMN "prefix" varchar DEFAULT 'media';
  ALTER TABLE "users" ADD COLUMN "role" "enum_users_role" DEFAULT 'editor' NOT NULL;
  ALTER TABLE "users" ADD COLUMN "legacy_login" varchar;
  ALTER TABLE "podcasts" ADD CONSTRAINT "podcasts_audio_file_id_media_id_fk" FOREIGN KEY ("audio_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_podcasts_v" ADD CONSTRAINT "_podcasts_v_version_audio_file_id_media_id_fk" FOREIGN KEY ("version_audio_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "podcasts_audio_file_idx" ON "podcasts" USING btree ("audio_file_id");
  CREATE INDEX "_podcasts_v_version_version_audio_file_idx" ON "_podcasts_v" USING btree ("version_audio_file_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "podcasts" DROP CONSTRAINT "podcasts_audio_file_id_media_id_fk";
  
  ALTER TABLE "_podcasts_v" DROP CONSTRAINT "_podcasts_v_version_audio_file_id_media_id_fk";
  
  DROP INDEX "podcasts_audio_file_idx";
  DROP INDEX "_podcasts_v_version_version_audio_file_idx";
  ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "podcasts" DROP COLUMN "audio_file_id";
  ALTER TABLE "_podcasts_v" DROP COLUMN "version_audio_file_id";
  ALTER TABLE "media" DROP COLUMN "prefix";
  ALTER TABLE "users" DROP COLUMN "role";
  ALTER TABLE "users" DROP COLUMN "legacy_login";
  DROP TYPE "public"."enum_users_role";`)
}
