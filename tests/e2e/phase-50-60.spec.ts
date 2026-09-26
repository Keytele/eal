import { expect, test } from '@playwright/test';

test.describe('Phases 50–60 public gates', () => {
  test('renders news and legal templates with safe pending states', async ({ page }) => {
    await page.goto('/en/au/news', { waitUntil: 'networkidle' });
    await expect(page.locator('main#main-content h1')).toHaveText('News');
    await expect(page.getByText('News is not published for this market yet.')).toBeVisible();

    await page.goto('/en/au/legal/finance', { waitUntil: 'networkidle' });
    await expect(page.locator('main#main-content h1')).toHaveText('Legal');
    await expect(page.getByRole('status')).toContainText(
      'The current approved legal version is not published for this market.',
    );
  });

  test('searches the local cross-domain index and keeps inventory separate', async ({ page }) => {
    await page.goto('/en/au/search?q=dealer', { waitUntil: 'networkidle' });
    await expect(page.getByRole('link', { name: 'Retailers', exact: true })).toBeVisible();
    await expect(
      page.getByText('Live inventory is searched separately because it is operational data.'),
    ).toBeVisible();
  });

  test('preserves configurator step links and keeps save local to the browser', async ({
    page,
  }) => {
    await page.goto('/en/au/configure/s6?step=0', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Exterior' }).click();
    await expect(page).toHaveURL(/\/en\/au\/configure\/s6\?step=1$/);
    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.getByRole('button', { name: 'Exterior' })).toHaveAttribute(
      'aria-current',
      'step',
    );
    await page.getByRole('button', { name: 'Save build', exact: true }).click();
    await expect(
      page.getByText('Build saved in this browser for this local demonstration.'),
    ).toBeVisible();
  });

  test('serves health and security evidence endpoints', async ({ page, request }) => {
    const health = await request.get('/api/health');
    expect(health.ok()).toBe(true);
    const response = await page.goto('/en/au');
    expect(response).not.toBeNull();
    expect(response?.headers()['content-security-policy']).toBeTruthy();
    expect(response?.headers()['x-content-type-options']).toBe('nosniff');
  });
});
