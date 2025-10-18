// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:8000',
    },
  },
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    name: 'Self-Referential Quiz Builder',
  },
  compatibilityDate: '2025-03-29',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    '@nuxtjs/device',
    '@nuxt/image',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
  ],
  app: {
    head: {
      title: 'Self-Referential Quiz Builder',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Create, customize, and solve self-referential quizzes.',
        },
        {
          name: 'keywords',
          content:
            'self-referential quiz, logic puzzle, quiz builder, AI evaluation, recursive thinking, meta-logic',
        },
        {
          name: 'robots',
          content: 'index, follow',
        },
        {
          name: 'og:title',
          content: 'Self-Referential Quiz Builder - Create Logic Puzzles',
        },
        {
          name: 'og:description',
          content: 'Create, customize, and solve self-referential quizzes.',
        },
        {
          name: 'og:type',
          content: 'website',
        },
        {
          name: 'og:url',
          content: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        },
        {
          name: 'og:image',
          content: '/images/self-referential-quiz-builder-dark.png',
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:title',
          content: 'Self-Referential Quiz Builder - Create Logic Puzzles',
        },
        {
          name: 'twitter:description',
          content: 'Create, customize, and solve self-referential quizzes.',
        },
        {
          name: 'twitter:image',
          content: '/images/self-referential-quiz-builder-dark.png',
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicon-16x16.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-32x32.png',
        },
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
        'mdi:white-balance-sunny',
        'material-symbols-light:dark-mode-rounded',
        'mdi:check',
        'mdi:close',
        'mdi:arrow-left',
        'mdi:arrow-right',
        'mdi:content-save',
        'mdi:content-copy',
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
