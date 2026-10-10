import { expect, test } from '@playwright/test'

// These exercise the real POST /api/leads route against whatever database the
// test server is configured with. In this project's dev environment the DB is
// currently unreachable, which lets us genuinely verify the "API/DB error"
// acceptance scenario (.cursorrules.txt section 16, #6): a clear error, a
// retry path, and no success/redirect — rather than mocking it.

async function fillQuizThroughStep9(page: import('@playwright/test').Page) {
  await page.goto('/ka/quiz?species=dog')
  await page.waitForLoadState('networkidle')
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
  await page.getByRole('radio', { name: 'WhatsApp' }).check()
  await page.getByLabel(/განაცხადის დამუშავებას/).check()
}

test('a DB/API failure on submit shows a clear error and never redirects to thank-you', async ({ page }) => {
  await fillQuizThroughStep9(page)

  const submit = page.getByRole('button', { name: 'განაცხადის დატოვება გამოწერაზე' })
  await expect(submit).toBeEnabled()
  await submit.click()

  // Button disables while the request is in flight.
  await expect(page.getByRole('button', { name: 'ვაგზავნით...' })).toBeDisabled()

  // On failure: a visible error, no redirect, and the submit button comes back.
  await expect(page.getByRole('alert')).toBeVisible({ timeout: 15_000 })
  await expect(page).toHaveURL(/\/ka\/quiz/)
  await expect(submit).toBeEnabled()
})

test('retrying after a failed submit does not navigate away either', async ({ page }) => {
  await fillQuizThroughStep9(page)

  const submit = page.getByRole('button', { name: 'განაცხადის დატოვება გამოწერაზე' })
  await submit.click()
  await expect(page.getByRole('alert')).toBeVisible({ timeout: 15_000 })

  await submit.click()
  await expect(page.getByRole('alert')).toBeVisible({ timeout: 15_000 })
  await expect(page).toHaveURL(/\/ka\/quiz/)
})

test('visiting /thank-you directly without a lead reference does not claim success', async ({ page }) => {
  await page.goto('/ru/thank-you')
  await expect(page.getByText('Эта страница открывается только после отправки анкеты.')).toBeVisible()
})
