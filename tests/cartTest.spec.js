import { test } from '@playwright/test';
import { LoginPage } from '../pages/loginPage.js';
import { CartPage } from '../pages/cartPage.js';

test('LoginPage_validCreds_LoginSuccess_addtocart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cartPage = new CartPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await cartPage.addItemToCart('sauce-labs-backpack');
    await cartPage.openCart();
    await cartPage.assertItemInCart('Sauce Labs Backpack', '1');
    
});
