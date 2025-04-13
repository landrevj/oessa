import { db } from '~/db/db';
import { defineEventHandler } from 'h3';
import { selectAllGroupsWithUsers } from '~/utils/db/group';

export default defineEventHandler({
  handler: () => {
    return selectAllGroupsWithUsers(db);
  },
});
