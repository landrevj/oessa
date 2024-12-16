import { defineEventHandler, toWebRequest } from '#imports';
import { auth } from '~/lib/auth';

export default defineEventHandler((event) => {
  return auth.handler(toWebRequest(event));
});