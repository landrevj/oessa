import {
  defineEventHandler,
  getValidatedRouterParams,
  setResponseStatus,
} from '#imports';
import {
  groupsDeleteParamsSchema,
  groupsDeleteQuery,
} from '~/utils/api/groups/[id].delete';
import { db } from '~/db/db';

const handler = defineEventHandler({
  handler: async (event) => {
    const params = await getValidatedRouterParams(
      event,
      groupsDeleteParamsSchema.parse,
    );
    await groupsDeleteQuery(db, params);
    setResponseStatus(event, 204);
  },
});

export default handler;
