const { test } = require('@playwright/test');
const {POManager} = require('../pages/POManager');
const loginData = require('../test-data/loginData');
const { addMetadata, attachScreenshot } = require('../helpers/reportHelper');

test.describe('@login Login Tests', () => {
  let loginPage;

  test.beforeEach(async ({ page }, testInfo) => {
    const poManager = new POManager(page, testInfo);
    loginPage = poManager.getLoginPage();
    
    // Add test metadata for better reporting
    addMetadata(testInfo, {
      'test-type': 'login',
      'browser': 'chromium',
      'environment': 'saucedemo'
    });
    
    await page.goto('/');
  });

  test('@smoke @regression @positiveLogin Valid user should login successfully', async ({ page }, testInfo) => {
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
      // Capture screenshot after login attempt
      await attachScreenshot(testInfo, page, 'after-login-attempt');
    });

    await test.step('Verify user is redirected to inventory page', async () => {
      await loginPage.validateLoginSuccess();
      // Capture screenshot showing successful login
      await attachScreenshot(testInfo, page, 'login-success');
    });
  });

  for (const user of loginData.invalidUsers) {
    test(`@smoke @regression @invalidLogin Invalid login → ${user.username || 'empty username'} / ${user.password || 'empty password'}`, async ({ page }, testInfo) => {
      // Add test-specific metadata for negative test cases
      addMetadata(testInfo, {
        'test-scenario': 'negative-login',
        'username': user.username || 'empty',
        'password': user.password || 'empty',
        'expected-error': user.error
      });

      await test.step('Attempt login with invalid credentials', async () => {
        await loginPage.loginUser(user.username, user.password);
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
