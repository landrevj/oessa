import { db } from '~/db/db';
import { defineEventHandler } from '#imports';
import { groupsGetQuery } from '~/utils/api/groups/index.get';

export default defineEventHandler({
  handler: () => {
    return groupsGetQuery(db);
  },
});
