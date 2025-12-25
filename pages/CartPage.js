const { expect } = require('@playwright/test');
const {BasePage} = require('./BasePage');
const { waitForNetworkIdle } = require('../helpers/waitHelper');

class CartPage extends BasePage {
  constructor(page, testInfo) {
    super(page, testInfo);
    this.cartItemName = this.locator('.inventory_item_name', 'cartItemName');
    this.cartItemQuantity = this.locator('.cart_quantity', 'cartItemQuantity');
    this.cartItemPrice = this.locator('.inventory_item_price', 'cartItemPrice');
    this.checkoutButton = this.locator(
      "#checkout",
      "button[data-test='checkout']"
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
