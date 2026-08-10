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

export default function delhiveryApiPlugin() {
  return {
    name: 'delhivery-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/delhivery-pincode', async (req, res) => {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const zip = url.searchParams.get('zip');

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

        try {
          const response = await fetch(`https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${zip}`, {
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
          console.error("Local API: Delhivery error:", error.message);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });
    }
  };
}
