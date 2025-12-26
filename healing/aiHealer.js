const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

/**
 * AI Provider Factory - Supports multiple AI providers
 */
class AIHealer {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'openai';
    this.apiKey = this.getApiKey();
    this.client = this.createClient();
  }

  getApiKey() {
    const provider = this.provider.toLowerCase();
    
    switch (provider) {
      case 'openai':
        return process.env.OPENAI_API_KEY;
      case 'google':
      case 'gemini':
        return process.env.GOOGLE_API_KEY;
      case 'xai':
      case 'grok':
        return process.env.XAI_API_KEY;
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }

  createClient() {
    const provider = this.provider.toLowerCase();
    
    if (!this.apiKey) {
      throw new Error(`❌ API key not set for provider: ${provider}`);
    }

    switch (provider) {
      case 'openai':
        const OpenAI = require('openai');
        return new OpenAI({ apiKey: this.apiKey });
      
      case 'google':
      case 'gemini':
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        return new GoogleGenerativeAI(this.apiKey);
      
      case 'xai':
      case 'grok':
        // xAI uses OpenAI-compatible API
        const OpenAIxAI = require('openai');
        return new OpenAIxAI({ 
          apiKey: this.apiKey,
          baseURL: 'https://api.x.ai/v1'
        });
      
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }

  async heal(context) {
    // Extract DOM directly from Playwright page
    const dom = await context.page.evaluate(() => {
      return document.documentElement.outerHTML;
    });

    const provider = this.provider.toLowerCase();
    
    switch (provider) {
      case 'openai':
        return await this.healWithOpenAI(context, dom);
      case 'google':
      case 'gemini':
        return await this.healWithGoogle(context, dom);
      case 'xai':
      case 'grok':
        return await this.healWithXAI(context, dom);
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }

  async healWithOpenAI(context, dom) {
    const response = await this.client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: 'You are a senior Playwright automation engineer. Return ONLY a stable Playwright locator string (CSS selector or text-based locator). Do not include any explanation or additional text, just the locator.'
        },
        {
          role: 'user',
          content: `Element intent: ${context.logicalName}\nCurrent URL: ${context.url}\n\nFind a stable Playwright locator for an element that matches the intent "${context.logicalName}".\n\nDOM:\n${dom.slice(0, 12000)}`
        }
      ]
    });
    return response.choices[0].message.content.trim();
  }

  async healWithGoogle(context, dom) {
    const model = this.client.getGenerativeModel({ 
      model: process.env.GOOGLE_MODEL || 'gemini-pro' 
    });
    
    const prompt = `You are a senior Playwright automation engineer. Return ONLY a stable Playwright locator string (CSS selector or text-based locator). Do not include any explanation or additional text, just the locator.

Element intent: ${context.logicalName}
Current URL: ${context.url}

Find a stable Playwright locator for an element that matches the intent "${context.logicalName}".

DOM:
${dom.slice(0, 12000)}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  }

  async healWithXAI(context, dom) {
    try {
      const response = await this.client.chat.completions.create({
        model: process.env.XAI_MODEL || 'grok-beta',
        temperature: 0,
        messages: [
          {
            role: 'system',
            content: 'You are a senior Playwright automation engineer. Return ONLY a stable Playwright locator string (CSS selector or text-based locator). Do not include any explanation or additional text, just the locator.'
          },
          {
            role: 'user',
            content: `Element intent: ${context.logicalName}\nCurrent URL: ${context.url}\n\nFind a stable Playwright locator for an element that matches the intent "${context.logicalName}".\n\nDOM:\n${dom.slice(0, 12000)}`
          }
        ]
      });
      return response.choices[0].message.content.trim();
    } catch (error) {
      // Better error handling for xAI API errors
      if (error.response) {
        const errorData = error.response.data || error.response;
        throw new Error(`xAI API error: ${JSON.stringify(errorData)}`);
      }
      throw error;
    }
  }
}

async function healWithAI(context) {
  const healer = new AIHealer();
  return await healer.heal(context);
}

module.exports = { healWithAI, AIHealer };

