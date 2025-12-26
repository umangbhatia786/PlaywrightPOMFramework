const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const OpenAI = require('openai');

if (!process.env.OPENAI_API_KEY) {
  throw new Error('❌ OPENAI_API_KEY not set');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function healWithChatGptMcp(context) {
  // Extract DOM directly from Playwright page instead of using MCP server
  const dom = await context.page.evaluate(() => {
    return document.documentElement.outerHTML;
  });

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content:
          'You are a senior Playwright automation engineer. ' +
          'Return ONLY a stable Playwright locator string (CSS selector or text-based locator). ' +
          'Do not include any explanation or additional text, just the locator.'
      },
      {
        role: 'user',
        content: `
Element intent: ${context.logicalName}
Current URL: ${context.url}

Find a stable Playwright locator for an element that matches the intent "${context.logicalName}".

DOM:
${dom.slice(0, 12000)}
`
      }
    ]
  });

  return response.choices[0].message.content.trim();
}

module.exports = { healWithChatGptMcp };
