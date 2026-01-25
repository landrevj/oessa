import { createError, defineEventHandler, getValidatedRouterParams } from 'h3';
import { auth } from '~/lib/auth';
import { commentReactions } from '~/utils/db/comments/comments';
import { db } from '~/db/db';
import { reactionGetParamsSchema } from '~/utils/api/comments/[id]/reactions/index.get';

export default defineEventHandler({
  handler: async (event) => {
    const session = await auth.api.getSession({ headers: event.headers });
    if (!session) {
      throw createError({
        status: 401,
        statusMessage: 'Unauthorized',
      });
    }

    const { id } = await getValidatedRouterParams(
      event,
      reactionGetParamsSchema.parse,
    );

    const { reactions } = await db
      .selectNoFrom(({ eb }) =>
        commentReactions(eb, id, session).as('reactions'),
      )
      .executeTakeFirstOrThrow();
    return reactions || [];
  },
});
