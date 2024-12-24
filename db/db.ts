import type { DB } from './types.d.ts';
import pg from 'pg';
import { Kysely, PostgresDialect } from 'kysely';

const dialect = new PostgresDialect({
  pool: new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  }),
});

export const db = new Kysely<DB>({
  dialect,
});
