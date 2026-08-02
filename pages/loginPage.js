import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.prod') });

export class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
  }

  async login(username, password) {
    const user = typeof username === 'string' ? username : process.env.USERNAME;
    const pass = typeof password === 'string' ? password : process.env.PASSWORD;
    if (!user || !pass) {
      throw new Error('Missing credentials: set USERNAME/PASSWORD in .env.prod or pass them to login()');
    }
    await this.usernameInput.fill(user);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
  }

 async goto() {
  if (!process.env.BASE_URL) {
    throw new Error('Missing BASE_URL: set it in your .env file');
  }
  await this.page.goto(process.env.BASE_URL);
}

}


