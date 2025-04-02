import { defineEventHandler } from '#imports';
import { db } from '~/db/db';
import type { ExtractHandlerResponseBody } from '~/utils/api/types';

const handler = defineEventHandler({
  handler: () => {
    return db.selectFrom('group').selectAll().execute();
  },
});

export type ResponseBody = ExtractHandlerResponseBody<typeof handler>;
export default handler;
