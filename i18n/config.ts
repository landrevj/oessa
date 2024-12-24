import { defineI18nConfig } from '#imports';
import en from './langs/en';

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  messages: { en },
}));
