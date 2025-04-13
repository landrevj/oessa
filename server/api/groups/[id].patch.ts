import {
  defineEventHandler,
  getValidatedRouterParams,
  readValidatedBody,
} from 'h3';
import {
  groupsPatchBodySchema,
  groupsPatchParamsSchema,
} from '~/utils/api/groups/[id].patch';
import { insertGroupUsers, updateGroup } from '~/utils/db/group';
import { db } from '~/db/db';

export default defineEventHandler({
  handler: async (event) => {
    const { id } = await getValidatedRouterParams(
      event,
      groupsPatchParamsSchema.parse,
    );
    const { users, ...group } = await readValidatedBody(
      event,
      groupsPatchBodySchema.parse,
    );

    const finalGroup = await db.transaction().execute(async (trx) => {
      const updatedGroup = await updateGroup(trx, id, group);

      await trx
        .deleteFrom('groupUser')
        .where('groupId', '=', updatedGroup.id)
        .execute();

      let newUsers;
      if (users?.length) {
        newUsers = await insertGroupUsers(
          trx,
          updatedGroup.id,
          users.map((user) => user.id),
        );
      }

      return { ...updateGroup, users: newUsers || [] };
    });

    return finalGroup;
  },
});
