import { z } from 'zod';

export const reactionDeleteParamsSchema = z.object({
  id: z.string().uuid(),
});

export type ReactionDeleteParams = z.infer<typeof reactionDeleteParamsSchema>;

export const reactionDeleteBodySchema = z.object({
  reaction: z.string().emoji(),
});

export type ReactionDeleteRequestBody = z.infer<
  typeof reactionDeleteBodySchema
>;

export const deleteReaction = ({
  id,
  body,
}: {
  id: ReactionDeleteParams['id'];
  body: ReactionDeleteRequestBody;
}) => {
  return $fetch(`/api/comments/${id}/reactions`, {
    method: 'delete',
    headers: {
      'content-type': 'application/json',
    },
    body,
  });
};
