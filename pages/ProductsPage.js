const {BasePage} = require('./BasePage');
const {expect} = require("@playwright/test");
const { waitForNetworkIdle } = require('../helpers/waitHelper');

class ProductsPage extends BasePage {

    constructor(page, testInfo) {
        super(page, testInfo);
        this.userName = this.locator(
            "#user-name",
            "input[placeholder='Username']",
            "input[name='user-name']"
        );

        this.products = this.locator(
            [".inventory_item", "div[class='inventory_item']"],
            "products"
        );

        this.cartButton = this.locator(
            ".shopping_cart_link",
            "a[data-test='shopping-cart-link']"
        );
    }

    async addProductToCart(productName) {
        // Using Playwright locator chaining with this.products: resolve and chain
        const productsLocator = await this.products.resolve();
        await productsLocator
            .filter({ hasText: productName })
            .locator('button')
            .filter({ hasText: 'Add to cart' })
            .click();
    }

    async goToCart() {
        await this.cartButton.click();
        await waitForNetworkIdle(this.page);
    }

}

module.exports = {ProductsPage};