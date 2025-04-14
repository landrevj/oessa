import type { CreateTableBuilder } from 'kysely';
import { sql } from 'kysely';

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
