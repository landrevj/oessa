import {
  defineEventHandler,
  getValidatedRouterParams,
  setResponseStatus,
} from '#imports';
import { z } from 'zod';
import { db } from '~/db/db';

export const paramsSchema = z.object({
  id: z.string().uuid(),
});

const handler = defineEventHandler({
  handler: async (event) => {
    const { id } = await getValidatedRouterParams(event, paramsSchema.parse);
    await db.deleteFrom('group').where('id', '=', id).execute();
    setResponseStatus(event, 204);
  },
});

export default handler;
