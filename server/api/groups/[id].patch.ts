import {
  defineEventHandler,
  getValidatedRouterParams,
  readValidatedBody,
} from '#imports';
import {
  groupsPatchBodySchema,
  groupsPatchParamsSchema,
  groupsPatchQuery,
} from '~/utils/api/groups/[id].patch';
import { db } from '~/db/db';

export default defineEventHandler({
  handler: async (event) => {
    const params = await getValidatedRouterParams(
      event,
      groupsPatchParamsSchema.parse,
    );
    const body = await readValidatedBody(event, groupsPatchBodySchema.parse);

    return groupsPatchQuery(db, params, body);
  },
});
