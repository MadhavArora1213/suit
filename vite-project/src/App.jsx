import { useState } from 'react'
import './App.css'
import LoadingScreen from './LoadingScreen'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import StackedCategories from './components/StackedCategories'
import InteractiveLookbook from './components/InteractiveLookbook'
import ScrollytellingCraft from './components/ScrollytellingCraft'
import Testimonials from './components/Testimonials'
import SpecialOffer from './components/SpecialOffer'
import Footer from './components/Footer'

function App() {
  const [loadingComplete, setLoadingComplete] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)
  const [cart, setCart] = useState([])
  const [favorites, setFavorites] = useState({})

  const handleLoadComplete = () => {
    setLoadingComplete(true)
    setTimeout(() => setContentVisible(true), 200)
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

  if (!loadingComplete) return <LoadingScreen onComplete={handleLoadComplete} />

  return (
    <div className="min-h-screen bg-[#0A0A0A]" style={{ opacity: contentVisible ? 1 : 0, transition: 'opacity 0.8s ease' }}>
      <Navbar 
        cart={cart} 
        removeFromCart={removeFromCart} 
        updateCartQty={updateCartQty}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        addToCart={addToCart}
      />
      <Hero addToCart={addToCart} />
      <StackedCategories />
      <ScrollytellingCraft />
      <InteractiveLookbook addToCart={addToCart} />
      <Testimonials />
      <SpecialOffer />
      <Footer />
    </div>
  )
}

export default App

