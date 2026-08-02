import { test } from '@playwright/test';

test('debuggingExample', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await page.pause();

});