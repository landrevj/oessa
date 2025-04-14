import { z } from 'zod';

export const groupsPatchParamsSchema = z.object({
  id: z.string().uuid(),
});

export type GroupsPatchParams = z.infer<typeof groupsPatchParamsSchema>;

export const groupsPatchBodySchema = z
  .object({
    name: z.string().min(1),
    image: z.string().url().nullable(),
    users: z.array(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        image: z.string().nullable().optional(),
      }),
    ),
  })
  .partial();

export type GroupsPatchRequestBody = z.infer<typeof groupsPatchBodySchema>;

export const updateGroup = ({
  id,
  body,
}: {
  id: GroupsPatchParams['id'];
  body: GroupsPatchRequestBody;
}) => {
  return $fetch(`/api/groups/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });
};
