import { useState, useEffect } from 'react'
import { auth, db } from './firebase'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { syncProducts, getAllProducts } from './utils/adminStore'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [cart, setCart] = useState([])
  const [favorites, setFavorites] = useState({})
  const [toastMessage, setToastMessage] = useState('')
  const allProducts = getAllProducts();

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
    if (path === '/boutiques') return 'boutiques';
    if (path.startsWith('/boutiques/')) return 'seller-shop';
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
      return path.replace('/collections/', '');
    }
    return null;
  };
  
  const getBoutiqueFromPath = () => {
    const path = window.location.pathname;
    if (path.startsWith('/boutiques/')) {
      const slug = path.replace('/boutiques/', '');
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
      // capitalizes first letter (e.g. anarkali -> Anarkali)
      const cat = path.replace('/category/', '');
      return cat.charAt(0).toUpperCase() + cat.slice(1);
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
      window.dispatchEvent(new CustomEvent('admin-data-updated'));
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data());
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
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const pathMap = {
      'customer-home': '/',
      'collections': '/collections',
      'collection-detail': `/collections/${selectedCollectionSlug || ''}`,
      'category': `/category/${(selectedCategory || '').toLowerCase()}`,
      'boutiques': '/boutiques',
      'seller-shop': ['Rivaaj Store', 'Pehnawa', 'Ludhiana Silks', 'Amritsar Textiles', 'The Heritage Store'].includes(selectedBoutique) 
          ? `/shop/${(selectedBoutique || '').toLowerCase().replace(/ /g, '-')}` 
          : `/boutiques/${(selectedBoutique || '').toLowerCase().replace(/ /g, '-')}`,
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
      'product-details': `/product/${selectedProduct?.name ? selectedProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : ''}`,
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
    setUser(null)
    window.location.href = '/'
  }

  const addToCart = (product, size = 'M') => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === product.id && item.size === size
      )
      if (existingIndex > -1) {
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        }
        return updated
      }
      return [...prev, { ...product, size, quantity: 1 }]
    })
  }

  const removeFromCart = (productId, size) => {
    setCart((prev) => prev.filter((item) => !(item.id === productId && item.size === size)))
  }

  const updateCartQty = (productId, size, qty) => {
    if (qty <= 0) {
      removeFromCart(productId, size)
      return
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId && item.size === size ? { ...item, quantity: qty } : item
      )
    )
  }

  const toggleFavorite = (productId) => {
    setFavorites((prev) => ({ ...prev, [productId]: !prev[productId] }))
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
          user={user}
          handleLogout={handleLogout}
        />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]" style={{ opacity: contentVisible ? 1 : 0, transition: 'opacity 0.8s ease' }}>
      <Toast />
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
        />
      )}

      {view === 'category' && (
        <CategoryPage 
          categoryName={selectedCategory}
          setView={setView}
          setSelectedProduct={setSelectedProduct}
          addToCart={addToCart}
        />
      )}

      {view === 'collections' && (
        <CollectionsPage 
          setView={setView}
          setSelectedCategory={setSelectedCategory}
          setSelectedProduct={setSelectedProduct}
          setSelectedCollectionSlug={setSelectedCollectionSlug}
          addToCart={addToCart}
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
        />
      )}

      {view === 'boutiques' && (
        <BoutiquesPage 
          setView={setView}
          setSelectedBoutique={setSelectedBoutique}
        />
      )}

      {view === 'seller-shop' && (
        <SellerShopPage 
          boutiqueName={selectedBoutique}
          setView={setView}
          setSelectedProduct={setSelectedProduct}
          addToCart={addToCart}
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

