import type { DB } from '~/db/types';
import type { Kysely } from 'kysely';

export const selectBasicUsers = (db: Kysely<DB>) => {
  return db.selectFrom('user').select(['id', 'name', 'image']).execute();
};
