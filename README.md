# SauceDemo Playwright Test Framework

A robust, self-healing end-to-end test automation framework built with Playwright, featuring intelligent locator healing, Page Object Model (POM) pattern, and comprehensive test data management.

## 🚀 Features

### Core Features
- **Self-Healing Locators**: Automatic locator recovery when selectors break
- **Page Object Model (POM)**: Clean, maintainable test architecture
- **POM Manager**: Centralized page object management with lazy initialization
- **Test Data Management**: Externalized test data for easy maintenance
- **Locator Chaining**: Support for Playwright's powerful locator chaining
- **Comprehensive Reporting**: HTML reports with screenshots and videos on failure
- **GitHub Pages Integration**: Automatic deployment of test reports to GitHub Pages
- **Environment Configuration**: Support for multiple environments via `.env` files
- **Test Fixtures**: Reusable test context with pre-authenticated pages
- **Wait Utilities**: Custom wait helpers for better control
- **Cross-Browser Testing**: Ready for multi-browser test execution

### Self-Healing System
The framework includes an intelligent healing mechanism that:
- Automatically tries multiple selector strategies when a locator fails
- Persists successful selectors for future use
- Provides special handling for common UI patterns (products, items, etc.)
- Reduces test maintenance overhead
- **AI-Powered Healing**: Supports multiple AI providers (OpenAI, Google Gemini, xAI/Grok) for intelligent locator generation
- **Fallback Strategy**: Automatically falls back to CSS-based healing if AI healing fails or is unavailable

## 📁 Project Structure

```
SauceDemoPlaywright/
├── healing/                    # Self-healing locator system
│   ├── healingLocator.js      # HealingLocator class implementation
│   ├── traceHealer.js         # Healing logic and selector recovery
│   └── healerStore.json       # Persisted successful selectors
├── pages/                      # Page Object Model classes
│   ├── BasePage.js            # Base page with common functionality
│   ├── LoginPage.js           # Login page object
│   ├── ProductsPage.js        # Products page object
│   ├── CartPage.js            # Cart page object
│   └── POManager.js           # Centralized page object manager
├── test-data/                  # Test data files
│   ├── loginData.js           # Login test data
│   └── productsData.js        # Product test data
├── tests/                      # Test specifications
│   ├── login.spec.js          # Login test cases
│   └── cart.spec.js           # Cart test cases
├── helpers/                    # Helper utilities
│   ├── reportHelper.js       # Report enhancement utilities
│   └── waitHelper.js          # Wait utility helpers
├── playwright/                 # Playwright configuration and fixtures
│   └── fixtures.js           # Custom test fixtures
├── docs/                       # Documentation
│   ├── REPORTING_GUIDE.md     # Guide for enhanced reporting
│   └── GITHUB_PAGES_SETUP.md  # GitHub Pages setup guide
├── .github/                    # GitHub configuration
│   └── workflows/             # GitHub Actions workflows
│       └── playwright.yml     # CI/CD workflow for automated testing
├── .env.example                # Environment variables template
├── playwright.config.js        # Playwright configuration
├── package.json               # Project dependencies and npm scripts
└── README.md                  # This file
```

## 🛠️ Setup and Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository** (if applicable) or navigate to the project directory

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install Playwright browsers**:
   ```bash
   npm run test:install
   ```
   Or using npx:
   ```bash
   npx playwright install --with-deps
   ```

4. **Configure environment variables** (optional):
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your configuration:
   ```env
   BASE_URL=https://www.saucedemo.com/
   BROWSER=chromium
   HEADLESS=true
   TIMEOUT=30000
   RETRIES=0
   DEFAULT_USERNAME=standard_user
   DEFAULT_PASSWORD=secret_sauce
   ```

5. **Verify installation**:
   ```bash
   npx playwright test --version
   ```

## 🏗️ Framework Architecture

### Page Object Model (POM)

The framework follows the Page Object Model pattern where each page is represented by a class:

```javascript
class LoginPage extends BasePage {
  constructor(page, testInfo) {
    super(page, testInfo);
    // Define locators
  }
  
  // Define page methods
  async loginUser(username, password) {
    // Implementation
  }
}
```

### BasePage

All page objects extend `BasePage`, which provides:
- Common locator creation with healing support
- Access to Playwright `page` and `testInfo` objects
- Shared functionality across pages

### POM Manager

The `POManager` class provides centralized access to page objects with lazy initialization:

```javascript
const poManager = new POManager(page, testInfo);
const loginPage = poManager.getLoginPage();
const productsPage = poManager.getProductsPage();
const cartPage = poManager.getCartPage();
```

**Benefits:**
- Single source of truth for page objects
- Lazy initialization (pages created only when needed)
- Consistent page object lifecycle management

### Self-Healing Locator System

#### How It Works

1. **Multiple Selector Strategy**: Each locator can have multiple selector definitions
   ```javascript
   this.userName = this.locator(
     "#user-name",
     "input[placeholder='Username']",
     "input[name='user-name']"
   );
   ```

2. **Automatic Fallback**: If the primary selector fails, the system tries alternatives in order

3. **Healing Process**: When all predefined selectors fail:
   - The healing system generates candidate selectors based on logical names
   - Tries each candidate until one works
   - Persists successful selectors to `healerStore.json`

4. **Selector Persistence**: Successful healed selectors are saved and reused in future runs

#### HealingLocator Class

The `HealingLocator` class wraps Playwright locators with healing capabilities:

```javascript
class HealingLocator {
  async resolve() {
    // Tries each selector definition
    // Falls back to healing if all fail
    // Returns resolved Playwright locator
  }
  
  async click() { /* ... */ }
  async fill(value) { /* ... */ }
  async text() { /* ... */ }
}
```

#### Healing Strategies

The healing system uses intelligent strategies:

- **Class-based selectors**: `.className`, `[class*="className"]`
- **Attribute-based**: `[data-test*="key"]`, `[name*="key"]`, `[id*="key"]`
- **Special patterns**: Recognizes common patterns (products, items) and uses domain-specific selectors

## 📝 Writing Tests

### Using Custom Fixtures (Recommended)

The framework provides custom fixtures for better test organization:

```javascript
const { test } = require('../playwright/fixtures');
const loginData = require('../test-data/loginData');
const { addMetadata, attachScreenshot } = require('../helpers/reportHelper');
const { waitForNetworkIdle } = require('../helpers/waitHelper');

test.describe('Feature Tests', () => {
  test.beforeEach(async ({ page, poManager }, testInfo) => {
    // Set testInfo in fixtures when available
    poManager.setTestInfo(testInfo);
    
    // Add metadata
    addMetadata(testInfo, {
      'test-type': 'feature',
      'browser': 'chromium'
    });
    
    await page.goto('/');
    await waitForNetworkIdle(page);
  });

  test('Test description', async ({ page, poManager }, testInfo) => {
    // Update testInfo in fixtures
    poManager.setTestInfo(testInfo);
    
    const loginPage = poManager.getLoginPage();
    
    await test.step('Step description', async () => {
      // Test actions
    });
  });
});
```

### Using Authenticated Page Fixture

For tests that require authentication, use the `authenticatedPage` fixture:

```javascript
const { test } = require('../playwright/fixtures');

test.describe('Authenticated Tests', () => {
  test('Test with pre-authenticated page', async ({ authenticatedPage, poManager }) => {
    // Page is already logged in!
    
    // Navigate directly to authenticated pages
    await authenticatedPage.goto('/inventory.html');
    
    const productsPage = poManager.getProductsPage();
    await productsPage.addProductToCart('Sauce Labs Backpack');
  });
});
```

### Basic Test Structure (Without Fixtures)

```javascript
const { test, expect } = require('@playwright/test');
const {POManager} = require('../pages/POManager');
const loginData = require('../test-data/loginData');

test.describe('Feature Tests', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    const poManager = new POManager(page, testInfo);
    const loginPage = poManager.getLoginPage();
    await page.goto('/');
  });

  test('Test description', async ({ page }, testInfo) => {
    await test.step('Step description', async () => {
      // Test actions
    });
  });
});
```

### Using Test Data

```javascript
const loginData = require('../test-data/loginData');
const productsData = require('../test-data/productsData');

// Access test data
await loginPage.loginUser(
  loginData.validUser.username,
  loginData.validUser.password
);

await productsPage.addProductToCart(productsData.product.name);
```

### Locator Chaining Example

The framework supports Playwright's powerful locator chaining:

```javascript
async addProductToCart(productName) {
  const productsLocator = await this.products.resolve();
  await productsLocator
    .filter({ hasText: productName })
    .locator('button')
    .filter({ hasText: 'Add to cart' })
    .click();
}
```

### Test Tags

Use tags to organize and filter tests:

```javascript
test('@smoke @regression @positiveLogin Test description', async () => {
  // Test implementation
});
```

Run tests by tag:
```bash
npx playwright test --grep "@smoke"
npx playwright test --grep "@regression"
```

## 🧪 Running Tests

### Using npm Scripts (Recommended)

The framework includes convenient npm scripts defined in `package.json`:

#### Run All Tests
```bash
npm test
```

#### Run Tests in UI Mode
```bash
npm run test:ui
```

#### Run Tests in Headed Mode
```bash
npm run test:headed
```

#### Run Tests in Debug Mode
```bash
npm run test:debug
```

#### Run Tests by Tag
```bash
# Run smoke tests only
npm run test:smoke

# Run regression tests only
npm run test:regression
```

#### View HTML Report
```bash
npm run test:report
```

### Using Playwright CLI Directly

You can also use Playwright CLI commands directly:

#### Run All Tests
```bash
npx playwright test
```

#### Run Specific Test File
```bash
npx playwright test tests/login.spec.js
```

#### Run Tests by Tag
```bash
npx playwright test --grep "@smoke"
npx playwright test --grep "@regression"
```

#### Run Tests in UI Mode
```bash
npx playwright test --ui
```

#### Run Tests in Debug Mode
```bash
npx playwright test --debug
```

#### Run Tests in Headed Mode
```bash
npx playwright test --headed
```

#### Generate and View HTML Report
```bash
npx playwright test
npx playwright show-report
```

## 📊 Configuration

### Playwright Configuration

Key settings in `playwright.config.js`:

- **Base URL**: Configurable via `BASE_URL` environment variable (default: `https://www.saucedemo.com/`)
- **Browser**: Configurable via `BROWSER` environment variable (default: `chromium`)
- **Headless Mode**: Configurable via `HEADLESS` environment variable (default: `true`)
- **Retries**: 2 retries on CI, configurable via `RETRIES` environment variable locally
- **Workers**: Parallel execution (1 on CI)
- **Reporter**: 
  - HTML reporter (always) - Enhanced with better options
  - List reporter - Clean console output
  - JUnit XML reporter (CI only) - for GitHub Actions integration
- **Traces**: Retained on failure for better debugging
- **Screenshots**: Captured on failure
- **Videos**: Retained on failure
- **Timeouts**: Configurable via `TIMEOUT` environment variable (default: 30000ms)
- **Projects**: Ready for cross-browser testing (Chrome, Firefox, Safari)

### Environment Variables

The framework supports environment-based configuration via `.env` file:

#### Available Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BASE_URL` | Application base URL | `https://www.saucedemo.com/` |
| `BROWSER` | Browser to use (`chromium`, `firefox`, `webkit`) | `chromium` |
| `HEADLESS` | Run in headless mode (`true`/`false`) | `true` |
| `TIMEOUT` | Action and navigation timeout (ms) | `30000` |
| `RETRIES` | Number of retries for failed tests | `0` (local), `2` (CI) |
| `DEFAULT_USERNAME` | Default username for authentication | `standard_user` |
| `DEFAULT_PASSWORD` | Default password for authentication | `secret_sauce` |
| `AI_PROVIDER` | AI provider to use (`openai`, `google`, `xai`, `grok`) | `openai` |
| `AI_HEALING` | Enable AI-powered locator healing (`true`/`false`) | `false` |
| `OPENAI_API_KEY` | OpenAI API key (required if `AI_PROVIDER=openai`) | (required if using OpenAI) |
| `GOOGLE_API_KEY` | Google Gemini API key (required if `AI_PROVIDER=google`) | (required if using Google) |
| `XAI_API_KEY` | xAI/Grok API key (required if `AI_PROVIDER=xai` or `grok`) | (required if using xAI) |
| `OPENAI_MODEL` | OpenAI model to use (e.g., `gpt-4o-mini`) | `gpt-4o-mini` |
| `GOOGLE_MODEL` | Google model to use (e.g., `gemini-pro`) | `gemini-pro` |
| `XAI_MODEL` | xAI/Grok model to use (e.g., `grok-beta`) | `grok-beta` |
| `CI` | Automatically detected for CI/CD environments | `false` |

#### Creating Environment File

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your values:
   ```env
   BASE_URL=https://www.saucedemo.com/
   BROWSER=chromium
   HEADLESS=true
   TIMEOUT=30000
   RETRIES=0
   DEFAULT_USERNAME=standard_user
   DEFAULT_PASSWORD=secret_sauce
   
   # Optional: AI-powered locator healing
   # Choose one provider: openai, google, or xai/grok
   AI_PROVIDER=xai
   AI_HEALING=true
   
   # Provider-specific API keys (only set the one you're using)
   # OPENAI_API_KEY=sk-your-api-key-here
   # GOOGLE_API_KEY=your-api-key-here
   XAI_API_KEY=xai-your-api-key-here
   
   # Optional: Override default models
   # XAI_MODEL=grok-beta
   ```

3. The framework automatically loads `.env` file on startup

**Note**: `.env` file is gitignored. Use `.env.example` as a template for team members.

#### AI Provider Options

The framework supports multiple AI providers for locator healing. Choose based on your needs:

| Provider | Pros | Cons | Best For |
|----------|------|------|----------|
| **xAI/Grok** | 🚀 Fast, OpenAI-compatible API, good performance | Paid service | Teams wanting OpenAI-compatible alternative |
| **Google Gemini** | 🆓 Free tier available, good performance | Rate limits on free tier | Budget-conscious projects |
| **OpenAI** | 🏆 High quality, widely used | Quota limits, paid | Teams already using OpenAI |

**Recommendation**: Use **xAI/Grok** if you want an OpenAI-compatible API with good performance. It works great for locator generation and uses the same API format as OpenAI.

## 📈 Enhanced Reporting

### Report Features

The framework includes enhanced reporting capabilities:

- **Interactive HTML Reports**: Rich, interactive web-based reports
- **GitHub Pages Deployment**: Reports automatically published to GitHub Pages for easy access
- **Automatic Screenshots**: Captured on failure and at key test points
- **Video Recording**: Full test execution videos for failed tests
- **Trace Viewer**: Interactive trace playback for debugging
- **Test Metadata**: Custom metadata and annotations
- **Step-by-Step View**: Detailed breakdown of test execution
- **Filtering & Search**: Easy navigation through test results

### Helper Utilities

The framework provides several helper utilities located in `helpers/` directory:

#### Report Helper (`helpers/reportHelper.js`)

Enhance your test reports with metadata, screenshots, and annotations:

```javascript
const { addMetadata, attachScreenshot, addAnnotation } = require('../helpers/reportHelper');

test('Enhanced test', async ({ page }, testInfo) => {
  // Add metadata
  addMetadata(testInfo, {
    'product-name': 'Sauce Labs Backpack',
    'test-environment': 'staging'
  });
  
  // Add custom screenshot
  await attachScreenshot(testInfo, page, 'after-login');
  
  // Add annotation
  addAnnotation(testInfo, 'User logged in successfully', 'info');
});
```

#### Wait Helper (`helpers/waitHelper.js`)

Custom wait utilities for better control over waits:

```javascript
const { waitForVisible, waitForNetworkIdle, waitForURL, waitWithRetry } = require('../helpers/waitHelper');

// Wait for element to be visible
await waitForVisible(page.locator('#button'), 5000);

// Wait for network to be idle
await waitForNetworkIdle(page);

// Wait for specific URL
await waitForURL(page, /\/inventory\.html$/);

// Wait with retry mechanism
await waitWithRetry(async () => {
  await page.locator('#element').click();
}, 3, 1000);
```

**Available Wait Functions:**
- `waitForVisible(locator, timeout)` - Wait for element to be visible
- `waitForHidden(locator, timeout)` - Wait for element to be hidden
- `waitForAttached(locator, timeout)` - Wait for element to be attached to DOM
- `waitForNetworkIdle(page, timeout)` - Wait for network to be idle
- `waitForURL(page, url, timeout)` - Wait for specific URL
- `waitForText(locator, text, timeout)` - Wait for element text to match
- `waitWithRetry(fn, maxRetries, delay)` - Retry mechanism

### Best Practices for Reports

1. **Use Test Steps**: Break tests into logical, named steps
2. **Add Screenshots**: Capture state at key decision points
3. **Include Metadata**: Add context about test data and environment
4. **Use Descriptive Names**: Make test names self-explanatory
5. **Organize with Tags**: Use tags for easy filtering

For detailed reporting guide, see [docs/REPORTING_GUIDE.md](docs/REPORTING_GUIDE.md)

### Viewing Reports on GitHub Pages

After enabling GitHub Pages (see [docs/GITHUB_PAGES_SETUP.md](docs/GITHUB_PAGES_SETUP.md)), your test reports will be automatically available at:

```
https://[your-username].github.io/[repository-name]/
```

**Benefits**:
- ✅ No need to download artifacts
- ✅ Share reports with a simple URL
- ✅ Reports update automatically after each test run
- ✅ Accessible from anywhere with internet connection

**Note**: Reports are only deployed from `main`, `master`, or `develop` branches.

## 🎭 Test Fixtures

The framework provides custom fixtures for better test organization and code reuse.

### Available Fixtures

#### 1. `authenticatedPage`
Pre-authenticated page fixture - automatically logs in before test:

```javascript
const { test } = require('../playwright/fixtures');

test('Test with authenticated page', async ({ authenticatedPage, poManager }) => {
  // Page is already logged in!
  await authenticatedPage.goto('/inventory.html');
  const productsPage = poManager.getProductsPage();
  // Continue with test...
});
```

#### 2. `poManager`
POM Manager fixture - provides centralized page object access:

```javascript
test('Test with POM Manager', async ({ page, poManager }, testInfo) => {
  poManager.setTestInfo(testInfo);
  const loginPage = poManager.getLoginPage();
  const productsPage = poManager.getProductsPage();
  // Use page objects...
});
```

### Using Fixtures

1. **Import from fixtures**:
   ```javascript
   const { test } = require('../playwright/fixtures');
   ```

2. **Use in test functions**:
   ```javascript
   test('My test', async ({ authenticatedPage, poManager }, testInfo) => {
     // Set testInfo when available
     poManager.setTestInfo(testInfo);
     
     // Use fixtures...
   });
   ```

## 🔧 Creating New Page Objects

### Step 1: Create Page Class

```javascript
const {BasePage} = require('./BasePage');

class NewPage extends BasePage {
  constructor(page, testInfo) {
    super(page, testInfo);
    
    // Define locators with multiple selectors
    this.someElement = this.locator(
      "#primary-selector",
      ".alternative-selector",
      "selector3"
    );
  }
  
  // Define page methods
  async someAction() {
    await this.someElement.click();
  }
}

module.exports = {NewPage};
```

### Step 2: Add to POManager

```javascript
const {NewPage} = require('./NewPage');

class POManager {
  // ... existing code ...
  
  getNewPage() {
    if (!this._newPage) {
      this._newPage = new NewPage(this.page, this.testInfo);
    }
    return this._newPage;
  }
}
```

### Step 3: Use in Tests

```javascript
const poManager = new POManager(page, testInfo);
const newPage = poManager.getNewPage();
```

## 📦 Test Data Management

### Structure

Test data is stored in `test-data/` directory as JavaScript modules:

```javascript
// test-data/exampleData.js
module.exports = {
  validData: {
    field1: 'value1',
    field2: 'value2'
  },
  invalidData: [
    { field1: 'invalid1', error: 'Error message 1' },
    { field2: 'invalid2', error: 'Error message 2' }
  ]
};
```

### Usage

```javascript
const exampleData = require('../test-data/exampleData');

// Use in tests
await page.fillField(exampleData.validData.field1);
```

## 🔍 Self-Healing System Details

### How Healing Works

1. **Primary Attempt**: Tries all predefined selectors in order
2. **Healing Trigger**: If all selectors fail, healing is activated
3. **Candidate Generation**: Creates selector candidates based on logical name
4. **Testing**: Tries each candidate until one works
5. **Persistence**: Saves successful selector to `healerStore.json`
6. **Future Use**: Uses persisted selector in subsequent runs

### Healing Store

The `healerStore.json` file stores successful healed selectors:

```json
{
  "products": ".inventory_item",
  "loginButton": "#login-button"
}
```

These selectors are automatically used in future test runs, improving reliability.

### Customizing Healing

To customize healing behavior, modify `healing/traceHealer.js`:

```javascript
// Add custom candidates for specific patterns
if (key === 'customPattern') {
  specialCandidates.push('.custom-selector', '[data-custom*="value"]');
}
```

## 🚀 CI/CD Integration

### GitHub Actions

The framework includes a comprehensive GitHub Actions workflow (`.github/workflows/playwright.yml`) that automatically runs tests when code is pushed to the repository.

#### Features

- **Automatic Triggering**: Runs on push and pull requests to `main`, `master`, and `develop` branches
- **Optimized Builds**: 
  - npm caching for faster dependency installation
  - Efficient browser installation
- **Comprehensive Reporting**:
  - HTML test reports (downloadable artifact)
  - Test results including screenshots and videos (downloadable artifact)
  - **GitHub Pages Deployment**: Reports automatically published to GitHub Pages
  - Both artifacts retained for 30 days
- **CI-Optimized Configuration**:
  - Uses `npm test` script for consistency
  - Automatic retry on failure (2 retries)
  - Single worker for stability in CI environment

#### Setting Up GitHub Secrets

To use AI-powered locator healing in GitHub Actions, you need to configure GitHub Secrets:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add the following secrets:

   | Secret Name | Description | Required | Get API Key |
   |------------|-------------|----------|------------|
   | `AI_PROVIDER` | AI provider: `openai`, `google`, or `xai`/`grok` | Optional (defaults to `openai`) | - |
   | `AI_HEALING` | Set to `true` to enable AI healing | Optional (defaults to `false`) | - |
   | `OPENAI_API_KEY` | OpenAI API key (starts with `sk-`) | Only if `AI_PROVIDER=openai` | [OpenAI](https://platform.openai.com/api-keys) |
   | `GOOGLE_API_KEY` | Google Gemini API key | Only if `AI_PROVIDER=google` | [Google AI Studio](https://makersuite.google.com/app/apikey) |
   | `XAI_API_KEY` | xAI/Grok API key (starts with `xai-`) | Only if `AI_PROVIDER=xai` or `grok` | [xAI Console](https://console.x.ai/) |
   | `BASE_URL` | Application base URL | Optional (has default) | - |
   | `BROWSER` | Browser to use (`chromium`, `firefox`, `webkit`) | Optional (defaults to `chromium`) | - |
   | `HEADLESS` | Run in headless mode (`true`/`false`) | Optional (defaults to `true`) | - |

**Recommended Providers:**
- **xAI/Grok**: Fast, OpenAI-compatible API, good performance
- **Google Gemini**: Free tier available, good performance
- **OpenAI**: High quality but has quota limits

**Note**: If `AI_HEALING` is set to `true` but the required API key is not provided, AI healing will be skipped and the framework will fall back to CSS-based healing.

#### Workflow Steps

1. **Checkout**: Checks out the repository code
2. **Setup Node.js**: Sets up Node.js with npm caching enabled
3. **Install Dependencies**: Runs `npm ci` for clean, reproducible builds
4. **Install Browsers**: Installs Playwright browsers with system dependencies
5. **Run Tests**: Executes all Playwright tests using `npm test` with environment variables from GitHub Secrets
6. **Upload Artifacts**: Uploads test reports and results (even on failure)
7. **Deploy to GitHub Pages**: Automatically publishes HTML reports to GitHub Pages

#### Accessing Results

##### Option 1: GitHub Pages (Recommended)

Test reports are automatically published to GitHub Pages and accessible via a public URL:

**URL Format**: `https://[your-username].github.io/[repository-name]/`

**Example**: If your repository is `PlaywrightPOMFramework` and username is `yourusername`, the report will be at:
```
https://yourusername.github.io/PlaywrightPOMFramework/
```

**Setup Required**:
1. Go to repository **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Save the settings

The report will be automatically updated on every push to `main`, `master`, or `develop` branches.

For detailed setup instructions, see [docs/GITHUB_PAGES_SETUP.md](docs/GITHUB_PAGES_SETUP.md)

##### Option 2: Download Artifacts

After a workflow run completes:
1. Go to the **Actions** tab in your GitHub repository
2. Click on the workflow run
3. Download artifacts from the workflow summary:
   - `playwright-report`: HTML test report
   - `test-results`: Test execution results, screenshots, and videos

### GitHub Pages Integration

The framework automatically deploys test reports to GitHub Pages, making them accessible via a public URL. This provides:

- **Easy Access**: Share reports with team members via a simple URL
- **Automatic Updates**: Reports update automatically on every test run
- **No Downloads Required**: View reports directly in the browser
- **Public Sharing**: Share test results with stakeholders easily

**Note**: For private repositories, you need GitHub Pro, Team, or Enterprise account to use GitHub Pages.

### Customizing CI/CD

Modify `.github/workflows/playwright.yml` for your CI/CD needs:
- **Change trigger branches**: Update the `branches` array in `on.push` and `on.pull_request`
- **Adjust timeout**: Modify `timeout-minutes` value
- **Configure artifact retention**: Change `retention-days` in artifact upload steps
- **Add notification steps**: Add Slack, email, or other notification integrations
- **Add matrix strategy**: Test against multiple Node.js versions or browsers
- **Disable GitHub Pages**: Remove the `deploy` job if you don't want Pages deployment

## 📈 Best Practices

### 1. Locator Strategy
- Always provide multiple selector options
- Use logical names for locators
- Prefer stable selectors (data-test attributes, IDs)

### 2. Test Organization
- Group related tests in describe blocks
- Use descriptive test names
- Tag tests appropriately (@smoke, @regression, etc.)
- Use fixtures for common setup (authentication, etc.)

### 3. Page Objects
- Keep page objects focused on single pages
- Use meaningful method names
- Return values when appropriate for assertions
- Use POManager for centralized access

### 4. Test Data
- Externalize all test data
- Use descriptive variable names
- Organize data logically

### 5. Assertions
- Use Playwright's expect API
- Make assertions specific and meaningful
- Validate both positive and negative scenarios

### 6. Environment Configuration
- Use `.env` file for environment-specific settings
- Never commit `.env` file (use `.env.example` as template)
- Use environment variables for sensitive data

### 7. Logging and Reporting
- Add metadata to tests for better reporting
- Capture screenshots at key decision points
- Use wait helpers for reliable waits

### 8. Fixtures Usage
- Use `authenticatedPage` for tests requiring login
- Set `testInfo` in fixtures when available
- Leverage fixtures to reduce code duplication

## 🐛 Troubleshooting

### Tests Failing Due to Locators

1. Check `healerStore.json` for persisted selectors
2. Clear the store if selectors are outdated: `{}`
3. Verify selectors in browser DevTools
4. Check healing logs for attempted selectors

### Healing Not Working

1. Ensure logical names are provided to locators
2. Check `traceHealer.js` for candidate generation logic
3. Verify page is loaded before locator resolution
4. Review healing console logs

### Performance Issues

1. Reduce parallel workers if needed
2. Optimize selector strategies
3. Use more specific selectors
4. Review test execution time in reports

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

## 🤝 Contributing

When adding new features:
1. Follow existing code patterns
2. Update this README if needed
3. Add appropriate test coverage
4. Ensure all tests pass

## 📄 License

ISC

---

**Happy Testing! 🎉**

