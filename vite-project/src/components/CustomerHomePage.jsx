import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllProducts, staticBoutiques } from '../utils/adminStore';
import TrustStrip from './TrustStrip';
import PremiumPackaging from './PremiumPackaging';
import EditorialCollections from './EditorialCollections';
import WhyGurnaaz from './WhyGurnaaz';
import FeaturedSellers from './FeaturedSellers';
import RealReviews from './RealReviews';
import Newsletter from './Newsletter';
import AiOutfitFinder from './AiOutfitFinder';
import OccasionTimeline from './OccasionTimeline';
import ShopByColor from './ShopByColor';
import ShoppingReimagined from './ShoppingReimagined';
import HeroRitual from './HeroRitual';
import Footer from './Footer';
import Navbar from './Navbar';

const CATEGORIES = ['Anarkali', 'Sharara', 'Banarasi', 'Chikankari', 'Patiala', 'Pakistani'];

export default function CustomerHomePage({ setView, cart, favorites, addToCart, removeFromCart, updateCartQty, toggleFavorite, setSelectedCategory, setSelectedProduct, setSelectedBoutique, user, handleLogout }) {
  const [products, setProducts] = useState([]);
  const [selectedCategoryState, setSelectedCategoryState] = useState('All');
  const [isCrossfading, setIsCrossfading] = useState(false);

  const handleRitualFilter = (filter) => {
    setIsCrossfading(true);
    
    // Simulate setting filters
    if (filter.type === 'occasion' && filter.value) {
      // Just for demo, reset to All or a mapped category
      setSelectedCategoryState('All'); 
    }

    // Crossfade execution
    setTimeout(() => {
      const el = document.getElementById('categories');
      if (el) {
        el.scrollIntoView({ behavior: 'auto' });
      }
      setTimeout(() => {
        setIsCrossfading(false);
      }, 100);
    }, 500);
  };

  useEffect(() => {
    setProducts(getAllProducts());
    const handleUpdate = () => setProducts(getAllProducts());
    window.addEventListener('admin-data-updated', handleUpdate);
    return () => window.removeEventListener('admin-data-updated', handleUpdate);
  }, []);

  const filtered = selectedCategoryState === 'All'
    ? products
    : products.filter(p => p.type === selectedCategoryState);

  const featured = products.slice(0, 8);
  const boutiqueList = Object.values(staticBoutiques).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
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
      {/* Full Page Crossfade Overlay */}
      <AnimatePresence>
        {isCrossfading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 bg-[#111111] z-[9999] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Hero - The Discovery Ritual */}
      <HeroRitual onSelectFilter={handleRitualFilter} />



      {/* Shopping, Reimagined Occasion Cards */}
      <ShoppingReimagined />

      <ShopByColor />
      <OccasionTimeline />

      <AiOutfitFinder />
      {/* Featured Sellers (Instagram Style) */}
      <FeaturedSellers />
      <EditorialCollections />
      <WhyGurnaaz />
      <PremiumPackaging />

      <RealReviews />

      <TrustStrip />

      <Newsletter />

      <Footer />
    </div>
  );
}
