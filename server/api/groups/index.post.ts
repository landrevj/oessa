import { defineEventHandler, readValidatedBody } from 'h3';
import { insertGroup, insertGroupUsers } from '~/utils/db/group';
import { db } from '~/db/db';
import { groupsPostBodySchema } from '~/utils/api/groups/index.post';

const handler = defineEventHandler({
  handler: async (event) => {
    const { users, ...group } = await readValidatedBody(
      event,
      groupsPostBodySchema.parse,
    );

    const newGroup = await db.transaction().execute(async (trx) => {
      const insertedGroup = await insertGroup(trx, group);

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
