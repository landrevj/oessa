import { z } from 'zod';

export const groupsDeleteParamsSchema = z.object({
  id: z.string().uuid(),
});

export type GroupsDeleteParams = z.infer<typeof groupsDeleteParamsSchema>;

export const deleteGroup = ({ id }: GroupsDeleteParams) => {
  return $fetch(`/api/groups/${id}`, {
    method: 'DELETE',
  });
};
