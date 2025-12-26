const { expect } = require('@playwright/test');
const {BasePage} = require('./BasePage');
const { waitForNetworkIdle } = require('../helpers/waitHelper');

class ChekoutPage extends BasePage {
  constructor(page, testInfo) {
    super(page, testInfo);
    this.firstName = this.locator(
        "#first-name",
        "input[placeholder='First Name']",
        "input[name='firstName']"
    );
    this.lastName = this.locator(
        "#last-name",
        "input[placeholder='Last Name']",
        "input[name='lastName']"
    );
    this.zipCode = this.locator(
        "#postal-code",
        "input[placeholder='Zip/Postal Code']",
        "input[name='postalCode']"
    );
  }

  async validateCartItemName(expectedName) {
    const cartItemNameLocator = await this.cartItemName.resolve();
    await expect(cartItemNameLocator).toBeVisible();
    await expect(cartItemNameLocator).toHaveText(expectedName);
  }

  async validateQuantity(expectedQuantity) {
    const cartItemQuantityLocator = await this.cartItemQuantity.resolve();
    await expect(cartItemQuantityLocator).toBeVisible();
    await expect(cartItemQuantityLocator).toHaveText(expectedQuantity);
  }

  async validatePrice(expectedPrice) {
    const cartItemPriceLocator = await this.cartItemPrice.resolve();
    await expect(cartItemPriceLocator).toBeVisible();
    await expect(cartItemPriceLocator).toHaveText(expectedPrice);
  }

  async clickCheckout() {
    await this.checkoutButton.click();
    await waitForNetworkIdle(this.page);
  }
}

module.exports = {CartPage};
