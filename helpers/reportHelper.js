/**
 * Helper utilities for enhancing Playwright test reports
 */

/**
 * Adds a screenshot attachment to the test report
 * @param {import('@playwright/test').TestInfo} testInfo - Test info object
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} name - Name for the screenshot
 */
async function attachScreenshot(testInfo, page, name = 'screenshot') {
  const screenshot = await page.screenshot();
  await testInfo.attach(name, {
    body: screenshot,
    contentType: 'image/png',
  });
}

/**
 * Adds a page snapshot (HTML) to the test report
 * @param {import('@playwright/test').TestInfo} testInfo - Test info object
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} name - Name for the snapshot
 */
async function attachPageSnapshot(testInfo, page, name = 'page-snapshot') {
  const html = await page.content();
  await testInfo.attach(name, {
    body: html,
    contentType: 'text/html',
  });
}

/**
 * Adds custom text annotation to the test report
 * @param {import('@playwright/test').TestInfo} testInfo - Test info object
 * @param {string} text - Text to add
 * @param {string} type - Annotation type (info, warning, error)
 */
function addAnnotation(testInfo, text, type = 'info') {
  testInfo.annotations.push({
    type: type,
    description: text,
  });
}

/**
 * Adds test metadata for better report organization
 * @param {import('@playwright/test').TestInfo} testInfo - Test info object
 * @param {Object} metadata - Metadata object with key-value pairs
 */
function addMetadata(testInfo, metadata) {
  Object.entries(metadata).forEach(([key, value]) => {
    testInfo.annotations.push({
      type: key,
      description: String(value),
    });
  });
}

/**
 * Logs a step with timestamp for better traceability
 * @param {import('@playwright/test').TestInfo} testInfo - Test info object
 * @param {string} message - Step message
 */
function logStep(testInfo, message) {
  const timestamp = new Date().toISOString();
  testInfo.annotations.push({
    type: 'step',
    description: `[${timestamp}] ${message}`,
  });
}

module.exports = {
  attachScreenshot,
  attachPageSnapshot,
  addAnnotation,
  addMetadata,
  logStep,
};

