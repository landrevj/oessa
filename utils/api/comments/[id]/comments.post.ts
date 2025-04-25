import { z } from 'zod';

export const commentPostParamsSchema = z.object({
  id: z.string().uuid(),
});

export type CommentPostParams = z.infer<typeof commentPostParamsSchema>;

export const commentPostBodySchema = z.object({
  title: z.string().optional(),
  message: z.string(),
});

export type CommentPostRequestBody = z.infer<typeof commentPostBodySchema>;

export const createComment = ({
  id,
  body,
}: {
  id: CommentPostParams['id'];
  body: CommentPostRequestBody;
}) => {
  return $fetch(`/api/comments/${id}/comments`, {
    method: 'post',
    headers: {
      'content-type': 'application/json',
    },
    body,
  });
};
