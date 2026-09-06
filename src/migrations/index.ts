import * as migration_20260906_234608_initial from './20260906_234608_initial';

export const migrations = [
  {
    up: migration_20260906_234608_initial.up,
    down: migration_20260906_234608_initial.down,
    name: '20260906_234608_initial'
  },
];
