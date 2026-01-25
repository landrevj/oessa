import { z } from 'zod';

export const commentGetParamsSchema = z.object({
  id: z.string().uuid(),
});

export type CommentGetParams = z.infer<typeof commentGetParamsSchema>;

export const readComment = ({ id }: CommentGetParams) => {
  return $fetch(`/api/comments/${id}`);
};
