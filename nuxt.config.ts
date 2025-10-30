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
    '@pinia/nuxt',
    '@vue-final-modal/nuxt',
    'nuxt3-notifications',
    'nuxt-auth-sanctum',
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

    runtimeConfig: {
        public: {
            apiBase: 'http://localhost:8100',
        }
    },

    css: ['vue-final-modal/style.css'],

    // nuxt-auth-sanctum options (also configurable via environment variables)
    sanctum: {
        baseUrl: 'http://localhost:8100', // Laravel API
        redirect: {
            onLogin: '/games'
        },
        logLevel: 5,
    }
})
