import { z } from 'zod';

export const threadPostParamsSchema = z.object({
  id: z.string().uuid(),
});

export type ThreadPostParams = z.infer<typeof threadPostParamsSchema>;

export const threadPostBodySchema = z.object({
  title: z.string().optional(),
  message: z.string(),
});

export type ThreadPostRequestBody = z.infer<typeof threadPostBodySchema>;

export const createThread = ({
  id,
  body,
}: {
  id: ThreadPostParams['id'];
  body: ThreadPostRequestBody;
}) => {
  return $fetch(`/api/commentables/${id}/threads`, {
    method: 'post',
    headers: {
      'content-type': 'application/json',
    },
    body,
  });
};
