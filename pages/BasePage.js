const {HealingLocator} = require('../healing/HealingLocator');
const store = require('../healing/healerStore.json');

class BasePage {
  constructor(page, testInfo) {
    this.page = page;
    this.testInfo = testInfo;
  }

  locator(defs, logicalName) {
    let arr = Array.isArray(defs) ? defs : [defs];
    if (store[logicalName]) arr = [store[logicalName], ...arr];
    return new HealingLocator(this.page, arr, logicalName, this.testInfo);
  }
}

module.exports = {BasePage};
