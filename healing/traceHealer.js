const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function healFromTrace(page, testInfo, logicalName) {
  console.log(`🧠 Healing: ${logicalName}`);

  // Try AI healing if enabled
  if (process.env.AI_HEALING === 'true') {
    const provider = process.env.AI_PROVIDER || 'openai';
    try {
      const { healWithAI } = require('./aiHealer');
      console.log(`🤖 Attempting AI healing (${provider}) for ${logicalName}`);
      
      const selector = await healWithAI({
        logicalName,
        url: page.url(),
        page: page
      });

      // Validate the healed selector
      if (await page.locator(selector).count() > 0) {
        persist(logicalName, selector);
        console.log(`✅ AI healed using ${selector}`);
        return selector;
      } else {
        console.log(`⚠️ AI returned invalid selector, falling back to CSS healing`);
      }
    } catch (error) {
      // Provide more detailed error information
      let errorMsg = error.message;
      if (error.response || error.data) {
        const errorData = error.response?.data || error.data;
        errorMsg = `API Error: ${JSON.stringify(errorData)}`;
      }
      console.log(`⚠️ AI healing failed (${provider}): ${errorMsg}, falling back to CSS healing`);
    }
  }

  // Fallback to CSS-based healing
  return await cssBasedHealing(page, logicalName);
}

async function cssBasedHealing(page, logicalName) {
  const key = logicalName.split('.').pop();
  const lowerKey = key.toLowerCase();

  let candidates = [];

  // Prioritize inventory-related selectors for 'products' or 'item' logical names
  if (lowerKey.includes('product') || lowerKey.includes('item')) {
    candidates.push(
      '.inventory_item',
      'div.inventory_item',
      '.inventory_item_name',
      'div.inventory_item_name'
    );
  }

  // General CSS selector candidates
  candidates.push(
    `.${key}`, // Direct class selector
    `[class*="${key}"]`, // Class attribute contains key
    `[data-test*="${key}"]`,
    `[name*="${key}"]`,
    `[id*="${key}"]`
  );

  for (const selector of candidates) {
    try {
      const el = page.locator(selector);
      if (await el.count() > 0) {
        persist(logicalName, selector);
        console.log(`✅ CSS healed using ${selector}`);
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
