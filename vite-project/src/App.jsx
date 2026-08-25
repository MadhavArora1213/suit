import React, { useState, useEffect, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom'
import { auth, db } from './firebase'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { syncProducts, getAllProducts, getBoutiques, getCategories, getCollections, recordProductClick, recordProductView } from './utils/adminStore'
import { trackPageView, trackSessionEnd, trackBackNavigation } from './utils/analytics'
import { motion, AnimatePresence } from 'framer-motion'
import { User } from 'lucide-react'
import useSEO from './utils/useSEO'
import './App.css'
import LoadingScreen from './LoadingScreen'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartPage from './components/CartPage'
import CheckoutPage from './components/CheckoutPage'
import LoginSignup from './components/LoginSignup'

// Lazy loaded components for code splitting
const Hero = lazy(() => import('./components/Hero'))
const WhyShopGurnaaz = lazy(() => import('./components/WhyShopGurnaaz'))
const HowItWorks = lazy(() => import('./components/HowItWorks'))
const FeaturedStores = lazy(() => import('./components/FeaturedStores'))
const WhySellersChoose = lazy(() => import('./components/WhySellersChoose'))
const PremiumPackaging = lazy(() => import('./components/PremiumPackaging'))
const CustomerReviews = lazy(() => import('./components/Testimonials'))
const GurnaazPromise = lazy(() => import('./components/GurnaazPromise'))
const FAQ = lazy(() => import('./components/FAQ'))
const BecomeSellerCTA = lazy(() => import('./components/BecomeSellerCTA'))
const Newsletter = lazy(() => import('./components/Newsletter'))
const CategoryPage = lazy(() => import('./components/CategoryPage'))
const ProductDetailsPage = lazy(() => import('./components/ProductDetailsPage'))
const SellerShopPage = lazy(() => import('./components/SellerShopPage'))
const CustomerHomePage = lazy(() => import('./components/CustomerHomePage'))
const ContactPage = lazy(() => import('./components/ContactPage'))
const AboutPage = lazy(() => import('./components/AboutPage'))
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'))
const ShippingPolicy = lazy(() => import('./components/ShippingPolicy'))
const FAQPage = lazy(() => import('./components/FAQPage'))
const CollectionsPage = lazy(() => import('./components/CollectionsPage'))
const CollectionDetailPage = lazy(() => import('./components/CollectionDetailPage'))
const BoutiquesPage = lazy(() => import('./components/BoutiquesPage'))
const WishlistPage = lazy(() => import('./components/WishlistPage'))
const ProfilePage = lazy(() => import('./components/ProfilePage'))

// ScrollToTop component ensures we scroll up on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView(pathname);
  }, [pathname]);
  return null;
}

// Wrappers for components that need URL parameters
const CategoryPageWrapper = (props) => {
  const { categorySlug } = useParams();
  const catName = categorySlug ? categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'All';
  return <CategoryPage categoryName={catName} {...props} />
}

const CollectionDetailPageWrapper = (props) => {
  const { slug } = useParams();
  return <CollectionDetailPage slug={slug} {...props} />
}

const SellerShopPageWrapper = (props) => {
  const { slug } = useParams();
  const boutiqueName = slug ? slug.replace(/-/g, ' ') : '';
  // Capitalize properly if needed, but the original logic didn't capitalize
  return <SellerShopPage boutiqueName={boutiqueName} {...props} />
}

const ProductDetailsPageWrapper = (props) => {
  const { productSlug } = useParams();
  const [product, setProduct] = useState(() => {
    const allProds = getAllProducts();
    return allProds.find(p => p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === productSlug) || 
           allProds.find(p => String(p.id) === productSlug) || null;
  });

  useEffect(() => {
    const resolveProduct = () => {
      const allProds = getAllProducts();
      const found = allProds.find(p => p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === productSlug) || 
                    allProds.find(p => String(p.id) === productSlug) || null;
      if (found && !product) {
        setProduct(found);
      }
    };
    resolveProduct();
    window.addEventListener('admin-data-updated', resolveProduct);
    return () => window.removeEventListener('admin-data-updated', resolveProduct);
  }, [productSlug]);

  useEffect(() => {
    if (product?.id) {
      recordProductView(product.id);
    }
  }, [product?.id]);

  return <ProductDetailsPage product={product} {...props} />
}

const SITE = 'https://www.gurnaaz.co.in';

const routeSEO = {
  '/shop': {
    title: 'Shop Premium Ethnic Wear | Suits, Anarkali, Sharara | GURNAAZ',
    description: 'Shop handcrafted premium ethnic wear at Gurnaaz. Explore Anarkali suits, Sharara sets, Banarasi silk, Chikankari & designer outfits with free shipping across India.',
    keywords: 'buy ethnic wear online, designer suits India, Anarkali suits, Sharara suits, Banarasi silk suits, Chikankari suits, premium Indian fashion, Gurnaaz shop',
    schema: { "@context": "https://schema.org", "@type": "CollectionPage", "name": "Gurnaaz Shop", "description": "Premium handcrafted ethnic wear collection", "url": `${SITE}/shop`, "publisher": { "@type": "Organization", "name": "Gurnaaz", "logo": `${SITE}/gurnaaz_logo.png` } }
  },
  '/collections': {
    title: 'Curated Collections | Wedding, Festive, Luxury Ethnic Wear | GURNAAZ',
    description: 'Explore Gurnaaz curated collections — Wedding, Festive, Luxury & Casual ethnic wear. Handpicked designer suits and sets for every occasion.',
    keywords: 'ethnic wear collections, wedding suits, festive wear, luxury ethnic wear, Gurnaaz collections',
    schema: { "@context": "https://schema.org", "@type": "CollectionPage", "name": "Gurnaaz Collections", "url": `${SITE}/collections` }
  },
  '/shops-and-boutiques': {
    title: 'Our Boutiques & Sellers | Premium Ethnic Wear Partners | GURNAAZ',
    description: 'Discover Gurnaaz partner boutiques offering handcrafted ethnic wear. Shop from India\'s finest heritage boutiques — curated for quality and elegance.',
    keywords: 'ethnic wear boutiques, Indian fashion sellers, designer boutique partners, Gurnaaz boutiques',
    schema: { "@context": "https://schema.org", "@type": "CollectionPage", "name": "Gurnaaz Boutiques", "url": `${SITE}/shops-and-boutiques` }
  },
  '/about': {
    title: 'About GURNAAZ | Our Story, Craftsmanship & Heritage',
    description: 'Learn about Gurnaaz — India\'s premium handcrafted ethnic wear brand. Our commitment to heritage craftsmanship, sustainable fashion and timeless elegance.',
    keywords: 'about Gurnaaz, Indian ethnic wear brand, handcrafted fashion, heritage craftsmanship, luxury Indian fashion brand',
    schema: { "@context": "https://schema.org", "@type": "AboutPage", "name": "About Gurnaaz", "url": `${SITE}/about` }
  },
  '/contact': {
    title: 'Contact GURNAAZ | Customer Support & Inquiries',
    description: 'Get in touch with Gurnaaz for orders, inquiries, returns or custom requests. Reach our customer support team — we\'re here to help.',
    keywords: 'contact Gurnaaz, customer support, order help, ethnic wear inquiries, Gurnaaz contact',
    schema: { "@context": "https://schema.org", "@type": "ContactPage", "name": "Contact Gurnaaz", "url": `${SITE}/contact` }
  },
  '/privacy': {
    title: 'Privacy Policy | GURNAAZ',
    description: 'Gurnaaz privacy policy — how we collect, use and protect your personal information. Your privacy matters to us.',
    keywords: 'privacy policy, Gurnaaz privacy, data protection',
    schema: { "@context": "https://schema.org", "@type": "WebPage", "name": "Privacy Policy - Gurnaaz" }
  },
  '/shipping': {
    title: 'Shipping Policy | Free Shipping Across India | GURNAAZ',
    description: 'Gurnaaz shipping policy — free shipping across India on all orders. Easy returns, secure packaging, and fast delivery for all ethnic wear.',
    keywords: 'shipping policy, free shipping India, Gurnaaz delivery, ethnic wear shipping',
    schema: { "@context": "https://schema.org", "@type": "WebPage", "name": "Shipping Policy - Gurnaaz" }
  },
  '/faq': {
    title: 'Frequently Asked Questions | GURNAAZ Help Center',
    description: 'Find answers to common questions about Gurnaaz — orders, sizing, payments, returns, shipping and customization. Quick help at your fingertips.',
    keywords: 'Gurnaaz FAQ, help center, order questions, sizing guide, return policy',
    schema: { "@context": "https://schema.org", "@type": "FAQPage", "name": "Gurnaaz FAQ", "url": `${SITE}/faq`, "mainEntity": [
      { "@type": "Question", "name": "How long does shipping take?", "acceptedAnswer": { "@type": "Answer", "text": "Standard delivery takes 5-7 business days across India. Express delivery is available in select cities." }},
      { "@type": "Question", "name": "Do you offer returns?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, we offer easy returns within 7 days of delivery for unused items in original packaging." }},
      { "@type": "Question", "name": "Are the suits handmade?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, all Gurnaaz outfits are handcrafted by skilled artisans using traditional techniques." }},
      { "@type": "Question", "name": "Do you offer unstitched options?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, most of our suits are available in both stitched and unstitched options." }},
      { "@type": "Question", "name": "How can I track my order?", "acceptedAnswer": { "@type": "Answer", "text": "Once your order is shipped, you'll receive a tracking link via email and SMS." }}
    ]}
  },
  '/cart': {
    title: 'Your Cart | GURNAAZ',
    description: 'Review your selected ethnic wear items in your Gurnaaz cart. Proceed to checkout for secure payment and free shipping across India.',
    keywords: 'shopping cart, checkout, Gurnaaz cart',
    robots: 'noindex, nofollow',
  },
  '/checkout': {
    title: 'Secure Checkout | GURNAAZ',
    description: 'Complete your Gurnaaz order with secure Razorpay payment. Free shipping, easy returns on all handcrafted ethnic wear.',
    keywords: 'secure checkout, online payment, Gurnaaz checkout',
    robots: 'noindex, nofollow',
  },
  '/wishlist': {
    title: 'Your Wishlist | Saved Ethnic Wear | GURNAAZ',
    description: 'Your saved Gurnaaz favorites — ethnic suits, Anarkali, Sharara sets and more. Come back anytime to shop your curated wishlist.',
    keywords: 'wishlist, saved items, favorite ethnic wear',
  },
};

const defaultSEO = {
  title: 'GURNAAZ — Premium Handcrafted Ethnic Wear | Shop Online',
  description: 'Discover handcrafted premium ethnic wear at Gurnaaz. Luxury suits, Anarkali, Sharara, Banarasi & Chikankari — where tradition meets timeless elegance. Free shipping across India.',
  keywords: 'Gurnaaz, premium ethnic wear, handcrafted suits, Anarkali, Sharara, Banarasi, Chikankari, luxury Indian fashion, buy ethnic wear online, designer suits',
  schema: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Gurnaaz",
    "url": SITE,
    "description": "Premium handcrafted ethnic wear",
    "publisher": { "@type": "Organization", "name": "Gurnaaz", "logo": `${SITE}/gurnaaz_logo.png`, "url": SITE, "sameAs": ["https://www.instagram.com/gurnaaz.co.in", "https://www.facebook.com/gurnaaz.co.in"] },
    "potentialAction": { "@type": "SearchAction", "target": `${SITE}/shop?search={search_term_string}`, "query-input": "required name=search_term_string" }
  }
};

function getDynamicSEO(pathname) {
  const allProducts = getAllProducts();
  const allCategories = getCategories();
  const allBoutiques = getBoutiques();
  const allCollections = getCollections();

  // /product/:productSlug
  const productMatch = pathname.match(/^\/product\/(.+)$/);
  if (productMatch) {
    const slug = decodeURIComponent(productMatch[1]);
    const product = allProducts.find(p => {
      const nameSlug = (p.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return nameSlug === slug || String(p.id) === slug;
    });
    if (product) {
      const price = product.priceNum || parseInt(String(product.price).replace(/[^0-9]/g, '')) || 0;
      const img = product.coverImage || product.image || `${SITE}/gurnaaz_logo.png`;
      return {
        title: `${product.name} | GURNAAZ`,
        description: `Buy ${product.name} — ${product.shortDesc || 'handcrafted premium ethnic wear'}. ${product.fabricDetails ? product.fabricDetails + '.' : ''} Price: ${product.price || ''}. Free shipping across India.`,
        keywords: `${product.name}, ${product.type || ''}, ${product.category || ''}, ${product.collection || ''}, ${product.fabricName || ''} suit, buy ${product.name}, Gurnaaz`,
        image: img.startsWith('http') ? img : `${SITE}${img}`,
        url: `${SITE}/product/${slug}`,
        schema: {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.name,
          "description": product.shortDesc || product.name,
          "image": img.startsWith('http') ? img : `${SITE}${img}`,
          "brand": { "@type": "Brand", "name": "Gurnaaz" },
          "sku": product.id,
          "offers": {
            "@type": "Offer",
            "url": `${SITE}/product/${slug}`,
            "priceCurrency": "INR",
            "price": price,
            "availability": (product.stock || 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "itemCondition": "https://schema.org/NewCondition"
          },
          "aggregateRating": product.rating ? {
            "@type": "AggregateRating",
            "ratingValue": product.rating,
            "reviewCount": product.reviewsCount || 1
          } : undefined
        }
      };
    }
    return { title: 'Product | GURNAAZ', description: defaultSEO.description };
  }

  // /category/:categorySlug
  const catMatch = pathname.match(/^\/category\/(.+)$/);
  if (catMatch) {
    const slug = decodeURIComponent(catMatch[1]);
    const cat = allCategories.find(c => c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug || String(c.id) === slug);
    if (cat) {
      return {
        title: `${cat.name} | Shop Online | GURNAAZ`,
        description: `Shop ${cat.name} at Gurnaaz. ${cat.tagline || cat.subtitle || 'Handcrafted premium ethnic wear'}. Explore our curated collection with free shipping across India.`,
        keywords: `${cat.name}, buy ${cat.name}, ${cat.name} online, Gurnaaz ${cat.name}, ethnic wear`,
        url: `${SITE}/category/${slug}`,
        schema: { "@context": "https://schema.org", "@type": "CollectionPage", "name": cat.name, "description": cat.tagline || cat.subtitle || '', "url": `${SITE}/category/${slug}` }
      };
    }
    return { title: `${slug} | GURNAAZ`, description: defaultSEO.description };
  }

  // /collections/:slug
  const colMatch = pathname.match(/^\/collections\/(.+)$/);
  if (colMatch) {
    const slug = decodeURIComponent(colMatch[1]);
    const col = allCollections.find(c => (c.id || '').toLowerCase() === slug || (c.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug);
    if (col) {
      return {
        title: `${col.name} Collection | GURNAAZ`,
        description: `Explore the ${col.name} collection at Gurnaaz. ${col.description || 'Handcrafted premium ethnic wear curated for elegance.'} Free shipping across India.`,
        keywords: `${col.name} collection, ${col.name} ethnic wear, Gurnaaz ${col.name}, designer suits`,
        url: `${SITE}/collections/${slug}`,
        schema: { "@context": "https://schema.org", "@type": "CollectionPage", "name": `${col.name} - Gurnaaz`, "description": col.description || '', "url": `${SITE}/collections/${slug}` }
      };
    }
    return { title: `${slug} Collection | GURNAAZ`, description: defaultSEO.description };
  }

  // /shops-and-boutiques/:slug or /shop/:slug
  const boutiqueMatch = pathname.match(/^\/(?:shops-and-boutiques|shop)\/(.+)$/);
  if (boutiqueMatch) {
    const slug = decodeURIComponent(boutiqueMatch[1]);
    const boutique = allBoutiques.find(b => (b.id || '').toLowerCase() === slug || (b.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug);
    if (boutique) {
      return {
        title: `${boutique.name} | GURNAAZ Boutique`,
        description: `Shop from ${boutique.name} on Gurnaaz. ${boutique.description || 'Handcrafted premium ethnic wear from India\'s finest boutique.'} Free shipping across India.`,
        keywords: `${boutique.name}, ${boutique.name} ethnic wear, shop ${boutique.name}, Gurnaaz boutique`,
        url: `${SITE}/shops-and-boutiques/${slug}`,
        schema: { "@context": "https://schema.org", "@type": "Store", "name": boutique.name, "description": boutique.description || '', "url": `${SITE}/shops-and-boutiques/${slug}`, "brand": { "@type": "Brand", "name": "Gurnaaz" } }
      };
    }
    return { title: `${slug} | GURNAAZ Boutique`, description: defaultSEO.description };
  }

  return null;
}

const noIndexPages = ['/login', '/signup', '/profile'];

function RouteSEO() {
  const location = useLocation();
  const path = location.pathname;

  const [dynamicSEO, setDynamicSEO] = useState(null);

  useEffect(() => {
    setDynamicSEO(getDynamicSEO(path));
  }, [path]);

  const staticMatch = routeSEO[path];
  const isNoIndex = noIndexPages.some(p => path.startsWith(p)) || path.startsWith('/admin');
  const seoData = staticMatch || dynamicSEO || defaultSEO;

  useSEO({
    ...seoData,
    robots: isNoIndex ? 'noindex, nofollow' : (seoData.robots || undefined),
    url: seoData.url || `${SITE}${path}`,
  });

  return null;
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomeRoute = location.pathname === '/' || location.pathname === '';

  const [loadingComplete, setLoadingComplete] = useState(!isHomeRoute)
  const [contentVisible, setContentVisible] = useState(!isHomeRoute)
  const [storeReady, setStoreReady] = useState(false)
  const [cart, setCart] = useState([])
  const [favorites, setFavorites] = useState({})
  const [toastMessage, setToastMessage] = useState('')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [user, setUser] = useState(null)
  
  const allProducts = getAllProducts();

  useEffect(() => {
    const initStoreData = async () => {
      try {
        const { initializeStore } = await import('./utils/adminStore');
        await initializeStore();
      } catch (err) {
        console.error('Store initialization failed:', err);
      } finally {
        setStoreReady(true);
      }
    };
    initStoreData();
  }, []);

  // Track session end when user closes tab/browser
  useEffect(() => {
    const handleBeforeUnload = () => trackSessionEnd();
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    syncProducts(() => {
      window.isLiveSyncComplete = true;
      window.dispatchEvent(new CustomEvent('admin-data-updated'));
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUser({ ...data, uid: currentUser.uid });
            if (data.cart) setCart(data.cart);
            else setCart([]);
            if (data.favorites) setFavorites(data.favorites);
            else setFavorites({});
          } else {
            setUser({
              uid: currentUser.uid,
              name: currentUser.displayName || 'User',
              email: currentUser.email,
              phone: currentUser.phoneNumber || '',
              role: 'customer'
            });
          }
        } catch (error) {
          console.warn("Firestore offline or profile fetch error, using local auth user state:", error);
          setUser({
            uid: currentUser.uid,
            name: currentUser.displayName || 'User',
            email: currentUser.email,
            phone: currentUser.phoneNumber || '',
            role: 'customer'
          });
        }
      } else {
        setUser(null);
        setFavorites({});
        setCart([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleLoadComplete = () => {
    setLoadingComplete(true)
    setTimeout(() => setContentVisible(true), 200)
  }

  // --- Legacy Routing Adapters ---
  const setView = (viewName) => {
    const pathMap = {
      'customer-home': '/',
      'collections': '/collections',
      'boutiques': '/shops-and-boutiques',
      'contact': '/contact',
      'about': '/about',
      'privacy': '/privacy',
      'shipping': '/shipping',
      'faq': '/faq',
      'cart': '/cart',
      'checkout': '/checkout',
      'login': '/login',
      'wishlist': '/wishlist',
      'profile': '/profile',
      'shop': '/shop',
      'home': '/sell',
    };
    if (pathMap[viewName]) {
      navigate(pathMap[viewName]);
    } else {
      // Fallback for parameterized routes that should be handled directly via navigation
      console.warn("setView called with parameterized view:", viewName, "Consider using standard React Router links.");
      setTimeout(() => {
        const path = window.location.pathname;
        if (viewName === 'category' && !path.includes('/category')) navigate('/category/all');
        if (viewName === 'seller-shop' && !path.includes('/shop')) navigate('/shops-and-boutiques');
      }, 50);
    }
  };

  const setSelectedCategory = (cat) => navigate(`/category/${(cat || '').toLowerCase().replace(/ /g, '-')}`);
  const setSelectedCollectionSlug = (slug) => navigate(`/collections/${slug || ''}`);
  const setSelectedProduct = (product) => {
    if (product?.id) {
      recordProductClick(product.id);
    }
    if (product?.name) {
      navigate(`/product/${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`);
    }
  };
  const setSelectedBoutique = (boutiqueName) => {
    if (!boutiqueName) {
      navigate('/shops-and-boutiques');
      return;
    }
    const b = getBoutiques().find(b => b.name === boutiqueName);
    const prefix = b?.type === 'Shop' ? 'shop' : 'shops-and-boutiques';
    navigate(`/${prefix}/${boutiqueName.toLowerCase().replace(/ /g, '-')}`);
  };
  // ------------------------------

  const handleLoginSuccess = (userProfile) => {
    setUser(userProfile)
    showToast(`Welcome back, ${userProfile.name}! Login successful.`);
    const redirectPath = sessionStorage.getItem('redirectAfterLogin');
    if (redirectPath) {
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(redirectPath);
    } else {
      navigate('/');
    }
  }

  const handleLogout = async () => {
    try { await signOut(auth); } catch (e) { console.error("Logout error", e); }
    setUser(null);
    setCart([]);
    setFavorites({});
    navigate('/');
  }

  const addToCart = async (product, size = 'M') => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    const existingIndex = cart.findIndex((item) => item.id === product.id && item.size === size);
    let newCart = [...cart];
    if (existingIndex > -1) {
      newCart[existingIndex] = { ...newCart[existingIndex], quantity: newCart[existingIndex].quantity + 1 };
    } else {
      newCart.push({ ...product, size, quantity: 1 });
    }
    setCart(newCart);
    const ts = Date.now();
    try { await setDoc(doc(db, 'users', user.uid), { cart: newCart, cartUpdatedAt: ts }, { merge: true }); }
    catch (err) { console.error("Error syncing cart:", err); }
  }

  const removeFromCart = async (productId, size) => {
    const newCart = cart.filter((item) => !(item.id === productId && item.size === size));
    setCart(newCart);
    const ts = Date.now();
    if (user) {
      try { await setDoc(doc(db, 'users', user.uid), { cart: newCart, cartUpdatedAt: ts }, { merge: true }); }
      catch (err) { console.error("Error syncing cart:", err); }
    }
  }

  const updateCartQty = async (productId, size, qty) => {
    if (qty <= 0) { removeFromCart(productId, size); return; }
    const newCart = cart.map((item) => item.id === productId && item.size === size ? { ...item, quantity: qty } : item);
    setCart(newCart);
    const ts = Date.now();
    if (user) {
      try { await setDoc(doc(db, 'users', user.uid), { cart: newCart, cartUpdatedAt: ts }, { merge: true }); }
      catch (err) { console.error("Error syncing cart:", err); }
    }
  }

  const toggleFavorite = async (productId) => {
    if (!user) { setShowLoginModal(true); return; }
    const newFavs = { ...favorites, [productId]: !favorites[productId] };
    setFavorites(newFavs);
    try { await setDoc(doc(db, 'users', user.uid), { favorites: newFavs }, { merge: true }); }
    catch (err) { console.error("Error syncing favorites:", err); }
  }

  const clearCart = () => setCart([])

  const Toast = () => (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] bg-[#111111] text-white px-6 py-3.5 rounded-full text-[12px] font-medium tracking-wide shadow-2xl flex items-center gap-3"
        >
          <div className="w-2 h-2 rounded-full bg-green-400" />
          {toastMessage}
        </motion.div>
      )}
    </AnimatePresence>
  );

  const AuthModal = (
    <AnimatePresence>
      {showLoginModal && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pt-24 sm:pt-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
             className="bg-[#FAF9F6] p-6 sm:p-8 md:p-12 max-w-[400px] w-full border border-[#D4AF37]/30 text-center relative overflow-hidden mx-3 sm:mx-4"
            style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))' }}
          >
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle at top center, #D4AF37 0%, transparent 70%)' }} />
            <div className="w-16 h-16 rounded-full bg-[#1A0008]/5 flex items-center justify-center text-[#D4AF37] mx-auto mb-6 relative z-10 border border-[#D4AF37]/20">
              <User size={28} strokeWidth={1.5} />
            </div>
            <h3 className="text-3xl font-light text-[#1A0008] mb-3 relative z-10" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Login Required
            </h3>
            <p className="text-[13px] text-[#1A0008]/60 mb-8 relative z-10 leading-relaxed font-light">
              Please sign in to your Gurnaaz account to add items to bag or wishlist.
            </p>
            <div className="flex flex-col gap-3 relative z-10">
              <button
                onClick={() => {
                  sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
                  setShowLoginModal(false);
                  navigate('/login');
                }}
                className="w-full bg-[#1A0008] text-white py-3.5 text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-[#D4AF37] transition-colors duration-300"
              >
                Log In Now
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full py-3.5 text-[11px] uppercase tracking-[0.2em] text-[#1A0008]/40 font-semibold hover:text-[#1A0008] transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!loadingComplete && isHomeRoute) return <LoadingScreen onComplete={handleLoadComplete} />

  // Common Props for many pages
  const commonProps = {
    setView,
    setSelectedCategory,
    setSelectedProduct,
    setSelectedBoutique,
    setSelectedCollectionSlug,
    addToCart,
    favorites,
    toggleFavorite,
    user,
    requireLogin: () => setShowLoginModal(true)
  };

  if (location.pathname === '/' || location.pathname === '') {
    return (
      <>
        <RouteSEO />
        <Toast />
        {AuthModal}
        <CustomerHomePage 
          {...commonProps}
          cart={cart} 
          removeFromCart={removeFromCart} 
          updateCartQty={updateCartQty} 
          handleLogout={handleLogout}
        />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]" style={{ opacity: contentVisible ? 1 : 0, transition: 'opacity 0.8s ease' }}>
      <RouteSEO />
      <Toast />
      <ScrollToTop />
      
      {/* Auth Required Modal */}
      {AuthModal}

      <Navbar 
        {...commonProps}
        cart={cart} 
        removeFromCart={removeFromCart} 
        updateCartQty={updateCartQty}
        handleLogout={handleLogout}
      />
      
      <Suspense fallback={<div className="h-screen w-full flex items-center justify-center pt-[110px]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A0008]"></div></div>}>
        <Routes>
          {/* 
          <Route path="/sell" element={
            <>
              <Hero addToCart={addToCart} />
              <WhyShopGurnaaz />
              <HowItWorks />
              <FeaturedStores setView={setView} setSelectedBoutique={setSelectedBoutique} />
              <WhySellersChoose />
              <PremiumPackaging />
              <CustomerReviews />
              <GurnaazPromise />
              <FAQ />
              <BecomeSellerCTA />
              <Newsletter />
            </>
          } />
          */}

          <Route path="/shop" element={<CategoryPage categoryName="All" {...commonProps} />} />
          <Route path="/category/:categorySlug" element={<CategoryPageWrapper {...commonProps} />} />
          
          <Route path="/collections" element={<CollectionsPage {...commonProps} />} />
          <Route path="/collections/:slug" element={<CollectionDetailPageWrapper {...commonProps} />} />
          
          <Route path="/product/:productSlug" element={<ProductDetailsPageWrapper {...commonProps} />} />
          
          <Route path="/shops-and-boutiques" element={<BoutiquesPage {...commonProps} />} />
          <Route path="/shops-and-boutiques/:slug" element={<SellerShopPageWrapper {...commonProps} />} />
          <Route path="/shop/:slug" element={<SellerShopPageWrapper {...commonProps} />} />
          
          <Route path="/cart" element={<CartPage cart={cart} updateCartQty={updateCartQty} removeFromCart={removeFromCart} setView={setView} />} />
          <Route path="/checkout" element={<CheckoutPage cart={cart} setView={setView} clearCart={clearCart} />} />
          
          <Route path="/login" element={<LoginSignup setView={setView} onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/signup" element={<LoginSignup setView={setView} onLoginSuccess={handleLoginSuccess} />} />
          
          <Route path="/wishlist" element={<WishlistPage allProducts={allProducts} setView={setView} favorites={favorites} toggleFavorite={toggleFavorite} addToCart={addToCart} />} />
          <Route path="/profile" element={<ProfilePage user={user} setView={setView} handleLogout={handleLogout} />} />
          
          <Route path="/contact" element={<ContactPage setView={setView} user={user} />} />
          <Route path="/about" element={<AboutPage setView={setView} />} />
          <Route path="/privacy" element={<PrivacyPolicy setView={setView} />} />
          <Route path="/shipping" element={<ShippingPolicy setView={setView} />} />
          <Route path="/faq" element={<FAQPage setView={setView} />} />

          {/* Catch all to redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      <Footer setView={setView} />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
