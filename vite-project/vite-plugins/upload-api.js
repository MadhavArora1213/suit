import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

export default function uploadApiPlugin() {
  return {
    name: 'upload-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/upload', async (req, res) => {
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        try {
          const body = await readBody(req);
          const { imageBase64, filename, folder } = JSON.parse(body);

          if (!imageBase64 || !filename || !folder) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing required fields' }));
            return;
          }

          // Strip off the data:image/...;base64, prefix
          const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          if (!matches || matches.length !== 3) {
            throw new Error('Invalid base64 format');
          }
          const imageBuffer = Buffer.from(matches[2], 'base64');
          
          // Generate safe and unique filename
          const ext = path.extname(filename) || '.jpg';
          const safeName = path.basename(filename, ext).replace(/[^a-z0-9]/gi, '_').toLowerCase();
          const uniqueFilename = `${safeName}_${Date.now()}${ext}`;

          // Construct path: public/uploads/{folder}/
          const uploadDir = path.resolve(__dirname, '..', 'public', 'uploads', folder);
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          const filePath = path.join(uploadDir, uniqueFilename);
          fs.writeFileSync(filePath, imageBuffer);

          // Return URL relative to public directory
          const url = `/uploads/${folder}/${uniqueFilename}`;
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, url }));
        } catch (error) {
          console.error("Local API: Upload error:", error.message);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });
    }
  };
}
