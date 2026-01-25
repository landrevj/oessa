import { defineEventHandler, getValidatedRouterParams } from 'h3';
import { db } from '~/db/db';
import { groupGetParamsSchema } from '~/utils/api/groups/[id].get';
import { groupUsers } from '~/utils/db/group';

export default defineEventHandler({
  handler: async (event) => {
    const { id } = await getValidatedRouterParams(
      event,
      groupGetParamsSchema.parse,
    );

    return db
      .selectFrom('group')
      .selectAll('group')
      .select(({ ref }) => groupUsers(db, ref('group.id')).as('users'))
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  },
});
