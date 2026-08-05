import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage.js';
import dotenv from 'dotenv';

dotenv.config();

test('LoginPage1', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login();
   
})