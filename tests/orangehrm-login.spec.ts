import { test, expect } from '@playwright/test';
import { OrangeHRMLoginPage } from './pages/OrangeHRMLoginPage';

test.describe('OrangeHRM Authentication & Navigation', () => {
  let loginPage: OrangeHRMLoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new OrangeHRMLoginPage(page);
    await loginPage.goto();
  });

  test('should display login page elements correctly using accessibility selectors', async () => {
    await expect(loginPage.loginHeading).toBeVisible();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('should show error message with invalid credentials', async () => {
    await loginPage.login('Admin', 'wrongpassword');
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('should login successfully with valid credentials and verify dashboard', async ({ page }) => {
    await loginPage.login('Admin', 'admin123');

    await expect(page).toHaveURL(/.*dashboard.*/);
    await expect(loginPage.dashboardHeading).toBeVisible();
  });
});
