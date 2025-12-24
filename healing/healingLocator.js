const { healFromTrace } = require('./traceHealer');

class HealingLocator {
  constructor(page, defs, logicalName, testInfo) {
    this.page = page;
    this.locatorDefs = defs;
    this.logicalName = logicalName;
    this.testInfo = testInfo;
  }

  async resolve() {
    for (const def of this.locatorDefs) {
      try {
        const el = typeof def === 'function'
          ? def()
          : this.page.locator(def);

        await el.waitFor({ state: 'attached', timeout: 1500 });
        return el;
      } catch {}
    }

    console.log(`🧠 Healing: ${this.logicalName}`);
    const healed = await healFromTrace(
      this.page,
      this.testInfo,
      this.logicalName
    );
    return this.page.locator(healed);
  }

  async click() {
    const el = await this.resolve();
    await el.click();
  }

  async fill(value) {
    const el = await this.resolve();
    await el.fill(value);
  }

  async text() {
    const el = await this.resolve();
    return el.textContent();
  }
}

module.exports = {HealingLocator};
