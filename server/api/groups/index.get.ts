import { db } from '~/db/db';
import { defineEventHandler } from 'h3';
import { groupUsers } from '~/utils/db/group';

export default defineEventHandler({
  handler: () => {
    return db
      .selectFrom('group')
      .selectAll()
      .select(({ ref }) => groupUsers(db, ref('group.id')).as('users'))
      .execute();
  },
});
