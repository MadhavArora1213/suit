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

export const memoryStore = {
  products: [],
  categories: [],
  boutiques: [],
  reviews: {},
  orders: [],
  support: [],
  collections: [],
  collectionTags: [],
  coupons: [],
  festiveOffers: []
};

// INITIALIZATION
export const initializeStore = async () => {
  if (!isFirebaseConfigured()) return;

  try {
    const safeFetch = async (fetchPromise, fallback = []) => {
      try { return (await fetchPromise) || fallback; }
      catch (e) { console.warn("Firestore fetch warning:", e.message); return fallback; }
    };

    memoryStore.products = await safeFetch(fetchProductsFromFirestore());
    memoryStore.boutiques = await safeFetch(fetchCollectionFromFirestore('boutiques'));
    memoryStore.categories = await safeFetch(fetchCollectionFromFirestore('categories'));
    memoryStore.collections = await safeFetch(fetchCollectionFromFirestore('collections'));
    memoryStore.collectionTags = await safeFetch(fetchCollectionFromFirestore('collectionTags'));
    memoryStore.coupons = await safeFetch(fetchCollectionFromFirestore('coupons'));
    memoryStore.festiveOffers = await safeFetch(fetchCollectionFromFirestore('festiveOffers'));

    // Initialize reviews (group by productId if they are flat in Firestore)
    const reviews = await safeFetch(fetchCollectionFromFirestore('reviews'));
    memoryStore.reviews = {};
    if (reviews && reviews.length > 0) {
      reviews.forEach(r => {
        if (!memoryStore.reviews[r.productId]) {
          memoryStore.reviews[r.productId] = [];
        }
        memoryStore.reviews[r.productId].push(r);
      });
    }

    memoryStore.orders = await safeFetch(fetchCollectionFromFirestore('orders'));
    memoryStore.support = await safeFetch(fetchCollectionFromFirestore('contacts'));

    notifyWebsite();

  } catch (err) {
    console.error("Critical failure initializing store:", err);
  }
};

export const defaultCategories = [
  { id: '1', name: 'Anarkali Suits', active: true, order: 1 },
  { id: '2', name: 'Sharara Suits', active: true, order: 2 },
  { id: '3', name: 'Patiala Suits', active: true, order: 3 },
  { id: '4', name: 'Lehenga Sets', active: true, order: 4 },
  { id: '5', name: 'Palazzo Suits', active: true, order: 5 },
  { id: '6', name: 'Silk Sarees', active: true, order: 6 },
  { id: '7', name: 'Straight Cut', active: true, order: 7 },
  { id: '8', name: 'Designer Dupattas', active: true, order: 8 }
];

export const defaultCollections = [
  { id: 'festive', title: 'Festive Edit', subtitle: 'Royal Celebration Wear', category: 'Festive', isFeaturedMenu: true, image: '/anarkali_suit.png', active: true, order: 1 },
  { id: 'wedding', title: 'Bridal & Wedding', subtitle: 'Heavy Zari & Dori', category: 'Wedding', isFeaturedMenu: true, image: '/designer_suit_1.png', active: true, order: 2 },
  { id: 'velvet', title: 'Royal Velvet', subtitle: 'Pure Kashmiri Velvet', category: 'Velvet', image: '/designer_suit_1.png', active: true, order: 3 },
  { id: 'silk', title: 'Pure Raw Silk', subtitle: 'Traditional Weaves', category: 'Silk', image: '/anarkali_suit.png', active: true, order: 4 },
  { id: 'pastel', title: 'Pastel Dreams', subtitle: 'Soft & Elegant Tones', category: 'Pastel', image: '/designer_suit_1.png', active: true, order: 5 },
  { id: 'black', title: 'Midnight Black', subtitle: 'Noir Elegance', category: 'Black', image: '/anarkali_suit.png', active: true, order: 6 },
  { id: 'luxury', title: 'Haute Couture', subtitle: 'Handcrafted Masterpieces', category: 'Luxury', image: '/designer_suit_1.png', active: true, order: 7 }
];

export const defaultBoutiques = [
  { id: '1', name: 'Gurnaaz Heritage', type: 'Boutique', showInNavbar: true, isFeatured: true, coverImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80', description: 'Handcrafted royal ethnic suits & lehengas.' },
  { id: '2', name: 'Kashmiri Silk Studio', type: 'Shop', showInNavbar: true, isFeatured: true, coverImage: '/designer_suit_1.png', description: 'Authentic Kashmiri Tilla & Zari work.' }
];

export const getAllProducts = () => memoryStore.products;
export const getProducts = () => memoryStore.products;
export const getCategories = () => memoryStore.categories;
export const getCollections = () => memoryStore.collections;
export const getCollectionTags = () => memoryStore.collectionTags;
export const getBoutiques = () => memoryStore.boutiques;
export const defaultFestiveOffers = [
  { id: 'suit_combo', title: 'Gulabi Silk Patiala & Silver Rakhi Set', category: 'Patiala Suits', price: '₹8,999', originalPrice: '₹14,999', savings: 'Save ₹6,000', rating: '4.9', reviews: '142', badge: '40% OFF', desc: 'Pure Raw Silk Kameez with Golden Gota Patti & Silver Rakhi.', image: '/rakhi_suit_hero_shoot.jpg', active: true, stock: 20 },
  { id: 'gift_hamper', title: 'Royal Kesari Audio QR Gift Box', category: 'Gift Hampers', price: '₹1,999', originalPrice: '₹3,499', savings: 'Save ₹1,500', rating: '4.9', reviews: '98', badge: '45% OFF', desc: 'Padded Velvet Hamper + Silver Rakhi + Audio QR Voice Card.', image: '/rakhi_gift_box_hamper.jpg', active: true, stock: 35 },
  { id: 'kashmiri_churi', title: 'Royal Kashmiri Velvet & Zari Churi', category: 'Kashmiri Churi', price: '₹1,499', originalPrice: '₹2,499', savings: 'Save ₹1,000', rating: '4.8', reviews: '86', badge: '30% OFF', desc: 'Handcrafted Kashmiri Velvet Zari Bangles with Gold Tilla.', image: '/kashmiri_churi_bangles.jpg', active: true, stock: 50 },
  { id: 'gold_kadas', title: 'Polki & Meenakari Gold Kadas', category: 'Designer Kadas', price: '₹2,299', originalPrice: '₹3,999', savings: 'Save ₹1,700', rating: '5.0', reviews: '114', badge: 'BUY 1 GET 1 FREE', desc: 'Handcrafted Jaipur Polki Diamond & Gold Plated Kadas.', image: '/designer_kadda_bangles.jpg', active: true, stock: 40 }
];

export const getOrders = () => memoryStore.orders;
export const getSupportTickets = () => memoryStore.support;
export const getCoupons = () => memoryStore.coupons;
export const getFestiveOffers = () => {
  if (!memoryStore.festiveOffers || memoryStore.festiveOffers.length === 0) {
    return defaultFestiveOffers;
  }
  return memoryStore.festiveOffers;
};
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

export const recordProductView = (id) => {
  if (!id) return;
  const prod = memoryStore.products.find(p => String(p.id) === String(id));
  if (!prod) return;
  const currentViews = (prod.viewsCount || prod.views || 0) + 1;
  updateProduct(id, { viewsCount: currentViews, views: currentViews });
  notifyWebsite();
};

export const recordProductClick = (id, clickType = 'card_click') => {
  if (!id) return;
  const prod = memoryStore.products.find(p => String(p.id) === String(id));
  if (!prod) return;
  const currentClicks = (prod.clicksCount || prod.clicks || 0) + 1;
  updateProduct(id, { clicksCount: currentClicks, clicks: currentClicks });
  notifyWebsite();
};

export const saveFestiveOffers = (arr) => {
  memoryStore.festiveOffers = arr;
  arr.forEach(c => saveDocumentToFirestore('festiveOffers', c.id.toString(), c));
  notifyWebsite();
};

export const addFestiveOffer = async (offer) => {
  memoryStore.festiveOffers.unshift(offer);
  if (isFirebaseConfigured()) await saveDocumentToFirestore('festiveOffers', offer.id.toString(), offer);
  notifyWebsite();
};

export const updateFestiveOffer = async (id, data) => {
  memoryStore.festiveOffers = memoryStore.festiveOffers.map(o => o.id === id ? { ...o, ...data } : o);
  if (isFirebaseConfigured()) {
    const offer = memoryStore.festiveOffers.find(o => o.id === id);
    if (offer) await saveDocumentToFirestore('festiveOffers', id.toString(), offer);
  }
  notifyWebsite();
};

export const deleteFestiveOffer = async (id) => {
  memoryStore.festiveOffers = memoryStore.festiveOffers.filter(o => o.id !== id);
  if (isFirebaseConfigured()) {
    import('firebase/firestore').then(({ doc, deleteDoc }) => {
      deleteDoc(doc(db, 'festiveOffers', id.toString())).catch(console.error);
    });
  }
  notifyWebsite();
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

