import { expect, test } from '@playwright/test'

test('messenger buttons are hidden when business contacts are not configured', async ({ page }) => {
  // .env.example / this dev server leaves BUSINESS_WHATSAPP_NUMBER and
  // BUSINESS_TELEGRAM_USERNAME empty, so MessengerButtons must render nothing.
  await page.goto('/ru/thank-you?leadId=test-lead-123&channel=whatsapp')
  await expect(page.getByRole('link', { name: /WhatsApp/i })).toHaveCount(0)
  await expect(page.getByRole('link', { name: /Telegram/i })).toHaveCount(0)
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
