import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const serviceAccount = JSON.parse(readFileSync(join(__dirname, 'service.json'), 'utf8'));

if (getApps().length === 0) {
  initializeApp({ credential: cert(serviceAccount) });
}

const auth = getAuth();

async function setAdminPassword(email, password) {
  try {
    let user;
    try {
      user = await auth.getUserByEmail(email);
      console.log('User found:', user.email, user.uid);
    } catch (e) {
      user = await auth.createUser({
        email: email,
        password: password,
        emailVerified: true
      });
      console.log('New user created:', user.email, user.uid);
    }

    await auth.updateUser(user.uid, {
      password: password,
      emailVerified: true
    });
    console.log('Password updated for:', email);
    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

const email = process.argv[2] || 'admin@gurnaaz.com';
const password = process.argv[3] || 'admin@123';
console.log('Setting password for:', email);
setAdminPassword(email, password);
