import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage.js';

test('LoginPage_wrongPassword_ShowsError', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.fillUsername('standard_user');
    await loginPage.fillPassword('wrong_password');
    await loginPage.clickLoginButton();
    await expect(loginPage.errorMessage).toBeVisible();
})