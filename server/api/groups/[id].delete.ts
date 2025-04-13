import {
  defineEventHandler,
  getValidatedRouterParams,
  setResponseStatus,
} from 'h3';
import { db } from '~/db/db';
import { deleteGroup } from '~/utils/db/group';
import { groupsDeleteParamsSchema } from '~/utils/api/groups/[id].delete';

const handler = defineEventHandler({
  handler: async (event) => {
    const { id } = await getValidatedRouterParams(
      event,
      groupsDeleteParamsSchema.parse,
    );
    await db.deleteFrom('groupUser').where('groupId', '=', id).execute();
    await deleteGroup(db, id);
    setResponseStatus(event, 204);
  },
});

export default handler;
