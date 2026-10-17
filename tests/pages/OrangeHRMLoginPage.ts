import { type Page, type Locator } from '@playwright/test';

export class OrangeHRMLoginPage {
  readonly page: Page;
  readonly loginHeading: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly dashboardHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginHeading = page.getByRole('heading', { name: 'Login' });
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.getByText('Invalid credentials');
    this.dashboardHeading = page.getByRole('heading', { name: 'Dashboard' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
