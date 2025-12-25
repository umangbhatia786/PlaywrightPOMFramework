// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Validate and return valid browser name
 * @returns {'chromium' | 'firefox' | 'webkit'}
 */
function getBrowserName() {
  const browser = process.env.BROWSER || 'chromium';
  const validBrowsers = ['chromium', 'firefox', 'webkit'];
  return /** @type {'chromium' | 'firefox' | 'webkit'} */ (validBrowsers.includes(browser) ? browser : 'chromium');
}

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : parseInt(process.env.RETRIES || '0'),
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI 
    ? [
        ['html', { 
          open: 'never',
          outputFolder: 'playwright-report'
        }], 
        ['list'],
        ['junit', { outputFile: 'test-results/junit.xml' }]
      ]
    : [
        ['html', { 
          open: 'on-failure',
          outputFolder: 'playwright-report'
        }],
        ['list']
      ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com/',
    browserName: getBrowserName(),
    headless: process.env.HEADLESS !== 'false',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure', // Changed to retain trace on failure for better debugging
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    /* Add test annotations for better reporting */
    actionTimeout: parseInt(process.env.TIMEOUT || '30000'),
    navigationTimeout: parseInt(process.env.TIMEOUT || '30000')
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // Uncomment to enable cross-browser testing
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
