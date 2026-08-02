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
  collectionTags: []
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
export const getReviews = (productId) => memoryStore.reviews[productId] || [];
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
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
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
