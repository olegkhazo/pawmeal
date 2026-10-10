const LOCALES = ['ka', 'ru', 'en'] as const
// Only genuinely indexable pages — quiz/thank-you are noindex (see their
// useSeoMeta calls) and intentionally left out here too.
const PATHS = ['', '/privacy'] as const

export default defineEventHandler((event) => {
  const siteUrl = useRuntimeConfig().public.siteUrl.replace(/\/$/, '')

  const urls = PATHS.map((path) => {
    const alternates = LOCALES.map(
      (loc) => `<xhtml:link rel="alternate" hreflang="${loc}" href="${siteUrl}/${loc}${path}" />`,
    ).join('')
    const defaultAlternate = `<xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/ka${path}" />`

    return LOCALES.map(
      (loc) =>
        `<url><loc>${siteUrl}/${loc}${path}</loc>${alternates}${defaultAlternate}</url>`,
    ).join('')
  }).join('')

  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`
})
