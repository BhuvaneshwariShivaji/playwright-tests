import { test, expect } from '@playwright/test';

test('Dropdown Handling', async ({page}) => {
    await page.goto('https://the-internet.herokuapp.com/dropdown');
    const dropdown = page.locator('#dropdown');
    await dropdown.selectOption('1');
    await expect(dropdown).toContainText('1');
    await expect(dropdown).toHaveValue('1');
});