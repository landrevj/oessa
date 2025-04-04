import type { DB } from '~/db/types';
import type { Kysely } from 'kysely';
import type { SerializedDates } from '~/utils/types';
import { z } from 'zod';

export const groupsDeleteParamsSchema = z.object({
  id: z.string().uuid(),
});

export type GroupsDeleteParams = z.infer<typeof groupsDeleteParamsSchema>;

export const groupsDeleteQuery = (
  db: Kysely<DB>,
  params: GroupsDeleteParams,
) => {
  return db.deleteFrom('group').where('id', '=', params.id).execute();
};

export type GroupsDeleteResponseBody = SerializedDates<
  Awaited<ReturnType<typeof groupsDeleteQuery>>
>;

export const deleteGroup = ({
  id,
}: {
  id: GroupsDeleteParams['id'];
}): Promise<GroupsDeleteResponseBody> => {
  return $fetch(`/api/groups/${id}`, {
    method: 'DELETE',
  });
};
