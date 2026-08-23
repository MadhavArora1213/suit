const admin = require('firebase-admin');

// Firebase Admin SDK initialization
// Download serviceAccountKey.json from Firebase Console > Project Settings > Service Accounts
const serviceAccount = require('./service.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();

async function setAdminPassword(email, password) {
  try {
    // Check if user exists
    let user;
    try {
      user = await auth.getUserByEmail(email);
      console.log(`User found: ${user.email} (${user.uid})`);
    } catch (e) {
      // User doesn't exist, create new
      user = await auth.createUser({
        email: email,
        password: password,
        emailVerified: true
      });
      console.log(`New user created: ${user.email} (${user.uid})`);
    }

    // Set/update password
    await auth.updateUser(user.uid, {
      password: password,
      emailVerified: true
    });
    console.log(`Password updated for: ${email}`);
    console.log(`Password: ${password}`);
    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run: node set-admin-password.js
const email = process.argv[2] || 'admin@gurnaaz.com';
const password = process.argv[3] || 'admin@123';

console.log(`Setting password for: ${email}`);
setAdminPassword(email, password);
