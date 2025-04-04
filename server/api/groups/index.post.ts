import { defineEventHandler, readValidatedBody } from '#imports';
import {
  groupsPostBodySchema,
  groupsPostQuery,
} from '~/utils/api/groups/index.post';
import { db } from '~/db/db';

export default defineEventHandler({
  handler: async (event) => {
    const body = await readValidatedBody(event, groupsPostBodySchema.parse);

    return groupsPostQuery(db, body);
  },
});
