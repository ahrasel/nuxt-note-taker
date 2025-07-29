// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@nuxtjs/i18n",
    "@vite-pwa/nuxt",
    "nuxt-typed-router",
  ],
  app: {
    head: {
      title: "Nuxt Note Taker",
      meta: [{ name: "description", content: "A simple note-taking application built with Nuxt" }],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
  css: ["@/assets/css/main.css"],
  i18n: {
    locales: [
      { code: "en", name: "English", file: "en.json" },
      { code: "bn", name: "Bengali", file: "bn.json" },
    ],
    defaultLocale: "en",
    langDir: "locales/",
    vueI18n: "./vue-i18n.options.ts",
  },
  pwa: {
    manifest: {
      name: "Nuxt Note Taker",
      short_name: "Note Taker",
      description: "A simple note-taking application built with Nuxt",
      theme_color: "#ffffff",
      icons: [
        { src: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
      ],
    },
    workbox: {
      runtimeCaching: [
        {
          urlPattern: "https://api.example.com/.*",
          handler: "NetworkFirst",
          method: "GET",
          options: {
            cacheName: "api-cache",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24, // 1 day
            },
          },
        },
      ],
    },
  },
});
