// @ts-check
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Minden teszt előtt megnyitjuk a kezdőlapot
  await page.goto('https://playwright.dev/');
});

test('dokumentáció oldal navigációja', async ({ page }) => {
  // Megkeressük a 'Docs' hivatkozást a menüben és rákattintunk
  const docsLink = page.getByRole('link', { name: 'Docs' });
  await expect(docsLink).toBeVisible();
  await docsLink.click();

  // Ellenőrizzük az új URL-t és a főcímet
  await expect(page).toHaveURL(/.*docs\/intro/);
  await expect(page.getByRole('heading', { name: 'Installation', level: 1 })).toBeVisible();
});

test('keresés funkció működése', async ({ page }) => {
  // Megnyitjuk a keresőablakot
  await page.getByRole('button', { name: 'Search' }).click();

  // Beírjuk a keresett kifejezést
  const searchInput = page.getByPlaceholder('Search docs');
  await searchInput.fill('locators');

  // Kiválasztjuk az első releváns találatot
  const firstResult = page.getByRole('link', { name: 'Locators', exact: true }).first();
  await expect(firstResult).toBeVisible();
  await firstResult.click();

  // Ellenőrizzük, hogy a megfelelő oldalra navigált-e
  await expect(page).toHaveURL(/.*locators/);
});

test('sötét és világos téma váltása', async ({ page }) => {
  // Megkeressük a témaváltó gombot
  const themeToggle = page.getByRole('button', { name: /switch between dark and light mode/i });
  await expect(themeToggle).toBeVisible();

  // Rákattintunk a váltásra
  await themeToggle.click();

  // Ellenőrizzük, hogy a <html> elem 'data-theme' attribútuma megváltozott-e
  await expect(page.locator('html')).toHaveAttribute('data-theme', /dark|light/);
});