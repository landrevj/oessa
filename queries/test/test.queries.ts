import { queryOptions } from '@tanstack/vue-query';
import type { Todo } from './test.types';

export const fetchTodos = () =>
  queryOptions({
    queryKey: ['todos'],
    queryFn: () => $fetch<Todo[]>('https://jsonplaceholder.typicode.com/todos'),
  });
