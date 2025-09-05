import { test, expect } from '@playwright/test';

test('Feed shows latest news and search works (mocked)', async ({ page }) => {
  await page.route(/\/health$/, async (route) => {
    await route.fulfill({ json: { status: 'ok' } });
  });
  await page.route(/\/news(\?.*)?$/, async (route) => {
    await route.fulfill({ json: { data: { news: [ { id: '1', title: 'E2E First' } ] } } });
  });
  await page.route(/\/search(\?.*)?$/, async (route) => {
    await route.fulfill({ json: { data: { results: [ { id: '2', title: 'E2E Search Result' } ] } } });
  });

  await page.goto('/');
  await page.getByText('aInvestFeed').waitFor();
  await page.getByRole('link', { name: 'Feed' }).click();
  await page.getByPlaceholder('Search news...').fill('query');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.getByText('E2E Search Result')).toBeVisible();
});


