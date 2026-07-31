/**
 * adminStore.js — Shared localStorage bridge between Admin Panel and Main Website
 * Admin saves data here → Main website reads from here
 */

import {
  saveReviewToFirestore,
  fetchReviewsFromFirestore,
  saveProductRatingToFirestore,
  isFirebaseConfigured,
  saveOrderToFirestore,
  fetchOrdersFromFirestore,
  saveProductToFirestore,
  deleteProductFromFirestore,
  fetchProductsFromFirestore,
  fetchCollectionFromFirestore,
  saveDocumentToFirestore,
  db,
  auth
} from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const KEYS = {
  products:     'gurnaaz_products',
  categories:   'gurnaaz_categories',
  reviews:      'gurnaaz_reviews',
  orders:       'gurnaaz_orders',
  support:      'gurnaaz_support',
  boutiques:    'gurnaaz_boutiques',
  collections:  'gurnaaz_collections',
  collectionTags: 'gurnaaz_collection_tags'
};

// ── Static Products Definition ────────────────────────────────
export const staticProducts = [];

// ── Seed product with all fields ─────────────────────────────
const seedProduct = {
  id: 'seed_product_001',
  name: 'Royal Banarasi Silk Anarkali Suit Set',
  price: '₹12,999',
  priceNum: 12999,
  originalPrice: '₹18,999',
  originalPriceNum: 18999,
  boutique: 'Rajputana Heritage',
  badge: 'Premium',
  collection: 'Festive Edit',
  styleCategory: 'Royal',
  suitType: 'Anarkali',
  type: 'Anarkali',
  shortDesc: 'Handwoven Banarasi silk anarkali with intricate zari embroidery, perfect for weddings and festive celebrations. Includes matching dupatta and palazzo.',
  fabricDetails: 'Crafted from 100% pure Banarasi silk with real gold zari work. The fabric is handwoven by master artisans from Varanasi. Features traditional Mughal-inspired motifs with modern silhouette. The anarkali has a flowing floor-length flare with detailed thread work on the yoke and hemline.',
  fabricName: 'Pure Banarasi Silk',
  fabricDesc: 'Handwoven with real gold zari',
  rating: 4.9,
  igLikes: '2.4K',
  igComments: '186',
  videoUrl: 'https://www.youtube.com/watch?v=example',
  reelUrl: 'https://www.instagram.com/reel/example',
  sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)'],
  occasions: ['Wedding', 'Festive', 'Engagement', 'Sangeet', 'Reception'],
  care: ['Dry Clean Only', 'Iron on Low Heat'],
  stockQty: { 'S (36)': 5, 'M (38)': 12, 'L (40)': 18, 'XL (42)': 10, 'XXL (44)': 6 },
  image: '/banarasi_suit.png',
  additionalImages: ['/designer_suit_1.png', '/anarkali_suit.png'],
  addedAt: '2026-07-25T10:00:00.000Z',
  source: 'admin',
  totalOrders: 48,
  totalRevenue: '₹6.24L',
  stock: 51,
  category: 'Festive Edit',
  active: true,
};

const seedProduct2 = {
  id: 'seed_product_002',
  name: 'Chikankari Handloom Cotton Suit Set',
  price: '₹7,499',
  priceNum: 7499,
  originalPrice: '₹10,999',
  originalPriceNum: 10999,
  boutique: 'Awadh Kraft',
  badge: 'Artisanal',
  collection: 'Best Sellers',
  styleCategory: 'Traditional',
  suitType: 'Chikankari',
  type: 'Chikankari',
  shortDesc: 'Authentic Lucknowi chikankari on pure cotton, hand-embroidered by women artisans. Lightweight and elegant for daily and semi-formal wear.',
  fabricDetails: 'Made from premium combed cotton with intricate shadow chikankari embroidery. Each piece takes 15-20 days to complete by skilled artisans from Lucknow. Features tepchi, phanda, and murri stitches. Includes cotton lining for comfort.',
  fabricName: 'Pure Combed Cotton',
  fabricDesc: 'Hand-embroidered Lucknowi chikankari',
  rating: 4.8,
  igLikes: '1.8K',
  igComments: '142',
  videoUrl: '',
  reelUrl: '',
  sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)'],
  occasions: ['Casual', 'Daily Wear', 'Office Wear', 'Brunch'],
  care: ['Hand Wash', 'Do Not Bleach', 'Iron on Low Heat'],
  stockQty: { 'S (36)': 8, 'M (38)': 15, 'L (40)': 20, 'XL (42)': 12 },
  image: '/chikankari_suit.png',
  additionalImages: ['/cotton_suit.png'],
  addedAt: '2026-07-24T08:30:00.000Z',
  source: 'admin',
  totalOrders: 39,
  totalRevenue: '₹2.92L',
  stock: 55,
  category: 'Best Sellers',
  active: true,
};

const seedProduct3 = {
  id: 'seed_product_003',
  name: 'Royal Sharara Suit Set with Heavy Dupatta',
  price: '₹11,499',
  priceNum: 11499,
  originalPrice: '₹15,999',
  originalPriceNum: 15999,
  boutique: 'Rajputana',
  badge: 'Grand Wedding',
  collection: 'Festive Edit',
  styleCategory: 'Royal',
  suitType: 'Sharara',
  type: 'Sharara',
  shortDesc: 'Opulent sharara suit with heavily embroidered kameez and flared sharara pants. Complete with a luxurious net dupatta with cutwork border.',
  fabricDetails: 'Premium georgette base with sequin, mirror, and thread work. The sharara pants feature gold gota patti borders. Kameez has full back and front embroidery with scalloped hemline. Dupatta has 4-side heavy border with pallu design.',
  fabricName: 'Premium Georgette',
  fabricDesc: 'Heavy sequin and mirror work',
  rating: 5.0,
  igLikes: '3.1K',
  igComments: '234',
  videoUrl: 'https://www.youtube.com/watch?v=example2',
  reelUrl: 'https://www.instagram.com/reel/example2',
  sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)'],
  occasions: ['Wedding', 'Bridal', 'Engagement', 'Reception', 'Sangeet'],
  care: ['Dry Clean Only'],
  stockQty: { 'S (36)': 3, 'M (38)': 6, 'L (40)': 8, 'XL (42)': 4 },
  image: '/sharara_suit.png',
  additionalImages: ['/designer_suit_1.png'],
  addedAt: '2026-07-23T12:00:00.000Z',
  source: 'admin',
  totalOrders: 31,
  totalRevenue: '₹3.56L',
  stock: 21,
  category: 'Festive Edit',
  active: true,
};

const seedProduct4 = {
  id: 'seed_product_004',
  name: 'Pakistani Straight Suit Set with Digital Print',
  price: '₹4,799',
  priceNum: 4799,
  originalPrice: '₹6,999',
  originalPriceNum: 6999,
  boutique: 'Nazraana',
  badge: 'Verified',
  collection: 'New Arrivals',
  styleCategory: 'Contemporary',
  suitType: 'Pakistani',
  type: 'Pakistani',
  shortDesc: 'Elegant Pakistani straight cut suit with digital floral print on premium lawn fabric. Includes chiffon dupatta with printed borders.',
  fabricDetails: 'Premium Pakistani lawn cotton with reactive digital print that retains color after multiple washes. Features contrast piping on neckline and hem. Straight pants with elasticized waistband for comfort. Chiffon dupatta with matching print.',
  fabricName: 'Premium Lawn Cotton',
  fabricDesc: 'Digital floral print',
  rating: 4.7,
  igLikes: '1.2K',
  igComments: '98',
  videoUrl: '',
  reelUrl: '',
  sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)'],
  occasions: ['Casual', 'Daily Wear', 'Office Wear', 'Travel'],
  care: ['Machine Wash', 'Do Not Bleach', 'Iron on Low Heat'],
  stockQty: { 'S (36)': 10, 'M (38)': 20, 'L (40)': 25, 'XL (42)': 15, 'XXL (44)': 8 },
  image: '/pakistani_suit.png',
  additionalImages: ['/cotton_suit.png'],
  addedAt: '2026-07-22T09:15:00.000Z',
  source: 'admin',
  totalOrders: 27,
  totalRevenue: '₹1.30L',
  stock: 78,
  category: 'New Arrivals',
  active: true,
};

const seedProduct5 = {
  id: 'seed_product_005',
  name: 'Razorpay Test Suit',
  price: '₹1',
  priceNum: 1,
  originalPrice: '₹1',
  originalPriceNum: 1,
  boutique: 'Gurnaaz',
  badge: 'Test',
  collection: 'Test',
  styleCategory: 'Casual',
  suitType: 'Anarkali',
  type: 'Anarkali',
  shortDesc: 'Test product for Razorpay integration. ₹1 price.',
  fabricDetails: 'Test fabric for payment testing.',
  fabricName: 'Cotton',
  fabricDesc: 'Test cotton',
  rating: 4.0,
  igLikes: '0',
  igComments: '0',
  videoUrl: '',
  reelUrl: '',
  sizes: ['M (38)'],
  occasions: ['Casual'],
  care: ['Machine Wash'],
  stockQty: { 'M (38)': 999 },
  image: '/Images/Confused.png',
  additionalImages: [],
  addedAt: new Date().toISOString(),
  source: 'admin',
  totalOrders: 0,
  totalRevenue: '₹0',
  stock: 999,
  category: 'Test',
  active: true,
};

// Auto-seed if no products exist
export const seedIfEmpty = () => {
  const existing = get(KEYS.products, []);
  if (existing.length === 0) {
    set(KEYS.products, [seedProduct, seedProduct2, seedProduct3, seedProduct4, seedProduct5]);
    if (isFirebaseConfigured()) {
      [seedProduct, seedProduct2, seedProduct3, seedProduct4, seedProduct5].forEach(p => {
        saveProductToFirestore(p.id, p).catch(() => {});
      });
    }
  }
};

// ── Generic helpers ──────────────────────────────────────────
const get  = (key, fallback = []) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};

const set  = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  
  // Also push to Firestore settings if it's one of the settings keys
  if (isFirebaseConfigured() && db) {
    const settingsKeys = [
      KEYS.categories, KEYS.collections
    ];
    if (settingsKeys.includes(key)) {
      // Find which generic name this key corresponds to
      const objKey = Object.keys(KEYS).find(k => KEYS[k] === key);
      if (objKey) {
        setDoc(doc(db, 'settings', 'gurnaaz_store'), {
          [objKey]: value
        }, { merge: true }).catch(err => {
          console.error("Failed to sync setting to Firestore:", objKey, err);
        });
      }
    }
  }
};

// ── Convert image File → base64 (persists in localStorage) ──
export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// ── PRODUCTS ─────────────────────────────────────────────────
export const getProducts   = ()           => get(KEYS.products, []);
export const saveProducts  = (arr)        => set(KEYS.products, arr);

export const addProduct = (product) => {
  const arr = getProducts();
  arr.unshift(product);
  saveProducts(arr);
  if (isFirebaseConfigured()) {
    saveProductToFirestore(product.id, product).catch(err =>
      console.error("Failed to add product to Firestore:", err)
    );
  }
};

export const updateProduct = (id, data) => {
  const updatedList = getProducts().map(p => p.id === id ? { ...p, ...data } : p);
  saveProducts(updatedList);
  
  if (isFirebaseConfigured()) {
    const updatedProd = updatedList.find(p => p.id === id);
    if (updatedProd) {
      saveProductToFirestore(id, updatedProd).catch(err =>
        console.error("Failed to update product in Firestore:", err)
      );
    }
  }
};

export const deleteProduct = (id) => {
  saveProducts(getProducts().filter(p => p.id !== id));
  if (isFirebaseConfigured()) {
    deleteProductFromFirestore(id).catch(err =>
      console.error("Failed to delete product from Firestore:", err)
    );
  }
};

const defaultVideos = [];

const defaultReels = [];

const injectDefaultMedia = (product, index) => {
  return {
    ...product,
    videoUrl: product.videoUrl || '',
    reelUrl: product.reelUrl || '',
    additionalImages: product.additionalImages || [],
    sizes: product.sizes || []
  };
};

export const getAllProducts = () => {
  const adminProducts = getProducts();
  const overrides = get('gurnaaz_static_overrides', {});
  const adminIds = new Set(adminProducts.map(p => p.id));
  
  // Merge static products with override values (like rating calculated dynamically)
  const processedStatics = staticProducts.map(p => {
    if (overrides[p.id]) {
      return { ...p, ...overrides[p.id] };
    }
    return p;
  });

  const merged = [...adminProducts, ...processedStatics.filter(p => !adminIds.has(p.id))];
  return merged.map((p, idx) => injectDefaultMedia(p, idx));
};

// ── REVIEWS & RATINGS ─────────────────────────────────────────
export const getReviews = (productId) => {
  const allReviews = get(KEYS.reviews, {});
  return allReviews[productId] || [];
};

export const addReview = (productId, review) => {
  const allReviews = get(KEYS.reviews, {});
  if (!allReviews[productId]) {
    allReviews[productId] = [];
  }
  
  const newReview = {
    id: `rev_${Date.now()}`,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    createdAt: new Date().toISOString(),
    ...review
  };
  
  allReviews[productId].unshift(newReview);
  set(KEYS.reviews, allReviews);

  // Dynamically update product rating average in store
  const reviews = allReviews[productId];
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const formattedAvg = parseFloat(avg.toFixed(1));
  
  const adminProducts = getProducts();
  if (adminProducts.some(p => p.id === productId)) {
    updateProduct(productId, { rating: formattedAvg });
  } else {
    const overrides = get('gurnaaz_static_overrides', {});
    overrides[productId] = { ...overrides[productId], rating: formattedAvg };
    set('gurnaaz_static_overrides', overrides);
  }

  // Trigger Firestore save async
  if (isFirebaseConfigured()) {
    saveReviewToFirestore(productId, newReview).then(() => {
      saveProductRatingToFirestore(productId, formattedAvg, reviews.length);
    }).catch(err => console.error("Async review save failed:", err));
  }
};

/**
 * Bidirectionally syncs reviews between Firestore and localStorage
 */
export const syncProductReviews = async (productId, onSyncComplete) => {
  if (!isFirebaseConfigured()) return;
  
  try {
    // 1. Fetch reviews from Firestore
    const dbReviews = await fetchReviewsFromFirestore(productId);
    
    // 2. Fetch local reviews
    const allReviews = get(KEYS.reviews, {});
    const localReviews = allReviews[productId] || [];
    
    // Create map of ID -> review
    const mergedMap = new Map();
    
    // Add all local reviews to map
    localReviews.forEach(r => mergedMap.set(r.id, r));
    
    // Add Firestore reviews to map (Firestore wins in case of conflicts, or merge new ones)
    dbReviews.forEach(r => {
      if (!mergedMap.has(r.id)) {
        mergedMap.set(r.id, r);
      }
    });
    
    // 3. Upload local reviews to Firestore if they don't exist in Firestore
    const localIdsInDb = new Set(dbReviews.map(r => r.id));
    for (const r of localReviews) {
      if (!localIdsInDb.has(r.id)) {
        await saveReviewToFirestore(productId, r);
      }
    }
    
    // 4. Update local storage with merged list
    const mergedList = Array.from(mergedMap.values());
    
    // Sort descending by date/createdAt/timestamp
    mergedList.sort((a, b) => {
      const timeA = new Date(a.createdAt || a.date || 0).getTime();
      const timeB = new Date(b.createdAt || b.date || 0).getTime();
      return timeB - timeA;
    });
    
    allReviews[productId] = mergedList;
    set(KEYS.reviews, allReviews);
    
    // 5. Update local average rating based on merged list
    if (mergedList.length > 0) {
      const avg = mergedList.reduce((sum, r) => sum + r.rating, 0) / mergedList.length;
      const formattedAvg = parseFloat(avg.toFixed(1));
      
      const adminProducts = getProducts();
      if (adminProducts.some(p => p.id === productId)) {
        updateProduct(productId, { rating: formattedAvg });
      } else {
        const overrides = get('gurnaaz_static_overrides', {});
        overrides[productId] = { ...overrides[productId], rating: formattedAvg };
        set('gurnaaz_static_overrides', overrides);
      }
      
      // Also update Firestore with the average rating
      await saveProductRatingToFirestore(productId, formattedAvg, mergedList.length);
    }
    
    if (onSyncComplete) {
      onSyncComplete(mergedList);
    }
  } catch (error) {
    console.error("Error syncing product reviews with database:", error);
  }
};

// ── GALLERY ──────────────────────────────────────────────────


export const getCategories = () => {
  const dataStr = localStorage.getItem(KEYS.categories);
  let data = dataStr ? JSON.parse(dataStr) : [];
  
  const hasSeeded = localStorage.getItem('gurnaaz_categories_seeded_v2');
  
  if (!hasSeeded) {
    const defaults = [
      { id: 1, name: 'Anarkali', subtitle: 'The Royal Edit', image: '/anarkali_suit.png', image2: '/designer_suit_1.png', tagline: 'Flowing elegance for every occasion', order: 1, active: true },
      { id: 2, name: 'Sharara', subtitle: 'The Festive Edit', image: '/sharara_suit.png', image2: '/pakistani_suit.png', tagline: 'Modern silhouettes with traditional charm', order: 2, active: true },
      { id: 3, name: 'Banarasi', subtitle: 'Golden Brocades', image: '/banarasi_suit.png', image2: '/cotton_suit.png', tagline: 'Heritage weaves from the holy city', order: 3, active: true },
      { id: 4, name: 'Chikankari', subtitle: 'Artisan Crafted', image: '/chikankari_suit.png', image2: '/anarkali_suit.png', tagline: 'Lucknowi artistry in every thread', order: 4, active: true },
      { id: 5, name: 'Patiala', subtitle: 'Heritage Weaves', image: '/patiala_suit.png', image2: '/designer_suit_1.png', tagline: 'Comfortable cuts with vibrant prints', order: 5, active: false },
      { id: 6, name: 'Pakistani', subtitle: 'Straight Elegance', image: '/pakistani_suit.png', image2: '/sharara_suit.png', tagline: 'Contemporary styles with rich embroidery', order: 6, active: true },
    ];
    
    let added = false;
    defaults.forEach(def => {
      // Add if category name doesn't exist yet
      if (!data.some(c => c.name.toLowerCase() === def.name.toLowerCase())) {
        data.push(def);
        added = true;
      }
    });

    if (added || data.length === 0) {
      set(KEYS.categories, data);
    }
    
    localStorage.setItem('gurnaaz_categories_seeded_v2', 'true');
  }

  return data;
};

export const saveCategories = (arr) => set(KEYS.categories, arr);

// ── COLLECTIONS ──────────────────────────────────────────────
export const getCollections = () => {
  const dataStr = localStorage.getItem(KEYS.collections);
  let data = dataStr ? JSON.parse(dataStr) : [];
  
  const hasSeeded = localStorage.getItem('gurnaaz_collections_seeded');
  
  if (!hasSeeded) {
    const defaults = [
      { id: 'summer', title: 'Summer', subtitle: 'Collection', desc: 'Breezy cottons and light georgettes tailored for the warm sun.', story: 'Inspired by sun-drenched Indian gardens and breezy terraces, this collection celebrates the joy of warm-weather dressing with lightweight fabrics and cheerful palettes.', image: '/summer_edit.png', accent: '#D4A574', category: 'All', tag: 'Seasonal', active: true, order: 1 },
      { id: 'monsoon', title: 'Monsoon', subtitle: 'Collection', desc: 'Vibrant hues and fluid silhouettes to brighten gray days.', story: 'When the rains arrive, so does our most colorful collection. Rich jewel tones and flowing fabrics that dance with the monsoon breeze.', image: '/monsoon_edit.png', accent: '#5B9AA0', category: 'All', tag: 'Seasonal', active: true, order: 2 },
      { id: 'wedding', title: 'Wedding', subtitle: 'Collection', desc: 'Heavy, regal bridal ensembles crafted for your biggest day.', story: 'For the most important day of your life, we bring you ensembles that carry centuries of bridal tradition, reimagined for the modern bride.', image: '/wedding_edit.png', accent: '#C77B8A', category: 'All', tag: 'Seasonal', active: true, order: 3 },
      { id: 'pastel', title: 'Pastel', subtitle: 'Collection', desc: 'Soft pinks, mints, and lilacs adorned with delicate threadwork.', story: 'Whisper-soft hues meet intricate hand embroidery in a collection that celebrates understated elegance and feminine grace.', image: '/pastel_edit.png', accent: '#B8A9C9', category: 'All', tag: 'Seasonal', active: true, order: 4 },
      { id: 'black', title: 'Black', subtitle: 'Collection', desc: 'Striking black suits with dramatic silver and gold accents.', story: 'Timeless, powerful, and always in style. Our black collection brings drama and sophistication to every occasion.', image: '/black_edit.png', accent: '#BCA58A', category: 'All', tag: 'Seasonal', active: true, order: 5 },
      { id: 'luxury', title: 'Luxury', subtitle: 'Collection', desc: 'Our most exclusive, hand-embroidered heritage pieces.', story: 'The pinnacle of Indian craftsmanship. Each piece in this collection takes weeks of dedicated handwork by master artisans.', image: '/luxury_edit.png', accent: '#C5A55A', category: 'All', tag: 'Seasonal', active: true, order: 6 },
      { id: 'punjabi', title: 'Punjabi', subtitle: 'Suits', desc: 'Rich Punjabi heritage with vibrant phulkari dupattas and bold silhouettes.', story: 'Bold colors, generous silhouettes, and the exuberant spirit of Punjab come alive in these traditionally crafted suits.', image: '/patiala_suit.png', accent: '#E07A5F', category: 'Patiala', tag: 'By Style', active: true, order: 7 },
      { id: 'anarkali', title: 'Anarkali', subtitle: 'Collection', desc: 'Regal flares and majestic silhouettes inspired by Mughal grandeur.', story: 'Named after the legendary court dancer, Anarkali suits feature voluminous flares that create a regal, princess-like silhouette.', image: '/anarkali_suit.png', accent: '#81B29A', category: 'Anarkali', tag: 'By Style', active: true, order: 8 },
      { id: 'sharara', title: 'Sharara', subtitle: 'Collection', desc: 'Playful tiers and festive drama with traditional three-piece elegance.', story: 'The three-piece ensemble that has been a staple of Indian celebrations for centuries, now reimagined with contemporary flair.', image: '/sharara_suit.png', accent: '#F2CC8F', category: 'Sharara', tag: 'By Style', active: true, order: 9 },
      { id: 'chikankari', title: 'Chikankari', subtitle: 'Collection', desc: 'Delicate shadow embroidery from Lucknow, woven with artisan heritage.', story: 'Born in the royal courts of Lucknow, Chikankari is one of India\'s most refined embroidery traditions, featuring delicate shadow work on sheer fabrics.', image: '/chikankari_suit.png', accent: '#9DB4C0', category: 'Chikankari', tag: 'By Style', active: true, order: 10 },
      { id: 'banarasi', title: 'Banarasi', subtitle: 'Collection', desc: 'Opulent katan silk brocades with golden zari from Varanasi looms.', story: 'Handwoven in the ancient city of Varanasi, Banarasi silk is renowned for its gold and silver brocade, fine silk, and opulent embroidery.', image: '/banarasi_suit.png', accent: '#C9A96E', category: 'Banarasi', tag: 'By Style', active: true, order: 11 },
      { id: 'pakistani', title: 'Pakistani', subtitle: 'Collection', desc: 'Contemporary straight-cut elegance with delicate laces and organza details.', story: 'Clean lines, elegant cuts, and meticulous attention to detail define this collection inspired by cross-border fashion sensibilities.', image: '/pakistani_suit.png', accent: '#7EB8C9', category: 'Pakistani', tag: 'By Style', active: true, order: 12 },
      { id: 'designer', title: 'Designer', subtitle: 'Edit', desc: 'Handpicked designer suits featuring premium fabrics and exclusive craftsmanship.', story: 'Curated from the studios of India\'s most talented designers, each piece is a wearable work of art.', image: '/designer_suit_1.png', accent: '#D4A574', category: 'All', tag: 'Curated', active: true, order: 13 },
      { id: 'festive', title: 'Festive', subtitle: 'Wear', desc: 'Celebratory ensembles with rich embroidery for festivals and puja ceremonies.', story: 'From Diwali to Eid, Navratri to Pongal — celebrate every festival in ensembles that match the joy of the occasion.', image: '/anarkali_suit.png', accent: '#D4574E', category: 'All', tag: 'By Occasion', active: true, order: 14 },
      { id: 'party', title: 'Party', subtitle: 'Wear', desc: 'Statement pieces with contemporary cuts and glamorous embellishments.', story: 'Make an entrance with bold silhouettes, shimmering fabrics, and statement embellishments designed for unforgettable evenings.', image: '/sharara_suit.png', accent: '#9B59B6', category: 'All', tag: 'By Occasion', active: true, order: 15 },
      { id: 'bridal', title: 'Bridal', subtitle: 'Collection', desc: 'Exquisite bridal lehengas and suits with heavy zardozi and danka work.', story: 'For the bride who wants to honor tradition while embracing modernity, our bridal collection features the finest zardozi, danka, and gota patti work.', image: '/wedding_edit.png', accent: '#C0392B', category: 'All', tag: 'By Occasion', active: true, order: 16 },
      { id: 'casual', title: 'Casual', subtitle: '& Daily Wear', desc: 'Comfortable everyday suits in breathable cottons and soft georgettes.', story: 'Elegance doesn\'t need to be reserved for special occasions. Our casual collection brings comfort and style to your everyday wardrobe.', image: '/cotton_suit.png', accent: '#7DCEA0', category: 'Casual', tag: 'By Occasion', active: true, order: 17 },
      { id: 'velvet', title: 'Velvet', subtitle: 'Collection', desc: 'Luxurious micro-velvet suits with heavy hand-applied zardozi work.', story: 'The richness of velvet meets the artistry of traditional Indian embroidery in this winter-perfect collection.', image: '/banarasi_suit.png', accent: '#6C3483', category: 'All', tag: 'By Fabric', active: true, order: 18 },
      { id: 'silk', title: 'Pure Silk', subtitle: 'Collection', desc: 'Handloomed silk suits with natural sheen and royal drape.', story: 'There is nothing quite like the feel of pure silk against skin. Our silk collection celebrates this most regal of fabrics.', image: '/luxury_edit.png', accent: '#B7950B', category: 'All', tag: 'By Fabric', active: true, order: 19 },
      { id: 'cotton', title: 'Cotton', subtitle: 'Collection', desc: 'Breathable handloom cotton suits with block prints and Chikankari.', story: 'India\'s gift to the world, handloom cotton is celebrated for its breathability, durability, and the unique character of handwoven textiles.', image: '/cotton_suit.png', accent: '#45B39D', category: 'All', tag: 'By Fabric', active: true, order: 20 },
      { id: 'georgette', title: 'Georgette', subtitle: 'Collection', desc: 'Flowy georgette suits with delicate threadwork and easy drape.', story: 'Lightweight, flowy, and effortlessly elegant — georgette is the fabric of choice for those who love movement and grace.', image: '/chikankari_suit.png', accent: '#AED6F1', category: 'All', tag: 'By Fabric', active: true, order: 21 },
      { id: 'organza', title: 'Organza', subtitle: 'Collection', desc: 'Sheer organza silk suits with intricate floral embroidery and volume.', story: 'The ethereal sheerness of organza creates a dreamlike quality, perfect for those who love romantic, feminine silhouettes.', image: '/pastel_edit.png', accent: '#F5B7B1', category: 'All', tag: 'By Fabric', active: true, order: 22 },
    ];
    
    let added = false;
    defaults.forEach(def => {
      if (!data.some(c => c.id === def.id)) {
        data.push(def);
        added = true;
      }
    });

    if (added || data.length === 0) {
      set(KEYS.collections, data);
    }
    
    localStorage.setItem('gurnaaz_collections_seeded', 'true');
  }

  return data;
};

export const saveCollections = (arr) => set(KEYS.collections, arr);

// --- COLLECTION TAGS ---
export const getCollectionTags = () => {
  const data = localStorage.getItem(KEYS.collectionTags);
  if (!data) {
    const initialTags = [
      { id: 'seasonal', name: 'Seasonal', icon: '☀', order: 1, active: true },
      { id: 'by-style', name: 'By Style', icon: '✦', order: 2, active: true },
      { id: 'by-occasion', name: 'By Occasion', icon: '♦', order: 3, active: true },
      { id: 'by-fabric', name: 'By Fabric', icon: '◎', order: 4, active: true },
      { id: 'curated', name: 'Curated', icon: '❖', order: 5, active: true },
    ];
    localStorage.setItem(KEYS.collectionTags, JSON.stringify(initialTags));
    
    // Also save to firebase if you want, but local is fine for seeding
    if (auth.currentUser) {
      setDoc(doc(db, 'adminData', KEYS.collectionTags), { data: initialTags });
    }
    
    return initialTags;
  }
  return JSON.parse(data);
};

export const saveCollectionTags = async (tags) => {
  localStorage.setItem(KEYS.collectionTags, JSON.stringify(tags));
  if (auth.currentUser) {
    await setDoc(doc(db, 'adminData', KEYS.collectionTags), { data: tags });
  }
  notifyWebsite();
};



// ── ORDERS ───────────────────────────────────────────────────
export const getOrders = () => get(KEYS.orders, []);
export const saveOrders = (arr) => set(KEYS.orders, arr);



// ── SUPPORT TICKETS (CONTACTS) ──────────────────────────────
export const getSupportTickets = () => get(KEYS.support, []);
export const saveSupportTickets = (arr) => set(KEYS.support, arr);

export const addSupportTicket = async (ticket) => {
  const arr = getSupportTickets();
  const ticketId = `ticket_${Date.now()}`;
  const newTicket = {
    id: ticketId,
    createdAt: new Date().toISOString(),
    status: 'new', // new, in-progress, closed
    ...ticket
  };
  arr.unshift(newTicket);
  saveSupportTickets(arr);

  if (isFirebaseConfigured()) {
    try {
      await saveDocumentToFirestore('contacts', ticketId, newTicket);
    } catch (err) {
      console.error("Failed to save contact to Firestore:", err);
    }
  }
};

export const updateSupportTicketStatus = async (id, newStatus) => {
  const arr = getSupportTickets();
  const updated = arr.map(t => t.id === id ? { ...t, status: newStatus } : t);
  saveSupportTickets(updated);

  if (isFirebaseConfigured()) {
    try {
      const ticket = updated.find(t => t.id === id);
      if (ticket) {
        await saveDocumentToFirestore('contacts', id, ticket);
      }
    } catch (err) {
      console.error("Failed to update contact in Firestore:", err);
    }
  }
};

export const syncSupportTickets = async () => {
  if (!isFirebaseConfigured()) return;
  try {
    const contacts = await fetchCollectionFromFirestore('contacts');
    if (contacts && contacts.length > 0) {
      contacts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      saveSupportTickets(contacts);
      window.dispatchEvent(new Event('admin-data-updated'));
    }
  } catch (err) {
    console.error("Failed to sync contacts:", err);
  }
};

export const addOrder = (order) => {
  const arr = getOrders();
  arr.unshift(order);
  saveOrders(arr);
  
  if (isFirebaseConfigured()) {
    saveOrderToFirestore(order.orderId || order.id, order).catch(err => 
      console.error("Failed to save order to Firestore:", err)
    );
  }
};

/**
 * Syncs orders between Firestore and localStorage
 */
export const syncOrders = async (onSyncComplete) => {
  if (!isFirebaseConfigured()) return;
  
  try {
    const dbOrders = await fetchOrdersFromFirestore();
    const localOrders = getOrders();
    
    const mergedMap = new Map();
    localOrders.forEach(o => mergedMap.set(o.orderId || o.id, o));
    
    dbOrders.forEach(o => {
      const key = o.orderId || o.id;
      if (!mergedMap.has(key)) {
        mergedMap.set(key, o);
      }
    });
    
    // Upload local orders if not in db
    const dbIds = new Set(dbOrders.map(o => o.orderId || o.id));
    for (const o of localOrders) {
      const key = o.orderId || o.id;
      if (!dbIds.has(key)) {
        await saveOrderToFirestore(key, o);
      }
    }
    
    const mergedList = Array.from(mergedMap.values());
    mergedList.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    
    saveOrders(mergedList);
    
    if (onSyncComplete) {
      onSyncComplete(mergedList);
    }
  } catch (error) {
    console.error("Error syncing orders:", error);
  }
};

export const updateOrderStatus = (id, status) => {
  const arr = getOrders();
  const index = arr.findIndex(o => (o.orderId || o.id) === id);
  if (index > -1) {
    arr[index] = { ...arr[index], status: status };
    saveOrders(arr);
    
    if (isFirebaseConfigured()) {
      saveOrderToFirestore(id, arr[index]).catch(err =>
        console.error("Failed to update order status in Firestore:", err)
      );
    }
  }
};

// ── Notify main website of data change ───────────────────────
export const notifyWebsite = () => {
  window.dispatchEvent(new CustomEvent('admin-data-updated'));
};

export const staticBoutiques = {};

// ── BOUTIQUES ────────────────────────────────────────────────
export const getBoutiques = () => get(KEYS.boutiques, []);
export const saveBoutiques = (arr) => set(KEYS.boutiques, arr);

export const addBoutique = async (boutique) => {
  const arr = getBoutiques();
  arr.push(boutique);
  saveBoutiques(arr);
  if (isFirebaseConfigured()) {
    try {
      await saveDocumentToFirestore('boutiques', boutique.id, boutique);
    } catch (err) {
      console.error("Failed to save boutique to Firestore:", err);
    }
  }
};

export const updateBoutique = async (id, data) => {
  const updatedList = getBoutiques().map(b => b.id === id ? { ...b, ...data } : b);
  saveBoutiques(updatedList);
  if (isFirebaseConfigured()) {
    try {
      const boutique = updatedList.find(b => b.id === id);
      if (boutique) await saveDocumentToFirestore('boutiques', id, boutique);
    } catch (err) {
      console.error("Failed to update boutique in Firestore:", err);
    }
  }
};

export const deleteBoutique = async (id) => {
  saveBoutiques(getBoutiques().filter(b => b.id !== id));
  // Note: deletion from firestore can be handled if a deleteDocumentFromFirestore function is added later.
};

export const syncBoutiques = async () => {
  if (!isFirebaseConfigured()) return;
  try {
    const dbBoutiques = await fetchCollectionFromFirestore('boutiques');
    if (dbBoutiques && dbBoutiques.length > 0) {
      saveBoutiques(dbBoutiques);
      window.dispatchEvent(new Event('admin-data-updated'));
    }
  } catch (err) {
    console.error("Failed to sync boutiques:", err);
  }
};

export const getBoutiqueProfile = (boutiqueName) => {
  if (!boutiqueName) return null;
  const name = boutiqueName.trim().toLowerCase();
  const allBoutiques = getBoutiques();
  
  // Try to find a dynamic match first
  const match = allBoutiques.find(b => {
    const bn = (b.name || '').toLowerCase();
    const slug = bn.replace(/ /g, '-');
    return bn.includes(name) || name.includes(bn) || slug === name;
  });

  if (match) return match;

  return {
    name: boutiqueName.trim(),
    description: "",
    contact: "",
    address: "",
    coverImage: "",
    logo: "",
    rating: 0
  };
};

export const syncProducts = async (onSyncComplete) => {
  if (!isFirebaseConfigured()) return;
  try {
    const dbProducts = await fetchProductsFromFirestore();
    saveProducts(dbProducts);

    try {
      const data = await fetchCollectionFromFirestore('settings');
      const storeData = data.find(d => d.id === 'gurnaaz_store');
      if (storeData) {
          const collectionsDoc = await getDoc(doc(db, 'adminData', KEYS.collections));
          if (collectionsDoc.exists()) {
            localStorage.setItem(KEYS.collections, JSON.stringify(collectionsDoc.data().data));
          }

          const tagsDoc = await getDoc(doc(db, 'adminData', KEYS.collectionTags));
          if (tagsDoc.exists()) {
            localStorage.setItem(KEYS.collectionTags, JSON.stringify(tagsDoc.data().data));
          }
          
          notifyWebsite();
          
          for (const [key, value] of Object.entries(storeData)) {
            if (key !== 'id' && KEYS[key]) {
              set(KEYS[key], value);
            }
          }
      }
    } catch (e) {
      console.error("Failed to fetch settings:", e);
    }

    await syncBoutiques();

    if (onSyncComplete) {
      onSyncComplete(dbProducts);
    }
  } catch (error) {
    console.error("Error syncing products and collections:", error);
  }
};
