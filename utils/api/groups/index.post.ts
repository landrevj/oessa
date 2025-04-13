import { z } from 'zod';

export const groupsPostBodySchema = z.object({
  name: z.string().min(1),
  image: z.string().url().optional(),
  users: z.array(
    z.object({
      id: z.string(),
      name: z.string().optional(),
      image: z.string().nullable().optional(),
    }),
  ),
});

export type GroupsPostRequestBody = z.infer<typeof groupsPostBodySchema>;

export const createGroup = ({ body }: { body: GroupsPostRequestBody }) => {
  return $fetch('/api/groups', {
    method: 'post',
    headers: {
      'content-type': 'application/json',
    },
    body,
  });
};
