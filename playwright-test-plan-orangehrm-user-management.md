# Comprehensive Test Plan: OrangeHRM User Management (Admin) Module

**Target Application URL**: `https://opensource-demo.orangehrmlive.com`  
**Module**: Admin > User Management (`/admin/viewSystemUsers`)  
**Document Version**: 1.0  
**Target Environment**: Fresh/Blank or Standard Demo State (OrangeHRM Open Source Demo)

---

## 1. Executive Summary
This test plan provides comprehensive end-to-end (E2E) test coverage for the **User Management** feature within the OrangeHRM Admin module. It covers role-based access control, search and filter capabilities, CRUD (Create, Read, Update, Delete) operations, form validation rules, edge cases, negative testing, and batch/bulk operations.

---

## 2. Scope of Testing
- **In-Scope**:
  - System Users List view, pagination, and sorting.
  - Search & Filtering by Username, User Role, Employee Name, and Status.
  - Add New User form validation, constraints, and success flows.
  - Edit/Update User details and password modification.
  - Delete single user and bulk/multiple user deletion with confirmation modals.
  - Role-Based Access Control (Admin vs. ESS/Non-Admin roles).
  - Negative testing (invalid inputs, duplicate usernames, weak passwords, missing required fields).
- **Out-of-Scope**:
  - Other Admin modules (Job, Organization, Qualifications, Nationalities, etc.) except where tied to User Management.
  - Employee creation in the PIM module (prerequisite dependency).

---

## 3. Pre-Conditions & Assumptions
1. **Starting State**: Tester has valid Admin credentials (default: Username: `Admin`, Password: `admin123`).
2. **Environment**: OrangeHRM demo instance is running and reachable.
3. **Dependencies**: Active employees exist in the PIM module to associate new system users with employee records.

---

## Summary Table of Test Scenarios

| ID | Category | Scenario Title | Priority |
|---|---|---|---|
| **TC-UM-01** | Navigation & UI | Verify Access to User Management Grid | High |
| **TC-UM-02** | Search & Filter | Filter Users by Username | High |
| **TC-UM-03** | Search & Filter | Filter Users by User Role (Admin vs ESS) | Medium |
| **TC-UM-04** | Search & Filter | Filter Users by Status (Enabled vs Disabled) | Medium |
| **TC-UM-05** | Search & Filter | Filter Users by Employee Name Auto-Suggest | Medium |
| **TC-UM-06** | Search & Filter | Reset Search Filters | Low |
| **TC-UM-07** | CRUD - Create | Successfully Create a New Admin User | Critical |
| **TC-UM-08** | CRUD - Create | Successfully Create an ESS User Linked to Employee | Critical |
| **TC-UM-09** | Validation | Add User - Required Field Validation | High |
| **TC-UM-10** | Validation | Add User - Duplicate Username Validation | High |
| **TC-UM-11** | Validation | Add User - Password Complexity & Mismatch Validation | High |
| **TC-UM-12** | Validation | Add User - Invalid Employee Name Hint Handling | Medium |
| **TC-UM-13** | CRUD - Update | Edit Existing User Role and Status | High |
| **TC-UM-14** | CRUD - Update | Edit User Password & Confirm Match | High |
| **TC-UM-15** | CRUD - Delete | Delete Single User with Confirmation Modal | High |
| **TC-UM-16** | CRUD - Delete | Cancel Single User Deletion | Low |
| **TC-UM-17** | Batch Operations | Select All / Multiple Users & Bulk Delete | Medium |
| **TC-UM-18** | Security & RBAC | Access Control for Non-Admin / ESS Users | Critical |

---

## Detailed Test Scenarios

### TC-UM-01: Verify Access to User Management Grid
- **Description**: Verify that an Admin user can successfully navigate to the User Management screen and view existing system users in a tabular grid.
- **Assumptions**: User is logged in as Admin on the dashboard.
- **Steps**:
  1. Navigate to `https://opensource-demo.orangehrmlive.com/web/index.php/auth/login`.
  2. Enter valid Admin credentials (`Admin` / `admin123`) and click **Login**.
  3. From the left sidebar navigation menu, click on **Admin**.
  4. Ensure the sub-menu opens to **User Management > Users** (or navigates to `/admin/viewSystemUsers`).
- **Expected Outcomes**:
  - User is successfully redirected to the System Users screen.
  - The page displays search filter inputs (Username, User Role, Employee Name, Status) and a data table listing existing users with columns: Username, User Role, Employee Name, Status, and Actions.
  - A record count summary (e.g., "(15) Records Found") is displayed above the table.

---

### TC-UM-02: Filter Users by Username
- **Description**: Verify the search functionality when querying by a specific existing username.
- **Assumptions**: User is on the System Users page (`/admin/viewSystemUsers`).
- **Steps**:
  1. Locate the **Username** input field under the System Users search filter.
  2. Type an exact existing username (e.g., `Admin`).
  3. Click the **Search** button.
- **Expected Outcomes**:
  - The table updates to display only records matching the searched username.
  - Record count updates accordingly (e.g., "(1) Record Found").

---

### TC-UM-03: Filter Users by User Role
- **Description**: Verify filtering system users by role type (Admin vs. ESS).
- **Assumptions**: User is on the System Users page.
- **Steps**:
  1. Click the **User Role** dropdown selector.
  2. Select **Admin** from the dropdown options.
  3. Click **Search**.
  4. Reset filter, then select **ESS** and click **Search**.
- **Expected Outcomes**:
  - When filtering by **Admin**, only users with the Admin role appear in the table.
  - When filtering by **ESS**, only users with the ESS role appear in the table.

---

### TC-UM-04: Filter Users by Status
- **Description**: Verify filtering system users by account status (Enabled vs. Disabled).
- **Assumptions**: User is on the System Users page.
- **Steps**:
  1. Click the **Status** dropdown selector.
  2. Select **Enabled**.
  3. Click **Search**.
  4. Repeat steps selecting **Disabled**.
- **Expected Outcomes**:
  - Table correctly displays only Enabled users or Disabled users matching the filter criteria.

---

### TC-UM-05: Filter Users by Employee Name Auto-Suggest
- **Description**: Verify searching for a user associated with a specific employee name using auto-complete.
- **Assumptions**: User is on the System Users page and employee names exist in the system.
- **Steps**:
  1. Locate the **Employee Name** input field.
  2. Type at least 2 characters of an employee's name (e.g., "a" or a known employee name like "John").
  3. Wait for the auto-suggest dropdown list to appear.
  4. Select a matching employee from the auto-suggest dropdown list.
  5. Click **Search**.
- **Expected Outcomes**:
  - Auto-suggest dropdown displays matching employee names.
  - Selecting an employee populates the input field.
  - Clicking Search displays the system user account linked to that employee.

---

### TC-UM-06: Reset Search Filters
- **Description**: Verify that the Reset button clears all active search filters and reloads the complete user list.
- **Assumptions**: User has entered values into Username, User Role, and Status filters.
- **Steps**:
  1. Populate various search filters (e.g., Username: `test`, User Role: `Admin`, Status: `Enabled`).
  2. Click the **Reset** button.
- **Expected Outcomes**:
  - All search fields are cleared back to default state (`-- Select --` or empty).
  - The user table reloads all system users in the system.

---

### TC-UM-07: Successfully Create a New Admin User
- **Description**: Verify that an Admin user can successfully create a new system user with the **Admin** role.
- **Assumptions**: User is on the System Users page.
- **Steps**:
  1. Click the **Add** button (`+ Add`) above the user table.
  2. Select **User Role** -> **Admin**.
  3. Type and select a valid **Employee Name** from the auto-suggest list.
  4. Select **Status** -> **Enabled**.
  5. Enter a unique **Username** (e.g., `testadmin99`).
  6. Enter a valid **Password** meeting complexity requirements (e.g., `Test@12345`).
  7. Enter matching confirmation in **Confirm Password**.
  8. Click **Save**.
- **Expected Outcomes**:
  - Success toast message appears (e.g., "Successfully Saved").
  - User is automatically redirected back to the System Users search page (`/admin/viewSystemUsers`).
  - The newly created user appears when searching for `testadmin99`.

---

### TC-UM-08: Successfully Create an ESS User Linked to Employee
- **Description**: Verify creation of a standard **ESS** user linked to an active employee record.
- **Assumptions**: User is on the Add User form (`/admin/saveSystemUser`).
- **Steps**:
  1. Click **Add** on the System Users page.
  2. Set **User Role** to **ESS**.
  3. Type 2+ characters in **Employee Name** and select an employee from suggestions.
  4. Set **Status** to **Enabled**.
  5. Enter unique **Username** (e.g., `ess_user_01`).
  6. Enter valid **Password** and **Confirm Password**.
  7. Click **Save**.
- **Expected Outcomes**:
  - System saves the record successfully with a success notification.
  - User record is correctly listed with Role = ESS.

---

### TC-UM-09: Add User - Required Field Validation
- **Description**: Verify that submission fails and validation errors are displayed when required fields are left blank on the Add User form.
- **Assumptions**: User is on the Add User form (`/admin/saveSystemUser`).
- **Steps**:
  1. Leave all fields empty.
  2. Click **Save** directly without entering any data.
- **Expected Outcomes**:
  - Form submission is blocked.
  - Inline validation error messages (e.g., "Required") appear under every mandatory field: User Role, Employee Name, Status, Username, Password, and Confirm Password.

---

### TC-UM-10: Add User - Duplicate Username Validation
- **Description**: Verify that the system prevents creating a user with an already existing username.
- **Assumptions**: A username (e.g., `Admin`) already exists in the system.
- **Steps**:
  1. Click **Add** on the System Users page.
  2. Fill in all required fields (User Role, Employee Name, Status).
  3. In the **Username** field, enter an existing username (`Admin`).
  4. Enter valid Password and Confirm Password.
  5. Click **Save**.
- **Expected Outcomes**:
  - An error message (e.g., "Already exists") is displayed under the Username field or as a toast banner.
  - Record is not created.

---

### TC-UM-11: Add User - Password Complexity & Mismatch Validation
- **Description**: Verify password validation rules, including minimum length, complexity, and password confirmation mismatch.
- **Assumptions**: User is on the Add User form.
- **Steps**:
  1. Enter a weak password (e.g., `123`) in the Password field.
  2. Verify inline validation error (e.g., "Should have at least 7 characters").
  3. Enter a valid password (e.g., `Password123`) in Password.
  4. Enter a non-matching password (e.g., `Password999`) in Confirm Password.
  5. Click **Save**.
- **Expected Outcomes**:
  - Weak passwords trigger length/complexity warning messages.
  - Mismatched passwords display an error message (e.g., "Passwords do not match").

---

### TC-UM-12: Add User - Invalid Employee Name Hint Handling
- **Description**: Verify behavior when an invalid employee name is typed manually without selecting from the auto-suggest dropdown.
- **Assumptions**: User is on the Add User form.
- **Steps**:
  1. Select User Role, Status, Username, and Passwords.
  2. In **Employee Name**, type a random non-existent name (e.g., `XYZNonExistentEmployee`) and do NOT select any auto-suggest dropdown option.
  3. Click **Save**.
- **Expected Outcomes**:
  - System displays an invalid error state or "Invalid" message under Employee Name, preventing save until a valid employee from the hint list is selected.

---

### TC-UM-13: CRUD - Update Edit Existing User Role and Status
- **Description**: Verify that an existing user's role and status can be successfully modified.
- **Assumptions**: At least one test user exists in the system table.
- **Steps**:
  1. Locate a user in the table and click the **Edit** icon (pencil icon) in the Actions column.
  2. On the Edit User screen (`/admin/saveSystemUser?id=...`), change the **User Role** (e.g., from ESS to Admin).
  3. Change the **Status** (e.g., from Enabled to Disabled).
  4. Click **Save**.
- **Expected Outcomes**:
  - Success message appears ("Successfully Updated").
  - User is redirected to the System Users list.
  - The table reflects the updated role and status for that user.

---

### TC-UM-14: CRUD - Update Edit User Password
- **Description**: Verify that an existing user's password can be updated when the "Change Password" checkbox is checked.
- **Assumptions**: User is on the Edit User screen for an existing user.
- **Steps**:
  1. Click Edit on an existing user row.
  2. Check the **"Change Password"** checkbox.
  3. Enter a new password in **Password** and **Confirm Password**.
  4. Click **Save**.
- **Expected Outcomes**:
  - Password fields accept the new values successfully.
  - Record saves with success confirmation.
  - User can subsequently log in using the new password.

---

### TC-UM-15: CRUD - Delete Single User with Confirmation Modal
- **Description**: Verify that a single system user can be deleted via the delete action icon with confirmation.
- **Assumptions**: A test user exists in the system table.
- **Steps**:
  1. Locate the target user row in the table.
  2. Click the **Delete** icon (trash can icon) in the Actions column.
  3. A confirmation popup/modal appears asking "Are you Sure?".
  4. Click **Yes, Delete**.
- **Expected Outcomes**:
  - Modal closes.
  - Success notification appears ("Successfully Deleted").
  - The deleted user is removed from the table list.

---

### TC-UM-16: CRUD - Delete Single User - Cancellation
- **Description**: Verify that deleting a user can be cancelled from the confirmation modal.
- **Assumptions**: User is on the System Users page with at least one record.
- **Steps**:
  1. Click the **Delete** icon on any user row.
  2. When the confirmation modal appears, click **No, Cancel** (or close modal).
- **Expected Outcomes**:
  - Modal closes without deleting the user.
  - User remains intact in the table.

---

### TC-UM-17: Batch Operations - Select All & Bulk Delete
- **Description**: Verify ability to select multiple user records and perform bulk deletion.
- **Assumptions**: Multiple test users exist in the system table.
- **Steps**:
  1. Click the header checkbox in the table to select all visible users (or check individual checkboxes for multiple users).
  2. Click the red **"Delete Selected"** button that appears above the table.
  3. In the confirmation modal, click **Yes, Delete**.
- **Expected Outcomes**:
  - All selected user records are deleted simultaneously.
  - Success notification appears.
  - Table updates to reflect removal of the selected users.

---

### TC-UM-18: Security & RBAC - Access Control for ESS / Non-Admin Users
- **Description**: Verify that non-admin users (ESS role) cannot access the Admin User Management module.
- **Assumptions**: A standard ESS user account exists with non-admin privileges.
- **Steps**:
  1. Log out of the Admin account.
  2. Log in with ESS user credentials.
  3. Observe the left sidebar navigation menu.
  4. Attempt direct navigation to `https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers`.
- **Expected Outcomes**:
  - The **Admin** module option is completely absent from the ESS user's sidebar menu.
  - Direct URL access to `/admin/viewSystemUsers` results in an "Access Denied" error page, redirection to Dashboard, or unauthorized notice.

---

## 5. Failure Conditions & Negative Testing Summary
- **Blank Form Submission**: Must trigger mandatory field indicators ("Required") on all inputs.
- **Existing Usernames**: Must reject duplicates with an inline error.
- **Mismatched Passwords**: Must prevent save when confirmation password does not match.
- **Unauthorized Access**: Must block non-admin roles from accessing system user admin endpoints.

---
*End of Test Plan.*
