import { test } from '@playwright/test';
import { LoginPage, ProductsPage, CartPage, CheckoutPage } from '../pages/index.js';

test('Complete purchase flow with env data', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await loginPage.goto();
  await loginPage.login(); // uses USERNAME/PASSWORD from .env

  await productsPage.addItemToCart('sauce-labs-backpack');
  await cartPage.openCart();
  await cartPage.assertItemInCart('Sauce Labs Backpack', '1');

  await checkoutPage.checkout(); // uses FIRST_NAME/LAST_NAME/ZIP_CODE from .env
  await checkoutPage.assertOrderSuccess();
});
