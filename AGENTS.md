# Playwright OpenCode AI

## Commands
- **Run all tests**: `npx playwright test`
- **Run a single test file**: `npx playwright test tests/orangehrm-login.spec.ts`
- **Run in UI mode**: `npx playwright test --ui`
- **Run with headed browser**: `npx playwright test --headed`
- **View HTML report**: `npx playwright show-report`

## Config & CI
- `playwright.confit.ts` : testDir `./tests`, 1 project (chromium), HTML reporter. `forbidOnly` + retries(2) + single worker only when `CI` env var is set.
-`.github/worflows/playwright.yml`: runs `npm ci`, `npx playwright instal --with-deps`, `npx playwright test` on push/PR to `main`/`master`; uploads `playwright-report` artifact (30-day retention)
- No lint, typecheck, or formatter confugured.

## Testing Guidelines & Best Practices
- **Locators**: Prefer user-facing and accessibility locators (`page.getByRole()`, `page.getByPlaceholder()`, `page.getByText()`, `page.getByLabel()`) over fragile CSS or XPath selectors.
- **Assertions**: Use Playwright's built-in web-first assertions (`await expect(locator).toBeVisible()`, `await expect(page).toHaveURL()`).
- **Structure**: Group related tests using `test.describe()` and use hooks (`test.beforeEach()`) for setup steps like navigation.
