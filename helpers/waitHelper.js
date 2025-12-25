/**
 * Wait utility helpers for Playwright tests
 */

/**
 * Wait for element to be visible with custom timeout
 * @param {import('@playwright/test').Locator} locator - Playwright locator
 * @param {number} timeout - Timeout in milliseconds (default: 10000)
 */
async function waitForVisible(locator, timeout = 10000) {
  await locator.waitFor({ state: 'visible', timeout });
}

/**
 * Wait for element to be hidden
 * @param {import('@playwright/test').Locator} locator - Playwright locator
 * @param {number} timeout - Timeout in milliseconds (default: 10000)
 */
async function waitForHidden(locator, timeout = 10000) {
  await locator.waitFor({ state: 'hidden', timeout });
}

/**
 * Wait for element to be attached to DOM
 * @param {import('@playwright/test').Locator} locator - Playwright locator
 * @param {number} timeout - Timeout in milliseconds (default: 10000)
 */
async function waitForAttached(locator, timeout = 10000) {
  await locator.waitFor({ state: 'attached', timeout });
}

/**
 * Wait for network to be idle
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {number} timeout - Timeout in milliseconds (default: 30000)
 */
async function waitForNetworkIdle(page, timeout = 30000) {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Wait for specific URL
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string|RegExp} url - URL pattern to wait for
 * @param {number} timeout - Timeout in milliseconds (default: 30000)
 */
async function waitForURL(page, url, timeout = 30000) {
  await page.waitForURL(url, { timeout });
}

/**
 * Wait for element text to match
 * @param {import('@playwright/test').Locator} locator - Playwright locator
 * @param {string|RegExp} text - Expected text
 * @param {number} timeout - Timeout in milliseconds (default: 10000)
 */
async function waitForText(locator, text, timeout = 10000) {
  await locator.waitFor({ state: 'visible', timeout });
  // Additional check for text if needed
  if (typeof text === 'string') {
    await locator.filter({ hasText: text }).waitFor({ timeout });
  }
}

/**
 * Wait with retry mechanism
 * @param {Function} fn - Function to execute
 * @param {number} maxRetries - Maximum number of retries (default: 3)
 * @param {number} delay - Delay between retries in milliseconds (default: 1000)
 */
async function waitWithRetry(fn, maxRetries = 3, delay = 1000) {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

module.exports = {
  waitForVisible,
  waitForHidden,
  waitForAttached,
  waitForNetworkIdle,
  waitForURL,
  waitForText,
  waitWithRetry,
};

