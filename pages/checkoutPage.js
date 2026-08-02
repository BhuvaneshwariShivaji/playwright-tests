import { expect } from '@playwright/test';
import dotenv from 'dotenv';


// Load environment variables (e.g., .env.prod, .env.staging)
dotenv.config();

export class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.firstName = page.getByPlaceholder('First Name');
    this.lastName = page.getByPlaceholder('Last Name');
    this.zipCode = page.getByPlaceholder('Zip/Postal Code');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
  }

  async checkout(firstName, lastName, zip) {
    // Use passed values if provided, otherwise fallback to env variables
    const fName = typeof firstName === 'string' ? firstName : process.env.FIRST_NAME;
    const lName = typeof lastName === 'string' ? lastName : process.env.LAST_NAME;
    const postal = typeof zip === 'string' ? zip : process.env.ZIP_CODE;

    if (!fName || !lName || !postal) {
      throw new Error('Missing checkout details: set FIRST_NAME, LAST_NAME, ZIP_CODE in .env or pass them to checkout()');
    }

    await this.checkoutButton.click();
    await this.firstName.fill(fName);
    await this.lastName.fill(lName);
    await this.zipCode.fill(postal);
    await this.continueButton.click();
    await this.finishButton.click();
  }

  async assertOrderSuccess() {
    await expect(this.page.getByText('THANK YOU FOR YOUR ORDER')).toBeVisible();
  }
}
