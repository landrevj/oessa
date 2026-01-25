import {
  defineEventHandler,
  getValidatedRouterParams,
  setResponseStatus,
} from 'h3';
import { db } from '~/db/db';
import { groupsDeleteParamsSchema } from '~/utils/api/groups/[id].delete';

const handler = defineEventHandler({
  handler: async (event) => {
    const { id } = await getValidatedRouterParams(
      event,
      groupsDeleteParamsSchema.parse,
    );

    await db.transaction().execute(async (trx) => {
      await trx.deleteFrom('groupUser').where('groupId', '=', id).execute();
      await trx.deleteFrom('group').where('id', '=', id).execute();
      await trx.deleteFrom('commentable').where('id', '=', id).execute();
    });
    setResponseStatus(event, 204);
  },
});

export default handler;
