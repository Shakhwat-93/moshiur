const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

const PORT = 5500;
const BASE_DIR = __dirname;

// Load .env
function loadEnv() {
    const envPath = path.join(BASE_DIR, '.env');
    if (!fs.existsSync(envPath)) return {};
    const content = fs.readFileSync(envPath, 'utf8');
    const env = {};
    content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            const val = trimmed.slice(eqIdx + 1).trim();
            env[key] = val;
        }
    });
    return env;
}

const env = loadEnv();
const SUPABASE_URL = env.SUPABASE_URL || 'https://ovpsfqsvwmtzxglxrceg.supabase.co';
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY || '';

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Save to Supabase
async function saveToSupabase(orderData) {
    if (!SUPABASE_KEY) {
        console.log('[Supabase] Waiting for API Key in .env. Order saved locally.');
        return { savedToSupabase: false, reason: 'missing_key' };
    }

    return new Promise((resolve) => {
        try {
            const url = new URL(`${SUPABASE_URL}/rest/v1/orders`);
            const postBody = JSON.stringify(orderData);

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Prefer': 'return=representation'
                }
            };

            const req = https.request(url, options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        console.log('[Supabase] Order successfully synced to database!');
                        resolve({ savedToSupabase: true, response: data });
                    } else {
                        console.error('[Supabase Error]', res.statusCode, data);
                        resolve({ savedToSupabase: false, error: data });
                    }
                });
            });

            req.on('error', (err) => {
                console.error('[Supabase Request Error]', err.message);
                resolve({ savedToSupabase: false, error: err.message });
            });

            req.write(postBody);
            req.end();
        } catch (e) {
            console.error('[Supabase Exception]', e.message);
            resolve({ savedToSupabase: false, error: e.message });
        }
    });
}

// Local orders backup
function saveLocalOrder(order) {
    const ordersFilePath = path.join(BASE_DIR, 'orders.json');
    let orders = [];
    if (fs.existsSync(ordersFilePath)) {
        try {
            orders = JSON.parse(fs.readFileSync(ordersFilePath, 'utf8'));
        } catch (e) {
            orders = [];
        }
    }
    orders.unshift(order);
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2), 'utf8');
}

const server = http.createServer(async (req, res) => {
    let reqUrl = req.url.split('?')[0];

    // API endpoint to place order
    if (req.method === 'POST' && reqUrl === '/api/order') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const orderData = JSON.parse(body);
                orderData.created_at = new Date().toISOString();
                orderData.status = 'pending';
                orderData.order_id = 'ORD-' + Date.now();

                // 1. Save locally for 100% fail-safe reliability
                saveLocalOrder(orderData);
                console.log(`[Order Received] ID: ${orderData.order_id} | Name: ${orderData.name} | Phone: ${orderData.phone}`);

                // 2. Sync with Supabase
                const dbResult = await saveToSupabase(orderData);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    order_id: orderData.order_id,
                    db: dbResult
                }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    if (reqUrl === '/') reqUrl = '/index.html';
    const filePath = path.join(BASE_DIR, decodeURIComponent(reqUrl));

    if (!filePath.startsWith(BASE_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        return res.end('403 Forbidden');
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end('404 Not Found');
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache'
        });

        fs.createReadStream(filePath).pipe(res);
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server successfully running at http://localhost:${PORT}/`);
    console.log(`Supabase target: ${SUPABASE_URL}`);
});
