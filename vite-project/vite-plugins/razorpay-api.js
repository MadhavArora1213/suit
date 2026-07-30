import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadServerEnv() {
  try {
    const envPath = path.resolve(__dirname, '..', '.env');
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const env = {};
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    });
    return env;
  } catch {
    return {};
  }
}

const serverEnv = loadServerEnv();

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function getCredentials() {
  const keyId = serverEnv.VITE_RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
  const keySecret = serverEnv.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET;
  return { keyId, keySecret };
}

function razorpayAuth(keyId, keySecret) {
  return 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
}

export default function razorpayApiPlugin() {
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

        const { keyId, keySecret } = getCredentials();
        if (!keyId || !keySecret) {
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

          const response = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
              'Authorization': razorpayAuth(keyId, keySecret),
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

          if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.description || 'Razorpay order creation failed');
          }

          const order = await response.json();

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: keyId,
          }));
        } catch (error) {
          console.error('Razorpay order error:', error.message);
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

        const { keyId, keySecret } = getCredentials();
        if (!keyId || !keySecret) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Razorpay keys not configured in .env' }));
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

          // Verify HMAC signature
          const expectedSignature = crypto
            .createHmac('sha256', keySecret)
            .update(razorpayOrderId + '|' + razorpayPaymentId)
            .digest('hex');

          if (expectedSignature !== razorpaySignature) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid payment signature', verified: false }));
            return;
          }

          // Fetch payment details
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
          console.error('Razorpay verify error:', error.message);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });
    }
  };
}
