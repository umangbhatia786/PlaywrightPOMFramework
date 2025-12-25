const { test } = require('../playwright/fixtures');
const loginData = require('../test-data/loginData');
const { addMetadata, attachScreenshot } = require('../helpers/reportHelper');
const { waitForNetworkIdle, waitForURL } = require('../helpers/waitHelper');

test.describe('@login Login Tests', () => {
  test.beforeEach(async ({ page, poManager }, testInfo) => {
    // Set testInfo in fixtures when available
    poManager.setTestInfo(testInfo);
    
    // Add test metadata for better reporting
    addMetadata(testInfo, {
      'test-type': 'login',
      'browser': 'chromium',
      'environment': 'saucedemo'
    });
    
    await page.goto('/');
    await waitForNetworkIdle(page);
  });

  test('@smoke @regression @positiveLogin Valid user should login successfully', async ({ page, poManager }, testInfo) => {
    // Update testInfo in fixtures
    poManager.setTestInfo(testInfo);
    
    const loginPage = poManager.getLoginPage();
    
    // Add test-specific metadata
    addMetadata(testInfo, {
      'test-scenario': 'positive-login',
      'username': loginData.validUser.username,
      'expected-result': 'successful-login'
    });

    await test.step('Login with valid credentials', async () => {
      await loginPage.loginUser(
        loginData.validUser.username,
        loginData.validUser.password
      );
      await waitForNetworkIdle(page);
      // Capture screenshot after login attempt
      await attachScreenshot(testInfo, page, 'after-login-attempt');
    });

    await test.step('Verify user is redirected to inventory page', async () => {
      await waitForURL(page, /\/inventory\.html$/);
      await loginPage.validateLoginSuccess();
      // Capture screenshot showing successful login
      await attachScreenshot(testInfo, page, 'login-success');
    });
  });

  for (const user of loginData.invalidUsers) {
    test(`@smoke @regression @invalidLogin Invalid login → ${user.username || 'empty username'} / ${user.password || 'empty password'}`, async ({ page, poManager }, testInfo) => {
      // Update testInfo in fixtures
      poManager.setTestInfo(testInfo);
      
      const loginPage = poManager.getLoginPage();
      
      // Add test-specific metadata for negative test cases
      addMetadata(testInfo, {
        'test-scenario': 'negative-login',
        'username': user.username || 'empty',
        'password': user.password || 'empty',
        'expected-error': user.error
      });

      await test.step('Attempt login with invalid credentials', async () => {
        await loginPage.loginUser(user.username, user.password);
        await waitForNetworkIdle(page);
        // Capture screenshot showing error state
        await attachScreenshot(testInfo, page, 'login-error-state');
      });

      await test.step('Verify error message is displayed', async () => {
        await loginPage.validateLoginError(user.error);
        // Capture screenshot with error message visible
        await attachScreenshot(testInfo, page, 'error-message-validated');
      });
    });
  }
});
