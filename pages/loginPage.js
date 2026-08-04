import dotenv from 'dotenv';
import path from 'path';

const envFilePath = path.resolve(process.cwd(), '.env');
const prodEnvFilePath = path.resolve(process.cwd(), '.env.prod');

dotenv.config({ path: envFilePath });
dotenv.config({ path: prodEnvFilePath });

export class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async fillUsername(username) {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password) {
    await this.passwordInput.fill(password);
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }

  async login(username, password) {
    const user = typeof username === 'string' ? username : process.env.USERNAME;
    const pass = typeof password === 'string' ? password : process.env.PASSWORD;
    if (!user || !pass) {
      throw new Error('Missing credentials: set USERNAME/PASSWORD in .env.prod or pass them to login()');
    }
    await this.fillUsername(user);
    await this.fillPassword(pass);
    await this.clickLoginButton();
  }

  async goto(pathValue = '') {
    if (!process.env.BASE_URL) {
      throw new Error('Missing BASE_URL: set it in your .env file');
    }

    const targetUrl = pathValue ? new URL(pathValue, process.env.BASE_URL).toString() : process.env.BASE_URL;
    await this.page.goto(targetUrl);
  }
}


