import * as migration_20260906_234608_initial from './20260906_234608_initial';
import * as migration_20260907_094728_users_roles_podcast_audio_file from './20260907_094728_users_roles_podcast_audio_file';
import * as migration_20260907_101241_content_model_phase2 from './20260907_101241_content_model_phase2';
import * as migration_20260907_101243_drop_show_genre from './20260907_101243_drop_show_genre';
import * as migration_20260907_212321_stats_counters from './20260907_212321_stats_counters';

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
    name: '20260907_212321_stats_counters'
  },
];
