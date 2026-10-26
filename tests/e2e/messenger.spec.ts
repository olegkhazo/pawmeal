import { expect, test } from '@playwright/test'

test('the WhatsApp button, when configured, links to wa.me with a prefilled message', async ({ page }) => {
  // BUSINESS_WHATSAPP_NUMBER may be empty (.env.example) — then no button renders at all.
  await page.goto('/ru/thank-you?leadId=test-lead-123&channel=whatsapp')
  for (const link of await page.getByRole('link', { name: /WhatsApp/i }).all()) {
    expect(await link.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/\d+\?text=/)
  }
  await expect(page.getByText('Номер заявки: test-lead-123')).toBeVisible()
})

test('a "call" preferred channel shows the call note instead of a messenger promise', async ({ page }) => {
  await page.goto('/ru/thank-you?leadId=test-lead-456&channel=call')
  await expect(page.getByText('Свяжемся по указанному номеру.')).toBeVisible()
})

test('the thank-you page states the request is valid without a messenger click', async ({ page }) => {
  await page.goto('/en/thank-you?leadId=test-lead-789')
  await expect(page.getByText('Your request is saved whether or not you message us.')).toBeVisible()
})
