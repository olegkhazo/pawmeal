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
    // Windows-only production-build workaround: Nitro's own bundle bootstrap
    // sets a fallback `globalThis._importMeta_ = { url: "file:///_entry.js" }`
    // for chunks that don't get a real per-chunk import.meta.url. The
    // Prisma-generated client calls `fileURLToPath(globalThis._importMeta_.url)`
    // at module-load time to resolve its own __dirname — and "file:///_entry.js"
    // has no drive letter, so Node's Windows file-URL parser throws
    // ERR_INVALID_FILE_URL_PATH, crashing the server before it can even start.
    // This only reproduces on Windows (Node's POSIX file-URL parser accepts a
    // driveless path fine); a Linux/production deploy is not expected to hit
    // it. The banner runs before Nitro's own fallback assignment and sets a
    // real, drive-lettered absolute path first, so Nitro's `||` default never
    // overwrites it. Remove once upstream fixes the per-chunk shim on Windows.
    rollupConfig: {
      output: {
        banner: `globalThis._importMeta_ = { url: 'file:///' + process.cwd().replace(/\\\\/g, '/') + '/_entry.js', env: process.env };`,
      },
    },
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
    // Dev only: lets a Cloudflare quick tunnel (*.trycloudflare.com) reach `nuxt dev`.
    server: { allowedHosts: ['.trycloudflare.com'] },
  },

  fonts: {
    families: [
      { name: 'Noto Sans Georgian', provider: 'google', weights: [400, 500, 600, 700] },
      { name: 'Noto Sans', provider: 'google', weights: [400, 500, 600, 700] },
      // Bold editorial serif for the "PawMeal" wordmark only — a free
      // equivalent in spirit to the premium condensed serif used in
      // differentdog.com's headlines (their actual logo is a drawn SVG
      // mark, not styled text, so there's nothing to copy there; see
      // docs/image-prompts.md for the brief research note).
      // Also the heading face since the foodforjoe-style redesign.
      { name: 'Fraunces', provider: 'google', weights: [500, 600, 700] },
      // Georgian glyph fallback for Fraunces headings.
      { name: 'Noto Serif Georgian', provider: 'google', weights: [500, 600, 700] },
      // Hand-written accent lines (Latin + Cyrillic).
      { name: 'Caveat', provider: 'google', weights: [500, 700] },
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
    // Server-only: an operational switch, not something to leak to the client
    // bundle ahead of the server-authoritative price logic (Stage 11).
    priceTestEnabled: process.env.PRICE_TEST_ENABLED === 'true',
    public: {
      // These are published contact points by design (messenger links, privacy
      // page deletion contact) — not secrets, so they are safe in runtimeConfig.public.
      brandName: process.env.BRAND_NAME || 'PawMeal',
      siteUrl: process.env.PUBLIC_SITE_URL || 'http://localhost:3000',
      businessWhatsappNumber: process.env.BUSINESS_WHATSAPP_NUMBER || '',
      businessTelegramUsername: process.env.BUSINESS_TELEGRAM_USERNAME || '',
      operatorContactEmail: process.env.OPERATOR_CONTACT_EMAIL || '',
      analyticsProvider: process.env.ANALYTICS_PROVIDER || 'none',
      // Shown on the privacy page so the stated retention period always
      // matches what scripts/purge-expired-leads.ts actually enforces.
      dataRetentionDays: process.env.DATA_RETENTION_DAYS || '90',
    },
  },
})
