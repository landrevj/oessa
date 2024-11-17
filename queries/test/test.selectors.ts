import { makeSelector } from '~/utils/queries';
import type { Todo } from './test.types';

export const getTodoStrings = makeSelector((data: Todo[]) =>
  data.map((todo) => `${todo.completed} - ${todo.title}`),
);
