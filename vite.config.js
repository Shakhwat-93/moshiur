import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-serverless-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (!req.url?.startsWith('/api/')) return next();

          try {
            const parsedUrl = new URL(req.url, 'http://localhost:5500');
            const urlPath = parsedUrl.pathname;
            req.query = Object.fromEntries(parsedUrl.searchParams.entries());

            let handlerModule = null;

            if (urlPath === '/api/courier-check') {
              handlerModule = await import('./api/courier-check.js');
            } else if (urlPath === '/api/admin-courier-config') {
              handlerModule = await import('./api/admin-courier-config.js');
            } else if (urlPath === '/api/fb-capi') {
              handlerModule = await import('./api/fb-capi.js');
            } else if (urlPath === '/api/orders') {
              handlerModule = await import('./api/orders.js');
            } else if (urlPath === '/api/admin-duplicate-config') {
              handlerModule = await import('./api/admin-duplicate-config.js');
            }

            if (handlerModule && handlerModule.default) {
              // Parse JSON body for POST/PUT if present
              let body = {};
              if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
                const chunks = [];
                for await (const chunk of req) {
                  chunks.push(chunk);
                }
                const raw = Buffer.concat(chunks).toString('utf8');
                if (raw) {
                  try {
                    body = JSON.parse(raw);
                  } catch {
                    body = {};
                  }
                }
              }

              req.body = body;

              // Polyfill Express/Vercel res helper methods if not present
              res.status = (code) => {
                res.statusCode = code;
                return res;
              };
              res.json = (data) => {
                if (!res.headersSent) {
                  res.setHeader('Content-Type', 'application/json');
                }
                res.end(JSON.stringify(data));
                return res;
              };

              return handlerModule.default(req, res);
            }
          } catch (err) {
            console.error('[Vite API Middleware Error]', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: err.message }));
          }

          next();
        });
      }
    }
  ],
  server: {
    port: 5500,
    host: true
  }
});
