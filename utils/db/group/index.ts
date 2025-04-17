import type { Expression, Kysely } from 'kysely';
import type { DB } from '~/db/types';
import type { GroupsPatchRequestBody } from '~/utils/api/groups/[id].patch';
import { jsonArrayFrom } from 'kysely/helpers/postgres';

export const groupUsers = (db: Kysely<DB>, groupId: Expression<string>) => {
  return jsonArrayFrom(
    db
      .selectFrom('groupUser')
      .innerJoin('user', 'user.id', 'groupUser.userId')
      .select(['user.id', 'user.name', 'user.image'])
      .where('groupUser.groupId', '=', groupId),
  );
};

export const selectAllGroupsWithUsers = (db: Kysely<DB>) => {
  return db
    .selectFrom('group')
    .selectAll('group')
    .select(({ ref }) => groupUsers(db, ref('group.id')).as('users'))
    .execute();
};

export const insertGroupUsers = (
  db: Kysely<DB>,
  groupId: string,
  userIds: string[],
) => {
  return db
    .insertInto('groupUser')
    .values(userIds.map((userId) => ({ groupId: groupId, userId })))
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const updateGroup = (
  db: Kysely<DB>,
  groupId: string,
  values: GroupsPatchRequestBody,
) => {
  return db
    .updateTable('group')
    .set(values)
    .where('id', '=', groupId)
    .returningAll()
    .executeTakeFirstOrThrow();
};
