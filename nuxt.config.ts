// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  components: {
    dirs: [],
  },
  devtools: { enabled: true },
  imports: {
    autoImport: false,
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxtjs/color-mode',
    [
      '@nuxtjs/i18n',
      {
        baseUrl: process.env.BASE_URL,
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
    ],
    '@nuxtjs/tailwindcss',
    ['@vee-validate/nuxt', { autoImports: false }],
    [
      'nuxt-security',
      {
        headers: {
          contentSecurityPolicy: {
            'img-src': ['self', 'data:', 'https://lh3.googleusercontent.com/'],
          },
        },
      },
    ],
    ['shadcn-nuxt', { prefix: '', componentDir: './components/ui' }],
    'unplugin-icons/nuxt',
  ],
});
