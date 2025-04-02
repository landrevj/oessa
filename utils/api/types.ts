import type { EventHandler, EventHandlerRequest } from 'h3';

export type ExtractHandlerResponseBody<T> =
  T extends EventHandler<EventHandlerRequest, infer U> ? Awaited<U> : never;
