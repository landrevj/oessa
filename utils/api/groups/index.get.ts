import type { DB } from '~/db/types';
import type { Kysely } from 'kysely';
import type { SerializedDates } from '~/utils/types';

export const groupsGetQuery = (db: Kysely<DB>) => {
  return db.selectFrom('group').selectAll().execute();
};

export type GroupsGetResponseBody = SerializedDates<
  Awaited<ReturnType<typeof groupsGetQuery>>
>;

export const readGroups = (): Promise<GroupsGetResponseBody> => {
  return $fetch('/api/groups');
};
