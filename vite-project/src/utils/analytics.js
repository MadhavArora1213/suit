import { db, isFirebaseConfigured } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy, limit as firestoreLimit, Timestamp } from 'firebase/firestore';

const STORAGE_KEY = 'gurnaaz_analytics_events';
const SESSION_KEY = 'gurnaaz_session_id';

function getSessionId() {
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = 's_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

function getVisitorId() {
  let vid = localStorage.getItem('gurnaaz_visitor_id');
  if (!vid) {
    vid = 'v_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    localStorage.setItem('gurnaaz_visitor_id', vid);
  }
  return vid;
}

// ─── Core Track Event ───
export function trackEvent(eventType, data = {}) {
  const event = {
    id: `e_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    type: eventType,
    sessionId: getSessionId(),
    visitorId: getVisitorId(),
    timestamp: Date.now(),
    url: window.location.pathname,
    ...data,
  };

  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    stored.push(event);
    if (stored.length > 800) stored.splice(0, stored.length - 800);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch (e) {
    console.warn('Analytics localStorage error:', e);
  }

  // Append to session journey
  try {
    const journeyKey = 'gurnaaz_journey_' + getSessionId();
    const journey = JSON.parse(sessionStorage.getItem(journeyKey) || '[]');
    journey.push({ type: eventType, url: event.url, t: event.timestamp, ...data });
    sessionStorage.setItem(journeyKey, JSON.stringify(journey));
  } catch (e) {}

  syncEventToFirestore(event).catch(() => {});
  return event;
}

async function syncEventToFirestore(event) {
  if (!isFirebaseConfigured() || !db) return;
  try {
    const eventsRef = collection(db, 'analytics_events');
    await addDoc(eventsRef, { ...event, createdAt: Timestamp.now() });
  } catch (e) {}
}

export function getStoredEvents() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getStoredJourney(sessionId) {
  try {
    return JSON.parse(sessionStorage.getItem('gurnaaz_journey_' + sessionId) || '[]');
  } catch {
    return [];
  }
}

export async function fetchAnalyticsFromFirestore({ eventType, days = 7, maxResults = 1000 } = {}) {
  if (!isFirebaseConfigured() || !db) return [];

  try {
    const eventsRef = collection(db, 'analytics_events');
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const q = query(eventsRef, orderBy('createdAt', 'desc'), firestoreLimit(maxResults));
    const snapshot = await getDocs(q);

    const events = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (eventType && data.type !== eventType) return;
      if (data.timestamp && data.timestamp < cutoff) return;
      events.push({ ...data, id: doc.id });
    });

    return events;
  } catch (e) {
    console.warn('Firestore analytics fetch error:', e);
    return getStoredEvents();
  }
}

// ═══════════════════════════════════════════
//  PAGE & SESSION TRACKING
// ═══════════════════════════════════════════

export function trackPageView(page, extra = {}) {
  return trackEvent('page_view', { page, ...extra });
}

export function trackTimeOnPage(page, seconds, maxScrollDepth, extra = {}) {
  return trackEvent('time_on_page', { page, seconds, maxScrollDepth, ...extra });
}

export function trackScrollMilestone(page, milestone, extra = {}) {
  return trackEvent('scroll_milestone', { page, milestone, ...extra });
}

export function trackScrollDepth(page, depth, extra = {}) {
  return trackEvent('scroll_depth', { page, depth, ...extra });
}

export function trackBackNavigation(fromPage, toPage, extra = {}) {
  return trackEvent('back_navigation', { fromPage, toPage, ...extra });
}

export function trackSessionEnd(extra = {}) {
  return trackEvent('session_end', extra);
}

// ═══════════════════════════════════════════
//  PRODUCT TRACKING
// ═══════════════════════════════════════════

export function trackProductClick(productId, productName, extra = {}) {
  return trackEvent('product_click', { productId, productName, ...extra });
}

export function trackProductInteraction(productId, productName, action, detail = '', extra = {}) {
  return trackEvent('product_interaction', { productId, productName, action, detail, ...extra });
}

export function trackAddToCart(product, extra = {}) {
  return trackEvent('add_to_cart', {
    productId: product.id,
    productName: product.name,
    price: product.price,
    priceNum: parseInt(String(product.price).replace(/\D/g, '')) || 0,
    ...extra,
  });
}

export function trackWishlistToggle(productId, action, extra = {}) {
  return trackEvent('wishlist_toggle', { productId, action, ...extra });
}

export function trackSearch(query, resultCount, extra = {}) {
  return trackEvent('search', { query, resultCount, ...extra });
}

// ═══════════════════════════════════════════
//  CART TRACKING
// ═══════════════════════════════════════════

export function trackCartView(cartItems = [], extra = {}) {
  const total = cartItems.reduce((s, i) => s + (parseInt(String(i.price).replace(/\D/g, '')) || 0) * i.quantity, 0);
  return trackEvent('cart_view', {
    itemCount: cartItems.length,
    cartTotal: total,
    items: cartItems.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.quantity })),
    ...extra,
  });
}

export function trackCartItemRemove(productId, productName, size, extra = {}) {
  return trackEvent('cart_item_remove', { productId, productName, size, ...extra });
}

export function trackCartItemQtyChange(productId, productName, size, oldQty, newQty, extra = {}) {
  return trackEvent('cart_item_qty_change', { productId, productName, size, oldQty, newQty, ...extra });
}

export function trackCheckoutClick(cartTotal, itemCount, extra = {}) {
  return trackEvent('checkout_click', { cartTotal, itemCount, ...extra });
}

// ═══════════════════════════════════════════
//  CHECKOUT FUNNEL TRACKING
// ═══════════════════════════════════════════

export function trackCheckoutStart(extra = {}) {
  return trackEvent('checkout_start', extra);
}

export function trackCheckoutStep(step, extra = {}) {
  return trackEvent('checkout_step', { step, ...extra });
}

export function trackCheckoutAbandon(lastStep, extra = {}) {
  return trackEvent('checkout_abandon', { lastStep, ...extra });
}

export function trackFormFocus(field, extra = {}) {
  return trackEvent('form_focus', { field, ...extra });
}

export function trackFormFill(field, value, extra = {}) {
  return trackEvent('form_fill', { field, hasValue: !!value, ...extra });
}

export function trackFormBlur(field, hasValue, extra = {}) {
  return trackEvent('form_blur', { field, hasValue, ...extra });
}

export function trackFormSubmit(step, extra = {}) {
  return trackEvent('form_submit', { step, ...extra });
}

// ═══════════════════════════════════════════
//  PAYMENT TRACKING
// ═══════════════════════════════════════════

export function trackPaymentAttempt(method, amount, extra = {}) {
  return trackEvent('payment_attempt', { method, amount, ...extra });
}

export function trackPaymentSuccess(method, amount, orderId, extra = {}) {
  return trackEvent('payment_success', { method, amount, orderId, ...extra });
}

export function trackPaymentFail(method, amount, reason, extra = {}) {
  return trackEvent('payment_fail', { method, amount, reason, ...extra });
}

export function trackPaymentAbandon(method, amount, step, extra = {}) {
  return trackEvent('payment_abandon', { method, amount, step, ...extra });
}

// ═══════════════════════════════════════════
//  SESSION JOURNEY (for replay in admin)
// ═══════════════════════════════════════════

export function getSessionJourney() {
  try {
    const allEvents = getStoredEvents();
    const sessionId = getSessionId();
    return allEvents.filter(e => e.sessionId === sessionId).sort((a, b) => a.timestamp - b.timestamp);
  } catch {
    return [];
  }
}

export function getSessionJourneysFromStorage() {
  try {
    const allEvents = getStoredEvents();
    const sessions = {};
    allEvents.forEach(e => {
      if (!sessions[e.sessionId]) sessions[e.sessionId] = [];
      sessions[e.sessionId].push(e);
    });
    return Object.entries(sessions)
      .map(([sid, events]) => ({
        sessionId: sid,
        visitorId: events[0]?.visitorId,
        startTime: events[0]?.timestamp,
        endTime: events[events.length - 1]?.timestamp,
        duration: events.length > 1 ? (events[events.length - 1]?.timestamp - events[0]?.timestamp) : 0,
        eventCount: events.length,
        pages: [...new Set(events.map(e => e.url || e.page).filter(Boolean))],
        hasAddToCart: events.some(e => e.type === 'add_to_cart'),
        hasCheckout: events.some(e => e.type === 'checkout_start'),
        hasPayment: events.some(e => e.type === 'payment_attempt'),
        hasPaymentSuccess: events.some(e => e.type === 'payment_success'),
        events: events.sort((a, b) => a.timestamp - b.timestamp),
      }))
      .sort((a, b) => b.startTime - a.startTime);
  } catch {
    return [];
  }
}
