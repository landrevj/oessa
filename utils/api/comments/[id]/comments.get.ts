import { z } from 'zod';

export const commentCommentsGetParamsSchema = z.object({
  id: z.string().uuid(),
});

export type CommentCommentsGetParams = z.infer<
  typeof commentCommentsGetParamsSchema
>;

export const readCommentComments = ({ id }: CommentCommentsGetParams) => {
  return $fetch(`/api/comments/${id}/comments`);
};
