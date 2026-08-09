import { useState, useEffect } from 'react'
import { auth, db } from './firebase'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { syncProducts, getAllProducts, getBoutiques } from './utils/adminStore'
import { motion, AnimatePresence } from 'framer-motion'
import { User } from 'lucide-react'
import './App.css'
import LoadingScreen from './LoadingScreen'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import WhyShopGurnaaz from './components/WhyShopGurnaaz'
import HowItWorks from './components/HowItWorks'
import FeaturedStores from './components/FeaturedStores'
import WhySellersChoose from './components/WhySellersChoose'
import PremiumPackaging from './components/PremiumPackaging'
import CustomerReviews from './components/Testimonials'
import GurnaazPromise from './components/GurnaazPromise'
import FAQ from './components/FAQ'
import BecomeSellerCTA from './components/BecomeSellerCTA'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
import CartPage from './components/CartPage'
import CheckoutPage from './components/CheckoutPage'
import LoginSignup from './components/LoginSignup'
import CategoryPage from './components/CategoryPage'
import ProductDetailsPage from './components/ProductDetailsPage'
import SellerShopPage from './components/SellerShopPage'
import CustomerHomePage from './components/CustomerHomePage'
import ContactPage from './components/ContactPage'
import AboutPage from './components/AboutPage'
import PrivacyPolicy from './components/PrivacyPolicy'
import ShippingPolicy from './components/ShippingPolicy'
import FAQPage from './components/FAQPage'
import CollectionsPage from './components/CollectionsPage'
import CollectionDetailPage from './components/CollectionDetailPage'
import BoutiquesPage from './components/BoutiquesPage'
import WishlistPage from './components/WishlistPage'
import ProfilePage from './components/ProfilePage'

function App() {
  const isHomeRoute = window.location.pathname === '/' || window.location.pathname === '';

  const [loadingComplete, setLoadingComplete] = useState(isHomeRoute ? false : true)
  const [contentVisible, setContentVisible] = useState(isHomeRoute ? false : true)
  const [storeReady, setStoreReady] = useState(false)
  const [cart, setCart] = useState([])
  const [favorites, setFavorites] = useState({})
  const [toastMessage, setToastMessage] = useState('')
  const [showLoginModal, setShowLoginModal] = useState(false)
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



  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const getInitialView = () => {
    const path = window.location.pathname;
    if (path === '/') return 'customer-home';
    if (path === '/collections') return 'collections';
    if (path.startsWith('/collections/')) return 'collection-detail';
    if (path.startsWith('/category/')) return 'category';
    if (path === '/shops-and-boutiques') return 'boutiques';
    if (path.startsWith('/shops-and-boutiques/')) return 'seller-shop';
    if (path.startsWith('/shop/')) return 'seller-shop';
    if (path === '/contact') return 'contact';
    if (path === '/about') return 'about';
    if (path === '/privacy') return 'privacy';
    if (path === '/shipping') return 'shipping';
    if (path === '/faq') return 'faq';
    if (path === '/cart') return 'cart';
    if (path === '/checkout') return 'checkout';
    if (path === '/login' || path === '/signup') return 'login';
    if (path === '/wishlist') return 'wishlist';
    if (path === '/shop') return 'shop';
    if (path.startsWith('/product/')) return 'product-details';
    return 'home';
  };

  const getCollectionFromPath = () => {
    const path = window.location.pathname;
    if (path.startsWith('/collections/')) {
      let slug = path.replace('/collections/', '');
      if (slug.endsWith('/')) slug = slug.slice(0, -1);
      return decodeURIComponent(slug);
    }
    return null;
  };
  
  const getBoutiqueFromPath = () => {
    const path = window.location.pathname;
    if (path.startsWith('/shops-and-boutiques/')) {
      const slug = path.replace('/shops-and-boutiques/', '');
      return decodeURIComponent(slug).replace(/-/g, ' ');
    }
    if (path.startsWith('/shop/')) {
      const slug = path.replace('/shop/', '');
      return decodeURIComponent(slug).replace(/-/g, ' ');
    }
    return null;
  };

  const getCategoryFromPath = () => {
    const path = window.location.pathname;
    if (path.startsWith('/category/')) {
      const slug = decodeURIComponent(path.replace('/category/', ''));
      return slug.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    return null;
  };

  const getProductFromPath = () => {
    const path = window.location.pathname;
    if (path.startsWith('/product/')) {
      const slug = decodeURIComponent(path.replace('/product/', ''));
      const allProds = getAllProducts();
      return allProds.find(p => p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === slug) || 
             allProds.find(p => String(p.id) === slug) || null;
    }
    return null;
  };

  const [view, setView] = useState(getInitialView());
  const [user, setUser] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(getCategoryFromPath())
  const [selectedProduct, setSelectedProduct] = useState(getProductFromPath())
  const [selectedBoutique, setSelectedBoutique] = useState(getBoutiqueFromPath())
  const [selectedCollectionSlug, setSelectedCollectionSlug] = useState(getCollectionFromPath())

  const currentPath = window.location.pathname

  useEffect(() => {
    syncProducts(() => {
      window.isLiveSyncComplete = true;
      window.dispatchEvent(new CustomEvent('admin-data-updated'));
    });
  }, []);

  useEffect(() => {
    const handler = () => {
      if (view === 'product-details') {
        const found = getProductFromPath();
        if (found) setSelectedProduct(found);
      }
    };
    window.addEventListener('admin-data-updated', handler);
    return () => window.removeEventListener('admin-data-updated', handler);
  }, [view, selectedProduct]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUser(data);
            
            if (data.cart) {
              setCart(data.cart);
            } else {
              setCart([]);
            }

            if (data.favorites) {
              setFavorites(data.favorites);
            } else {
              setFavorites({});
            }
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
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUser(null);
        setFavorites({});
        setCart([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const pathMap = {
      'customer-home': '/',
      'collections': '/collections',
      'collection-detail': `/collections/${selectedCollectionSlug || ''}`,
      'category': `/category/${(selectedCategory || '').toLowerCase().replace(/ /g, '-')}`,
      'boutiques': '/shops-and-boutiques',
      'seller-shop': (() => {
          if (!selectedBoutique) return '/shops-and-boutiques';
          const b = getBoutiques().find(b => b.name === selectedBoutique);
          return `/${b?.type === 'Shop' ? 'shop' : 'shops-and-boutiques'}/${selectedBoutique.toLowerCase().replace(/ /g, '-')}`;
      })(),
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
      'product-details': selectedProduct?.name ? `/product/${selectedProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}` : null,
    };
    if (pathMap[view] && window.location.pathname !== pathMap[view]) {
      window.history.pushState(null, '', pathMap[view]);
    }
  }, [view, selectedCollectionSlug, selectedCategory, selectedBoutique]);

  const handleLoadComplete = () => {
    setLoadingComplete(true)
    setTimeout(() => setContentVisible(true), 200)
  }

  const handleLoginSuccess = (userProfile) => {
    setUser(userProfile)
    showToast(`Welcome back, ${userProfile.name}! Login successful.`);
    const redirectPath = sessionStorage.getItem('redirectAfterLogin');
    if (redirectPath) {
      sessionStorage.removeItem('redirectAfterLogin');
      window.history.pushState(null, '', redirectPath);
    } else {
      window.history.pushState(null, '', '/');
    }
    
    // Update the app state based on the newly pushed URL so we don't reload
    setSelectedCategory(getCategoryFromPath());
    setSelectedBoutique(getBoutiqueFromPath());
    setSelectedCollectionSlug(getCollectionFromPath());
    setSelectedProduct(getProductFromPath());
    setView(getInitialView());
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Logout error", e);
    }
    setUser(null);
    setCart([]);
    setFavorites({});
    window.location.href = '/';
  }

  const addToCart = async (product, size = 'M') => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    const existingIndex = cart.findIndex(
      (item) => item.id === product.id && item.size === size
    );
    let newCart = [...cart];
    if (existingIndex > -1) {
      newCart[existingIndex] = {
        ...newCart[existingIndex],
        quantity: newCart[existingIndex].quantity + 1,
      };
    } else {
      newCart.push({ ...product, size, quantity: 1 });
    }
    setCart(newCart);
    const ts = Date.now();

    try {
      await setDoc(doc(db, 'users', user.uid), { cart: newCart, cartUpdatedAt: ts }, { merge: true });
    } catch (err) {
      console.error("Error syncing cart:", err);
    }
  }

  const removeFromCart = async (productId, size) => {
    const newCart = cart.filter((item) => !(item.id === productId && item.size === size));
    setCart(newCart);
    const ts = Date.now();
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), { cart: newCart, cartUpdatedAt: ts }, { merge: true });
      } catch (err) {
        console.error("Error syncing cart:", err);
      }
    }
  }

  const updateCartQty = async (productId, size, qty) => {
    if (qty <= 0) {
      removeFromCart(productId, size);
      return;
    }
    const newCart = cart.map((item) =>
      item.id === productId && item.size === size ? { ...item, quantity: qty } : item
    );
    setCart(newCart);
    const ts = Date.now();
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), { cart: newCart, cartUpdatedAt: ts }, { merge: true });
      } catch (err) {
        console.error("Error syncing cart:", err);
      }
    }
  }

  const toggleFavorite = async (productId) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    const newFavs = { ...favorites, [productId]: !favorites[productId] };
    setFavorites(newFavs);
    try {
      await setDoc(doc(db, 'users', user.uid), { favorites: newFavs }, { merge: true });
    } catch (err) {
      console.error("Error syncing favorites:", err);
    }
  }

  const clearCart = () => setCart([])

  const Toast = () => (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] bg-[#111111] text-white px-6 py-3.5 rounded-full text-[12px] font-medium tracking-wide shadow-2xl flex items-center gap-3"
        >
          <div className="w-2 h-2 rounded-full bg-green-400" />
          {toastMessage}
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!loadingComplete && isHomeRoute) return <LoadingScreen onComplete={handleLoadComplete} />

  if (view === 'customer-home') {
    return (
      <>
        <Toast />
        <CustomerHomePage 
          setView={setView} 
          cart={cart} 
          favorites={favorites} 
          addToCart={addToCart} 
          removeFromCart={removeFromCart} 
          updateCartQty={updateCartQty} 
          toggleFavorite={toggleFavorite} 
          setSelectedCategory={setSelectedCategory}
          setSelectedProduct={setSelectedProduct}
          setSelectedBoutique={setSelectedBoutique}
          setSelectedCollectionSlug={setSelectedCollectionSlug}
          user={user}
          handleLogout={handleLogout}
        />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]" style={{ opacity: contentVisible ? 1 : 0, transition: 'opacity 0.8s ease' }}>
      <Toast />
      
      {/* Auth Required Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pt-24 sm:pt-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="bg-[#FAF9F6] p-6 sm:p-8 md:p-12 max-w-[400px] w-full border border-[#D4AF37]/30 text-center relative overflow-hidden mx-3 sm:mx-4"
              style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))' }}
            >
              {/* Modal Background Glow */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ background: 'radial-gradient(circle at top center, #D4AF37 0%, transparent 70%)' }}
              />

              <div className="w-16 h-16 rounded-full bg-[#1A0008]/5 flex items-center justify-center text-[#D4AF37] mx-auto mb-6 relative z-10 border border-[#D4AF37]/20">
                <User size={28} strokeWidth={1.5} />
              </div>

              <h3 className="text-3xl font-light text-[#1A0008] mb-3 relative z-10" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Login Required
              </h3>
              <p className="text-[13px] text-[#1A0008]/60 mb-8 relative z-10 leading-relaxed font-light">
                Please sign in to your Gurnaaz account to save items to your wishlist.
              </p>

              <div className="flex flex-col gap-3 relative z-10">
                <button
                  onClick={() => {
                    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
                    setShowLoginModal(false);
                    setView('login');
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

      <Navbar 
        cart={cart} 
        removeFromCart={removeFromCart} 
        updateCartQty={updateCartQty}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        addToCart={addToCart}
        setView={setView}
        setSelectedCategory={setSelectedCategory}
        setSelectedProduct={setSelectedProduct}
        setSelectedBoutique={setSelectedBoutique}
        setSelectedCollectionSlug={setSelectedCollectionSlug}
        user={user}
        handleLogout={handleLogout}
      />
      
      {view === 'home' && (
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
      )}

      {view === 'shop' && (
        <CategoryPage 
          categoryName="All"
          setView={setView}
          setSelectedProduct={setSelectedProduct}
          addToCart={addToCart}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          user={user}
          requireLogin={() => setShowLoginModal(true)}
        />
      )}

      {view === 'category' && (
        <CategoryPage 
          categoryName={selectedCategory}
          setView={setView}
          setSelectedProduct={setSelectedProduct}
          addToCart={addToCart}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          user={user}
          requireLogin={() => setShowLoginModal(true)}
        />
      )}

      {view === 'collections' && (
        <CollectionsPage 
          setView={setView}
          setSelectedCategory={setSelectedCategory}
          setSelectedProduct={setSelectedProduct}
          setSelectedCollectionSlug={setSelectedCollectionSlug}
          addToCart={addToCart}
          user={user}
          requireLogin={() => setShowLoginModal(true)}
        />
      )}

      {view === 'collection-detail' && selectedCollectionSlug && (
        <CollectionDetailPage
          slug={selectedCollectionSlug}
          setView={setView}
          setSelectedCategory={setSelectedCategory}
          setSelectedProduct={setSelectedProduct}
          setSelectedCollectionSlug={setSelectedCollectionSlug}
          addToCart={addToCart}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          user={user}
          requireLogin={() => setShowLoginModal(true)}
        />
      )}

      {view === 'product-details' && (
        <ProductDetailsPage 
          product={selectedProduct}
          setView={setView}
          setSelectedCategory={setSelectedCategory}
          setSelectedBoutique={setSelectedBoutique}
          addToCart={addToCart}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          user={user}
          requireLogin={() => setShowLoginModal(true)}
        />
      )}

      {view === 'wishlist' && (
        <WishlistPage
          allProducts={getAllProducts()}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          addToCart={addToCart}
          setView={setView}
        />
      )}

      {view === 'boutiques' && (
        <BoutiquesPage 
          setView={setView}
          setSelectedBoutique={setSelectedBoutique}
          user={user}
          requireLogin={() => setShowLoginModal(true)}
        />
      )}

      {view === 'seller-shop' && (
        <SellerShopPage 
          boutiqueName={selectedBoutique}
          setView={setView}
          setSelectedProduct={setSelectedProduct}
          addToCart={addToCart}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          user={user}
          requireLogin={() => setShowLoginModal(true)}
        />
      )}

      {view === 'cart' && (
        <CartPage 
          cart={cart}
          updateCartQty={updateCartQty}
          removeFromCart={removeFromCart}
          setView={setView}
        />
      )}

      {view === 'checkout' && (
        <CheckoutPage 
          cart={cart}
          setView={setView}
          clearCart={clearCart}
        />
      )}

      {view === 'login' && (
        <LoginSignup
          setView={setView}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {view === 'contact' && (
        <ContactPage setView={setView} user={user} />
      )}

      {view === 'about' && (
        <AboutPage setView={setView} />
      )}

      {view === 'privacy' && (
        <PrivacyPolicy setView={setView} />
      )}

      {view === 'shipping' && (
        <ShippingPolicy setView={setView} />
      )}

      {view === 'faq' && (
        <FAQPage setView={setView} />
      )}

      {view === 'wishlist' && (
        <WishlistPage
          allProducts={allProducts}
          setView={setView}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          addToCart={addToCart}
        />
      )}

      {view === 'profile' && (
        <ProfilePage
          user={user}
          setView={setView}
          handleLogout={handleLogout}
        />
      )}

      <Footer setView={setView} />
    </div>
  )
}

export default App

