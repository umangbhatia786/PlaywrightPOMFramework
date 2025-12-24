const {LoginPage} = require('./LoginPage');
const {ProductsPage} = require('./ProductsPage');
const {CartPage} = require('./CartPage');

class POManager {
  constructor(page, testInfo) {
    this.page = page;
    this.testInfo = testInfo;

    // Lazy initialization
    this._loginPage = null;
    this._productsPage = null;
    this._cartPage = null;
  }

  getLoginPage() {
    if (!this._loginPage) {
      this._loginPage = new LoginPage(this.page, this.testInfo);
    }
    return this._loginPage;
  }

  getProductsPage() {
    if (!this._productsPage) {
      this._productsPage = new ProductsPage(this.page, this.testInfo);
    }
    return this._productsPage;
  }

  getCartPage() {
    if (!this._cartPage) {
      this._cartPage = new CartPage(this.page, this.testInfo);
    }
    return this._cartPage;
  }
}

module.exports = {POManager};
