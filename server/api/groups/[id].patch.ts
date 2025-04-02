import {
  defineEventHandler,
  getValidatedRouterParams,
  readValidatedBody,
} from '#imports';
import { z } from 'zod';
import { db } from '~/db/db';
import type { ExtractHandlerResponseBody } from '~/utils/api/types';

export const paramsSchema = z.object({
  id: z.string().uuid(),
});

export const bodySchema = z.object({
  name: z.string().min(1),
  image: z.string().url().nullable(),
});

const handler = defineEventHandler({
  handler: async (event) => {
    const { id } = await getValidatedRouterParams(event, paramsSchema.parse);
    const body = await readValidatedBody(event, bodySchema.partial().parse);

    return db
      .updateTable('group')
      .set(body)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow();
  },
});

export type RequestBody = Partial<z.infer<typeof bodySchema>>;
export type ResponseBody = ExtractHandlerResponseBody<typeof handler>;
export default handler;
