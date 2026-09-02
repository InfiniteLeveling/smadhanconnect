import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import handler from './api/chat.js';

function geminiDevApiPlugin(env) {
  return {
    name: 'gemini-chat-api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/api/chat')) {
          // Pass server environment variables
          process.env.GEMINI_API_KEY = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

          if (req.method === 'OPTIONS') {
            res.statusCode = 200;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            res.end();
            return;
          }

          if (req.method === 'POST') {
            let bodyStr = '';
            req.on('data', chunk => {
              bodyStr += chunk;
            });
            req.on('end', async () => {
              try {
                req.body = bodyStr ? JSON.parse(bodyStr) : {};
              } catch {
                req.body = {};
              }

              // Polyfill res.status and res.json for Express/Vercel handler compatibility
              res.status = (code) => {
                res.statusCode = code;
                return res;
              };
              res.json = (data) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
                return res;
              };

              try {
                await handler(req, res);
              } catch (err) {
                console.error('[Vite Gemini Middleware] Handler Error:', err);
                if (!res.writableEnded) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
                }
              }
            });
            return;
          }
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      geminiDevApiPlugin(env)
    ],
  };
});

