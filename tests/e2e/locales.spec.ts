import { expect, test } from '@playwright/test'

test('root redirects to the default ka locale', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/ka$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'ka-GE')
})

test('ru and en routes render in their own language', async ({ page }) => {
  await page.goto('/ru')
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru-RU')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Питание')

  await page.goto('/en')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-US')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Food')
})

test('language switcher in the header moves between locales', async ({ page }) => {
  await page.goto('/ka')
  await page.getByRole('link', { name: 'Русский' }).click()
  await expect(page).toHaveURL(/\/ru$/)
})

test('unknown route under a locale shows the localized not-found page', async ({ page }) => {
  const response = await page.goto('/ru/does-not-exist')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})
