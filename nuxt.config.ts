// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-12-12',

  future: {
    compatibilityVersion: 4,
  },
  
  devtools: { enabled: false },

  // Modules
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],

  // Global CSS
  css: ['~/assets/css/main.css'],

  // Runtime configuration
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'https://api-wizniche-demo.mirrorlog.com/api/v1'
    }
  },

  // App metadata
  app: {
    head: {
      title: 'WIZniche Job Costing Analyzer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Profit margin calculator for Radon mitigation service businesses'
        }
      ]
    }
  },

  // TypeScript configuration
  typescript: {
    strict: true
  }
})
