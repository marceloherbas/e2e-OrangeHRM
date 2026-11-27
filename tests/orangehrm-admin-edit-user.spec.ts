import { test, expect } from '@playwright/test';
import { OrangeHRMLoginPage } from './pages/OrangeHRMLoginPage';
import { OrangeHRMAdminPage } from './pages/OrangeHRMAdminPage';

test.describe('OrangeHRM User Management - Edit User', () => {
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

  test('TC-UM-13: CRUD - Edit Existing User Role and Status', async ({ page }) => {
    // 1. Navegar al módulo Admin -> User Management
    await adminPage.navigateToAdmin();

    // 2. Crear un usuario temporal primero para asegurar que tenemos uno editable
    const selectedEmployee = await adminPage.getRandomEmployeeName();
    const uniqueUsername = `edit_user_${Date.now()}`;
    const password = 'StrongPassword123!';

    await adminPage.addButton.click();
    await page.waitForURL(/.*admin\/saveSystemUser.*/);
    await adminPage.createUser(selectedEmployee, uniqueUsername, password);
    await page.waitForURL(/.*admin\/viewSystemUsers.*/, { timeout: 15000 });

    // 3. Buscar el usuario creado en la tabla
    await adminPage.searchUser(uniqueUsername);

    // 4. Editar el usuario: Cambiar Rol de ESS a Admin
    await adminPage.editFirstUserRoleAndStatus('Admin', 'Disabled');

    // 5. Verificar que regresó a la lista y el cambio se aplicó correctamente
    await expect(page).toHaveURL(/.*admin\/viewSystemUsers.*/);
    
    // Volver a buscar para verificar el estado actualizado en la tabla
    await adminPage.searchUser(uniqueUsername);
    
    // Verificar que muestre Admin en la celda correspondiente
    const row = adminPage.tableRows.first();
    await expect(row.locator('.oxd-table-cell').nth(2)).toContainText('Admin');
  });
});
