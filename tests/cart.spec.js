const { test, expect } = require('@playwright/test');
const {POManager} = require('../pages/POManager');
const loginData = require('../test-data/loginData');
const productsData = require('../test-data/productsData');
const { addMetadata, attachScreenshot } = require('../helpers/reportHelper');

test.describe('@cart Cart Tests', () => {
  let loginPage;
  let productsPage;
  let cartPage;

  test.beforeEach(async ({ page }, testInfo) => {
    const poManager = new POManager(page, testInfo);
    loginPage = poManager.getLoginPage();
    productsPage = poManager.getProductsPage();
    cartPage = poManager.getCartPage();
    
    // Add test metadata for better reporting
    addMetadata(testInfo, {
      'test-type': 'cart',
      'browser': 'chromium',
      'environment': 'saucedemo'
    });
    
    await page.goto('/');
    
    // Login first
    await test.step('Login with valid credentials', async () => {
      await loginPage.loginUser(
        loginData.validUser.username,
        loginData.validUser.password
      );
    });
  });

  test('@smoke @regression @cart Add product to cart and validate cart details', async ({ page }, testInfo) => {
    // Add product-specific metadata
    addMetadata(testInfo, {
      'product-name': productsData.product.name,
      'product-price': productsData.product.price,
      'expected-quantity': productsData.product.quantity.toString()
    });

    await test.step('Add product to cart', async () => {
      await productsPage.addProductToCart(productsData.product.name);
      // Attach screenshot after adding product
      await attachScreenshot(testInfo, page, 'after-add-to-cart');
    });

    await test.step('Navigate to cart', async () => {
      await productsPage.goToCart();
      await attachScreenshot(testInfo, page, 'cart-page');
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
      await attachScreenshot(testInfo, page, 'cart-validation-complete');
    });
  });

});

