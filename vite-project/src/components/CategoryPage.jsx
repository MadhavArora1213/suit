import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShoppingBag, Eye, SlidersHorizontal, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { getAllProducts, getCategories } from '../utils/adminStore';

function FilterAccordion({ title, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#111111]/10 pb-5 mb-5">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full text-left group cursor-pointer">
        <h4 className="text-[12px] font-bold tracking-[0.15em] text-[#111111] uppercase group-hover:text-[#BCA58A] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>{title}</h4>
        {isOpen ? <ChevronUp size={14} className="text-[#BCA58A] transition-colors" /> : <ChevronDown size={14} className="text-[#111111]/50 group-hover:text-[#BCA58A] transition-colors" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="pt-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CategoryPage({ categoryName, setView, setSelectedProduct, addToCart }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Sort
  const [sortOption, setSortOption] = useState('newest');

  // Advanced Filters
  const [selectedBoutiques, setSelectedBoutiques] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  
  useEffect(() => {
    setCategories(getCategories());
    const handleUpdate = () => setCategories(getCategories());
    window.addEventListener('admin-data-updated', handleUpdate);
    return () => window.removeEventListener('admin-data-updated', handleUpdate);
  }, []);

  const currentCat = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());

  const banner = {
    title: currentCat?.name || categoryName,
    subtitle: currentCat?.subtitle || 'Curated Collection',
    desc: currentCat?.tagline || 'Browse our exclusive, handcrafted selection of designer ethnic wear, curated from India’s finest heritage boutiques.',
    bgImage: currentCat?.image || '/designer_suit_1.png',
    bgImage2: currentCat?.image2 || '/anarkali_suit.png'
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const all = getAllProducts();
    if (categoryName === 'All') {
      setProducts(all);
      return;
    }
    const categoryFiltered = all.filter(p => {
      const typeMatch = (p.type || p.suitType || '').toLowerCase() === categoryName.toLowerCase();
      const colMatch = (p.collection || '').toLowerCase() === categoryName.toLowerCase();
      const catMatch = (p.category || '').toLowerCase() === categoryName.toLowerCase();
      return typeMatch || colMatch || catMatch;
    });
    setProducts(categoryFiltered);
  }, [categoryName]);

  const boutiques = useMemo(() => [...new Set(products.map(p => p.boutique).filter(Boolean))], [products]);
  
  const fabricsList = ['Cotton', 'Silk', 'Georgette', 'Velvet', 'Organza', 'Chanderi'];
  const occasionsList = ['Casual', 'Festive', 'Wedding', 'Party'];
  const sizesList = ['Unstitched']; // Temporarily only showing Unstitched
  const pricesList = [
    { id: 'under5k', label: 'Under ₹5,000' },
    { id: '5k-10k', label: '₹5,000 - ₹10,000' },
    { id: 'over10k', label: 'Over ₹10,000' }
  ];
  const colorsList = [
    { name: 'Red', hex: '#E74C3C' },
    { name: 'Blue', hex: '#3498DB' },
    { name: 'Green', hex: '#2ECC71' },
    { name: 'Pink', hex: '#F1948A' },
    { name: 'Black', hex: '#111111' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Yellow', hex: '#F1C40F' },
    { name: 'Wine', hex: '#722F37' }
  ];

  const toggleFilter = (setter, value) => {
    setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const clearAllFilters = () => {
    setSelectedBoutiques([]);
    setSelectedPrices([]);
    setSelectedFabrics([]);
    setSelectedColors([]);
    setSelectedOccasions([]);
    setSelectedSizes([]);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedBoutiques.length > 0) result = result.filter(p => selectedBoutiques.includes(p.boutique));
    
    if (selectedPrices.length > 0) {
      result = result.filter(p => {
        const price = p.priceNum || parseInt(p.price.replace(/[^\d]/g, ''), 10);
        if (selectedPrices.includes('under5k') && price < 5000) return true;
        if (selectedPrices.includes('5k-10k') && price >= 5000 && price <= 10000) return true;
        if (selectedPrices.includes('over10k') && price > 10000) return true;
        return false;
      });
    }

    const getText = (p) => `${p.name} ${p.desc} ${p.type} ${p.collection} ${p.fabricDetails || ''}`.toLowerCase();

    if (selectedFabrics.length > 0) {
      result = result.filter(p => selectedFabrics.some(f => getText(p).includes(f.toLowerCase())));
    }
    if (selectedColors.length > 0) {
      result = result.filter(p => selectedColors.some(c => getText(p).includes(c.toLowerCase())));
    }
    if (selectedOccasions.length > 0) {
      result = result.filter(p => selectedOccasions.some(o => getText(p).includes(o.toLowerCase())));
    }
    if (selectedSizes.length > 0) {
      result = result.filter(p => selectedSizes.some(s => getText(p).includes(s.toLowerCase())));
    }

    if (sortOption === 'price-low') {
      result.sort((a, b) => (a.priceNum || parseInt(a.price.replace(/[^\d]/g, ''), 10)) - (b.priceNum || parseInt(b.price.replace(/[^\d]/g, ''), 10)));
    } else if (sortOption === 'price-high') {
      result.sort((a, b) => (b.priceNum || parseInt(b.price.replace(/[^\d]/g, ''), 10)) - (a.priceNum || parseInt(a.price.replace(/[^\d]/g, ''), 10)));
    } else if (sortOption === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      result.sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0));
    }

    return result;
  }, [products, selectedBoutiques, selectedPrices, selectedFabrics, selectedColors, selectedOccasions, selectedSizes, sortOption]);

  const activeFilterCount = selectedBoutiques.length + selectedPrices.length + selectedFabrics.length + selectedColors.length + selectedOccasions.length + selectedSizes.length;

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setView('product-details');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] mt-[110px] selection:bg-[#BCA58A] selection:text-white">
      
      {/* ── 10/10 Avant-Garde Hero Section (Compact & Uncropped) ── */}
      <div className="relative w-full max-w-[1800px] mx-auto px-6 md:px-12 pt-4 pb-6 overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12 relative">
          
          {/* Typography / Left Side */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center z-20">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-px bg-[#BCA58A]" />
                <span className="text-[#BCA58A] text-[10px] tracking-[0.4em] uppercase font-bold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {banner.subtitle}
                </span>
              </div>

              <h1 className="text-6xl md:text-[80px] font-light text-[#111111] leading-[0.85] tracking-tight mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {banner.title}
              </h1>

              <p className="text-[#111111]/70 text-xs md:text-sm leading-relaxed mb-8 max-w-md font-light line-clamp-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {banner.desc}
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <button
                  onClick={() => document.getElementById('collection-start')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group relative inline-flex items-center gap-4 w-max cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full border border-[#BCA58A] flex items-center justify-center group-hover:bg-[#BCA58A] transition-colors duration-500">
                    <ArrowRight size={14} className="text-[#BCA58A] group-hover:text-white transition-colors duration-500" />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#111111] group-hover:text-[#BCA58A] transition-colors duration-500">
                    Explore Collection
                  </span>
                </button>
                <div className="hidden sm:flex items-center gap-2 text-[#111111]/30 animate-bounce mt-1">
                  <ChevronDown size={14} />
                  <span className="text-[8px] tracking-[0.2em] uppercase font-bold">Scroll</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Imagery / Right Side (Dual Portrait Layout to prevent cropping) */}
          <div className="w-full lg:w-1/2 flex justify-end gap-3 md:gap-4 pl-4 md:pl-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="w-1/2 md:w-[180px] lg:w-[200px] aspect-[3/4] overflow-hidden bg-[#E8DDD0]"
            >
              <img src={banner.bgImage} alt="Hero Main" className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700" />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className="w-1/2 md:w-[180px] lg:w-[200px] aspect-[3/4] overflow-hidden bg-[#E8DDD0] mt-6 md:mt-8"
            >
              <img src={banner.bgImage2} alt="Hero Sub" className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700" />
            </motion.div>
          </div>

        </div>
      </div>

      {/* ── Main Collection Layout ── */}
      <div id="collection-start" className="max-w-[1800px] mx-auto px-6 md:px-12 pt-2 pb-32">
        <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
          
          {/* ── Minimalist Left Sidebar Filters ── */}
          <div className="w-full lg:w-[260px] shrink-0">
            <div className="sticky top-[120px] max-h-[calc(100vh-140px)] overflow-y-auto pr-4 pb-10 scrollbar-thin scrollbar-thumb-[#BCA58A]/30 scrollbar-track-transparent">
              
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <SlidersHorizontal size={14} className="text-[#BCA58A]" />
                  <h3 className="text-[11px] tracking-[0.3em] uppercase font-bold text-[#111111]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Refine By
                  </h3>
                </div>
                {activeFilterCount > 0 && (
                  <button onClick={clearAllFilters} className="text-[9px] text-[#111111] font-bold uppercase tracking-wider hover:text-[#BCA58A] cursor-pointer">
                    Clear All
                  </button>
                )}
              </div>

              {/* Accordion: Sort */}
              <FilterAccordion title="Sort Collection" defaultOpen={true}>
                <div className="flex flex-col gap-4">
                  {[
                    { id: 'newest', label: 'Latest Arrivals' },
                    { id: 'price-low', label: 'Price: Ascending' },
                    { id: 'price-high', label: 'Price: Descending' },
                    { id: 'rating', label: 'Most Loved' }
                  ].map((sort) => (
                    <label key={sort.id} className="flex items-center gap-4 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <div className={`w-[14px] h-[14px] rounded-full border transition-all duration-300 ${sortOption === sort.id ? 'border-[#BCA58A]' : 'border-[#111111]/20 group-hover:border-[#BCA58A]/50'}`} />
                        <div className={`absolute w-1.5 h-1.5 rounded-full bg-[#BCA58A] transition-all duration-300 ${sortOption === sort.id ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
                      </div>
                      <span className={`text-[13px] transition-colors duration-300 ${sortOption === sort.id ? 'text-[#111111] font-medium' : 'text-[#111111]/60 group-hover:text-[#111111]'}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {sort.label}
                      </span>
                      <input type="radio" className="hidden" checked={sortOption === sort.id} onChange={() => setSortOption(sort.id)} />
                    </label>
                  ))}
                </div>
              </FilterAccordion>

              {/* Accordion: Price */}
              <FilterAccordion title="Price Point" defaultOpen={false}>
                <div className="space-y-4">
                  {pricesList.map(p => (
                    <label key={p.id} className="flex items-center gap-4 cursor-pointer group">
                      <div className={`w-3.5 h-3.5 flex items-center justify-center transition-all duration-300 border ${selectedPrices.includes(p.id) ? 'border-[#BCA58A] bg-[#BCA58A]' : 'border-[#111111]/20 group-hover:border-[#BCA58A]/50'}`}>
                        <Check size={10} className={`text-white transition-opacity ${selectedPrices.includes(p.id) ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
                      </div>
                      <span className={`text-[13px] transition-colors duration-300 ${selectedPrices.includes(p.id) ? 'text-[#111111] font-medium' : 'text-[#111111]/60 group-hover:text-[#111111]'}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {p.label}
                      </span>
                      <input type="checkbox" className="hidden" checked={selectedPrices.includes(p.id)} onChange={() => toggleFilter(setSelectedPrices, p.id)} />
                    </label>
                  ))}
                </div>
              </FilterAccordion>

              {/* Accordion: Size */}
              <FilterAccordion title="Size" defaultOpen={false}>
                <div className="flex flex-wrap gap-2">
                  {sizesList.map(s => (
                    <button key={s} onClick={() => toggleFilter(setSelectedSizes, s)}
                      className={`px-3 py-1.5 border text-[11px] font-medium transition-colors cursor-pointer ${selectedSizes.includes(s) ? 'border-[#111111] bg-[#111111] text-white' : 'border-[#BCA58A]/30 text-[#6B6B6B] hover:border-[#111111]'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </FilterAccordion>

              {/* Accordion: Fabric */}
              <FilterAccordion title="Fabric" defaultOpen={false}>
                <div className="space-y-4">
                  {fabricsList.map(f => (
                    <label key={f} className="flex items-center gap-4 cursor-pointer group">
                      <div className={`w-3.5 h-3.5 flex items-center justify-center transition-all duration-300 border ${selectedFabrics.includes(f) ? 'border-[#BCA58A] bg-[#BCA58A]' : 'border-[#111111]/20 group-hover:border-[#BCA58A]/50'}`}>
                        <Check size={10} className={`text-white transition-opacity ${selectedFabrics.includes(f) ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
                      </div>
                      <span className={`text-[13px] transition-colors duration-300 ${selectedFabrics.includes(f) ? 'text-[#111111] font-medium' : 'text-[#111111]/60 group-hover:text-[#111111]'}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {f}
                      </span>
                      <input type="checkbox" className="hidden" checked={selectedFabrics.includes(f)} onChange={() => toggleFilter(setSelectedFabrics, f)} />
                    </label>
                  ))}
                </div>
              </FilterAccordion>

              {/* Accordion: Color */}
              <FilterAccordion title="Color" defaultOpen={false}>
                <div className="flex flex-wrap gap-3">
                  {colorsList.map(c => {
                    const isSelected = selectedColors.includes(c.name);
                    return (
                      <button key={c.name} onClick={() => toggleFilter(setSelectedColors, c.name)} title={c.name}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${isSelected ? 'border-gray-400 scale-110 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                        style={{ backgroundColor: c.hex }}>
                        {isSelected && <Check size={12} className={c.name === 'White' || c.name === 'Yellow' ? 'text-black' : 'text-white'} />}
                      </button>
                    );
                  })}
                </div>
              </FilterAccordion>

              {/* Accordion: Occasion */}
              <FilterAccordion title="Occasion" defaultOpen={false}>
                <div className="space-y-4">
                  {occasionsList.map(o => (
                    <label key={o} className="flex items-center gap-4 cursor-pointer group">
                      <div className={`w-3.5 h-3.5 flex items-center justify-center transition-all duration-300 border ${selectedOccasions.includes(o) ? 'border-[#BCA58A] bg-[#BCA58A]' : 'border-[#111111]/20 group-hover:border-[#BCA58A]/50'}`}>
                        <Check size={10} className={`text-white transition-opacity ${selectedOccasions.includes(o) ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
                      </div>
                      <span className={`text-[13px] transition-colors duration-300 ${selectedOccasions.includes(o) ? 'text-[#111111] font-medium' : 'text-[#111111]/60 group-hover:text-[#111111]'}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {o}
                      </span>
                      <input type="checkbox" className="hidden" checked={selectedOccasions.includes(o)} onChange={() => toggleFilter(setSelectedOccasions, o)} />
                    </label>
                  ))}
                </div>
              </FilterAccordion>

              {/* Accordion: Boutiques */}
              {boutiques.length > 0 && (
                <FilterAccordion title="Boutique and Shop" defaultOpen={false}>
                  <div className="space-y-4">
                    {boutiques.map((btq) => (
                      <label key={btq} className="flex items-center gap-4 cursor-pointer group">
                        <div className={`w-3.5 h-3.5 flex items-center justify-center transition-all duration-300 border ${selectedBoutiques.includes(btq) ? 'border-[#BCA58A] bg-[#BCA58A]' : 'border-[#111111]/20 group-hover:border-[#BCA58A]/50'}`}>
                          <Check size={10} className={`text-white transition-opacity ${selectedBoutiques.includes(btq) ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
                        </div>
                        <span className={`text-[13px] transition-colors duration-300 ${selectedBoutiques.includes(btq) ? 'text-[#111111] font-medium' : 'text-[#111111]/60 group-hover:text-[#111111]'}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {btq}
                        </span>
                        <input type="checkbox" className="hidden" checked={selectedBoutiques.includes(btq)} onChange={() => toggleFilter(setSelectedBoutiques, btq)} />
                      </label>
                    ))}
                  </div>
                </FilterAccordion>
              )}

            </div>
          </div>

          {/* ── 10/10 Premium Product Grid ── */}
          <div className="flex-1 min-w-0">
            
            <div className="flex items-end justify-between mb-12">
              <span className="text-[10px] font-bold text-[#111111]/40 tracking-[0.2em] uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {filteredProducts.length} Results
              </span>
            </div>

            <AnimatePresence mode="wait">
              {filteredProducts.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-32 flex flex-col items-center justify-center text-center bg-white border border-[#BCA58A]/10 shadow-sm"
                >
                  <div className="w-16 h-16 rounded-full bg-[#FAF9F6] flex items-center justify-center mb-6">
                    <SlidersHorizontal size={24} className="text-[#BCA58A]/60" />
                  </div>
                  <h3 className="text-3xl font-light text-[#111111] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    No Styles Found
                  </h3>
                  <p className="text-[#111111]/50 text-sm max-w-sm mx-auto mb-8 font-light" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Your refined criteria yielded no results. Try removing some filters to discover our beautiful collection.
                  </p>
                  <button 
                    onClick={clearAllFilters}
                    className="border border-[#111111] text-[#111111] px-8 py-3 text-[10px] tracking-[0.25em] font-bold uppercase hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={activeFilterCount + sortOption}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
                >
                  {filteredProducts.map((p, index) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: (index % 6) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      onClick={() => handleProductClick(p)}
                      className="group flex flex-col cursor-pointer"
                    >
                      {/* Taller Aspect Ratio Image Container */}
                      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#F5F3F0] mb-5 group-hover:shadow-[0_10px_40px_rgb(0,0,0,0.08)] transition-all duration-500 border border-[#111111]/5">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                        />
                        
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                        
                        {/* Elegant floating boutique badge */}
                        <div className="absolute top-4 left-4 z-10">
                          <span className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 text-[9px] font-bold tracking-[0.2em] uppercase text-[#111111] rounded-full shadow-sm">
                            {p.badge || 'Exquisite'}
                          </span>
                        </div>

                        {/* Quick View & Add to Bag Drawer overlay */}
                        <div className="absolute inset-x-3 bottom-3 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20 flex gap-2">
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              addToCart(p, 'M');
                            }}
                            className="flex-1 bg-white/95 backdrop-blur-md text-[#111111] py-3.5 rounded-full text-[10px] font-bold tracking-[0.1em] uppercase flex items-center justify-center gap-2 hover:bg-[#111111] hover:text-white transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-pointer"
                          >
                             <ShoppingBag size={14} /> Add to Bag
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleProductClick(p); }}
                            className="w-12 h-12 bg-white/95 backdrop-blur-md text-[#111111] flex items-center justify-center rounded-full hover:bg-[#BCA58A] hover:text-white transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-pointer"
                          >
                             <Eye size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Typographic Content Below */}
                      <div className="flex flex-col text-left px-2">
                        <h3
                          className="text-[20px] font-medium text-[#111111] leading-tight mb-2 group-hover:text-[#BCA58A] transition-colors truncate"
                          style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                          {p.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-[#6B6B6B] text-[13px] font-medium"
                              style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                              {p.price}
                            </span>
                            {p.originalPrice && (
                              <span
                                className="text-[#A8A8A8] text-[11px] line-through font-medium"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                              >
                                {p.originalPrice}
                              </span>
                            )}
                          </div>
                          {p.rating && (
                            <div className="flex items-center gap-1 bg-[#FAF9F6] px-2 py-1 rounded-full border border-[#BCA58A]/20">
                              <span className="text-[#BCA58A] text-[9px]">★</span>
                              <span className="text-[10px] font-bold text-[#111111]/80 pt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                {p.rating}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
