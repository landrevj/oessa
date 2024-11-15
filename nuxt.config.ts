// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  imports: {
    autoImport: false,
  },
  components: {
    dirs: [],
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
  ],
  i18n: {
    // baseUrl: 'https://'
    vueI18n: './i18n/config.ts',
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        language: 'en-US',
      },
    ],
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui',
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
});
