export default defineEventHandler((event) => {
  const siteUrl = useRuntimeConfig().public.siteUrl
  setResponseHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return `User-Agent: *\nDisallow:\n\nSitemap: ${siteUrl}/sitemap.xml\n`
})
