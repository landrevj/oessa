import { defineEventHandler, getValidatedRouterParams } from 'h3';
import { auth } from '~/lib/auth';
import { commentReactions } from '~/utils/db/comments/comments';
import { db } from '~/db/db';
import { jsonObjectFrom } from 'kysely/helpers/postgres';
import { threadsGetParamsSchema } from '~/utils/api/commentables/[id]/threads.get';

export default defineEventHandler({
  handler: async (event) => {
    const session = await auth.api.getSession({ headers: event.headers });

    const { id } = await getValidatedRouterParams(
      event,
      threadsGetParamsSchema.parse,
    );

    const a = await db
      .selectFrom('comment')
      .selectAll()
      .select(({ eb, selectFrom, ref }) => [
        jsonObjectFrom(
          selectFrom('user')
            .select(['user.id', 'user.name', 'user.image'])
            .whereRef('comment.userId', '=', 'user.id'),
        ).as('user'),
        commentReactions(eb, ref('comment.id'), session).as('reactions'),
      ])
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
    return a;
  },
});
