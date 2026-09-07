import * as migration_20260906_234608_initial from './20260906_234608_initial';
import * as migration_20260907_094728_users_roles_podcast_audio_file from './20260907_094728_users_roles_podcast_audio_file';

export const migrations = [
  {
    up: migration_20260906_234608_initial.up,
    down: migration_20260906_234608_initial.down,
    name: '20260906_234608_initial',
  },
  {
    up: migration_20260907_094728_users_roles_podcast_audio_file.up,
    down: migration_20260907_094728_users_roles_podcast_audio_file.down,
    name: '20260907_094728_users_roles_podcast_audio_file'
  },
];
