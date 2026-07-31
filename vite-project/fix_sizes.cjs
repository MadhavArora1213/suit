const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      // Single line replacement pattern (e.g. Gallery.jsx, CategoryPage.jsx, WishlistPage.jsx, FeaturedCollections.jsx)
      const regex = /addToCart\(\s*([a-zA-Z0-9_]+)\s*,\s*\1\.fitOptions\?\.includes\('Unstitched'\)\s*\?\s*'Unstitched'\s*:\s*\(\1\.sizes\?\.length\s*>\s*0\s*\?\s*`Stitched\s*-\s*\$\{\1\.sizes\[0\]\}`\s*:\s*'Stitched'\)\)/g;
      
      if (regex.test(content)) {
        content = content.replace(regex, (match, p1) => {
          return `addToCart(${p1}, ${p1}.fitOptions?.includes('Unstitched') ? 'Unstitched' : (${p1}.fitOptions?.includes('Semi-Stitched') ? 'Semi-Stitched' : (${p1}.sizes?.length > 0 ? \`Stitched - \${${p1}.sizes[0]}\` : 'Stitched')))`;
        });
        changed = true;
      }
      
      // Multi-line pattern (InteractiveLookbook.jsx, MasonryGallery.jsx, Navbar.jsx)
      const regex2 = /const fit = ([a-zA-Z0-9_]+)\.fitOptions\?\.includes\('Unstitched'\) \? 'Unstitched' : \(\1\.fitOptions\?\.\[0\] \|\| 'Stitched'\);\s*const size = fit === 'Unstitched' \? 'Unstitched' : \(\1\.sizes\?\.length > 0 \? `Stitched - \$\{\1\.sizes\[0\]\}` : 'Stitched'\);/g;
      if (regex2.test(content)) {
         content = content.replace(regex2, (match, p1) => {
            return `const fit = ${p1}.fitOptions?.includes('Unstitched') ? 'Unstitched' : (${p1}.fitOptions?.includes('Semi-Stitched') ? 'Semi-Stitched' : (${p1}.fitOptions?.[0] || 'Stitched'));\n      const size = fit === 'Stitched' ? (${p1}.sizes?.length > 0 ? \`Stitched - \${${p1}.sizes[0]}\` : 'Stitched') : fit;`;
         });
         changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated:', fullPath);
      }
    }
  }
}

processDir(srcDir);
