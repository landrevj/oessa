import { defineEventHandler, readValidatedBody } from 'h3';
import { db } from '~/db/db';
import { groupsPostBodySchema } from '~/utils/api/groups/index.post';
import { insertGroupUsers } from '~/utils/db/group';

const handler = defineEventHandler({
  handler: async (event) => {
    const { users, ...group } = await readValidatedBody(
      event,
      groupsPostBodySchema.parse,
    );

    const newGroup = await db.transaction().execute(async (trx) => {
      const { id } = await db
        .insertInto('commentable')
        .defaultValues()
        .returning('id')
        .executeTakeFirstOrThrow();

      const insertedGroup = await db
        .insertInto('group')
        .values({ id, ...group })
        .returningAll()
        .executeTakeFirstOrThrow();

      if (users?.length) {
        await insertGroupUsers(
          trx,
          insertedGroup.id,
          users.map((user) => user.id),
        );
      }

      return { ...group, users };
    });

    return newGroup;
  },
});

export default handler;
