import type { Comment, User } from '~/db/types';
import { type Selectable, sql } from 'kysely';
import { defineEventHandler, getValidatedRouterParams } from 'h3';
import { auth } from '~/lib/auth';
import { commentReactions } from '~/utils/db/comments/comments';
import { db } from '~/db/db';
import { threadsGetParamsSchema } from '~/utils/api/commentables/[id]/threads.get';

// adapted from https://schinckel.net/2017/07/01/tree-data-as-a-nested-list-redux/#comment-6373741292

type CommentWithComments = Omit<Selectable<Comment>, 'user_id'> & {
  comments: CommentWithComments[];
  reactions: { reaction: string; count: number; didUserReact?: boolean }[];
  user: Pick<Selectable<User>, 'id' | 'name' | 'image'>;
};

const MAX_DIRECT_REPLIES = 10;
const MAX_REPLY_DEPTH = 2;

export default defineEventHandler({
  handler: async (event) => {
    const session = await auth.api.getSession({ headers: event.headers });

    const { id } = await getValidatedRouterParams(
      event,
      threadsGetParamsSchema.parse,
    );

    const { jsonbAgg: comments } = await db
      .withRecursive('node', (qb) =>
        qb
          .selectFrom(({ eb, selectFrom }) =>
            selectFrom('treeComment as parent')
              .selectAll()
              .select(({ lit, ref, selectFrom }) => [
                selectFrom('user')
                  .select(
                    sql<
                      CommentWithComments['user']
                    >`to_jsonb("user".*) - ARRAY['email', 'created_at', 'updated_at', 'email_verified']`.as(
                      'user_json',
                    ),
                  )
                  .whereRef('user.id', '=', 'parent.userId')
                  .as('user'),
                lit<number>(0).as('depth'),
                selectFrom('comment as c1')
                  .select(({ fn }) => fn.countAll().as('count'))
                  .where(({ eb, selectFrom }) =>
                    eb(
                      'c1.path',
                      '~',
                      sql<string>`(${selectFrom('comment as c2').select('c2.path').whereRef('c2.id', '=', 'parent.id')}::text || '.*{1}')::lquery`,
                    ),
                  )
                  .as('replyCount'),
                commentReactions(eb, ref('parent.id'), session).as('reactions'),
              ])
              .where('parent.parentId', '=', id)
              .limit(sql.lit(MAX_DIRECT_REPLIES))
              .as('directReplies'),
          )
          .selectAll()
          .union(({ selectFrom }) =>
            selectFrom('treeComment as child')
              .selectAll('child')
              .select(({ eb, ref, selectFrom }) => [
                selectFrom('user')
                  .select(
                    sql<
                      CommentWithComments['user']
                    >`to_jsonb("user".*) - ARRAY['email', 'created_at', 'updated_at', 'email_verified']`.as(
                      'user_json',
                    ),
                  )
                  .whereRef('user.id', '=', 'child.userId')
                  .as('user'),
                sql<number>`"parent"."depth" + 1`.as('depth'),
                selectFrom('comment')
                  .select(({ fn }) => fn.countAll().as('count'))
                  .where(({ eb, selectFrom }) =>
                    eb(
                      'comment.path',
                      '~',
                      sql<string>`(${selectFrom('comment').select('comment.path').whereRef('comment.id', '=', 'child.id')}::text || '.*{1}')::lquery`,
                    ),
                  )
                  .as('replyCount'),
                commentReactions(eb, ref('child.id'), session).as('reactions'),
              ])
              .innerJoin('node as parent', 'parent.id', 'child.parent_id')
              .where(sql<number>`depth + 1`, '<', sql.lit(MAX_REPLY_DEPTH)),
          ),
      )
      .withRecursive('tree', (qb) => {
        return qb
          .selectFrom('node')
          .selectAll('node')
          .select(sql<CommentWithComments[]>`'[]'::jsonb`.as('comments'))
          .where(({ eb, selectFrom }) =>
            eb(
              'depth',
              '=',
              selectFrom('node').select(({ fn, ref }) =>
                fn.max(ref('depth')).as('max_depth'),
              ),
            ),
          )
          .union(
            /** @ts-expect-error Think this should get fixed by the lower one */
            qb
              .selectFrom(
                qb
                  .with('prev_result', (qb) =>
                    qb.selectFrom('tree').selectAll(),
                  )
                  .with('current_depth', (qb) =>
                    qb
                      .selectFrom('prev_result')
                      .select(sql<number>`"depth" - 1`.as('depth'))
                      .limit(sql.lit(1)),
                  )
                  .selectFrom((qb) =>
                    qb
                      .selectFrom('node')
                      .innerJoin(
                        'current_depth',
                        'current_depth.depth',
                        'node.depth',
                      )
                      .leftJoin(
                        'prev_result as child',
                        'child.parent_id',
                        'node.id',
                      )
                      .select(['node', 'child'])
                      .as('working_tree'),
                  )
                  /** @ts-expect-error Somehow need to select this in a way typescript likes */
                  .select(({ fn }) => [
                    sql`("working_tree"."node").*`,
                    fn
                      .coalesce(
                        sql<
                          CommentWithComments[]
                        >`jsonb_agg(to_jsonb(working_tree.child) - 'depth' ORDER BY (working_tree.child).created_at) FILTER (WHERE "working_tree" IS NOT NULL)`,
                        sql`'[]'::jsonb`,
                      )
                      .as('comments'),
                  ])
                  .groupBy('working_tree.node')
                  .as('temp'),
              )
              .selectAll(),
          );
      })
      .selectFrom('tree as final_tree')
      .select(
        sql<
          CommentWithComments[]
        >`jsonb_agg(to_jsonb(final_tree) - 'depth' order by final_tree.created_at)`.as(
          'jsonbAgg',
        ),
      )
      .where('final_tree.depth', '=', sql.lit(0))
      .executeTakeFirstOrThrow();
    return comments;
  },
});
