import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  modules: ['@nuxtjs/i18n', '@nuxt/fonts', '@nuxt/eslint'],

  // Workaround for https://github.com/nuxt/nuxt/issues/36467 — on Windows, Nuxt 4.6.0's
  // SSR renderer fails with "Either manifest or precomputed data must be provided"
  // because Nitro's externals matcher doesn't normalize backslash paths. Bundling the
  // renderer instead of leaving it external avoids the broken path match. Remove once
  // upstream ships a fix.
  nitro: {
    externals: { inline: [/[\\/]node_modules[\\/]nuxt[\\/]dist[\\/]/] },
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  fonts: {
    families: [
      { name: 'Noto Sans Georgian', provider: 'google', weights: [400, 500, 600, 700] },
      { name: 'Noto Sans', provider: 'google', weights: [400, 500, 600, 700] },
    ],
  },

  routeRules: {
    '/': { redirect: { to: '/ka', statusCode: 302 } },
  },

  i18n: {
    restructureDir: '.',
    langDir: 'locales',
    locales: [
      { code: 'ka', language: 'ka-GE', name: 'ქართული', file: 'ka.json' },
      { code: 'ru', language: 'ru-RU', name: 'Русский', file: 'ru.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
    defaultLocale: 'ka',
    strategy: 'prefix',
    detectBrowserLanguage: false,
    baseUrl: process.env.PUBLIC_SITE_URL || 'http://localhost:3000',
  },

  runtimeConfig: {
    // Server-only: operational config, never sent to the client bundle.
    dataRetentionDays: process.env.DATA_RETENTION_DAYS || '90',
    priceTestEnabled: process.env.PRICE_TEST_ENABLED === 'true',
    public: {
      // These are published contact points by design (messenger links, privacy
      // page deletion contact) — not secrets, so they are safe in runtimeConfig.public.
      brandName: process.env.BRAND_NAME || 'PawMeal Georgia',
      siteUrl: process.env.PUBLIC_SITE_URL || 'http://localhost:3000',
      businessWhatsappNumber: process.env.BUSINESS_WHATSAPP_NUMBER || '',
      businessTelegramUsername: process.env.BUSINESS_TELEGRAM_USERNAME || '',
      operatorContactEmail: process.env.OPERATOR_CONTACT_EMAIL || '',
      analyticsProvider: process.env.ANALYTICS_PROVIDER || 'none',
    },
  },
})
