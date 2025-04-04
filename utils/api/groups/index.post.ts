import type { DB } from '~/db/types';
import type { Kysely } from 'kysely';
import type { SerializedDates } from '~/utils/types';
import { z } from 'zod';

export const groupsPostBodySchema = z.object({
  name: z.string(),
  image: z.string().url().optional(),
});

export type GroupsPostRequestBody = z.infer<typeof groupsPostBodySchema>;

export const groupsPostQuery = (
  db: Kysely<DB>,
  body: GroupsPostRequestBody,
) => {
  return db
    .insertInto('group')
    .values(body)
    .returningAll()
    .executeTakeFirstOrThrow();
};

export type GroupsPostResponseBody = SerializedDates<
  Awaited<ReturnType<typeof groupsPostQuery>>
>;

export const createGroup = ({
  body,
}: {
  body: GroupsPostRequestBody;
}): Promise<GroupsPostResponseBody> => {
  return $fetch('/api/groups', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });
};
