import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeaturedCollections from './components/FeaturedCollections'
import CategoryShowcase from './components/CategoryShowcase'
import WhyChooseUs from './components/WhyChooseUs'
import Testimonials from './components/Testimonials'
import Lookbook from './components/Lookbook'
import SpecialOffer from './components/SpecialOffer'
import Gallery from './components/Gallery'
import Footer from './components/Footer'

function App() {
  const [cart, setCart] = useState([])
  const [favorites, setFavorites] = useState({})

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

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        cart={cart} 
        removeFromCart={removeFromCart} 
        updateCartQty={updateCartQty}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        addToCart={addToCart}
      />
      <Hero addToCart={addToCart} />
      <FeaturedCollections 
        cart={cart}
        addToCart={addToCart}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
      />
      <CategoryShowcase />
      <Testimonials />
      <Lookbook addToCart={addToCart} />
      <SpecialOffer />
      <Gallery addToCart={addToCart} />
      <WhyChooseUs />
      <Footer />
    </div>
  )
}

export default App

