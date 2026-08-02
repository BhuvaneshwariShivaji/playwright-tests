import { test, expect } from '@playwright/test';
import { LoginPage } from '../pageObjects/LoginPage';

test('LoginPage_wrongPassword_ShowsError', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto('/');
    await loginPage.fillUsername('standard_user');
    await loginPage.fillPassword('wrong_password');
    await loginPage.clickLoginButton();
})