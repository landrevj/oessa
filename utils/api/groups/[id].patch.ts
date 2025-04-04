import type { DB } from '~/db/types';
import type { Kysely } from 'kysely';
import type { SerializedDates } from '~/utils/types';
import { z } from 'zod';

export const groupsPatchParamsSchema = z.object({
  id: z.string().uuid(),
});

export type GroupsPatchParams = z.infer<typeof groupsPatchParamsSchema>;

export const groupsPatchBodySchema = z
  .object({
    name: z.string().min(1),
    image: z.string().url().nullable(),
  })
  .partial();

export type GroupsPatchRequestBody = z.infer<typeof groupsPatchBodySchema>;

export const groupsPatchQuery = (
  db: Kysely<DB>,
  params: GroupsPatchParams,
  body: GroupsPatchRequestBody,
) => {
  return db
    .updateTable('group')
    .set(body)
    .where('id', '=', params.id)
    .returningAll()
    .executeTakeFirstOrThrow();
};

export type GroupsPatchResponseBody = SerializedDates<
  Awaited<ReturnType<typeof groupsPatchQuery>>
>;

export const updateGroup = ({
  id,
  body,
}: {
  id: GroupsPatchParams['id'];
  body: GroupsPatchRequestBody;
}): Promise<GroupsPatchResponseBody> => {
  return $fetch(`/api/groups/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });
};
