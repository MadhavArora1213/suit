import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadServerEnv() {
  try {
    const envPath = path.resolve(__dirname, '..', '.env');
    console.log('[Razorpay] Loading .env from:', envPath);
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const env = {};
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) return;
      const key = trimmed.substring(0, eqIndex).trim();
      const value = trimmed.substring(eqIndex + 1).trim();
      if (key) env[key] = value;
    });
    console.log('[Razorpay] Loaded keys:', Object.keys(env).filter(k => k.includes('RAZORPAY')));
    return env;
  } catch (e) {
    console.error('[Razorpay] Failed to load .env:', e.message);
    return {};
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function getCredentials(serverEnv) {
  const keyId = serverEnv.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
  const keySecret = serverEnv.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET;
  console.log('[Razorpay] Key ID:', keyId ? keyId.substring(0, 12) + '...' : 'MISSING');
  console.log('[Razorpay] Key Secret:', keySecret ? 'SET' : 'MISSING');
  return { keyId, keySecret };
}

function razorpayAuth(keyId, keySecret) {
  return 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
}

export default function razorpayApiPlugin() {
  // Load env fresh each time (not cached at import)
  return {
    name: 'razorpay-api-plugin',
    configureServer(server) {
      // POST /api/razorpay-order
      server.middlewares.use('/api/razorpay-order', async (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        const serverEnv = loadServerEnv();
        const { keyId, keySecret } = getCredentials(serverEnv);
        if (!keyId || !keySecret) {
          console.error('[Razorpay] Keys not found!');
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Razorpay keys not configured in .env' }));
          return;
        }

        try {
          const body = await readBody(req);
          const { amount, orderId, customerName, customerEmail, customerPhone } = JSON.parse(body);

          if (!amount || amount <= 0) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid amount' }));
            return;
          }

          const authHeader = razorpayAuth(keyId, keySecret);
          console.log('[Razorpay] Creating order for amount:', amount, 'INR');

          const response = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
              'Authorization': authHeader,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount: Math.round(amount * 100),
              currency: 'INR',
              receipt: `order_${orderId}`,
              notes: {
                customerName: customerName || '',
                customerEmail: customerEmail || '',
                customerPhone: customerPhone || '',
              },
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            console.error('[Razorpay] Order creation failed:', data);
            throw new Error(data.error?.description || 'Razorpay order creation failed');
          }

          console.log('[Razorpay] Order created:', data.id);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            orderId: data.id,
            amount: data.amount,
            currency: data.currency,
            keyId: keyId,
          }));
        } catch (error) {
          console.error('[Razorpay] Order error:', error.message);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });

      // POST /api/razorpay-verify
      server.middlewares.use('/api/razorpay-verify', async (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        const serverEnv = loadServerEnv();
        const { keyId, keySecret } = getCredentials(serverEnv);
        if (!keyId || !keySecret) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Razorpay keys not configured' }));
          return;
        }

        try {
          const body = await readBody(req);
          const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = JSON.parse(body);

          if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing payment parameters' }));
            return;
          }

          const expectedSignature = crypto
            .createHmac('sha256', keySecret)
            .update(razorpayOrderId + '|' + razorpayPaymentId)
            .digest('hex');

          if (expectedSignature !== razorpaySignature) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid payment signature', verified: false }));
            return;
          }

          const paymentRes = await fetch(`https://api.razorpay.com/v1/payments/${razorpayPaymentId}`, {
            headers: { 'Authorization': razorpayAuth(keyId, keySecret) },
          });

          if (!paymentRes.ok) {
            throw new Error('Failed to fetch payment details');
          }

          const payment = await paymentRes.json();

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            verified: true,
            payment: {
              id: payment.id,
              amount: payment.amount,
              currency: payment.currency,
              status: payment.status,
              method: payment.method,
            },
          }));
        } catch (error) {
          console.error('[Razorpay] Verify error:', error.message);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });
    }
  };
}
