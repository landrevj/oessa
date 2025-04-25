import { z } from 'zod';

export const groupGetParamsSchema = z.object({
  id: z.string().uuid(),
});

export type GroupGetParams = z.infer<typeof groupGetParamsSchema>;

export const readGroup = ({ id }: GroupGetParams) => {
  return $fetch(`/api/groups/${id}`);
};
