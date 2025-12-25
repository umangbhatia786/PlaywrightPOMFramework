const { test: base } = require('@playwright/test');
const { POManager } = require('../pages/POManager');

/**
 * Custom fixtures extending Playwright's base fixtures
 */

// Extend base test with custom fixtures
const test = base.extend({
  // Authenticated page fixture - automatically logs in
  authenticatedPage: async ({ page }, use) => {
    // Create POManager without testInfo for fixture setup
    // testInfo will be available in test functions
    const poManager = new POManager(page, null);
    const loginPage = poManager.getLoginPage();
    
    // Navigate and login
    await page.goto('/');
    await loginPage.loginUser(
      process.env.DEFAULT_USERNAME || 'standard_user',
      process.env.DEFAULT_PASSWORD || 'secret_sauce'
    );
    
    // Wait for successful login
    await page.waitForURL(/\/inventory\.html$/);
    
    await use(page);
  },

  // POM Manager fixture
  poManager: async ({ page }, use) => {
    // Create POManager without testInfo initially
    // testInfo will be set in test functions via setTestInfo() if needed
    const poManager = new POManager(page);
    await use(poManager);
  },
});

module.exports = { test };

