import { defineEventHandler, getValidatedRouterParams } from 'h3';
import { db } from '~/db/db';
import { jsonObjectFrom } from 'kysely/helpers/postgres';
import { threadsGetParamsSchema } from '~/utils/api/commentables/[id]/threads.get';

export default defineEventHandler({
  handler: async (event) => {
    const { id } = await getValidatedRouterParams(
      event,
      threadsGetParamsSchema.parse,
    );

    return db
      .selectFrom('comment')
      .where('id', '=', id)
      .selectAll()
      .select(({ eb }) =>
        jsonObjectFrom(
          eb
            .selectFrom('user')
            .select(['user.id', 'user.name', 'user.image'])
            .whereRef('comment.userId', '=', 'user.id'),
        ).as('user'),
      )
      .executeTakeFirstOrThrow();
  },
});
