import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" ADD COLUMN "stats_views" numeric DEFAULT 0;
  ALTER TABLE "posts" ADD COLUMN "stats_likes" numeric DEFAULT 0;
  ALTER TABLE "posts" ADD COLUMN "stats_shares" numeric DEFAULT 0;
  ALTER TABLE "_posts_v" ADD COLUMN "version_stats_views" numeric DEFAULT 0;
  ALTER TABLE "_posts_v" ADD COLUMN "version_stats_likes" numeric DEFAULT 0;
  ALTER TABLE "_posts_v" ADD COLUMN "version_stats_shares" numeric DEFAULT 0;
  ALTER TABLE "events" ADD COLUMN "stats_views" numeric DEFAULT 0;
  ALTER TABLE "events" ADD COLUMN "stats_likes" numeric DEFAULT 0;
  ALTER TABLE "events" ADD COLUMN "stats_shares" numeric DEFAULT 0;
  ALTER TABLE "_events_v" ADD COLUMN "version_stats_views" numeric DEFAULT 0;
  ALTER TABLE "_events_v" ADD COLUMN "version_stats_likes" numeric DEFAULT 0;
  ALTER TABLE "_events_v" ADD COLUMN "version_stats_shares" numeric DEFAULT 0;
  ALTER TABLE "podcasts" ADD COLUMN "stats_views" numeric DEFAULT 0;
  ALTER TABLE "podcasts" ADD COLUMN "stats_likes" numeric DEFAULT 0;
  ALTER TABLE "podcasts" ADD COLUMN "stats_shares" numeric DEFAULT 0;
  ALTER TABLE "_podcasts_v" ADD COLUMN "version_stats_views" numeric DEFAULT 0;
  ALTER TABLE "_podcasts_v" ADD COLUMN "version_stats_likes" numeric DEFAULT 0;
  ALTER TABLE "_podcasts_v" ADD COLUMN "version_stats_shares" numeric DEFAULT 0;
  ALTER TABLE "shows" ADD COLUMN "stats_views" numeric DEFAULT 0;
  ALTER TABLE "shows" ADD COLUMN "stats_likes" numeric DEFAULT 0;
  ALTER TABLE "shows" ADD COLUMN "stats_shares" numeric DEFAULT 0;
  ALTER TABLE "_shows_v" ADD COLUMN "version_stats_views" numeric DEFAULT 0;
  ALTER TABLE "_shows_v" ADD COLUMN "version_stats_likes" numeric DEFAULT 0;
  ALTER TABLE "_shows_v" ADD COLUMN "version_stats_shares" numeric DEFAULT 0;
  ALTER TABLE "staff" ADD COLUMN "stats_views" numeric DEFAULT 0;
  ALTER TABLE "staff" ADD COLUMN "stats_likes" numeric DEFAULT 0;
  ALTER TABLE "staff" ADD COLUMN "stats_shares" numeric DEFAULT 0;
  ALTER TABLE "_staff_v" ADD COLUMN "version_stats_views" numeric DEFAULT 0;
  ALTER TABLE "_staff_v" ADD COLUMN "version_stats_likes" numeric DEFAULT 0;
  ALTER TABLE "_staff_v" ADD COLUMN "version_stats_shares" numeric DEFAULT 0;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" DROP COLUMN "stats_views";
  ALTER TABLE "posts" DROP COLUMN "stats_likes";
  ALTER TABLE "posts" DROP COLUMN "stats_shares";
  ALTER TABLE "_posts_v" DROP COLUMN "version_stats_views";
  ALTER TABLE "_posts_v" DROP COLUMN "version_stats_likes";
  ALTER TABLE "_posts_v" DROP COLUMN "version_stats_shares";
  ALTER TABLE "events" DROP COLUMN "stats_views";
  ALTER TABLE "events" DROP COLUMN "stats_likes";
  ALTER TABLE "events" DROP COLUMN "stats_shares";
  ALTER TABLE "_events_v" DROP COLUMN "version_stats_views";
  ALTER TABLE "_events_v" DROP COLUMN "version_stats_likes";
  ALTER TABLE "_events_v" DROP COLUMN "version_stats_shares";
  ALTER TABLE "podcasts" DROP COLUMN "stats_views";
  ALTER TABLE "podcasts" DROP COLUMN "stats_likes";
  ALTER TABLE "podcasts" DROP COLUMN "stats_shares";
  ALTER TABLE "_podcasts_v" DROP COLUMN "version_stats_views";
  ALTER TABLE "_podcasts_v" DROP COLUMN "version_stats_likes";
  ALTER TABLE "_podcasts_v" DROP COLUMN "version_stats_shares";
  ALTER TABLE "shows" DROP COLUMN "stats_views";
  ALTER TABLE "shows" DROP COLUMN "stats_likes";
  ALTER TABLE "shows" DROP COLUMN "stats_shares";
  ALTER TABLE "_shows_v" DROP COLUMN "version_stats_views";
  ALTER TABLE "_shows_v" DROP COLUMN "version_stats_likes";
  ALTER TABLE "_shows_v" DROP COLUMN "version_stats_shares";
  ALTER TABLE "staff" DROP COLUMN "stats_views";
  ALTER TABLE "staff" DROP COLUMN "stats_likes";
  ALTER TABLE "staff" DROP COLUMN "stats_shares";
  ALTER TABLE "_staff_v" DROP COLUMN "version_stats_views";
  ALTER TABLE "_staff_v" DROP COLUMN "version_stats_likes";
  ALTER TABLE "_staff_v" DROP COLUMN "version_stats_shares";`)
}
