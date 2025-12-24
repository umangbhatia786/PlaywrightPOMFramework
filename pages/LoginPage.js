const {BasePage} = require('./BasePage');
const {expect} = require("@playwright/test");

class LoginPage extends BasePage {

    constructor(page, testInfo) {
        super(page, testInfo);
        this.userName = this.locator(
            "#user-name",
            "input[placeholder='Username']",
            "input[name='user-name']"
        );
        this.password = this.locator(
            "#password",
            "input[id='password']",
            "input[placeholder='Password']",
            "inout[type='password']",
            "input[name='password']"
        );
        this.loginButton = this.locator(
            "#login-button",
            "input[type='submit']",
            "input[value='Login']"
        );
        this.errorMessage = this.locator(
            "h3",
            "h3[data-test='error']"
        );
        this.cartButton = this.locator(
            ".shopping_cart_link",
            "a[data-test='shopping-cart-link']"
        );
    }

    async loginUser(userName, pwd) {
        await this.userName.fill(userName);
        await this.password.fill(pwd);
        await this.loginButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async validateLoginSuccess() {
        await expect(this.page).toHaveURL(/\/inventory\.html$/);
        const cartButtonLocator = await this.cartButton.resolve();
        await expect(cartButtonLocator).toBeVisible();

    }

    async validateLoginError(expectedErrorText) {
        const actualError = await this.errorMessage.text();
        await expect(actualError).toBe(expectedErrorText);
    }
}

module.exports = {LoginPage};