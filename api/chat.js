import { GoogleGenAI } from '@google/genai';
import { 
  SAMADHAN_SYSTEM_PROMPT, 
  ALLOWED_DOMAINS, 
  OUT_OF_DOMAIN_RESPONSE 
} from '../server/config/chatbotPrompt.js';

/**
 * Serverless / Node HTTP API Handler for POST /api/chat
 * Securely communicates with Google Gemini 2.5 Pro via @google/genai SDK.
 */
export default async function handler(req, res) {
  // Enable CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method Not Allowed. Only POST requests are supported.' 
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { message, history = [] } = body;

    // 1. Validate Input
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ 
        error: 'Invalid request: "message" field is required and cannot be empty.' 
      });
    }

    const trimmedMessage = message.trim();

    // 2. Validate API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('[Samadhan AI] Missing GEMINI_API_KEY environment variable on server.');
      return res.status(503).json({
        error: 'Gemini API key is not configured on the server. Please set GEMINI_API_KEY in your server environment variables.',
        isConfigError: true
      });
    }

    // 3. Initialize Google Gen AI SDK
    const ai = new GoogleGenAI({ apiKey });

    // 4. Format Conversation History (limit to last 10 messages)
    const validHistory = Array.isArray(history) ? history.slice(-10) : [];
    
    const formattedContents = [];
    
    for (const item of validHistory) {
      const rawText = item.text || item.content || item.message;
      if (rawText && typeof rawText === 'string') {
        const isUser = item.sender === 'user' || item.role === 'user';
        formattedContents.push({
          role: isUser ? 'user' : 'model',
          parts: [{ text: rawText }]
        });
      }
    }

    // Append current user message
    formattedContents.push({
      role: 'user',
      parts: [{ text: trimmedMessage }]
    });

    // 5. Call Gemini 2.5 Pro with System Instruction
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Gemini API request timed out after 30 seconds.')), 30000)
    );

    const generatePromise = ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: formattedContents,
      config: {
        systemInstruction: SAMADHAN_SYSTEM_PROMPT,
        temperature: 0.3,
        maxOutputTokens: 1200,
      }
    });

    const response = await Promise.race([generatePromise, timeoutPromise]);

    const replyText = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!replyText) {
      throw new Error('Empty response received from Gemini API.');
    }

    return res.status(200).json({
      reply: replyText.trim(),
      status: 'success'
    });

  } catch (error) {
    console.error('[Samadhan AI] Error handling chat request:', error);

    const errorMessage = error.message || 'An unexpected error occurred while processing your request.';
    const isRateLimit = errorMessage.includes('429') || errorMessage.toLowerCase().includes('quota') || errorMessage.toLowerCase().includes('rate limit');
    const isTimeout = errorMessage.includes('timed out');

    return res.status(isRateLimit ? 429 : 500).json({
      error: isRateLimit
        ? 'Gemini API rate limit reached. Please wait a moment and try again.'
        : isTimeout
        ? 'The request timed out. Please check your connection and try again.'
        : `Samadhan AI service notice: ${errorMessage}`,
      reply: isRateLimit
        ? '⚠️ High traffic notice: The AI assistant is currently experiencing high demand. Please retry in a few seconds.'
        : '⚠️ I encountered a temporary connection issue while reaching the AI engine. Please try sending your question again.'
    });
  }
}
