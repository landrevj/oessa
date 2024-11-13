// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  imports: {
    autoImport: false,
  },
  components: {
    dirs: [],
  },
  modules: [
    '@nuxt/fonts',
  ],
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
})
