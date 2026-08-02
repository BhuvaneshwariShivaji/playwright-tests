import { test, expect } from '@playwright/test';

test('LoginPage_InvalidPassword_ShowsError', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login');

    // Enter valid username but wrong password
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('wrongPassword');
    await page.locator('button[type="submit"]').click();

    // ❌ This will fail because the expected text is intentionally wrong
    await expect(page.locator('#flash')).toContainText('Login successful!');
});



