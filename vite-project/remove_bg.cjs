const { removeBackground } = require('@imgly/background-removal-node');
const fs = require('fs');
const path = require('path');

async function processImages() {
  const dir = path.join(__dirname, 'public', 'Images');
  const files = ['error_registered.png', 'error_invalid_credentials.png', 'error_invalid_otp.png', 'error_invalid_email.png'];

  for (const file of files) {
    const inputPath = path.join(dir, file);
    if (!fs.existsSync(inputPath)) continue;

    console.log(`Removing background for ${file}...`);
    try {
      // Use file:// URI for imgly on Windows
      const fileUri = `file:///${inputPath.replace(/\\/g, '/')}`;
      const blob = await removeBackground(fileUri);
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      fs.writeFileSync(inputPath, buffer);
      console.log(`Successfully removed background for ${file}`);
    } catch (e) {
      console.error(`Error processing ${file}:`, e);
    }
  }
}

processImages().then(() => console.log('Done!')).catch(console.error);
