import type { InternalApi } from 'nitropack';
import { makeSelector } from '~/utils/queries';

export const readUsers = () => {
  return $fetch('/api/users');
};

export const isUser = (
  object: unknown,
): object is InternalApi['/api/users']['get'][number] => {
  return (
    typeof object === 'object' &&
    object !== null &&
    'id' in object &&
    'name' in object &&
    'image' in object
  );
};

export const getUserOptions = makeSelector(
  (users: InternalApi['/api/users']['get']) => {
    return users.map((user) => ({ value: user.id, label: user.name }));
  },
);
