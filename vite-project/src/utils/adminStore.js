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
  db
} from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

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
  discounts:    'gurnaaz_discounts',
  support:      'gurnaaz_support',
  boutiques:    'gurnaaz_boutiques',
};

// ── Static Products Definition ────────────────────────────────
export const staticProducts = [];

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
      KEYS.gallery, KEYS.hero, KEYS.promotions, KEYS.testimonials, 
      KEYS.categories, KEYS.lookbook, KEYS.discounts
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
    reader.onload  = () => resolve(reader.result);
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
export const getGallery    = ()           => get(KEYS.gallery, []);
export const saveGallery   = (arr)        => set(KEYS.gallery, arr);
export const addGalleryItem= (item)       => { const arr = getGallery(); arr.unshift(item); saveGallery(arr); };
export const deleteGallery = (id)         => saveGallery(getGallery().filter(g => g.id !== id));

// ── Discounts ───────────────────────────────────────────────────
export const getDiscounts = () => {
  const data = localStorage.getItem(KEYS.discounts);
  return data ? JSON.parse(data) : [];
};

export const saveDiscounts = (discounts) => {
  localStorage.setItem(KEYS.discounts, JSON.stringify(discounts));
};

// ── Sync Helper ─────────────────────────────────────────────────────
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
