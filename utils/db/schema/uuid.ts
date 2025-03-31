import { sql } from 'kysely';
import type { CreateTableBuilder } from 'kysely';

export const withUuidPrimaryKey = <T extends string>(
  qb: CreateTableBuilder<T>,
) => {
  return qb.addColumn('id', 'uuid', (col) =>
    col
      .notNull()
      .primaryKey()
      .defaultTo(sql`gen_random_uuid()`),
  );
};
