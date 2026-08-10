import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

export default function delhiveryShippingApiPlugin() {
  return {
    name: 'delhivery-shipping-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/delhivery-shipping', async (req, res) => {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const zip = url.searchParams.get('zip');
        const weight = url.searchParams.get('weight');
        const pt = url.searchParams.get('pt');

        if (!zip) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Zip code is required' }));
          return;
        }

        const apiKey = serverEnv.DELHIVERY_API_KEY || process.env.DELHIVERY_API_KEY;
        if (!apiKey) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Delhivery API key not configured' }));
          return;
        }

        const originPin = '144001';
        const packageWeight = weight || 500;
        const paymentType = pt === 'cod' ? 'COD' : 'Pre-paid';

        try {
          const response = await fetch(`https://track.delhivery.com/api/kinko/v1/invoice/charges/.json?md=S&ss=Delivered&d_pin=${zip}&o_pin=${originPin}&cgm=${packageWeight}&pt=${paymentType}`, {
            headers: {
              'Authorization': `Token ${apiKey}`
            }
          });

          if (!response.ok) {
            throw new Error(`Delhivery API Error: ${response.status}`);
          }

          const data = await response.json();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(data));
        } catch (error) {
          console.error("Local API: Delhivery shipping error:", error.message);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });
    }
  };
}
