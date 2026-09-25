import * as migration_20260906_234608_initial from './20260906_234608_initial';
import * as migration_20260907_094728_users_roles_podcast_audio_file from './20260907_094728_users_roles_podcast_audio_file';
import * as migration_20260907_101241_content_model_phase2 from './20260907_101241_content_model_phase2';
import * as migration_20260907_101243_drop_show_genre from './20260907_101243_drop_show_genre';
import * as migration_20260907_212321_stats_counters from './20260907_212321_stats_counters';
import * as migration_20260921_154421 from './20260921_154421';
import * as migration_20260923_190500_users_active from './20260923_190500_users_active';
import * as migration_20260924_132444_add_surname_to_users from './20260924_132444_add_surname_to_users';
import * as migration_20260925_175700_add_published_at_to_events from './20260925_175700_add_published_at_to_events';

export const migrations = [
  {
    up: migration_20260906_234608_initial.up,
    down: migration_20260906_234608_initial.down,
    name: '20260906_234608_initial',
  },
  {
    up: migration_20260907_094728_users_roles_podcast_audio_file.up,
    down: migration_20260907_094728_users_roles_podcast_audio_file.down,
    name: '20260907_094728_users_roles_podcast_audio_file',
  },
  {
    up: migration_20260907_101241_content_model_phase2.up,
    down: migration_20260907_101241_content_model_phase2.down,
    name: '20260907_101241_content_model_phase2',
  },
  {
    up: migration_20260907_101243_drop_show_genre.up,
    down: migration_20260907_101243_drop_show_genre.down,
    name: '20260907_101243_drop_show_genre',
  },
  {
    up: migration_20260907_212321_stats_counters.up,
    down: migration_20260907_212321_stats_counters.down,
    name: '20260907_212321_stats_counters',
  },
  {
    up: migration_20260921_154421.up,
    down: migration_20260921_154421.down,
    name: '20260921_154421',
  },
  {
    up: migration_20260923_190500_users_active.up,
    down: migration_20260923_190500_users_active.down,
    name: '20260923_190500_users_active',
  },
  {
    up: migration_20260924_132444_add_surname_to_users.up,
    down: migration_20260924_132444_add_surname_to_users.down,
    name: '20260924_132444_add_surname_to_users'
  },
  {
    up: migration_20260925_175700_add_published_at_to_events.up,
    down: migration_20260925_175700_add_published_at_to_events.down,
    name: '20260925_175700_add_published_at_to_events'
  },
];
