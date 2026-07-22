import { useState, useEffect } from 'react'
import { syncProducts } from './utils/adminStore'
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
import FAQPage from './components/FAQPage'
import CollectionsPage from './components/CollectionsPage'
import CollectionDetailPage from './components/CollectionDetailPage'

function App() {
  const isHomeRoute = window.location.pathname === '/' || window.location.pathname === '';

  const [loadingComplete, setLoadingComplete] = useState(isHomeRoute ? false : true)
  const [contentVisible, setContentVisible] = useState(isHomeRoute ? false : true)
  const [cart, setCart] = useState([])
  const [favorites, setFavorites] = useState({})
  const getInitialView = () => {
    const path = window.location.pathname;
    if (path === '/') return 'customer-home';
    if (path === '/collections') return 'collections';
    if (path.startsWith('/collections/')) return 'collection-detail';
    if (path === '/contact') return 'contact';
    if (path === '/about') return 'about';
    if (path === '/privacy') return 'privacy';
    if (path === '/faq') return 'faq';
    return 'home';
  };

  const getCollectionFromPath = () => {
    const path = window.location.pathname;
    if (path.startsWith('/collections/')) {
      return path.replace('/collections/', '');
    }
    return null;
  };
  const [view, setView] = useState(getInitialView());
  const [user, setUser] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedBoutique, setSelectedBoutique] = useState(null)
  const [selectedCollectionSlug, setSelectedCollectionSlug] = useState(getCollectionFromPath())

  const currentPath = window.location.pathname

  useEffect(() => {
    syncProducts(() => {
      window.dispatchEvent(new CustomEvent('admin-data-updated'));
    });
  }, []);

  useEffect(() => {
    const pathMap = {
      'customer-home': '/',
      'collections': '/collections',
      'collection-detail': `/collections/${selectedCollectionSlug || ''}`,
      'contact': '/contact',
      'about': '/about',
      'privacy': '/privacy',
      'faq': '/faq',
      'home': '/sell',
    };
    if (pathMap[view] && window.location.pathname !== pathMap[view]) {
      window.history.pushState(null, '', pathMap[view]);
    }
  }, [view]);

  const handleLoadComplete = () => {
    setLoadingComplete(true)
    setTimeout(() => setContentVisible(true), 200)
  }

  const handleLoginSuccess = (userProfile) => {
    setUser(userProfile)
    window.location.href = '/sell'
  }

  const handleLogout = () => {
    setUser(null)
    window.location.href = '/sell'
    alert('Logged out successfully.')
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

  if (!loadingComplete && isHomeRoute) return <LoadingScreen onComplete={handleLoadComplete} />

  if (view === 'customer-home') {
    return (
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
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]" style={{ opacity: contentVisible ? 1 : 0, transition: 'opacity 0.8s ease' }}>
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
        <ContactPage setView={setView} />
      )}

      {view === 'about' && (
        <AboutPage setView={setView} />
      )}

      {view === 'privacy' && (
        <PrivacyPolicy setView={setView} />
      )}

      {view === 'faq' && (
        <FAQPage setView={setView} />
      )}

      <Footer setView={setView} />
    </div>
  )
}

export default App

