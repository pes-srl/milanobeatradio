import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "shows" DROP CONSTRAINT "shows_genre_id_genres_id_fk";
  
  ALTER TABLE "_shows_v" DROP CONSTRAINT "_shows_v_version_genre_id_genres_id_fk";
  
  DROP INDEX "shows_genre_idx";
  DROP INDEX "_shows_v_version_version_genre_idx";
  ALTER TABLE "shows" DROP COLUMN "genre_id";
  ALTER TABLE "_shows_v" DROP COLUMN "version_genre_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "shows" ADD COLUMN "genre_id" integer;
  ALTER TABLE "_shows_v" ADD COLUMN "version_genre_id" integer;
  ALTER TABLE "shows" ADD CONSTRAINT "shows_genre_id_genres_id_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."genres"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_shows_v" ADD CONSTRAINT "_shows_v_version_genre_id_genres_id_fk" FOREIGN KEY ("version_genre_id") REFERENCES "public"."genres"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "shows_genre_idx" ON "shows" USING btree ("genre_id");
  CREATE INDEX "_shows_v_version_version_genre_idx" ON "_shows_v" USING btree ("version_genre_id");`)
}
