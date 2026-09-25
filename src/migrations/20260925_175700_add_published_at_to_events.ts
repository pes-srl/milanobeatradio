import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "published_at" timestamp(3) with time zone;
    ALTER TABLE "_events_v" ADD COLUMN IF NOT EXISTS "version_published_at" timestamp(3) with time zone;
    CREATE INDEX IF NOT EXISTS "events_published_at_idx" ON "events" USING btree ("published_at");
    CREATE INDEX IF NOT EXISTS "_events_v_version_published_at_idx" ON "_events_v" USING btree ("version_published_at");
    UPDATE "events" SET "published_at" = "created_at" WHERE "published_at" IS NULL AND "_status" = 'published';
    UPDATE "_events_v" SET "version_published_at" = "version_created_at" WHERE "version_published_at" IS NULL AND "version__status" = 'published';
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "events_published_at_idx";
    DROP INDEX IF EXISTS "_events_v_version_published_at_idx";
    ALTER TABLE "events" DROP COLUMN IF EXISTS "published_at";
    ALTER TABLE "_events_v" DROP COLUMN IF EXISTS "version_published_at";
  `)
}
