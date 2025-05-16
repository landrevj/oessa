import {
  CamelCasePlugin,
  Kysely,
  PostgresDialect,
  expressionBuilder as kyselyExpressionBuilder,
} from 'kysely';
import type { DB } from './types.d.ts';
import pg from 'pg';

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
    }),
  }),
  plugins: [new CamelCasePlugin()],
});

export const expressionBuilder = kyselyExpressionBuilder<DB>;
