import type { ExpressionBuilder, ExpressionWrapper } from 'kysely';
import { jsonbAgg, toJsonb } from '../functions';
import type { DB } from '~/db/types';
import type { auth } from '~/lib/auth';

export const commentReactions = (
  expressionBuilder: ExpressionBuilder<DB, 'comment'>,
  commentId: ExpressionWrapper<DB, 'comment', string>,
  session?: Awaited<ReturnType<typeof auth.api.getSession>>,
) => {
  return expressionBuilder
    .selectFrom(({ selectFrom }) =>
      selectFrom('reaction as r1')
        .innerJoin('user', 'r1.userId', 'user.id')
        .select(({ fn }) => [
          'r1.reaction',
          fn.count('r1.reaction').as('count'),
          fn.jsonAgg('user.name').orderBy('r1.createdAt', 'asc').as('users'),
        ])
        .$if(!!session, (qb) =>
          qb.select(({ exists, selectFrom }) =>
            exists(
              selectFrom('reaction as r2')
                .selectAll()
                .whereRef('r2.commentId', '=', 'r1.commentId')
                .whereRef('r2.reaction', '=', 'r1.reaction')
                .where('r2.userId', '=', session!.user.id),
            ).as('didUserReact'),
          ),
        )
        .where('r1.commentId', '=', commentId)
        .groupBy(['r1.commentId', 'r1.reaction'])
        .orderBy(({ fn }) => fn.min('r1.createdAt'), 'asc')
        .as('reactionCounts'),
    )
    .select(({ fn }) =>
      jsonbAgg(toJsonb(fn, 'reactionCounts')).as('reactionArray'),
    );
};
