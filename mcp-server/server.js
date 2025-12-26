const express = require('express');
const { chromium } = require('playwright');

const app = express();
app.use(express.json());

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Tool: open page
  app.post('/tool/open_page', async (req, res) => {
    await page.goto(req.body.url);
    res.json({ status: 'ok' });
  });

  // Tool: get DOM
  app.post('/tool/get_dom', async (_, res) => {
    const dom = await page.content();
    res.json({ dom });
  });

  // Tool: query selector
  app.post('/tool/query_selector', async (req, res) => {
    const count = await page.locator(req.body.selector).count();
    res.json({ count });
  });

  // Tool: query by role
  app.post('/tool/query_by_role', async (req, res) => {
    const { role, name } = req.body;
    const count = await page.getByRole(role, { name }).count();
    res.json({ count });
  });

  app.listen(3333, () => {
    console.log('✅ MCP Server running on http://localhost:3333');
  });
})();
