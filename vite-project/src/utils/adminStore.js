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

<<<<<<< HEAD
const KEYS = {
  products:     'gurnaaz_products',
  categories:   'gurnaaz_categories',
  reviews:      'gurnaaz_reviews',
  orders:       'gurnaaz_orders',
  support:      'gurnaaz_support',
  boutiques:    'gurnaaz_boutiques',
  collections:  'gurnaaz_collections',
  collectionTags: 'gurnaaz_collection_tags',
  festiveOffers: 'gurnaaz_festive_offers'
=======
export const memoryStore = {
  products: [],
  categories: [],
  boutiques: [],
  reviews: {},
  orders: [],
  support: [],
  collections: [],
  collectionTags: [],
  coupons: []
>>>>>>> aa180a84696430bc746da8dbb638cb663024ea8a
};

// INITIALIZATION
export const initializeStore = async () => {
  if (!isFirebaseConfigured()) return;

  try {
    const products = await fetchProductsFromFirestore();
    memoryStore.products = products || [];

    const boutiques = await fetchCollectionFromFirestore('boutiques');
    memoryStore.boutiques = boutiques || [];

    const categories = await fetchCollectionFromFirestore('categories');
    memoryStore.categories = categories || [];

    const collections = await fetchCollectionFromFirestore('collections');
    memoryStore.collections = collections || [];

    const collectionTags = await fetchCollectionFromFirestore('collectionTags');
    memoryStore.collectionTags = collectionTags || [];

    const coupons = await fetchCollectionFromFirestore('coupons');
    memoryStore.coupons = coupons || [];

    // Initialize reviews (group by productId if they are flat in Firestore)
    const reviews = await fetchCollectionFromFirestore('reviews');
    memoryStore.reviews = {};
    if (reviews && reviews.length > 0) {
      reviews.forEach(r => {
        if (!memoryStore.reviews[r.productId]) {
          memoryStore.reviews[r.productId] = [];
        }
        memoryStore.reviews[r.productId].push(r);
      });
    }

    const orders = await fetchCollectionFromFirestore('orders');
    memoryStore.orders = orders || [];

    const contacts = await fetchCollectionFromFirestore('contacts');
    memoryStore.support = contacts || [];

    notifyWebsite();

  } catch (err) {
    console.error("Failed to initialize store:", err);
  }
};

// GETTERS
export const getAllProducts = () => memoryStore.products;
export const getProducts = () => memoryStore.products;
export const getCategories = () => memoryStore.categories;
export const getCollections = () => memoryStore.collections;
export const getCollectionTags = () => memoryStore.collectionTags;
export const getBoutiques = () => memoryStore.boutiques;
export const getOrders = () => memoryStore.orders;
export const getSupportTickets = () => memoryStore.support;
export const getCoupons = () => memoryStore.coupons;
export const getReviews = (productId) => memoryStore.reviews[productId] || [];
export const getAllReviews = () => {
  const all = [];
  Object.values(memoryStore.reviews).forEach(arr => all.push(...arr));
  return all.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
};
export const getBoutiqueProfile = (boutiqueName) => {
  if (!boutiqueName) return null;
  const name = boutiqueName.trim().toLowerCase();
  const allBoutiques = getBoutiques();
  const match = allBoutiques.find(b => {
    const bn = (b.name || '').toLowerCase();
    const slug = bn.replace(/ /g, '-');
    return bn.includes(name) || name.includes(bn) || slug === name;
  });
  if (match) return match;
  return { name: boutiqueName.trim(), description: "", contact: "", address: "", coverImage: "", logo: "", rating: 0 };
};

// ACTIONS (ADD/UPDATE/DELETE)
export const addProduct = (product) => {
  memoryStore.products.unshift(product);
  if (isFirebaseConfigured()) saveProductToFirestore(product.id, product).catch(console.error);
};
export const updateProduct = (id, data) => {
  memoryStore.products = memoryStore.products.map(p => p.id === id ? { ...p, ...data } : p);
  if (isFirebaseConfigured()) {
    const updatedProd = memoryStore.products.find(p => p.id === id);
    if (updatedProd) saveProductToFirestore(id, updatedProd).catch(console.error);
  }
};
export const deleteProduct = (id) => {
  memoryStore.products = memoryStore.products.filter(p => p.id !== id);
  if (isFirebaseConfigured()) deleteProductFromFirestore(id).catch(console.error);
};

export const saveCategories = (arr) => {
    memoryStore.categories = arr;
    arr.forEach(c => saveDocumentToFirestore('categories', c.id.toString(), c));
};

export const deleteCategory = async (id) => {
  memoryStore.categories = memoryStore.categories.filter(c => c.id !== id);
  if (isFirebaseConfigured()) {
    import('firebase/firestore').then(({ doc, deleteDoc }) => {
      deleteDoc(doc(db, 'categories', id.toString())).catch(console.error);
    });
  }
  notifyWebsite();
};

export const saveCollections = (arr) => {
    memoryStore.collections = arr;
    arr.forEach(c => saveDocumentToFirestore('collections', c.id.toString(), c));
};

export const saveCollectionTags = async (tags) => {
  memoryStore.collectionTags = tags;
  tags.forEach(t => saveDocumentToFirestore('collectionTags', t.id.toString(), t));
  notifyWebsite();
};

export const addBoutique = async (boutique) => {
  memoryStore.boutiques.push(boutique);
  if (isFirebaseConfigured()) await saveDocumentToFirestore('boutiques', boutique.id.toString(), boutique);
};
export const updateBoutique = async (id, data) => {
  memoryStore.boutiques = memoryStore.boutiques.map(b => b.id === id ? { ...b, ...data } : b);
  if (isFirebaseConfigured()) {
    const boutique = memoryStore.boutiques.find(b => b.id === id);
    if (boutique) await saveDocumentToFirestore('boutiques', id.toString(), boutique);
  }
};
export const deleteBoutique = async (id) => {
  memoryStore.boutiques = memoryStore.boutiques.filter(b => b.id !== id);
};

export const addCoupon = async (coupon) => {
  memoryStore.coupons.push(coupon);
  if (isFirebaseConfigured()) await saveDocumentToFirestore('coupons', coupon.id.toString(), coupon);
  notifyWebsite();
};
export const updateCoupon = async (id, data) => {
  memoryStore.coupons = memoryStore.coupons.map(c => c.id === id ? { ...c, ...data } : c);
  if (isFirebaseConfigured()) {
    const coupon = memoryStore.coupons.find(c => c.id === id);
    if (coupon) await saveDocumentToFirestore('coupons', id.toString(), coupon);
  }
  notifyWebsite();
};
export const deleteCoupon = async (id) => {
  memoryStore.coupons = memoryStore.coupons.filter(c => c.id !== id);
  if (isFirebaseConfigured()) {
    import('firebase/firestore').then(({ doc, deleteDoc }) => {
      deleteDoc(doc(db, 'coupons', id.toString())).catch(console.error);
    });
  }
  notifyWebsite();
};

export const addOrder = (order) => {
  memoryStore.orders.unshift(order);
  if (isFirebaseConfigured()) saveOrderToFirestore(order.orderId || order.id, order).catch(console.error);
};
export const updateOrderStatus = (id, status) => {
  memoryStore.orders = memoryStore.orders.map(o => (o.orderId || o.id) === id ? { ...o, status } : o);
  if (isFirebaseConfigured()) {
    const order = memoryStore.orders.find(o => (o.orderId || o.id) === id);
    if (order) saveOrderToFirestore(id, order).catch(console.error);
  }
};
export const saveOrders = (arr) => {
  memoryStore.orders = arr;
};

export const addSupportTicket = async (ticket) => {
  const ticketId = `ticket_${Date.now()}`;
  const newTicket = { id: ticketId, createdAt: new Date().toISOString(), status: 'new', ...ticket };
  memoryStore.support.unshift(newTicket);
  if (isFirebaseConfigured()) await saveDocumentToFirestore('contacts', ticketId, newTicket);
};
export const updateSupportTicketStatus = async (id, newStatus) => {
  memoryStore.support = memoryStore.support.map(t => t.id === id ? { ...t, status: newStatus } : t);
  if (isFirebaseConfigured()) {
    const ticket = memoryStore.support.find(t => t.id === id);
    if (ticket) await saveDocumentToFirestore('contacts', id, ticket);
  }
};
export const saveSupportTickets = (arr) => {
  memoryStore.support = arr;
}

export const addReview = (productId, review) => {
  if (!memoryStore.reviews[productId]) memoryStore.reviews[productId] = [];
  const newReview = { id: `rev_${Date.now()}`, date: new Date().toLocaleDateString(), createdAt: new Date().toISOString(), productId, ...review };
  memoryStore.reviews[productId].unshift(newReview);
  
<<<<<<< HEAD
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
=======
  const reviews = memoryStore.reviews[productId];
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const formattedAvg = parseFloat(avg.toFixed(1));
  updateProduct(productId, { rating: formattedAvg });
  
  if (isFirebaseConfigured()) {
    saveDocumentToFirestore('reviews', newReview.id, newReview).then(() => saveProductRatingToFirestore(productId, formattedAvg, reviews.length)).catch(console.error);
  }
};

export const updateReview = (productId, reviewId, updatedData) => {
  if (memoryStore.reviews[productId]) {
    memoryStore.reviews[productId] = memoryStore.reviews[productId].map(r => 
      r.id === reviewId ? { ...r, ...updatedData } : r
    );
    
    const reviews = memoryStore.reviews[productId];
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const formattedAvg = parseFloat(avg.toFixed(1));
    updateProduct(productId, { rating: formattedAvg });
    
    if (isFirebaseConfigured()) {
      const updatedReview = memoryStore.reviews[productId].find(r => r.id === reviewId);
      if (updatedReview) {
        saveDocumentToFirestore('reviews', reviewId, updatedReview)
          .then(() => saveProductRatingToFirestore(productId, formattedAvg, reviews.length))
          .catch(console.error);
>>>>>>> aa180a84696430bc746da8dbb638cb663024ea8a
      }
    }
  }
};

export const deleteReview = async (productId, reviewId) => {
  if (memoryStore.reviews[productId]) {
    memoryStore.reviews[productId] = memoryStore.reviews[productId].filter(r => r.id !== reviewId);
    
    // Recalculate average rating
    const reviews = memoryStore.reviews[productId];
    const avg = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) : 0;
    const formattedAvg = parseFloat(avg.toFixed(1));
    updateProduct(productId, { rating: formattedAvg });

    if (isFirebaseConfigured()) {
      import('firebase/firestore').then(({ doc, deleteDoc }) => {
        deleteDoc(doc(db, 'reviews', reviewId))
          .then(() => saveProductRatingToFirestore(productId, formattedAvg, reviews.length))
          .catch(console.error);
      });
    }
  }
};

export const syncProductReviews = async (productId, onSyncComplete) => {
  if (!isFirebaseConfigured()) return;
  try {
    const dbReviews = await fetchReviewsFromFirestore(productId);
    if (dbReviews && dbReviews.length > 0) {
        memoryStore.reviews[productId] = dbReviews.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        const avg = dbReviews.reduce((sum, r) => sum + r.rating, 0) / dbReviews.length;
        updateProduct(productId, { rating: parseFloat(avg.toFixed(1)) });
    }
    if (onSyncComplete) onSyncComplete(memoryStore.reviews[productId]);
  } catch (e) {
      console.error(e);
  }
};

export const syncProducts = async (onSyncComplete) => {
  await initializeStore();
  if (onSyncComplete) onSyncComplete(memoryStore.products);
};
export const syncOrders = async (onSyncComplete) => {
  await initializeStore();
  if (onSyncComplete) onSyncComplete(memoryStore.orders);
};
export const syncBoutiques = async () => {};
export const syncSupportTickets = async () => {};
export const notifyWebsite = () => window.dispatchEvent(new CustomEvent('admin-data-updated'));
export const seedIfEmpty = () => {};

export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;
        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
<<<<<<< HEAD

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

// ── FESTIVE & SPECIAL ITEMS (Rakhi, Churi, Kadas, Hampers, Bracelets) ──────
export const defaultFestiveOffers = [
  {
    id: 'suit_combo',
    title: 'Gulabi Silk Patiala & Silver Rakhi Set',
    category: 'Patiala Suits',
    price: '₹8,999',
    originalPrice: '₹14,999',
    savings: 'Save ₹6,000',
    rating: '4.9',
    reviews: '142',
    badge: '40% OFF',
    desc: 'Pure Raw Silk Kameez with Golden Gota Patti & Silver Rakhi.',
    image: '/rakhi_suit_hero_shoot.jpg',
    active: true,
    stock: 20
  },
  {
    id: 'gift_hamper',
    title: 'Royal Kesari Audio QR Gift Box',
    category: 'Gift Hampers',
    price: '₹1,999',
    originalPrice: '₹3,499',
    savings: 'Save ₹1,500',
    rating: '4.9',
    reviews: '98',
    badge: '45% OFF',
    desc: 'Padded Velvet Hamper + Silver Rakhi + Audio QR Voice Card.',
    image: '/rakhi_gift_box_hamper.jpg',
    active: true,
    stock: 35
  },
  {
    id: 'kashmiri_churi',
    title: 'Royal Kashmiri Velvet & Zari Churi',
    category: 'Kashmiri Churi',
    price: '₹1,499',
    originalPrice: '₹2,499',
    savings: 'Save ₹1,000',
    rating: '4.8',
    reviews: '86',
    badge: '30% OFF',
    desc: 'Handcrafted Kashmiri Velvet Zari Bangles with Gold Tilla.',
    image: '/kashmiri_churi_bangles.jpg',
    active: true,
    stock: 50
  },
  {
    id: 'gold_kadas',
    title: 'Polki & Meenakari Gold Kadas',
    category: 'Designer Kadas',
    price: '₹2,299',
    originalPrice: '₹3,999',
    savings: 'Save ₹1,700',
    rating: '5.0',
    reviews: '114',
    badge: 'BUY 1 GET 1 FREE',
    desc: 'Handcrafted Jaipur Polki Diamond & Gold Plated Kadas.',
    image: '/designer_kadda_bangles.jpg',
    active: true,
    stock: 40
  }
];

export const getFestiveOffers = () => {
  const saved = get(KEYS.festiveOffers, null);
  if (!saved || saved.length === 0) return defaultFestiveOffers;
  return saved;
};

export const saveFestiveOffers = (arr) => {
  set(KEYS.festiveOffers, arr);
  notifyWebsite();
};

export const addFestiveOffer = (offer) => {
  const list = getFestiveOffers();
  list.unshift(offer);
  saveFestiveOffers(list);
};

export const updateFestiveOffer = (id, data) => {
  const list = getFestiveOffers();
  const index = list.findIndex(o => o.id === id);
  if (index !== -1) {
    list[index] = { ...list[index], ...data };
    saveFestiveOffers(list);
  }
};

export const deleteFestiveOffer = (id) => {
  const list = getFestiveOffers().filter(o => o.id !== id);
  saveFestiveOffers(list);
};

const defaultVideos = [];

const defaultReels = [];

const injectDefaultMedia = (product, index) => {
  return {
    ...product,
    videoUrl: product.videoUrl || '',
    reelUrl: product.reelUrl || '',
    additionalImages: product.additionalImages || [],
    sizes: product.sizes || [],
    fitOptions: product.fitOptions || ['Unstitched', 'Stitched']
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
  
  const hasSeeded = localStorage.getItem('gurnaaz_categories_seeded_v3');
  
  if (!hasSeeded) {
    const defaults = [
      { id: 1, name: 'Rakhi Special', subtitle: 'Festive Edition', image: '/rakhi_suit_hero_shoot.jpg', image2: '/rakhi_poster_banner.png', tagline: 'Designer Rakhi & Ethnic Suit Pairing', order: 1, active: true },
      { id: 2, name: 'Gift Boxes', subtitle: 'Keepsake Hampers', image: '/rakhi_gift_box_hamper.jpg', image2: '/rakhi_poster_banner.png', tagline: 'Sweets, Silver Rakhi & Custom Voice QR Card', order: 2, active: true },
      { id: 3, name: 'Kashmiri Churi', subtitle: 'Artisanal Bangles', image: '/kashmiri_churi_bangles.jpg', image2: '/kashmiri_churi_bangles.jpg', tagline: 'Handcrafted Velvet Zari Bangles from Kashmir', order: 3, active: true },
      { id: 4, name: 'Designer Kadas', subtitle: 'Polki & Gold', image: '/designer_kadda_bangles.jpg', image2: '/designer_kadda_bangles.jpg', tagline: 'Bridal Gold & Meenakari Kada Bangles', order: 4, active: true },
      { id: 5, name: 'Kids Rakhi', subtitle: 'Bacheya Ki Special', image: '/kids_rakhi_collection.jpg', image2: '/kids_rakhi_collection.jpg', tagline: 'Cute superhero & soft light-up Rakhis for kids', order: 5, active: true },
      { id: 6, name: 'Anarkali', subtitle: 'The Royal Edit', image: '/anarkali_suit.png', image2: '/designer_suit_1.png', tagline: 'Flowing elegance for every occasion', order: 6, active: true },
      { id: 7, name: 'Sharara', subtitle: 'The Festive Edit', image: '/sharara_suit.png', image2: '/pakistani_suit.png', tagline: 'Modern silhouettes with traditional charm', order: 7, active: true },
      { id: 8, name: 'Banarasi', subtitle: 'Golden Brocades', image: '/banarasi_suit.png', image2: '/cotton_suit.png', tagline: 'Heritage weaves from the holy city', order: 8, active: true },
      { id: 9, name: 'Patiala', subtitle: 'Heritage Weaves', image: '/patiala_suit.png', image2: '/designer_suit_1.png', tagline: 'Comfortable cuts with vibrant prints', order: 9, active: true },
      { id: 10, name: 'Pakistani', subtitle: 'Straight Elegance', image: '/pakistani_suit.png', image2: '/sharara_suit.png', tagline: 'Contemporary styles with rich embroidery', order: 10, active: true },
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
    
    localStorage.setItem('gurnaaz_categories_seeded_v3', 'true');
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

export const staticBoutiques = {
  'Awadh Kraft': {
    id: 'b1',
    name: 'Awadh Kraft',
    logo: '/chikankari_suit.png',
    coverImage: '/chikankari_suit.png',
    rating: 4.9,
    reviews: 124,
    location: 'Lucknow, UP'
  },
  'Rajputana Heritage': {
    id: 'b2',
    name: 'Rajputana Heritage',
    logo: '/banarasi_suit.png',
    coverImage: '/banarasi_suit.png',
    rating: 4.8,
    reviews: 89,
    location: 'Varanasi, UP'
  },
  'Nazraana': {
    id: 'b3',
    name: 'Nazraana',
    logo: '/pakistani_suit.png',
    coverImage: '/pakistani_suit.png',
    rating: 4.7,
    reviews: 210,
    location: 'Delhi'
  },
  'Rajputana': {
    id: 'b4',
    name: 'Rajputana',
    logo: '/sharara_suit.png',
    coverImage: '/sharara_suit.png',
    rating: 5.0,
    reviews: 312,
    location: 'Jaipur, RJ'
  }
};

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
=======
>>>>>>> aa180a84696430bc746da8dbb638cb663024ea8a
