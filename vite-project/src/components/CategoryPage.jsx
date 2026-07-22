import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, SlidersHorizontal, ArrowUpDown, ChevronDown, Check, Star, ShoppingBag, Eye } from 'lucide-react';
import { getAllProducts } from '../utils/adminStore';

const categoryBanners = {
  Anarkali: {
    title: 'Anarkali Suits',
    tagline: 'Regal Flares & Majestic Silhouettes',
    desc: 'Indulge in high-volume silhouettes, royal kali cuts, and handloomed silk weaves. Inspired by Mughal heritage and re-imagined for modern celebrations.',
    bgImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80'
  },
  Sharara: {
    title: 'Sharara Suits',
    tagline: 'Playful Tiers & Festive Drama',
    desc: 'Traditional three-piece sets featuring heavily flared sharara trousers, shorter designer kurtis, and matching embellished dupattas for timeless elegance.',
    bgImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=80'
  },
  Patiala: {
    title: 'Patiala Suits',
    tagline: 'Vibrant Salwars & Classic Gathering',
    desc: 'Representing rich Punjabi heritage with dense, hand-folded salwar pleats, short kurtas, and heavily embroidered phulkari dupattas.',
    bgImage: 'https://images.unsplash.com/photo-1605784401368-5af1d9d6c4dc?auto=format&fit=crop&w=1600&q=80'
  },
  Pakistani: {
    title: 'Pakistani Suits',
    tagline: 'Straight Elegance & Intricate Laces',
    desc: 'Contemporary long straight-cut silhouettes adorned with soft organza inserts, delicate shadow work, and premium thread laces.',
    bgImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1600&q=80'
  },
  Chikankari: {
    title: 'Chikankari Suits',
    tagline: 'Shadow Embroidery & Lucknowi Art',
    desc: 'Delicate hand-knotted shadow embroidery on breezy georgette and premium modal cotton. Perfect pastel hues with authentic handloom artistry.',
    bgImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1600&q=80'
  },
  Banarasi: {
    title: 'Banarasi Suits',
    tagline: 'Katan Silk Brocades & Golden Zari',
    desc: 'Opulent suit sets handwoven in Varanasi using katan silk threads and metallic zari. Exudes grandeur and heritage luxury, ideal for grand weddings.',
    bgImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1600&q=80'
  }
};

export default function CategoryPage({ categoryName, setView, setSelectedProduct, addToCart }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedBoutique, setSelectedBoutique] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [sortOption, setSortOption] = useState('newest');
  const [filterOpen, setFilterOpen] = useState(false);

  const banner = categoryBanners[categoryName] || {
    title: `${categoryName} Collection`,
    tagline: 'Luxury Heritage Collection',
    desc: 'Browse our exclusive, handcrafted selection of designer ethnic wear, curated from India’s finest heritage boutiques.',
    bgImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80'
  };

  // Load products matching this category
  useEffect(() => {
    const all = getAllProducts();
    if (categoryName === 'All') {
      setProducts(all);
      setFilteredProducts(all);
      return;
    }
    const categoryFiltered = all.filter(p => {
      const typeMatch = (p.type || p.suitType || '').toLowerCase() === categoryName.toLowerCase();
      const colMatch = (p.collection || '').toLowerCase() === categoryName.toLowerCase();
      const catMatch = (p.category || '').toLowerCase() === categoryName.toLowerCase();
      return typeMatch || colMatch || catMatch;
    });
    setProducts(categoryFiltered);
    setFilteredProducts(categoryFiltered);
  }, [categoryName]);

  // Unique boutiques for filter dropdown
  const boutiques = ['All', ...new Set(products.map(p => p.boutique).filter(Boolean))];

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];

    // Boutique Filter
    if (selectedBoutique !== 'All') {
      result = result.filter(p => p.boutique === selectedBoutique);
    }

    // Price Range Filter
    if (selectedPriceRange !== 'All') {
      result = result.filter(p => {
        const price = p.priceNum || parseInt(p.price.replace(/[^\d]/g, ''), 10);
        if (selectedPriceRange === 'under-5k') return price < 5000;
        if (selectedPriceRange === '5k-10k') return price >= 5000 && price <= 10000;
        if (selectedPriceRange === 'above-10k') return price > 10000;
        return true;
      });
    }

    // Sorting
    if (sortOption === 'price-low') {
      result.sort((a, b) => {
        const priceA = a.priceNum || parseInt(a.price.replace(/[^\d]/g, ''), 10);
        const priceB = b.priceNum || parseInt(b.price.replace(/[^\d]/g, ''), 10);
        return priceA - priceB;
      });
    } else if (sortOption === 'price-high') {
      result.sort((a, b) => {
        const priceA = a.priceNum || parseInt(a.price.replace(/[^\d]/g, ''), 10);
        const priceB = b.priceNum || parseInt(b.price.replace(/[^\d]/g, ''), 10);
        return priceB - priceA;
      });
    } else if (sortOption === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      // Newest
      result.sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0));
    }

    setFilteredProducts(result);
  }, [products, selectedBoutique, selectedPriceRange, sortOption]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setView('product-details');
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#111111] pb-24" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      
      {/* Editorial Header Banner */}
      <div className="relative h-[55vh] md:h-[60vh] overflow-hidden flex items-center justify-center pt-20">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src={banner.bgImage} 
          alt={banner.title} 
          className="absolute inset-0 w-full h-full object-cover object-center scale-102"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-transparent to-transparent z-15" />
        
        <div className="relative z-20 text-center px-6 max-w-3xl space-y-4">
          <button 
            onClick={() => window.location.href = '/sell'}
            className="inline-flex items-center gap-2 text-xs tracking-widest text-[#BCA58A] hover:text-[#FAF9F6] uppercase font-bold transition-colors cursor-pointer mb-2"
          >
            <ArrowLeft size={13} />
            <span>Back to Home</span>
          </button>
          
          <span className="text-[10px] tracking-[0.4em] uppercase text-[#BCA58A] font-bold block">
            {banner.tagline}
          </span>
          <h1 className="text-4xl md:text-6xl font-light text-white tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {banner.title}
          </h1>
          <p className="text-[#FAF9F6]/80 text-xs md:text-sm leading-relaxed max-w-xl mx-auto font-medium">
            {banner.desc}
          </p>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-14 mt-12">
        
        {/* Filters Top Bar */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 border-b border-[#BCA58A]/15 pb-6 mb-10">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-[#111111]/70">{filteredProducts.length} Luxury Creations Found</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Filter Toggle Button */}
            <button 
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 border border-[#BCA58A]/30 px-5 py-3 text-xs tracking-wider font-bold uppercase hover:border-[#111111] transition-all cursor-pointer bg-white"
            >
              <SlidersHorizontal size={14} className="text-[#BCA58A]" />
              <span>Filter By</span>
            </button>

            {/* Sorting Dropdown */}
            <div className="relative flex items-center border border-[#BCA58A]/30 bg-white px-4 py-3">
              <ArrowUpDown size={14} className="text-[#BCA58A] mr-2" />
              <select 
                value={sortOption} 
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-transparent text-xs tracking-wider font-bold uppercase outline-none cursor-pointer appearance-none pr-6"
              >
                <option value="newest">New Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown size={12} className="absolute right-4 pointer-events-none text-[#BCA58A]" />
            </div>
          </div>
        </div>

        {/* Filter Drawer / Accordion */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-[#E8DDD0]/15 border border-[#BCA58A]/20 p-6 mb-10 rounded text-left grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* Boutique filter */}
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-widest text-[#BCA58A] font-bold block">Heritage Boutique</span>
                <div className="flex flex-wrap gap-2">
                  {boutiques.map(bt => (
                    <button 
                      key={bt} 
                      onClick={() => setSelectedBoutique(bt)}
                      className={`px-4 py-2 border text-xs font-semibold tracking-wider transition-all uppercase rounded cursor-pointer ${
                        selectedBoutique === bt 
                          ? 'bg-[#BCA58A] text-[#FAF9F6] border-transparent shadow' 
                          : 'border-[#BCA58A]/30 bg-white hover:border-[#111111] text-[#111111]/70'
                      }`}
                    >
                      {bt === 'All' ? 'All Boutiques' : bt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price filter */}
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-widest text-[#BCA58A] font-bold block">Price Filter</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'All', label: 'All Prices' },
                    { id: 'under-5k', label: 'Under ₹5,000' },
                    { id: '5k-10k', label: '₹5,000 - ₹10,000' },
                    { id: 'above-10k', label: 'Above ₹10,000' }
                  ].map(pr => (
                    <button 
                      key={pr.id} 
                      onClick={() => setSelectedPriceRange(pr.id)}
                      className={`px-4 py-2 border text-xs font-semibold tracking-wider transition-all uppercase rounded cursor-pointer ${
                        selectedPriceRange === pr.id 
                          ? 'bg-[#BCA58A] text-[#FAF9F6] border-transparent shadow' 
                          : 'border-[#BCA58A]/30 bg-white hover:border-[#111111] text-[#111111]/70'
                      }`}
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center border border-[#BCA58A]/15 bg-white rounded p-12">
            <h3 className="text-2xl font-light text-[#111111] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              No Collections Found
            </h3>
            <p className="text-sm text-[#6B6B6B] max-w-sm mx-auto mb-6">
              There are currently no products in {categoryName} matching your active filters. Try clearing filters.
            </p>
            <button 
              onClick={() => { setSelectedBoutique('All'); setSelectedPriceRange('All'); }}
              className="bg-[#BCA58A] text-[#FAF9F6] px-8 py-3 text-xs tracking-widest font-bold uppercase hover:bg-[#9A8268] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((p, idx) => (
              <motion.div 
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="group relative cursor-pointer text-left flex flex-col justify-between"
                onClick={() => handleProductClick(p)}
              >
                <div>
                  {/* Photo container */}
                  <div className="aspect-[3/4] overflow-hidden bg-white border border-[#BCA58A]/10 group-hover:border-[#BCA58A]/45 relative mb-4 rounded shadow-sm transition-all duration-300">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    />

                    {p.badge && (
                      <span className="absolute top-3 left-3 bg-[#FAF9F6]/85 backdrop-blur-sm text-[#BCA58A] text-[8px] font-bold tracking-widest uppercase px-2.5 py-1.5 border border-[#BCA58A]/25 rounded-sm">
                        {p.badge}
                      </span>
                    )}

                    {/* Quick overlay buttons */}
                    <div className="absolute inset-0 bg-[#FAF9F6]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4 z-10">
                      <div className="w-full flex gap-2">
                        <motion.button 
                          whileHover={{ scale: 1.02 }} 
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            addToCart(p, 'M');
                            alert(`Added ${p.name} (Size M) to bag!`);
                          }}
                          className="flex-1 bg-[#BCA58A] text-white text-[9px] font-bold tracking-widest uppercase py-3 flex items-center justify-center gap-1.5 hover:bg-[#9A8268] transition-colors cursor-pointer shadow-lg"
                        >
                          <ShoppingBag size={11} /> ADD TO BAG
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.02 }} 
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => { e.stopPropagation(); handleProductClick(p); }}
                          className="bg-white border border-[#BCA58A]/35 text-[#111111] hover:bg-[#111111] hover:text-white p-3 transition-all cursor-pointer shadow-lg rounded-sm"
                        >
                          <Eye size={12} />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Info details */}
                  <div className="space-y-1.5 pl-1">
                    <span className="inline-block text-[#BCA58A] text-[8px] font-bold tracking-widest uppercase border border-[#BCA58A]/25 px-2 py-0.5 rounded-sm">
                      ✓ {p.boutique}
                    </span>
                    <h3 className="text-sm font-medium text-[#111111]/85 group-hover:text-[#BCA58A] transition-colors duration-300 leading-snug line-clamp-1" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px' }}>
                      {p.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pl-1">
                  <span className="text-base font-medium text-[#BCA58A]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {p.price}
                  </span>
                  
                  {p.rating && (
                    <div className="flex items-center gap-1">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      <span className="text-[10px] font-semibold text-[#111111]/70">{p.rating}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
