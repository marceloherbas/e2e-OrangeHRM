import { test, expect } from '@playwright/test';
import { OrangeHRMLoginPage } from '../../pages/OrangeHRMLoginPage';
import { OrangeHRMAdminPage } from '../../pages/OrangeHRMAdminPage';

test.describe.configure({ mode: 'serial' });

test.describe('OrangeHRM User Management - Edit User', () => {
  let loginPage: OrangeHRMLoginPage;
  let adminPage: OrangeHRMAdminPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new OrangeHRMLoginPage(page);
    adminPage = new OrangeHRMAdminPage(page);

    // Iniciar sesión como Admin
    await loginPage.goto();
    await loginPage.login(
      process.env.WEBSITE_USER as string,
      process.env.WEBSITE_PASSWORD as string
    );
    await page.waitForURL(/.*dashboard.*/, { timeout: 15000 });
    await expect(page).toHaveURL(/.*dashboard.*/);
  });

  test('TC-UM-13: CRUD - Edit Existing User Role and Status', async ({ page }) => {
    // 1. Navegar al módulo Admin -> User Management
    await adminPage.navigateToAdmin();

    // 2. Crear un usuario temporal primero para asegurar que tenemos uno editable
    const selectedEmployee = await adminPage.getRandomEmployeeName();
    const uniqueUsername = `edit_user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const password = 'StrongPassword123!';

    await adminPage.addButton.click();
    await page.waitForURL(/.*admin\/saveSystemUser.*/);
    await adminPage.createUser(selectedEmployee, uniqueUsername, password);
    
    try {
      await page.waitForURL(/.*admin\/viewSystemUsers.*/, { timeout: 15000 });
    } catch {
      await adminPage.navigateToAdmin();
    }

    // 3. Buscar el usuario creado en la tabla
    await adminPage.searchUser(uniqueUsername);

    // 4. Editar el usuario: Cambiar Rol de Admin a ESS (o al revés, asegurando que se modifique)
    await adminPage.editFirstUserRoleAndStatus('ESS', 'Disabled');

    // 5. Verificar que regresó a la lista y el cambio se aplicó correctamente
    await expect(page).toHaveURL(/.*admin\/viewSystemUsers.*/);
    
    // Volver a buscar para verificar el estado actualizado en la tabla
    await adminPage.searchUser(uniqueUsername);
    
    // Verificar que muestre ESS en la celda correspondiente
    const row = adminPage.tableRows.first();
    await expect(row.locator('.oxd-table-cell').nth(2)).toContainText('ESS');
  });
});
