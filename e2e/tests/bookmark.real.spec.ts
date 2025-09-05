import { test, expect } from '@playwright/test';

test('Bookmark flow (real backend)', async ({ page }) => {
  const backendBaseUrl = process.env.API_BASE_URL || 'http://localhost:3002';

  // seed a news item via node fetch
  const res = await fetch(`${backendBaseUrl}/__seed/news`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ title: 'E2E Real Item', market: 'stocks' })
  });
  expect(res.ok).toBeTruthy();

  // set token directly to simulate authenticated user
  await page.addInitScript(() => localStorage.setItem('ainvestfeed:accessToken', 'token'));

  // Bridge preview origin to backend for API calls
  const forward = async (route: any) => {
    const req = route.request();
    const u = new URL(req.url());
    const backendUrl = `${backendBaseUrl}${u.pathname}${u.search}`;
    const headers = req.headers();
    const filtered: Record<string, string> = {};
    if (headers['authorization']) filtered['authorization'] = headers['authorization'];
    if (headers['content-type']) filtered['content-type'] = headers['content-type'];
    const resp = await fetch(backendUrl, { method: req.method(), headers: filtered, body: req.postData() as any });
    const text = await resp.text();
    await route.fulfill({ status: resp.status, body: text, headers: { 'content-type': resp.headers.get('content-type') || 'application/json' } });
  };
  await page.route('**/news?**', forward);
  await page.route('**/news/*', forward);
  await page.route('**/user/*', forward);
  await page.route('**/search?**', forward);

  await page.goto('/feed');
  await page.getByRole('button', { name: 'Apply' }).click();
  const btn = page.locator('[data-testid^="bm-"]').first();
  await btn.first().waitFor();
  const before = await btn.textContent();
  await btn.click();
  const after = await btn.textContent();
  expect(before).not.toBe(after);
});


