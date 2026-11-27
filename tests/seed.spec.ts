import { test, expect } from '@playwright/test';
import { OrangeHRMLoginPage } from './pages/OrangeHRMLoginPage';
import { OrangeHRMAdminPage } from './pages/OrangeHRMAdminPage';

test.describe('Test group', () => {
  test('seed', async ({ page }) => {
    const loginPage = new OrangeHRMLoginPage(page);
    const adminPage = new OrangeHRMAdminPage(page);

    await loginPage.goto(); // Asegúrate de incluir la navegación si es necesario
    await loginPage.login(
      process.env.WEBSITE_USER as string,
      process.env.WEBSITE_PASSWORD as string
    );
    await expect(page).toHaveURL(/.*dashboard.*/);
    await expect(loginPage.dashboardHeading).toBeVisible();
  });
});