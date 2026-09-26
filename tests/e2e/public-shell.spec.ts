import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('localized public shell', () => {
  test('renders the localized market experience @smoke', async ({ page }) => {
    await page.goto('/en/au', { waitUntil: 'networkidle' });

    await expect(page).toHaveURL(/\/en\/au$/);
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main#main-content')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('has no automated accessibility violations @a11y', async ({ page }) => {
    await page.goto('/en/au', { waitUntil: 'networkidle' });

    const accessibilityResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityResults.violations).toEqual([]);
  });

  test('preserves independent locale and market selection', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Simplified Chinese' }).click();
    await page.getByRole('button', { name: '中国' }).click();
    await page.getByRole('button', { name: '继续' }).click();

    await expect(page).toHaveURL(/\/zh-Hans\/cn$/);
    await expect(page.locator('main#main-content')).toBeVisible();
  });

  test('renders discovery and commerce routes with useful primary headings', async ({ page }) => {
    for (const path of [
      '/en/au/vehicles',
      '/en/au/compare?models=c2,s6',
      '/en/au/technology/800v-architecture',
      '/en/au/configure/s6',
      '/en/au/inventory',
    ]) {
      await page.goto(path, { waitUntil: 'networkidle' });
      await expect(page.locator('main#main-content h1').first()).toBeVisible();
    }
  });

  test('keeps mobile navigation and configurator steps keyboard addressable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/en/au');
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toHaveCount(0);

    await page.goto('/en/au/configure/s6');
    await page.getByRole('button', { name: 'Exterior' }).click();
    await expect(page.getByRole('button', { name: 'Exterior' })).toHaveAttribute(
      'aria-current',
      'step',
    );
  });
});
