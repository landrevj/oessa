import { db } from './db/db';
import { defineConfig } from 'kysely-ctl';

export default defineConfig({
  kysely: db,
  migrations: {
    migrationFolder: './db/migrations',
  },
});
