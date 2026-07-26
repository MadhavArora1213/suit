const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

const errors = {
  name: 'Full name is required.',
  email: 'Please enter a valid email address.',
  phone: 'Please enter a valid 10-digit phone number.',
  password: 'Password must be at least 8 characters.',
  already_registered: 'Looks like you already have an account! Please log in instead.',
  send_failed: 'Oops! We had trouble sending the email. Please try again later.',
  network: 'Network error. Please check your internet connection and try again.',
  wrong_credentials: 'Incorrect email or password. Please try again.',
  invalid_otp: 'The code you entered is incorrect. Please check your email and try again.'
};

async function generateImages() {
  const baseImagePath = path.join(__dirname, 'public/Images/error_character.png');
  
  if (!fs.existsSync(baseImagePath)) {
    console.error("Base image not found at", baseImagePath);
    return;
  }

  // Load a Jimp font
  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK); // For 1024x1024 image
  
  for (const [key, text] of Object.entries(errors)) {
    console.log(`Generating image for ${key}...`);
    const image = await Jimp.read(baseImagePath);
    
    image.print(
      font,
      280, // x
      500, // y
      {
        text: text,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
      },
      460, // maxWidth
      150  // maxHeight
    );
    
    const outPath = path.join(__dirname, `public/Images/error_${key}.png`);
    await image.writeAsync(outPath);
  }
  
  console.log("Done generating all error images!");
}

generateImages().catch(console.error);
