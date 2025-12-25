const { test, expect } = require('../playwright/fixtures');
const productsData = require('../test-data/productsData');
const { addMetadata, attachScreenshot } = require('../helpers/reportHelper');
const { waitForNetworkIdle } = require('../helpers/waitHelper');

test.describe('@cart Cart Tests', () => {
  test.beforeEach(async ({ authenticatedPage, poManager }, testInfo) => {
    // Set testInfo in fixtures when available
    poManager.setTestInfo(testInfo);
    
    // Add test metadata for better reporting
    addMetadata(testInfo, {
      'test-type': 'cart',
      'browser': 'chromium',
      'environment': 'saucedemo'
    });
    
    // Page is already authenticated via authenticatedPage fixture
    await waitForNetworkIdle(authenticatedPage);
  });

  test('@smoke @regression @cart Add product to cart and validate cart details', async ({ authenticatedPage, poManager }, testInfo) => {
    // Update testInfo in fixtures
    poManager.setTestInfo(testInfo);
    
    const productsPage = poManager.getProductsPage();
    const cartPage = poManager.getCartPage();
    
    // Add product-specific metadata
    addMetadata(testInfo, {
      'product-name': productsData.product.name,
      'product-price': productsData.product.price,
      'expected-quantity': productsData.product.quantity.toString()
    });

    await test.step('Add product to cart', async () => {
      await productsPage.addProductToCart(productsData.product.name);
      await waitForNetworkIdle(authenticatedPage);
      // Attach screenshot after adding product
      await attachScreenshot(testInfo, authenticatedPage, 'after-add-to-cart');
    });

    await test.step('Navigate to cart', async () => {
      await productsPage.goToCart();
      await waitForNetworkIdle(authenticatedPage);
      await attachScreenshot(testInfo, authenticatedPage, 'cart-page');
    });

    await test.step('Validate cart item name', async () => {
      await cartPage.validateCartItemName(productsData.product.name);
    });

    await test.step('Validate cart item quantity', async () => {
      await cartPage.validateQuantity(productsData.product.quantity.toString());
    });

    await test.step('Validate cart item price', async () => {
      await cartPage.validatePrice(productsData.product.price);
      // Final screenshot showing successful validation
      await attachScreenshot(testInfo, authenticatedPage, 'cart-validation-complete');
    });
  });

});

