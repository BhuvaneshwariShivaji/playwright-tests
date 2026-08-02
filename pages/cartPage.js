import { expect } from '@playwright/test';

export class CartPage {
  constructor(page) {
    this.page = page;
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartItemName = page.locator('[data-test="inventory-item-name"]');
    this.cartItemQuantity = page.locator('[data-test="item-quantity"]');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  async addItemToCart(itemId) {
    // itemId example: 'sauce-labs-backpack'
    await this.page.click(`[data-test="add-to-cart-${itemId}"]`);
  }

  async removeItemFromCart(itemId) {
    // itemId example: 'sauce-labs-backpack'
    await this.page.click(`[data-test="remove-${itemId}"]`);
  }

  async openCart() {
    await this.cartLink.click();
  }

  async assertItemInCart(expectedName, expectedQty) {
    await expect(this.cartItemName).toHaveText(expectedName);
    await expect(this.cartItemQuantity).toHaveText(expectedQty);
  }

  async assertCartCount(expectedCount) {
    await expect(this.cartBadge).toHaveText(expectedCount);
  }
}


