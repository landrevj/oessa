import { sql } from 'kysely';
import type { CreateTableBuilder, Kysely } from 'kysely';

export const withTimestamps = <T extends string, U extends string>(
  qb: CreateTableBuilder<T, U>,
) => {
  return qb
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    );
};

export const createUpdatedAtTrigger = (db: Kysely<any>, table: string) => {
  return sql`
    CREATE TRIGGER ${sql.id(`touch_updated_at_${table}`)} BEFORE UPDATE ON ${sql.table(table)} FOR EACH ROW EXECUTE PROCEDURE touch_updated_at_timestamp();
  `.execute(db);
};

export const dropUpdatedAtTrigger = (db: Kysely<any>, table: string) => {
  return sql`
    DROP TRIGGER ${sql.id(`touch_updated_at_${table}`)} ON ${sql.table(table)};
  `.execute(db);
};
