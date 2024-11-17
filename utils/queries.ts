import { toValue, type MaybeRefOrGetter } from 'vue';

export const makeSelector =
  <T, R>(selector: (data: T) => R) =>
  (data: MaybeRefOrGetter<T>) =>
    selector(toValue(data));
