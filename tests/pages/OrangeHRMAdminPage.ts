import { type Page, type Locator } from '@playwright/test';

export class OrangeHRMAdminPage {
  readonly page: Page;
  readonly adminMenuLink: Locator;
  readonly addButton: Locator;
  readonly userRoleDropdown: Locator;
  readonly employeeNameInput: Locator;
  readonly statusDropdown: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly saveButton: Locator;
  readonly tableRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.adminMenuLink = page.getByRole('link', { name: 'Admin' });
    this.addButton = page.getByRole('button', { name: ' Add' });
    this.userRoleDropdown = page.locator('.oxd-select-text').first();
    this.employeeNameInput = page.getByPlaceholder('Type for hints...');
    this.statusDropdown = page.locator('.oxd-select-text').nth(1);
    this.usernameInput = page.locator('form').getByRole('textbox').nth(1);
    this.passwordInput = page.locator('input[type="password"]').first();
    this.confirmPasswordInput = page.locator('input[type="password"]').last();
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.tableRows = page.locator('.oxd-table-body .oxd-table-row');
  }

  async navigateToAdmin() {
    await this.adminMenuLink.click();
    await this.page.waitForURL(/.*admin\/viewSystemUsers.*/);
  }

  async getRandomEmployeeName(): Promise<string> {
    await this.tableRows.first().waitFor({ state: 'visible', timeout: 10000 });
    const count = await this.tableRows.count();
    
    const employeeNames: string[] = [];
    for (let i = 0; i < count; i++) {
      const row = this.tableRows.nth(i);
      const cells = row.locator('.oxd-table-cell');
      const empNameCell = cells.nth(3);
      const text = await empNameCell.textContent();
      if (text && text.trim() !== '' && !text.includes('--')) {
        employeeNames.push(text.trim());
      }
    }

    if (employeeNames.length === 0) {
      throw new Error('No valid employee names found in the user table.');
    }

    const randomIndex = Math.floor(Math.random() * employeeNames.length);
    const selectedName = employeeNames[randomIndex];
    console.log(`[POM] Selected employee from table: "${selectedName}"`);
    return selectedName;
  }

  async searchUser(username: string) {
    if (!this.page.url().includes('admin/viewSystemUsers')) {
      await this.navigateToAdmin();
    }
    const inputField = this.page.locator('.oxd-input-group').filter({ hasText: 'Username' }).locator('input').first();
    await inputField.waitFor({ state: 'visible', timeout: 15000 });
    await inputField.fill(username);
    const searchBtn = this.page.getByRole('button', { name: 'Search' });
    await searchBtn.click();
    await this.tableRows.first().waitFor({ state: 'visible', timeout: 10000 });
  }

  async editFirstUserRoleAndStatus(newRole: 'Admin' | 'ESS', newStatus: 'Enabled' | 'Disabled') {
    // Click edit button (pencil icon) on the first row
    const editButton = this.tableRows.first().locator('button.oxd-icon-button').filter({ has: this.page.locator('.bi-pencil-fill') });
    await editButton.waitFor({ state: 'visible', timeout: 10000 });
    await editButton.click();
    
    // Wait for form to be visible/stable and loader to disappear
    await this.page.waitForURL(/.*admin\/saveSystemUser.*/);
    await this.page.locator('.oxd-form-loader').waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});
    const roleDropdownContainer = this.page.locator('.oxd-select-text').first();
    await roleDropdownContainer.waitFor({ state: 'visible', timeout: 10000 });
    await roleDropdownContainer.click();
    await this.page.getByRole('option', { name: newRole, exact: true }).click();

    // Save changes
    const saveButtons = this.page.getByRole('button', { name: 'Save' });
    await saveButtons.last().click();
    await this.page.waitForURL(/.*admin\/viewSystemUsers.*/, { timeout: 30000 });
    // Esperar a que la tabla vuelva a renderizarse después de guardar
    await this.tableRows.first().waitFor({ state: 'visible', timeout: 10000 });
  }

  async createUser(employeeName: string, username: string, password: string) {
    await this.userRoleDropdown.click();
    await this.page.getByRole('option', { name: 'ESS', exact: true }).click();

    const searchKey = employeeName.substring(0, Math.min(3, employeeName.length));
    console.log(`[POM] Entering employee name search key: "${searchKey}" for "${employeeName}"`);
    
    await this.employeeNameInput.click();
    await this.employeeNameInput.pressSequentially(searchKey, { delay: 150 });

    const option = this.page.locator('.oxd-autocomplete-option', { hasText: employeeName });
    const firstOption = this.page.locator('.oxd-autocomplete-option').first();

    try {
      await option.waitFor({ state: 'visible', timeout: 3000 });
      await option.click();
    } catch {
      console.log(`[POM] Exact option for "${employeeName}" not found immediately, clicking first available suggestion.`);
      await firstOption.waitFor({ state: 'visible', timeout: 5000 });
      await firstOption.click();
    }

    await this.statusDropdown.click();
    await this.page.getByRole('option', { name: 'Enabled' }).click();

    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);

    const saveButtons = this.page.getByRole('button', { name: 'Save' });
    await saveButtons.last().click();
  }
}
