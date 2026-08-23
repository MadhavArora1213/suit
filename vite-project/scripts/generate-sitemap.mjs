#!/usr/bin/env node
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const firebaseConfig = {
  apiKey: "AIzaSyBMjCrzTnXDBZ2FPsR7BpjNIgMFgVOqKbM",
  authDomain: "gurnaaz-928e2.firebaseapp.com",
  projectId: "gurnaaz-928e2",
  storageBucket: "gurnaaz-928e2.firebasestorage.app",
  messagingSenderId: "353408296240",
  appId: "1:353408296240:web:85ce6f8f2a1e5c234fb26e"
};

const SITE = 'https://www.gurnaaz.co.in';
const today = new Date().toISOString().split('T')[0];

async function generate() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const productsSnap = await getDocs(collection(db, 'products'));
  const products = [];
  productsSnap.forEach(doc => {
    const data = doc.data();
    if (data.name && data.active !== false) {
      const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      products.push({ id: doc.id, slug, name: data.name, addedAt: data.addedAt });
    }
  });

  const categoriesSnap = await getDocs(collection(db, 'categories'));
  const categories = [];
  categoriesSnap.forEach(doc => {
    const data = doc.data();
    if (data.name) {
      const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      categories.push({ slug, name: data.name });
    }
  });

  const collectionsSnap = await getDocs(collection(db, 'collections'));
  const collections = [];
  collectionsSnap.forEach(doc => {
    const data = doc.data();
    const title = data.title || data.name || '';
    if (title) {
      const slug = (data.id || doc.id || title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      collections.push({ slug, name: title });
    }
  });

  const boutiquesSnap = await getDocs(collection(db, 'boutiques'));
  const boutiques = [];
  boutiquesSnap.forEach(doc => {
    const data = doc.data();
    if (data.name) {
      const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      boutiques.push({ slug, name: data.name });
    }
  });

  const urls = [];

  // Static pages
  const staticPages = [
    { path: '/', priority: '1.0', freq: 'daily' },
    { path: '/shop', priority: '0.9', freq: 'daily' },
    { path: '/collections', priority: '0.8', freq: 'weekly' },
    { path: '/shops-and-boutiques', priority: '0.7', freq: 'weekly' },
    { path: '/about', priority: '0.6', freq: 'monthly' },
    { path: '/contact', priority: '0.6', freq: 'monthly' },
    { path: '/faq', priority: '0.5', freq: 'monthly' },
    { path: '/shipping', priority: '0.4', freq: 'monthly' },
    { path: '/privacy', priority: '0.3', freq: 'monthly' },
  ];

  for (const p of staticPages) {
    urls.push(`  <url>
    <loc>${SITE}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`);
  }

  // Categories
  for (const cat of categories) {
    urls.push(`  <url>
    <loc>${SITE}/category/${cat.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }

  // Collections
  for (const col of collections) {
    urls.push(`  <url>
    <loc>${SITE}/collections/${col.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }

  // Boutiques
  for (const b of boutiques) {
    urls.push(`  <url>
    <loc>${SITE}/shops-and-boutiques/${b.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
  }

  // Products
  for (const p of products) {
    urls.push(`  <url>
    <loc>${SITE}/product/${p.slug}</loc>
    <lastmod>${(p.addedAt || today).split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  const outPath = resolve(process.cwd(), 'public', 'sitemap.xml');
  writeFileSync(outPath, xml, 'utf-8');
  console.log(`Sitemap generated: ${outPath}`);
  console.log(`  - ${staticPages.length} static pages`);
  console.log(`  - ${categories.length} categories`);
  console.log(`  - ${collections.length} collections`);
  console.log(`  - ${boutiques.length} boutiques`);
  console.log(`  - ${products.length} products`);
  console.log(`  - Total: ${urls.length} URLs`);
}

generate().catch(err => {
  console.error('Failed to generate sitemap:', err.message);
  process.exit(1);
});
