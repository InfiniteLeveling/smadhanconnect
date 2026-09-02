import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import handler from '../api/chat.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Samadhan AI Chatbot Server',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// Proxy to the master handler
app.post('/api/chat', async (req, res) => {
  await handler(req, res);
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Samadhan AI] Server running on http://localhost:${PORT}`);
    console.log(`[Samadhan AI] Gemini API Key configured: ${!!process.env.GEMINI_API_KEY}`);
  });
}

export default app;
