import { test, expect } from '@playwright/test';
import { OrangeHRMLoginPage } from './pages/OrangeHRMLoginPage';
import { OrangeHRMAdminPage } from './pages/OrangeHRMAdminPage';

test.describe('OrangeHRM User Management - Admin Creation', () => {
  let loginPage: OrangeHRMLoginPage;
  let adminPage: OrangeHRMAdminPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new OrangeHRMLoginPage(page);
    adminPage = new OrangeHRMAdminPage(page);

    // Iniciar sesión como Admin
    await loginPage.goto();
    await loginPage.login('Admin', 'admin123');
    await expect(page).toHaveURL(/.*dashboard.*/);
  });

  test('should create a new admin user by selecting a random employee from table', async ({ page }) => {
    // 1. Navegar a la sección User Management -> Admin
    await adminPage.navigateToAdmin();

    // 2 & 3. Inspeccionar tabla, seleccionar empleado aleatoriamente y guardar nombre
    const selectedEmployee = await adminPage.getRandomEmployeeName();
    console.log(`Selected Employee for new user: ${selectedEmployee}`);

    // 4. Hacer clic en Add
    await adminPage.addButton.click();

    // 5. Completar formulario de creación de usuario
    const uniqueUsername = `admin_user_${Date.now()}`;
    const password = 'StrongPassword123!';

    await adminPage.createUser(selectedEmployee, uniqueUsername, password);

    // 6 & 7. Validar que la creación haya sido exitosa (verificando redirección a la lista de usuarios o toast de éxito)
    await page.waitForURL(/.*admin\/viewSystemUsers.*/, { timeout: 15000 });
    await expect(page).toHaveURL(/.*admin\/viewSystemUsers.*/);
  });
});
