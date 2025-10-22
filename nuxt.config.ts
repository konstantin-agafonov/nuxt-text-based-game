// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxtjs/tailwindcss',
    '@sidebase/nuxt-auth',
  ],

    tailwindcss: {
        exposeConfig: true,
        viewer: true,
        // and more...
    },

    components: [
        {
            path: '~/components',
            pathPrefix: false,
        },
    ],
})