// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:8000',
    },
  },
  compatibilityDate: '2025-03-29',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    '@nuxtjs/device',
    '@nuxt/image',
  ],
  app: {
    head: {
      title: 'Self-Referential Quiz Builder',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Create, customize, and solve self-referential quizzes.',
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap',
        },
      ],
    },
  },

  icon: {
    clientBundle: {
      // list of icons to include in the client bundle
      icons: [
        'mdi:github',
        'mdi:white-balance-sunny',
        'material-symbols-light:dark-mode-rounded',
        'mdi:check',
        'mdi:close',
        'mdi:arrow-left',
        'mdi:arrow-right',
      ],
      scan: true,
    },
  },

  colorMode: {
    preference: 'dark', // default value of $colorMode.preference
    fallback: 'dark', // fallback value if not system preference found
    storage: 'localStorage', // or 'sessionStorage' or 'cookie'
    storageKey: 'nuxt-color-mode',
  },

  image: {
    quality: 90,
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
        },
      },
    },
  },
})
