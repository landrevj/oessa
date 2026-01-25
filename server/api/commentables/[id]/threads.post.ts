import {
  createError,
  defineEventHandler,
  getValidatedRouterParams,
  readValidatedBody,
} from 'h3';
import {
  threadPostBodySchema,
  threadPostParamsSchema,
} from '~/utils/api/commentables/[id]/threads.post';
import { auth } from '~/lib/auth';
import { db } from '~/db/db';

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
      threadPostParamsSchema.parse,
    );
    const values = await readValidatedBody(event, threadPostBodySchema.parse);

    const newComment = await db.transaction().execute(async (trx) => {
      const comment = await trx
        .insertInto('comment')
        .values({ ...values, userId: session.user.id })
        .returningAll()
        .executeTakeFirstOrThrow();

      await trx
        .insertInto('thread')
        .values({ commentableId: id, commentId: comment.id })
        .execute();

      return comment;
    });

    return newComment;
  },
});
