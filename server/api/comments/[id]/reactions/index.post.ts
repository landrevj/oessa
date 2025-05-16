import {
  createError,
  defineEventHandler,
  getValidatedRouterParams,
  readValidatedBody,
} from 'h3';
import {
  reactionPostBodySchema,
  reactionPostParamsSchema,
} from '~/utils/api/comments/[id]/reactions/index.post';
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
      reactionPostParamsSchema.parse,
    );
    const { reaction } = await readValidatedBody(
      event,
      reactionPostBodySchema.parse,
    );

    const newReaction = await db
      .insertInto('reaction')
      .values({ commentId: id, userId: session.user.id, reaction })
      .returningAll()
      .executeTakeFirstOrThrow();

    return newReaction;
  },
});
