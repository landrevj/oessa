import { db } from '~/db/db';
import { defineEventHandler } from 'h3';
import { selectBasicUsers } from '~/utils/db/user';

export default defineEventHandler({
  handler: () => {
    return selectBasicUsers(db);
  },
});
