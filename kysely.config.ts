import { defineConfig } from 'kysely-ctl';
import { db } from './db/db';

export default defineConfig({
  kysely: db,
  migrations: {
    migrationFolder: './db/migrations',
  },
});
