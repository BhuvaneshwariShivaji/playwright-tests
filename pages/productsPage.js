import { expect } from '@playwright/test';

export class ProductsPage {
  constructor(page) {
    this.page = page;
    this.inventoryItems = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product_sort_container"]');
  }

  async addItemToCart(itemId) {
    await this.page.click(`[data-test="add-to-cart-${itemId}"]`);
  }

  async removeItemFromCart(itemId) {
    await this.page.click(`[data-test="remove-${itemId}"]`);
  }

  async sortProducts(optionValue) {
    await this.sortDropdown.selectOption(optionValue);
  }

  async assertProductVisible(productName) {
    await expect(this.page.locator('.inventory_item_name')).toContainText(productName);
  }
}
