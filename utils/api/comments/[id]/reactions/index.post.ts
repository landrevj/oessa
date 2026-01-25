import { z } from 'zod';

export const reactionPostParamsSchema = z.object({
  id: z.string().uuid(),
});

export type ReactionPostParams = z.infer<typeof reactionPostParamsSchema>;

export const reactionPostBodySchema = z.object({
  reaction: z.string().emoji(),
});

export type ReactionPostRequestBody = z.infer<typeof reactionPostBodySchema>;

export const createReaction = ({
  id,
  body,
}: {
  id: ReactionPostParams['id'];
  body: ReactionPostRequestBody;
}) => {
  return $fetch(`/api/comments/${id}/reactions`, {
    method: 'post',
    headers: {
      'content-type': 'application/json',
    },
    body,
  });
};
