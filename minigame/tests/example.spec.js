// @ts-check
import { test, expect } from '@playwright/test';

// Segédfüggvény a felváltva történő kattintásokhoz (bal / jobb gomb)
async function play(squares, moves) {
  for (const [turn, squareIndex] of moves.entries()) {
    await squares.nth(squareIndex).click({
      button: turn % 2 === 1 ? 'right' : 'left',
    });
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('1. Ugyanaz a játékos nem léphet kétszer egymás után', async ({ page }) => {
  const squares = page.locator('.square');

  await squares.nth(0).click();
  await squares.nth(1).click();

  await expect(squares.nth(0)).toHaveText('X');
  await expect(squares.nth(1)).toHaveText('');
});

test('2. Egy játékos nem írhatja felül a már elfoglalt mezőt', async ({ page }) => {
  const squares = page.locator('.square');

  await squares.nth(0).click();
  await squares.nth(0).click({ button: 'right' });

  await expect(squares.nth(0)).toHaveText('X');
});

test('3. X nyer, és a további lépéseket figyelmen kívül hagyja a játék', async ({ page }) => {
  const squares = page.locator('.square');

  await play(squares, [0, 3, 1, 4, 2]);

  await expect(page.getByText('Game over! X won')).toBeVisible();
  await squares.nth(5).click({ button: 'right' });
  await expect(squares.nth(5)).toHaveText('');
  await expect(page.getByText('Game over! X won')).toBeVisible();
});

test('4. Teli tábla győztes sor nélkül döntetlen', async ({ page }) => {
  const squares = page.locator('.square');

  await play(squares, [0, 1, 2, 4, 3, 5, 7, 6, 8]);

  await expect(page.getByText('Draw! No winner')).toBeVisible();
});

test('5. A Reset gomb törli az összes mezőt egy befejezett játék után', async ({ page }) => {
  const squares = page.locator('.square');

  await play(squares, [0, 3, 1, 4, 2]);
  await page.getByRole('button', { name: 'Reset' }).click();

  await expect(squares).toHaveText(Array(9).fill(''));
});

test('6. Az utolsó lépés kiemelése átkerül a legújabb mezőre', async ({ page }) => {
  const squares = page.locator('.square');

  await squares.nth(0).click();
  await expect(squares.nth(0)).toHaveClass(/lastcell/);

  await squares.nth(3).click({ button: 'right' });
  await expect(squares.nth(0)).not.toHaveClass(/lastcell/);
  await expect(squares.nth(3)).toHaveClass(/lastcell/);
});