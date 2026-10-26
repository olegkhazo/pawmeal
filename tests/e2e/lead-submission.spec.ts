import { expect, test } from '@playwright/test'

test('visiting /thank-you directly without a lead reference does not claim success', async ({ page }) => {
  await page.goto('/ru/thank-you')
  await expect(page.getByText('Эта страница открывается только после отправки анкеты.')).toBeVisible()
})
