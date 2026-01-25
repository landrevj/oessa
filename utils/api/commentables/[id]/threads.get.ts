import { z } from 'zod';

export const threadsGetParamsSchema = z.object({
  id: z.string().uuid(),
});

export type ThreadsGetParams = z.infer<typeof threadsGetParamsSchema>;

export const readThreads = ({ id }: ThreadsGetParams) => {
  return $fetch(`/api/commentables/${id}/threads`);
};
