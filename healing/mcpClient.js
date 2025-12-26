// Use Node.js built-in fetch (available in Node 18+)
const fetch = globalThis.fetch;
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const MCP_URL = process.env.MCP_SERVER_URL || 'http://localhost:3333/tool';

async function call(tool, body) {
  try {
    const res = await fetch(`${MCP_URL}/${tool}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    // Check if response is OK
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`MCP server returned ${res.status} ${res.statusText}: ${text.substring(0, 200)}`);
    }

    // Check content type
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text();
      throw new Error(`MCP server returned non-JSON response (${contentType}): ${text.substring(0, 200)}`);
    }

    return await res.json();
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.message.includes('fetch failed')) {
      throw new Error(`MCP server not available at ${MCP_URL}. Is the server running?`);
    }
    throw error;
  }
}

module.exports = {
  openPage: (url) => call('open_page', { url }),
  getDom: () => call('get_dom', {}),
  querySelector: (selector) => call('query_selector', { selector }),
  queryByRole: (role, name) => call('query_by_role', { role, name })
};
