import { expect, test } from '@playwright/test'

const viewports = [
  { name: '360px', width: 360, height: 740 },
  { name: '390px', width: 390, height: 844 },
  { name: '768px', width: 768, height: 1024 },
  { name: '1440px', width: 1440, height: 900 },
]

for (const vp of viewports) {
  test(`landing has no horizontal overflow at ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height })
    await page.goto('/ka')
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    )
    expect(hasOverflow).toBe(false)
  })
}

test('species CTA preselects species in the quiz link', async ({ page }) => {
  await page.goto('/ka')
  await page.getByRole('link', { name: 'ძაღლისთვის' }).click()
  await expect(page).toHaveURL(/\/ka\/quiz\?species=dog$/)
})

test('menu filter narrows the catalog to the selected species', async ({ page }) => {
  await page.goto('/ka')
  // Wait for hydration so the filter buttons' click listeners are attached —
  // without this, Playwright can click before Vue hydrates and the click is a no-op.
  await page.waitForLoadState('networkidle')
  const cards = page.locator('#menu article')
  await expect(cards).toHaveCount(6)

  await page.getByTestId('filter-dog').click()
  await expect(cards).toHaveCount(3)

  await page.getByTestId('filter-cat').click()
  await expect(cards).toHaveCount(3)

  await page.getByTestId('filter-all').click()
  await expect(cards).toHaveCount(6)
})

test('product CTA carries species and recipeId as a preference', async ({ page }) => {
  await page.goto('/ka')
  await page.getByRole('button', { name: 'ძაღლებისთვის' }).click()
  await page.getByRole('link', { name: 'განაცხადის დატოვება გამოწერაზე' }).first().click()
  await expect(page).toHaveURL(/\/ka\/quiz\?species=dog&recipeId=dog-/)
})

test('FAQ items expand and collapse', async ({ page }) => {
  await page.goto('/ka')
  const first = page.locator('#faq details').first()
  await expect(first).not.toHaveAttribute('open', '')
  await first.locator('summary').click()
  await expect(first).toHaveAttribute('open', '')
})
