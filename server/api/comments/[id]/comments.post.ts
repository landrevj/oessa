import {
  commentPostBodySchema,
  commentPostParamsSchema,
} from '~/utils/api/comments/[id]/comments.post';
import {
  createError,
  defineEventHandler,
  getValidatedRouterParams,
  readValidatedBody,
} from 'h3';
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
      commentPostParamsSchema.parse,
    );
    const values = await readValidatedBody(event, commentPostBodySchema.parse);

    const newComment = await db
      .insertInto('comment')
      .values({ ...values, parentId: id, userId: session.user.id })
      .returningAll()
      .executeTakeFirstOrThrow();

    return newComment;
  },
});
