import { defineI18nConfig } from '#imports';
import en from './locales/en';

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en },
}));
