import { expect, test } from '@playwright/test';

test('app boots and renders a canvas', async ({ page }) => {
  await page.goto('/');
  const canvas = page.locator('#game canvas');
  await expect(canvas).toBeVisible({ timeout: 10_000 });

  const size = await canvas.boundingBox();
  expect(size?.width).toBeGreaterThan(0);
  expect(size?.height).toBeGreaterThan(0);
});
