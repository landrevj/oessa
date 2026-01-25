import {
  createError,
  defineEventHandler,
  getValidatedRouterParams,
  readValidatedBody,
  setResponseStatus,
} from 'h3';
import {
  reactionDeleteBodySchema,
  reactionDeleteParamsSchema,
} from '~/utils/api/comments/[id]/reactions/index.delete';
import { auth } from '~/lib/auth';
import { db } from '~/db/db';

const handler = defineEventHandler({
  handler: async (event) => {
    const session = await auth.api.getSession({ headers: event.headers });
    if (!session) {
      throw createError({
        status: 401,
        statusMessage: 'Unauthorized',
      });
    }

    const { id: commentId } = await getValidatedRouterParams(
      event,
      reactionDeleteParamsSchema.parse,
    );
    const { reaction } = await readValidatedBody(
      event,
      reactionDeleteBodySchema.parse,
    );

    await db
      .deleteFrom('reaction')
      .where('commentId', '=', commentId)
      .where('userId', '=', session!.user.id)
      .where('reaction', '=', reaction)
      .execute();
    setResponseStatus(event, 204);
  },
});

export default handler;
