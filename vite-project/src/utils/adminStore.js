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
  fetchOrdersFromFirestore
} from '../firebase';

const KEYS = {
  products:     'gurnaaz_products',
  gallery:      'gurnaaz_gallery',
  hero:         'gurnaaz_hero',
  promotions:   'gurnaaz_promotions',
  testimonials: 'gurnaaz_testimonials',
  categories:   'gurnaaz_categories',
  lookbook:     'gurnaaz_lookbook',
  reviews:      'gurnaaz_reviews',
  orders:       'gurnaaz_orders',
};

// ── Static Products Definition ────────────────────────────────
export const staticProducts = [
  { 
    id: 't1', 
    name: 'Embroidered Silk Suit Set', 
    price: '₹4,299', 
    priceNum: 4299, 
    boutique: 'Kala Mandir', 
    badge: 'Silk Blend', 
    collection: 'Trending', 
    type: 'Anarkali', 
    suitType: 'Anarkali', 
    occasions: ['Festive', 'Party', 'Wedding'], 
    care: ['Dry Clean Only'], 
    sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)'], 
    image: '/designer_suit_1.png', 
    additionalImages: ['/anarkali_suit.png', '/sharara_suit.png'], 
    shortDesc: 'An elegant hand-embroidered raw silk suit set with luxury dupatta.', 
    fabricDetails: 'Handloomed raw silk blend with fine gold zari and zardozi details.', 
    fabricName: 'Raw Silk Blend', 
    fabricDesc: 'Premium heavy weight drape.', 
    rating: 4.8 
  },
  { 
    id: 't2', 
    name: 'Chanderi Salwar Suit Set', 
    price: '₹3,899', 
    priceNum: 3899, 
    boutique: 'Zari Heritage', 
    badge: 'Handloom', 
    collection: 'Trending', 
    type: 'Patiala', 
    suitType: 'Patiala', 
    occasions: ['Casual', 'Daily Wear', 'Festive'], 
    care: ['Hand Wash'], 
    sizes: ['M (38)', 'L (40)', 'XL (42)'], 
    image: '/cotton_suit.png', 
    additionalImages: ['/designer_suit_1.png'], 
    shortDesc: 'Comfortable daywear block-printed Chanderi suit.', 
    fabricDetails: '100% fine cotton-chanderi blend with hand-carved block prints.', 
    fabricName: 'Chanderi Cotton', 
    fabricDesc: 'Soft, breathable, and light.', 
    rating: 4.6 
  },
  { 
    id: 't3', 
    name: 'Designer Angrakha Suit Set', 
    price: '₹5,499', 
    priceNum: 5499, 
    boutique: 'Gulabo Jaipur', 
    badge: 'Premium', 
    collection: 'Trending', 
    type: 'Sharara', 
    suitType: 'Sharara', 
    occasions: ['Festive', 'Party', 'Wedding'], 
    care: ['Dry Clean Only'], 
    sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)'], 
    image: '/sharara_suit.png', 
    additionalImages: ['/pakistani_suit.png'], 
    shortDesc: 'Charming Angrakha cut sharara suit set with hand-applied gota borders.', 
    fabricDetails: 'Pure georgette fabric with traditional Rajasthani gota work.', 
    fabricName: 'Pure Georgette', 
    fabricDesc: 'Flowy tiers with golden shine.', 
    rating: 4.9 
  },
  { 
    id: 't4', 
    name: 'Pakistani Straight Suit Set', 
    price: '₹4,799', 
    priceNum: 4799, 
    boutique: 'Nazraana', 
    badge: 'Verified', 
    collection: 'New Arrivals', 
    type: 'Pakistani', 
    suitType: 'Pakistani', 
    occasions: ['Festive', 'Party'], 
    care: ['Dry Clean Only'], 
    sizes: ['M (38)', 'L (40)', 'XL (42)', 'XXL (44)'], 
    image: '/pakistani_suit.png', 
    additionalImages: ['/designer_suit_1.png'], 
    shortDesc: 'Classic straight cut salwar suit in royal ivory.', 
    fabricDetails: 'Premium cotton silk with shadow work lace inserts.', 
    fabricName: 'Cotton Silk Blend', 
    fabricDesc: 'Semi-sheer luxury texture.', 
    rating: 4.7 
  },
  { 
    id: 'n1', 
    name: 'Floral Silk Anarkali Suit', 
    price: '₹6,899', 
    priceNum: 6899, 
    boutique: 'Silk Weaver', 
    badge: 'New Edition', 
    collection: 'New Arrivals', 
    type: 'Anarkali', 
    suitType: 'Anarkali', 
    occasions: ['Festive', 'Wedding'], 
    care: ['Dry Clean Only'], 
    sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)'], 
    image: '/anarkali_suit.png', 
    additionalImages: ['/sharara_suit.png'], 
    shortDesc: 'Voluminous floral printed pure silk anarkali.', 
    fabricDetails: 'Hand-printed digital floral motifs on organza and art silk base.', 
    fabricName: 'Art Silk & Organza', 
    fabricDesc: 'Stunning flare with matching dupatta.', 
    rating: 4.9 
  },
  { 
    id: 'n2', 
    name: 'Classic Georgette Suit Set', 
    price: '₹3,299', 
    priceNum: 3299, 
    boutique: 'Poshak', 
    badge: 'Lightweight', 
    collection: 'New Arrivals', 
    type: 'Casual', 
    suitType: 'Casual', 
    occasions: ['Casual', 'Daily Wear'], 
    care: ['Hand Wash'], 
    sizes: ['M (38)', 'L (40)', 'XL (42)'], 
    image: '/designer_suit_1.png', 
    additionalImages: ['/cotton_suit.png'], 
    shortDesc: 'Comfortable casual georgette suit with minor threadwork.', 
    fabricDetails: 'Lightweight poly-georgette with delicate resham border work.', 
    fabricName: 'Faux Georgette', 
    fabricDesc: 'Highly durable and easy to maintain.', 
    rating: 4.5 
  },
  { 
    id: 'n3', 
    name: 'Glacier Blue Organza Suit Set', 
    price: '₹14,500', 
    priceNum: 14500, 
    boutique: 'Punjabi Couture', 
    badge: 'Premium', 
    collection: 'New Arrivals', 
    type: 'Sharara', 
    suitType: 'Sharara', 
    occasions: ['Wedding', 'Festive'], 
    care: ['Dry Clean Only'], 
    sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)'], 
    image: '/sky_blue_suit.jpg', 
    additionalImages: ['/designer_suit_1.png'], 
    shortDesc: 'Opulent glacier blue organza silk sharara set.', 
    fabricDetails: 'Handcrafted zardozi floral vines over premium organza silk fabric.', 
    fabricName: 'Premium Organza Silk', 
    fabricDesc: 'Ultra-luxurious hand-feel.', 
    rating: 5.0 
  },
  { 
    id: 'n4', 
    name: 'Organza Dupatta Suit Set', 
    price: '₹5,199', 
    priceNum: 5199, 
    boutique: 'Rivaaz', 
    badge: 'Best Price', 
    collection: 'New Arrivals', 
    type: 'Chikankari', 
    suitType: 'Chikankari', 
    occasions: ['Casual', 'Party'], 
    care: ['Dry Clean Only'], 
    sizes: ['M (38)', 'L (40)', 'XL (42)'], 
    image: '/chikankari_suit.png', 
    additionalImages: ['/anarkali_suit.png'], 
    shortDesc: 'Delicate Chikankari embroidered georgette suit set.', 
    fabricDetails: 'Soft georgette with lucknowi shadow work chikankari thread patterns.', 
    fabricName: 'Georgette Chikankari', 
    fabricDesc: 'Beautiful hand-done look.', 
    rating: 4.6 
  },
  { 
    id: 'b1', 
    name: 'Velvet Embroidered Suit Set', 
    price: '₹8,999', 
    priceNum: 8999, 
    boutique: 'Vastra', 
    badge: 'Hot Seller', 
    collection: 'Best Sellers', 
    type: 'Anarkali', 
    suitType: 'Anarkali', 
    occasions: ['Wedding', 'Party'], 
    care: ['Dry Clean Only'], 
    sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)'], 
    image: '/banarasi_suit.png', 
    additionalImages: ['/designer_suit_1.png'], 
    shortDesc: 'Heavy embroidered plush velvet suit.', 
    fabricDetails: 'Rich micro-velvet fabric with intricate tilla embroidery.', 
    fabricName: 'Premium Micro-Velvet', 
    fabricDesc: 'Warm, soft, and royal look.', 
    rating: 4.9 
  },
  { 
    id: 'b2', 
    name: 'Chikankari Handloom Suit Set', 
    price: '₹7,499', 
    priceNum: 7499, 
    boutique: 'Awadh Kraft', 
    badge: 'Artisanal', 
    collection: 'Best Sellers', 
    type: 'Chikankari', 
    suitType: 'Chikankari', 
    occasions: ['Festive', 'Party'], 
    care: ['Dry Clean Only'], 
    sizes: ['M (38)', 'L (40)', 'XL (42)', 'XXL (44)'], 
    image: '/chikankari_suit.png', 
    additionalImages: ['/designer_suit_1.png'], 
    shortDesc: 'Authentic Lucknowi chikankari handloom suit.', 
    fabricDetails: 'Pure modal cotton with exquisite hand-knotted chikankari stitches.', 
    fabricName: 'Handloom Modal Cotton', 
    fabricDesc: 'Artisanal heritage craft.', 
    rating: 4.8 
  },
  { 
    id: 'b3', 
    name: 'Banarasi Brocade Suit Set', 
    price: '₹9,299', 
    priceNum: 9299, 
    boutique: 'Kashi Fabrics', 
    badge: 'Heritage', 
    collection: 'Best Sellers', 
    type: 'Banarasi', 
    suitType: 'Banarasi', 
    occasions: ['Wedding', 'Festive'], 
    care: ['Dry Clean Only'], 
    sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)'], 
    image: '/banarasi_suit.png', 
    additionalImages: ['/designer_suit_1.png'], 
    shortDesc: 'Luxurious Banarasi brocade suit with pure silk elements.', 
    fabricDetails: 'Handwoven gold brocade motifs on premium katan silk base.', 
    fabricName: 'Banarasi Katan Silk', 
    fabricDesc: 'Woven with gold and silver zari.', 
    rating: 4.8 
  },
  { 
    id: 'b4', 
    name: 'Gota Patti Sharara Suit Set', 
    price: '₹4,999', 
    priceNum: 4999, 
    boutique: 'Shagun Jaipur', 
    badge: 'Best Seller', 
    collection: 'Best Sellers', 
    type: 'Sharara', 
    suitType: 'Sharara', 
    occasions: ['Festive', 'Party'], 
    care: ['Dry Clean Only'], 
    sizes: ['M (38)', 'L (40)', 'XL (42)'], 
    image: '/sharara_suit.png', 
    additionalImages: ['/designer_suit_1.png'], 
    shortDesc: 'Jaipur traditional gota patti sharara suit set.', 
    fabricDetails: 'Rayon crepe with high-density gold gota work lace borders.', 
    fabricName: 'Rayon Crepe', 
    fabricDesc: 'Flowy and extremely comfortable.', 
    rating: 4.7 
  },
  { 
    id: 'f1', 
    name: 'Royal Sharara Suit Set', 
    price: '₹11,499', 
    priceNum: 11499, 
    boutique: 'Rajputana', 
    badge: 'Grand Wedding', 
    collection: 'Festive Edit', 
    type: 'Sharara', 
    suitType: 'Sharara', 
    occasions: ['Wedding', 'Party'], 
    care: ['Dry Clean Only'], 
    sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)'], 
    image: '/sharara_suit.png', 
    additionalImages: ['/designer_suit_1.png'], 
    shortDesc: 'Imperial wedding wear sharara suit.', 
    fabricDetails: 'Pure upada silk decorated with detailed hand-done zardozi craft.', 
    fabricName: 'Pure Upada Silk', 
    fabricDesc: 'Stunning royal drape and shine.', 
    rating: 5.0 
  },
  { 
    id: 'f2', 
    name: 'Handcrafted Palazzo Suit Set', 
    price: '₹8,299', 
    priceNum: 8299, 
    boutique: 'Gulabi Dhaaga', 
    badge: 'Silk Edit', 
    collection: 'Festive Edit', 
    type: 'Casual', 
    suitType: 'Casual', 
    occasions: ['Festive', 'Party'], 
    care: ['Dry Clean Only'], 
    sizes: ['M (38)', 'L (40)', 'XL (42)'], 
    image: '/pakistani_suit.png', 
    additionalImages: ['/designer_suit_1.png'], 
    shortDesc: 'Vibrant silk palazzo suit set.', 
    fabricDetails: 'Tabby silk with fine mirror work and hand-knitted threads.', 
    fabricName: 'Tabby Silk', 
    fabricDesc: 'Soft sheen with delicate touch.', 
    rating: 4.8 
  },
  { 
    id: 'f3', 
    name: 'Raw Silk Anarkali Suit Set', 
    price: '₹13,999', 
    priceNum: 13999, 
    boutique: 'Royal Heritage', 
    badge: 'Exclusive', 
    collection: 'Festive Edit', 
    type: 'Anarkali', 
    suitType: 'Anarkali', 
    occasions: ['Wedding', 'Festive'], 
    care: ['Dry Clean Only'], 
    sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)'], 
    image: '/anarkali_suit.png', 
    additionalImages: ['/designer_suit_1.png'], 
    shortDesc: 'Extremely high-volume raw silk anarkali suit.', 
    fabricDetails: 'Pure raw silk fabric with traditional Rajasthani danka embroidery.', 
    fabricName: 'Pure Raw Silk', 
    fabricDesc: 'Heavy, luxurious, and structured flare.', 
    rating: 4.9 
  },
  { 
    id: 'f4', 
    name: 'Heavy Zardozi Salwar Suit Set', 
    price: '₹12,499', 
    priceNum: 12499, 
    boutique: 'Lakhnavi Shaan', 
    badge: 'Festive Special', 
    collection: 'Festive Edit', 
    type: 'Pakistani', 
    suitType: 'Pakistani', 
    occasions: ['Wedding', 'Party'], 
    care: ['Dry Clean Only'], 
    sizes: ['M (38)', 'L (40)', 'XL (42)'], 
    image: '/designer_suit_1.png', 
    additionalImages: ['/anarkali_suit.png'], 
    shortDesc: 'Beautiful straight-cut heavy zardozi salwar suit.', 
    fabricDetails: 'Kora silk base adorned with Lucknowi zardozi metal embroidery.', 
    fabricName: 'Kora Silk', 
    fabricDesc: 'Unique textured look.', 
    rating: 4.7 
  }
];

// ── Generic helpers ──────────────────────────────────────────
const get  = (key, fallback = []) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};
const set  = (key, value) => localStorage.setItem(key, JSON.stringify(value));

// ── Convert image File → base64 (persists in localStorage) ──
export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// ── PRODUCTS ─────────────────────────────────────────────────
export const getProducts   = ()           => get(KEYS.products, []);
export const saveProducts  = (arr)        => set(KEYS.products, arr);
export const addProduct    = (product)    => { const arr = getProducts(); arr.unshift(product); saveProducts(arr); };
export const updateProduct = (id, data)   => saveProducts(getProducts().map(p => p.id === id ? { ...p, ...data } : p));
export const deleteProduct = (id)         => saveProducts(getProducts().filter(p => p.id !== id));

const defaultVideos = [
  'https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-a-red-dress-walking-in-a-field-40485-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-in-white-dress-posing-in-nature-41584-large.mp4'
];

const defaultReels = [
  'https://assets.mixkit.co/videos/preview/mixkit-young-woman-modelling-a-red-summer-dress-40487-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-model-posing-in-a-fashion-photoshoot-40486-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-woman-running-in-slow-motion-in-a-long-dress-40488-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-young-woman-posing-with-a-flowing-dress-in-a-field-40489-large.mp4'
];

const injectDefaultMedia = (product, index) => {
  const images = product.additionalImages && product.additionalImages.length > 0
    ? product.additionalImages
    : [
        product.image || '/designer_suit_1.png',
        '/banarasi_suit.png',
        '/chikankari_suit.png',
        '/sharara_suit.png'
      ];
  
  return {
    ...product,
    videoUrl: product.videoUrl || defaultVideos[index % defaultVideos.length],
    reelUrl: product.reelUrl || defaultReels[index % defaultReels.length],
    additionalImages: images,
    sizes: product.sizes && product.sizes.length > 0
      ? product.sizes
      : ['S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)']
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
export const getGallery    = ()           => get(KEYS.gallery, []);
export const saveGallery   = (arr)        => set(KEYS.gallery, arr);
export const addGalleryItem= (item)       => { const arr = getGallery(); arr.unshift(item); saveGallery(arr); };
export const deleteGallery = (id)         => saveGallery(getGallery().filter(g => g.id !== id));

// ── HERO ─────────────────────────────────────────────────────
export const getHero  = (fallback) => get(KEYS.hero, fallback);
export const saveHero = (data)     => set(KEYS.hero, data);

// ── PROMOTIONS ───────────────────────────────────────────────
export const getPromo  = (fallback) => get(KEYS.promotions, fallback);
export const savePromo = (data)     => set(KEYS.promotions, data);

// ── TESTIMONIALS ─────────────────────────────────────────────
export const getTestimonials  = ()    => get(KEYS.testimonials, []);
export const saveTestimonials = (arr) => set(KEYS.testimonials, arr);

// ── CATEGORIES ───────────────────────────────────────────────
export const getCategories  = ()    => get(KEYS.categories, []);
export const saveCategories = (arr) => set(KEYS.categories, arr);

// ── LOOKBOOK ─────────────────────────────────────────────────
export const getLookbook  = (fallback) => get(KEYS.lookbook, fallback);
export const saveLookbook = (data)     => set(KEYS.lookbook, data);

// ── ORDERS ───────────────────────────────────────────────────
export const getOrders = () => get(KEYS.orders, []);
export const saveOrders = (arr) => set(KEYS.orders, arr);

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

export const staticBoutiques = {
  'Kala Mandir': {
    name: 'Kala Mandir',
    description: 'Renowned for handloomed raw silks, traditional weaves, and intricate zardozi craftsmanship from Varanasi and beyond. Kala Mandir brings centuries of royal heritage directly to your ethnic wardrobe.',
    contact: '+91 98765 01001 | contact@kalamandir.com',
    address: '14, Heritage Lane, Chowk, Varanasi, UP',
    coverImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    rating: 4.8
  },
  'Zari Heritage': {
    name: 'Zari Heritage',
    description: 'Specialists in classic Chanderi block prints, traditional Patiala gathered salwars, and fine resham borders. We preserve the organic texture of Indian handloom with modern cuts.',
    contact: '+91 98765 01002 | info@zariheritage.com',
    address: '72, Block Print Bazar, Sector 17, Chandigarh',
    coverImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 4.6
  },
  'Gulabo Jaipur': {
    name: 'Gulabo Jaipur',
    description: 'Bringing the royal charm of Rajasthan to life with flowy pure georgette fabrics, hand-applied gota patti laces, and traditional Angrakha cuts in vibrant block colors.',
    contact: '+91 98765 01003 | hello@gulabojaipur.com',
    address: 'B-4, Johari Bazar, Jaipur, Rajasthan',
    coverImage: 'https://images.unsplash.com/photo-1605784401368-5af1d9d6c4dc?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 4.9
  },
  'Nazraana': {
    name: 'Nazraana',
    description: 'Exquisite straight-cut Lucknowi silhouettes and Chikankari shadow embroidery, decorated with delicate shadow work lace inserts and pure chiffon dupattas.',
    contact: '+91 98765 01004 | shop@nazraana.com',
    address: 'Hazratganj Main Market, Lucknow, UP',
    coverImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    rating: 4.7
  },
  'Vastra': {
    name: 'Vastra',
    description: 'Vastra designs premium velvet collections with heavy hand-applied zardozi works. Our designs combine heavy traditional embellishments with clean, structured tailoring.',
    contact: '+91 98765 01005 | orders@vastra.in',
    address: 'Block C, Shahpur Jat, New Delhi',
    coverImage: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    rating: 4.9
  },
  'Awadh Kraft': {
    name: 'Awadh Kraft',
    description: 'Authentic hand-embroidered Lucknowi Chikankari directly from craft councils and block weavers in Lucknow. Premium heritage ethnic wear.',
    contact: '+91 98765 01006 | contact@awadhkraft.org',
    address: 'Artisans Market, Chowk, Lucknow, UP',
    coverImage: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    rating: 4.8
  }
};

export const getBoutiqueProfile = (boutiqueName) => {
  if (!boutiqueName) return null;
  const name = boutiqueName.trim();
  if (staticBoutiques[name]) {
    return staticBoutiques[name];
  }
  return {
    name: name,
    description: `Premium ethnic wear boutique offering handpicked designer suits, salwar sets, and traditional wear directly from artisan workshops.`,
    contact: '+91 99999 88888 | hello@' + name.toLowerCase().replace(/\s+/g, '') + '.com',
    address: 'Artisan Plaza, Sector 5, Greater Noida, NCR',
    coverImage: 'https://images.unsplash.com/photo-1605784401368-5af1d9d6c4dc?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    rating: 4.5
  };
};
