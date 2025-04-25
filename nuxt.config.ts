import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
  components: {
    dirs: [],
  },
  devtools: { enabled: true },
  imports: {
    autoImport: false,
  },
  // nitro: {
  //   imports: {
  //     autoImport: false,
  //   },
  // },
  typescript: {
    strict: true,
    typeCheck: true,
  },
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    // '@nuxtjs/tailwindcss',
    '@vee-validate/nuxt',
    'nuxt-security',
    // 'shadcn-nuxt',
    'unplugin-icons/nuxt',
  ],
  colorMode: {
    classSuffix: '',
  },
  i18n: {
    bundle: {
      optimizeTranslationDirective: false,
    },
    baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        language: 'en-US',
      },
    ],
    experimental: {
      typedOptionsAndMessages: 'default',
    },
  },
  security: {
    headers: {
      contentSecurityPolicy: {
        'img-src': ["'self'", 'data:', 'https://lh3.googleusercontent.com/'],
      },
    },
  },
  // shadcn: {
  //   prefix: '',
  //   componentDir: './components/ui',
  // },
  veeValidate: {
    autoImports: false,
  },
});
