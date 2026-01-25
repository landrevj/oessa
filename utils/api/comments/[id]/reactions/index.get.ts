import { z } from 'zod';

export const reactionGetParamsSchema = z.object({
  id: z.string().uuid(),
});

export type ReactionGetParams = z.infer<typeof reactionGetParamsSchema>;

export const readReactions = (id: ReactionGetParams['id']) => {
  return $fetch(`/api/comments/${id}/reactions`);
};
