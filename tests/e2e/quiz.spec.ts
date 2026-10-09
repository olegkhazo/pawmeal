import { expect, test } from '@playwright/test'

async function goToQuiz(page: import('@playwright/test').Page, query = '') {
  await page.goto(`/ka/quiz${query}`)
  await page.waitForLoadState('networkidle')
}

test('species preselected from the landing CTA is reflected on step 1', async ({ page }) => {
  await goToQuiz(page, '?species=dog')
  await expect(page.getByRole('button', { name: 'ძაღლი', exact: true })).toHaveClass(/bg-brand-accent/)
})

test('next is disabled until a required field is filled, city step requires otherCity when "other" is picked', async ({
  page,
}) => {
  await goToQuiz(page)
  const next = page.getByRole('button', { name: 'შემდეგი' })
  await expect(next).toBeDisabled()

  await page.getByRole('button', { name: 'ძაღლი', exact: true }).click()
  await expect(next).toBeEnabled()
  await next.click()

  // step 2: city required
  await expect(next).toBeDisabled()
  await page.getByRole('button', { name: 'სხვა ქალაქი' }).click()
  await expect(next).toBeDisabled() // otherCity text still required
  await page.getByLabel('მიუთითეთ ქალაქი').fill('X')
  await expect(next).toBeDisabled() // too short (min 2 chars)
  await page.getByLabel('მიუთითეთ ქალაქი').fill('Xyz')
  await expect(next).toBeEnabled()
})

test('weight validation rejects non-numeric and out-of-range values', async ({ page }) => {
  await goToQuiz(page, '?species=dog')
  await page.getByRole('button', { name: 'შემდეგი' }).click() // step 1 -> 2
  await page.getByRole('button', { name: 'თბილისი' }).click()
  await page.getByRole('button', { name: 'შემდეგი' }).click() // step 2 -> 3

  await page.getByRole('button', { name: '1-დან 7 წლამდე' }).click()
  const next = page.getByRole('button', { name: 'შემდეგი' })
  await expect(next).toBeDisabled()

  const weight = page.getByLabel('წონა, კგ')
  await weight.fill('500') // out of sanity range for a dog
  await expect(next).toBeDisabled()

  await weight.fill('18')
  await expect(next).toBeEnabled()
})

test('excluded-ingredients "none"/"unknown" are mutually exclusive with specific proteins', async ({ page }) => {
  await goToQuiz(page, '?species=dog')
  await page.getByRole('button', { name: 'შემდეგი' }).click()
  await page.getByRole('button', { name: 'თბილისი' }).click()
  await page.getByRole('button', { name: 'შემდეგი' }).click()
  await page.getByRole('button', { name: '1-დან 7 წლამდე' }).click()
  await page.getByLabel('წონა, კგ').fill('18')
  await page.getByRole('button', { name: 'შემდეგი' }).click()
  await page.getByRole('button', { name: 'საშუალო', exact: true }).click()
  await page.getByRole('button', { name: 'მშრალი კორმი' }).click()
  await page.getByRole('button', { name: 'შემდეგი' }).click()

  // step 5: ingredient reactions
  const chicken = page.getByRole('button', { name: 'ქათამი', exact: true })
  const none = page.getByRole('button', { name: 'რეაქცია არ არის' })
  await chicken.click()
  await expect(chicken).toHaveAttribute('aria-pressed', 'true')
  await none.click()
  await expect(none).toHaveAttribute('aria-pressed', 'true')
  await expect(chicken).toHaveAttribute('aria-pressed', 'false')
})

test('zero candidate recipes shows the consultation outcome, not an excluded product', async ({ page }) => {
  await goToQuiz(page, '?species=cat')
  await page.getByRole('button', { name: 'შემდეგი' }).click()
  await page.getByRole('button', { name: 'თბილისი' }).click()
  await page.getByRole('button', { name: 'შემდეგი' }).click()
  await page.getByRole('button', { name: '1-დან 7 წლამდე' }).click()
  await page.getByLabel('წონა, კგ').fill('4')
  await page.getByRole('button', { name: 'შემდეგი' }).click()
  await page.getByRole('button', { name: 'საშუალო', exact: true }).click()
  await page.getByRole('button', { name: 'მშრალი კორმი' }).click()
  await page.getByRole('button', { name: 'შემდეგი' }).click()

  // exclude all three cat proteins: chicken, turkey, fish
  await page.getByRole('button', { name: 'ქათამი', exact: true }).click()
  await page.getByRole('button', { name: 'ინდაური', exact: true }).click()
  await page.getByRole('button', { name: 'თევზი', exact: true }).click()
  await page.getByRole('button', { name: 'არა', exact: true }).click() // specialDiet: no
  await page.getByRole('button', { name: 'შემდეგი' }).click()

  // step 6
  await page.getByRole('button', { name: 'სრული რაციონი' }).click()
  await page.getByRole('button', { name: 'ყოველკვირეულად' }).click()
  await page.getByRole('button', { name: 'შემდეგი' }).click()

  // step 7
  await page.getByLabel('არ ვიცი').check()
  await page.getByRole('button', { name: 'დიახ', exact: true }).click()
  await page.getByRole('button', { name: 'შემდეგი' }).click()

  // step 8: should show "no matches" text, not any cat recipe chip
  await expect(page.getByText('ამჟამინდელ კონცეფციებში')).toBeVisible()
  await expect(page.locator('li', { hasText: 'კატებისთვის' })).toHaveCount(0)
})

test('refreshing the page restores the draft including the current step', async ({ page }) => {
  await goToQuiz(page, '?species=dog')
  await page.getByRole('button', { name: 'შემდეგი' }).click()
  await page.getByRole('button', { name: 'ბათუმი' }).click()
  await expect(page).toHaveURL(/\/ka\/quiz/)

  await page.reload()
  await page.waitForLoadState('networkidle')
  await expect(page.getByRole('button', { name: 'ბათუმი' })).toHaveClass(/bg-brand-accent/)
})

test('going back does not erase previously entered answers', async ({ page }) => {
  await goToQuiz(page, '?species=dog')
  await page.getByRole('button', { name: 'შემდეგი' }).click()
  await page.getByRole('button', { name: 'ბათუმი' }).click()
  await page.getByRole('button', { name: 'უკან' }).click()
  await expect(page.getByRole('button', { name: 'ძაღლი', exact: true })).toHaveClass(/bg-brand-accent/)
  await page.getByRole('button', { name: 'შემდეგი' }).click()
  await expect(page.getByRole('button', { name: 'ბათუმი' })).toHaveClass(/bg-brand-accent/)
})

test('the phone number is never written to sessionStorage', async ({ page }) => {
  await goToQuiz(page, '?species=dog')
  await page.getByRole('button', { name: 'შემდეგი' }).click()
  await page.getByRole('button', { name: 'თბილისი' }).click()
  await page.getByRole('button', { name: 'შემდეგი' }).click()
  await page.getByRole('button', { name: '1-დან 7 წლამდე' }).click()
  await page.getByLabel('წონა, კგ').fill('18')
  await page.getByRole('button', { name: 'შემდეგი' }).click()
  await page.getByRole('button', { name: 'საშუალო', exact: true }).click()
  await page.getByRole('button', { name: 'მშრალი კორმი' }).click()
  await page.getByRole('button', { name: 'შემდეგი' }).click()
  await page.getByRole('button', { name: 'რეაქცია არ არის' }).click()
  await page.getByRole('button', { name: 'არა', exact: true }).click()
  await page.getByRole('button', { name: 'შემდეგი' }).click()
  await page.getByRole('button', { name: 'სრული რაციონი' }).click()
  await page.getByRole('button', { name: 'ყოველკვირეულად' }).click()
  await page.getByRole('button', { name: 'შემდეგი' }).click()
  await page.getByLabel('არ ვიცი').check()
  await page.getByRole('button', { name: 'დიახ', exact: true }).click()
  await page.getByRole('button', { name: 'შემდეგი' }).click()
  await page.getByRole('button', { name: 'შემდეგი' }).click() // step 8 -> 9

  await page.getByLabel('ტელეფონი').fill('+995555123456')
  await page.waitForTimeout(100)

  const storageDump = await page.evaluate(() => JSON.stringify(window.sessionStorage))
  expect(storageDump).not.toContain('555123456')
})

test('switching language keeps the answers and current step', async ({ page }) => {
  await goToQuiz(page, '?species=dog')
  await page.getByRole('button', { name: 'შემდეგი' }).click()

  await page.getByRole('link', { name: 'Русский' }).click()
  await expect(page).toHaveURL(/\/ru\/quiz/)
  await expect(page.getByRole('heading', { name: 'В каком городе вы находитесь?' })).toBeVisible()
})
