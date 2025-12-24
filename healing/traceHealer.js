const fs = require('fs');

async function healFromTrace(page, testInfo, logicalName) {
  const key = logicalName.split('.').pop();
  
  // Special handling for common patterns
  const specialCandidates = [];
  if (key === 'products' || key.includes('product') || key.includes('item')) {
    specialCandidates.push('.inventory_item', '[class*="inventory_item"]', '.inventory_item_description');
  }
  
  const candidates = [
    ...specialCandidates,
    `.${key}`, // Class selector
    `[class*="${key}"]`, // Class attribute contains key
    `[data-test*="${key}"]`,
    `[name*="${key}"]`,
    `[id*="${key}"]`
    // Removed text=${key} as it's too generic and can match wrong elements
  ];

  for (const selector of candidates) {
    try {
      const el = page.locator(selector);
      const count = await el.count();
      if (count > 0) {
        persist(logicalName, selector);
        console.log(`✅ Healed using ${selector}`);
        return selector;
      }
    } catch (e) {
      // Continue to next candidate
    }
  }
  throw new Error(`Healing failed: ${logicalName}`);
}

function persist(key, selector) {
  const path = './healing/healerStore.json';
  const store = fs.existsSync(path)
    ? JSON.parse(fs.readFileSync(path))
    : {};
  store[key] = selector;
  fs.writeFileSync(path, JSON.stringify(store, null, 2));
}

module.exports = { healFromTrace };
