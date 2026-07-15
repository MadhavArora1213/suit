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
import LoginPage from './components/LoginPage'
import CategoryPage from './components/CategoryPage'
import ProductDetailsPage from './components/ProductDetailsPage'
import SellerShopPage from './components/SellerShopPage'
import WaitlistPage from './components/WaitlistPage'

function App() {
  const [loadingComplete, setLoadingComplete] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)
  const [cart, setCart] = useState([])
  const [favorites, setFavorites] = useState({})
  const [view, setView] = useState('home')
  const [user, setUser] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedBoutique, setSelectedBoutique] = useState(null)

  const currentPath = window.location.pathname

  useEffect(() => {
    syncProducts(() => {
      window.dispatchEvent(new CustomEvent('admin-data-updated'));
    });
  }, []);

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

  if (!loadingComplete) return <LoadingScreen onComplete={handleLoadComplete} />

  if (currentPath === '/') return <WaitlistPage />

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
        <LoginPage 
          setView={setView}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      <Footer setView={setView} />
    </div>
  )
}

export default App

