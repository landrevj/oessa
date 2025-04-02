import { defineEventHandler } from '#imports';
import { db } from '~/db/db';

export default defineEventHandler({
  handler: () => {
    return db.selectFrom('user').select(['id', 'name', 'image']).execute();
  },
});
