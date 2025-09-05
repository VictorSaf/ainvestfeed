import { test, expect } from '@playwright/test';

test('Login stores access token (mocked)', async ({ page }) => {
  await page.route(/\/health$/, async (route) => {
    await route.fulfill({ json: { status: 'ok' } });
  });
  await page.route(/\/auth\/login$/, async (route) => {
    await route.fulfill({ json: { data: { tokens: { accessToken: 'token', refreshToken: 'rt' } } } });
  });

  await page.goto('/');
  await page.getByText('aInvestFeed').waitFor();
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByTestId('email').fill('user@example.com');
  await page.getByTestId('password').fill('Password123!');
  await page.getByTestId('login-btn').click();
  await page.waitForFunction(() => !!localStorage.getItem('ainvestfeed:accessToken'));
  const token = await page.evaluate(() => localStorage.getItem('ainvestfeed:accessToken'));
  expect(token).toBe('token');
});


