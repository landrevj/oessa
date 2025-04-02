import { defineEventHandler, readValidatedBody } from '#imports';
import { z } from 'zod';
import { db } from '~/db/db';
import type { ExtractHandlerResponseBody } from '~/utils/api/types';

export const bodySchema = z.object({
  name: z.string().min(1),
  image: z.string().url().optional(),
});

const handler = defineEventHandler({
  handler: async (event) => {
    const body = await readValidatedBody(event, bodySchema.parse);

    return db
      .insertInto('group')
      .values(body)
      .returningAll()
      .executeTakeFirstOrThrow();
  },
});

export type RequestBody = z.infer<typeof bodySchema>;
export type ResponseBody = ExtractHandlerResponseBody<typeof handler>;
export default handler;
