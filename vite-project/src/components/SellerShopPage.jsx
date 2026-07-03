import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin, Star, Filter, ArrowUpDown, ChevronDown, Check, ArrowLeft, ShoppingBag, Eye, Heart } from 'lucide-react';
import { getAllProducts, getBoutiqueProfile } from '../utils/adminStore';

export default function SellerShopPage({ boutiqueName, setView, setSelectedProduct, addToCart }) {
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedFabric, setSelectedFabric] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [sortOption, setSortOption] = useState('default');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Load profile
    const prof = getBoutiqueProfile(boutiqueName);
    setProfile(prof);

    // Load products belonging to this boutique
    const allProds = getAllProducts();
    const boutiqueProds = allProds.filter(
      p => p.boutique && p.boutique.trim().toLowerCase() === boutiqueName.trim().toLowerCase()
    );
    setProducts(boutiqueProds);
    setFilteredProducts(boutiqueProds);

    // Load favorites from localStorage
    const savedFavs = localStorage.getItem('gurnaaz_favorites');
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    }
  }, [boutiqueName]);

  // Extract unique fabrics from products
  const fabrics = ['All', ...new Set(products.map(p => {
    if (p.fabricName) return p.fabricName.split(' ').pop();
    if (p.suitType) return p.suitType;
    return 'Silk'; // fallback default
  }).filter(Boolean))];

  // Price range options
  const priceRanges = [
    { label: 'All Prices', value: 'All' },
    { label: 'Under ₹3,000', value: 'under3' },
    { label: '₹3,000 - ₹6,000', value: '3to6' },
    { label: '₹6,000 - ₹10,000', value: '6to10' },
    { label: 'Over ₹10,000', value: 'over10' },
  ];

  // Filtering and Sorting Logic
  useEffect(() => {
    let result = [...products];

    // Fabric Filter
    if (selectedFabric !== 'All') {
      result = result.filter(p => {
        const fab = (p.fabricName || '').toLowerCase() + ' ' + (p.suitType || '').toLowerCase();
        return fab.includes(selectedFabric.toLowerCase());
      });
    }

    // Price Filter
    if (selectedPriceRange !== 'All') {
      result = result.filter(p => {
        const priceNum = typeof p.price === 'string' 
          ? parseInt(p.price.replace(/[^\d]/g, '')) 
          : (p.priceNum || 0);
        
        if (selectedPriceRange === 'under3') return priceNum < 3000;
        if (selectedPriceRange === '3to6') return priceNum >= 3000 && priceNum <= 6000;
        if (selectedPriceRange === '6to10') return priceNum > 6000 && priceNum <= 10000;
        if (selectedPriceRange === 'over10') return priceNum > 10000;
        return true;
      });
    }

    // Sorting
    if (sortOption === 'price-low') {
      result.sort((a, b) => {
        const pA = typeof a.price === 'string' ? parseInt(a.price.replace(/[^\d]/g, '')) : (a.priceNum || 0);
        const pB = typeof b.price === 'string' ? parseInt(b.price.replace(/[^\d]/g, '')) : (b.priceNum || 0);
        return pA - pB;
      });
    } else if (sortOption === 'price-high') {
      result.sort((a, b) => {
        const pA = typeof a.price === 'string' ? parseInt(a.price.replace(/[^\d]/g, '')) : (a.priceNum || 0);
        const pB = typeof b.price === 'string' ? parseInt(b.price.replace(/[^\d]/g, '')) : (b.priceNum || 0);
        return pB - pA;
      });
    } else if (sortOption === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortOption === 'newest') {
      result.sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0));
    }

    setFilteredProducts(result);
  }, [products, selectedFabric, selectedPriceRange, sortOption]);

  const toggleFavorite = (id) => {
    const updated = { ...favorites, [id]: !favorites[id] };
    setFavorites(updated);
    localStorage.setItem('gurnaaz_favorites', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('favorites-updated'));
  };

  if (!profile) return null;

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-24 text-[#111111] overflow-hidden pt-28">
      {/* Editorial Cover Banner */}
      <div className="relative h-[45vh] md:h-[55vh] w-full overflow-hidden">
        <img 
          src={profile.coverImage} 
          alt={profile.name} 
          className="w-full h-full object-cover object-center filter brightness-[0.85] scale-105"
        />
        {/* Soft edge gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-[#111111]/10 to-[#111111]/30" />
        
        {/* Back Button */}
        <button 
          onClick={() => setView('home')} 
          className="absolute top-10 left-6 md:left-12 z-20 flex items-center gap-2 bg-[#FAF9F6]/90 hover:bg-[#FAF9F6] border border-[#BCA58A]/30 text-[#111111] text-[10px] uppercase tracking-widest px-4 py-2 rounded-full backdrop-blur-md shadow-lg transition-all"
        >
          <ArrowLeft size={12} />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Boutique branding header card */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative -mt-24 z-20">
        <div className="bg-[#FAF9F6] border border-[#BCA58A]/15 shadow-2xl rounded-2xl p-6 md:p-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Logo */}
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-[#FAF9F6] shadow-xl flex-shrink-0">
              <img src={profile.logo} alt={profile.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl md:text-5xl font-light text-[#111111]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {profile.name}
                </h1>
                <span className="bg-[#BCA58A] text-[#FAF9F6] text-[8px] font-bold tracking-[0.2em] px-3 py-1 uppercase rounded-full">
                  VERIFIED SELLER
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1.5 text-[#BCA58A]">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={13} 
                    className={profile.rating >= i + 1 ? 'fill-current' : 'opacity-30'} 
                  />
                ))}
                <span className="text-xs font-bold text-[#6B6B6B] ml-2">({profile.rating} Rating)</span>
              </div>

              {/* Description */}
              <p className="text-sm text-[#6B6B6B] leading-relaxed max-w-2xl font-medium">
                {profile.description}
              </p>
            </div>
          </div>

          {/* Contact & Location card */}
          <div className="w-full md:w-auto p-6 bg-[#E8DDD0]/20 border border-[#BCA58A]/15 rounded-xl space-y-4 text-xs font-semibold tracking-wider text-[#6B6B6B] flex-shrink-0">
            <div className="flex items-center gap-3">
              <Phone size={14} className="text-[#BCA58A]" />
              <span>{profile.contact.split('|')[0].trim()}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={14} className="text-[#BCA58A]" />
              <span>{profile.contact.split('|')[1]?.trim() || 'info@boutique.com'}</span>
            </div>
            <div className="flex items-start gap-3 max-w-[280px]">
              <MapPin size={14} className="text-[#BCA58A] mt-0.5 flex-shrink-0" />
              <span>{profile.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products & Filters Section */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 mt-16">
        
        {/* Controls Bar */}
        <div className="flex justify-between items-center border-b border-[#BCA58A]/15 pb-6 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-light text-[#111111]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Collection Catalogue <span className="text-sm text-[#BCA58A] ml-2">({filteredProducts.length} items)</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Fabric Select */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] tracking-widest uppercase text-[#6B6B6B] font-bold">Fabric:</span>
                <select 
                  value={selectedFabric} 
                  onChange={(e) => setSelectedFabric(e.target.value)}
                  className="bg-transparent border-b border-[#BCA58A]/30 focus:border-[#BCA58A] text-xs font-semibold py-1 focus:outline-none cursor-pointer pr-4"
                >
                  {fabrics.map(fab => (
                    <option key={fab} value={fab}>{fab === 'All' ? 'All Fabrics' : fab}</option>
                  ))}
                </select>
              </div>

              {/* Price Select */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] tracking-widest uppercase text-[#6B6B6B] font-bold">Price:</span>
                <select 
                  value={selectedPriceRange} 
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="bg-transparent border-b border-[#BCA58A]/30 focus:border-[#BCA58A] text-xs font-semibold py-1 focus:outline-none cursor-pointer pr-4"
                >
                  {priceRanges.map(pr => (
                    <option key={pr.value} value={pr.value}>{pr.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort options */}
            <div className="flex items-center gap-2">
              <ArrowUpDown size={12} className="text-[#BCA58A]" />
              <select 
                value={sortOption} 
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-transparent border-b border-[#BCA58A]/30 focus:border-[#BCA58A] text-xs font-semibold py-1 focus:outline-none cursor-pointer pr-4"
              >
                <option value="default">Default Sorting</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>

            {/* Mobile Filter Button */}
            <button 
              onClick={() => setFilterDrawerOpen(true)}
              className="lg:hidden p-2 border border-[#BCA58A]/20 hover:border-[#BCA58A] text-[#111111] transition-colors"
            >
              <Filter size={16} />
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#BCA58A]/30 rounded-2xl bg-white/40">
            <p className="text-lg font-light text-[#6B6B6B]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              No products found matching the selected filters.
            </p>
            <button 
              onClick={() => { setSelectedFabric('All'); setSelectedPriceRange('All'); }}
              className="mt-6 text-[10px] font-bold tracking-widest text-[#BCA58A] hover:text-[#111111] uppercase border-b border-[#BCA58A]/50 pb-1"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <motion.div 
                layout 
                key={product.id}
                onClick={() => {
                  setSelectedProduct(product);
                  setView('product-details');
                }}
                className="group text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Image */}
                  <div className="aspect-[3/4] overflow-hidden relative bg-[#FAF9F6] mb-5 border border-[#BCA58A]/8 group-hover:border-[#BCA58A]/30 transition-all duration-500 rounded-lg shadow-sm">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700" 
                    />

                    {/* Badge */}
                    {product.badge && (
                      <span className="absolute top-3 left-3 bg-[#FAF9F6]/90 backdrop-blur-sm text-[#BCA58A] text-[8px] font-semibold tracking-[0.15em] uppercase px-2.5 py-1.5 border border-[#BCA58A]/25">
                        {product.badge}
                      </span>
                    )}

                    {/* Wishlist */}
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        toggleFavorite(product.id); 
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-full border transition-all duration-300 z-20 cursor-pointer ${
                        favorites[product.id]
                          ? 'bg-[#BCA58A] text-white border-transparent'
                          : 'bg-[#FAF9F6]/80 text-[#111111]/70 border-[#111111]/15 hover:border-[#BCA58A] hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <Heart size={13} className={favorites[product.id] ? 'fill-current' : ''} />
                    </button>

                    {/* Quick Add Overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#111111]/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 z-10">
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          addToCart(product, 'M'); 
                          alert(`Added ${product.name} (Size M) to your bag!`);
                        }}
                        className="flex-1 bg-[#FAF9F6] hover:bg-[#BCA58A] hover:text-[#FAF9F6] text-[#111111] text-[9px] font-bold tracking-[0.2em] uppercase py-3 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ShoppingBag size={11} /> QUICK ADD
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="px-1 space-y-1.5">
                    <span className="inline-block text-[#BCA58A] text-[8px] font-semibold tracking-[0.15em] uppercase border border-[#BCA58A]/25 px-2 py-0.5">
                      ✓ {product.boutique}
                    </span>
                    <h3 className="text-sm font-medium text-[#111111]/85 group-hover:text-[#111111] transition-colors duration-300 leading-snug"
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '15px' }}>
                      {product.name}
                    </h3>
                  </div>
                </div>
                <div className="px-1 mt-2">
                  <p className="text-base font-light text-[#BCA58A]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {product.price}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {filterDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterDrawerOpen(false)}
              className="fixed inset-0 bg-black z-50 lg:hidden"
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-xs bg-[#FAF9F6] z-50 p-6 shadow-2xl flex flex-col justify-between lg:hidden text-left"
            >
              <div className="space-y-8">
                <div className="flex justify-between items-center border-b border-[#BCA58A]/10 pb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#111111]">Filter boutique items</span>
                  <button onClick={() => setFilterDrawerOpen(false)} className="text-[#6B6B6B] hover:text-[#111111] text-xs uppercase tracking-wider font-bold">Close</button>
                </div>

                {/* Fabric Selector */}
                <div className="space-y-3">
                  <span className="text-[10px] tracking-widest uppercase text-[#BCA58A] font-bold block">Filter by Fabric</span>
                  <div className="flex flex-col gap-2.5">
                    {fabrics.map(fab => (
                      <button 
                        key={fab} 
                        onClick={() => setSelectedFabric(fab)}
                        className={`text-left text-xs py-2 px-3 border transition-colors flex items-center justify-between font-semibold ${
                          selectedFabric === fab 
                            ? 'border-[#BCA58A] bg-[#BCA58A]/5 text-[#BCA58A]' 
                            : 'border-[#BCA58A]/10 text-[#6B6B6B] hover:border-[#BCA58A]/50'
                        }`}
                      >
                        <span>{fab === 'All' ? 'All Fabrics' : fab}</span>
                        {selectedFabric === fab && <Check size={12} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Selector */}
                <div className="space-y-3">
                  <span className="text-[10px] tracking-widest uppercase text-[#BCA58A] font-bold block">Filter by Price</span>
                  <div className="flex flex-col gap-2.5">
                    {priceRanges.map(pr => (
                      <button 
                        key={pr.value} 
                        onClick={() => setSelectedPriceRange(pr.value)}
                        className={`text-left text-xs py-2 px-3 border transition-colors flex items-center justify-between font-semibold ${
                          selectedPriceRange === pr.value 
                            ? 'border-[#BCA58A] bg-[#BCA58A]/5 text-[#BCA58A]' 
                            : 'border-[#BCA58A]/10 text-[#6B6B6B] hover:border-[#BCA58A]/50'
                        }`}
                      >
                        <span>{pr.label}</span>
                        {selectedPriceRange === pr.value && <Check size={12} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => { setSelectedFabric('All'); setSelectedPriceRange('All'); setFilterDrawerOpen(false); }}
                className="w-full bg-[#111111] hover:bg-[#BCA58A] text-[#FAF9F6] py-3.5 text-[9px] font-bold tracking-[0.25em] uppercase transition-colors"
              >
                Reset &amp; Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
