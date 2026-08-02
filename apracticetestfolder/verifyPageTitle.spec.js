//navigation+assertion
import { test, expect } from '@playwright/test';

//test('testname',async({page})=>{});

test('verify page title', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);

});
