import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envFilePath = path.resolve(process.cwd(), '.env');
const prodEnvFilePath = path.resolve(process.cwd(), '.env.prod');

const loadEnvFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return dotenv.parse(fs.readFileSync(filePath));
};

const repoEnv = {
  ...loadEnvFile(envFilePath),
  ...loadEnvFile(prodEnvFilePath),
};

const getRepoEnvValue = (key) => repoEnv[key] ?? '';

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
    const user = typeof username === 'string' ? username : getRepoEnvValue('USERNAME');
    const pass = typeof password === 'string' ? password : getRepoEnvValue('PASSWORD');

    if (!user || !pass) {
      throw new Error('Missing credentials: set USERNAME/PASSWORD in .env or .env.prod or pass them to login()');
    }

    await this.fillUsername(user);
    await this.fillPassword(pass);
    await this.clickLoginButton();
  }

  async goto(pathValue = '') {
    const baseUrl = getRepoEnvValue('BASE_URL');
    if (!baseUrl) {
      throw new Error('Missing BASE_URL: set it in your .env file');
    }

    const targetUrl = pathValue ? new URL(pathValue, baseUrl).toString() : baseUrl;
    await this.page.goto(targetUrl);
  }
}


