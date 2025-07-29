// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: ["@nuxt/eslint", "@nuxt/image", "@nuxt/scripts", "@nuxt/test-utils", "@nuxt/ui"],
  app: {
    head: {
      title: "Nuxt Note Taker",
      meta: [{ name: "description", content: "A simple note-taking application built with Nuxt" }],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
  css: ["@/assets/css/main.css"],
});
