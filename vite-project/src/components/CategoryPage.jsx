import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShoppingBag, Eye, SlidersHorizontal, Check, ChevronDown, ChevronUp, Heart } from 'lucide-react';
import { getAllProducts, getCategories } from '../utils/adminStore';

function FilterAccordion({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#1A0008]/10 pb-5 mb-5">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full text-left group cursor-pointer">
        <h4 className="text-[12px] font-bold tracking-[0.15em] text-[#1A0008] uppercase group-hover:text-[#D4AF37] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>{title}</h4>
        {isOpen ? <ChevronUp size={14} className="text-[#D4AF37] transition-colors" /> : <ChevronDown size={14} className="text-[#1A0008]/50 group-hover:text-[#D4AF37] transition-colors" />}
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

export default function CategoryPage({ categoryName, setView, setSelectedProduct, addToCart, favorites = {}, toggleFavorite }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sort
  const [sortOption, setSortOption] = useState('newest');

  // Filters
  const [selectedBoutiques, setSelectedBoutiques] = useState([]);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(null);
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

  const catProducts = useMemo(() => {
    return products.filter(p => (p.image || p.coverImage));
  }, [products]);

  const banner = {
    title: currentCat?.name || categoryName,
    subtitle: currentCat?.subtitle || 'Curated Collection',
    desc: currentCat?.tagline || `Explore ${catProducts.length > 0 ? catProducts.length + ' handpicked' : 'our exclusive'} ${categoryName} — crafted with love from India's finest heritage boutiques.`,
    bgImage: (catProducts.length > 0 ? (catProducts[0].image || catProducts[0].coverImage) : null) || currentCat?.image || '/designer_suit_1.png',
    bgImage2: (catProducts.length > 1 ? (catProducts[1].image || catProducts[1].coverImage) : null) || currentCat?.image2 || '/anarkali_suit.png'
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    let timeoutId;

    const fetchAndFilterProducts = () => {
      const all = getAllProducts();
      let finalProducts = [];
      if (categoryName === 'All') {
        finalProducts = all;
      } else {
        finalProducts = all.filter(p => {
          const typeMatch = (p.type || p.suitType || '').toLowerCase().includes(categoryName.toLowerCase());
          const colMatch = (p.collection || '').toLowerCase().includes(categoryName.toLowerCase());
          const catMatch = (p.category || '').toLowerCase().includes(categoryName.toLowerCase());
          const nameMatch = (p.name || p.title || '').toLowerCase().includes(categoryName.toLowerCase());
          return typeMatch || colMatch || catMatch || nameMatch;
        });
      }
      setProducts(finalProducts);

      clearTimeout(timeoutId);
      if (finalProducts.length > 0) {
        setLoading(false);
      } else {
        if (window.isLiveSyncComplete) {
          setLoading(false);
        } else {
          timeoutId = setTimeout(() => setLoading(false), 8000);
        }
      }
    };

    fetchAndFilterProducts();

    window.addEventListener('admin-data-updated', fetchAndFilterProducts);
    return () => {
      window.removeEventListener('admin-data-updated', fetchAndFilterProducts);
      clearTimeout(timeoutId);
    };
  }, [categoryName]);

  const boutiques = useMemo(() => [...new Set(products.map(p => p.boutique).filter(Boolean))], [products]);

  const fabricsList = useMemo(() => {
    const f = new Set();
    products.forEach(p => {
      if (p.fabricName) f.add(p.fabricName.trim());
    });
    return [...f].filter(Boolean).sort();
  }, [products]);

  const occasionsList = useMemo(() => {
    const o = new Set();
    products.forEach(p => {
      if (p.occasions && Array.isArray(p.occasions)) {
        p.occasions.forEach(occ => o.add(occ.trim()));
      }
    });
    return [...o].filter(Boolean).sort();
  }, [products]);

  const sizesList = useMemo(() => {
    const s = new Set();
    products.forEach(p => {
      if (p.sizes && Array.isArray(p.sizes)) p.sizes.forEach(sz => s.add(sz.trim()));
      if (p.fitOptions && Array.isArray(p.fitOptions)) p.fitOptions.forEach(sz => s.add(sz.trim()));
    });
    const order = ['Unstitched', 'Semi-Stitched', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL'];
    return [...s].filter(Boolean).sort((a, b) => {
      let idxA = order.indexOf(a);
      let idxB = order.indexOf(b);
      if (idxA === -1) idxA = 999;
      if (idxB === -1) idxB = 999;
      if (idxA === 999 && idxB === 999) return a.localeCompare(b);
      return idxA - idxB;
    });
  }, [products]);

  const { globalMinPrice, globalMaxPrice } = useMemo(() => {
    if (products.length === 0) return { globalMinPrice: 1000, globalMaxPrice: 10000 };
    let min = Infinity;
    let max = -Infinity;
    products.forEach(p => {
      const price = p.priceNum || parseInt((p.price || '0').toString().replace(/[^\d]/g, ''), 10) || 0;
      if (price < min) min = price;
      if (price > max) max = price;
    });
    if (min === Infinity || min > 1000) min = 1000;
    if (max === -Infinity || max < 10000) max = 10000;
    if (min === max) max = min + 1000;
    return { globalMinPrice: min, globalMaxPrice: max };
  }, [products]);

  const baseColors = [
    { name: 'Red', hex: '#E74C3C' }, { name: 'Blue', hex: '#3498DB' }, { name: 'Green', hex: '#2ECC71' },
    { name: 'Pink', hex: '#F1948A' }, { name: 'Black', hex: '#1A0008' }, { name: 'White', hex: '#FFFFFF' },
    { name: 'Yellow', hex: '#F1C40F' }, { name: 'Wine', hex: '#722F37' }, { name: 'Maroon', hex: '#800000' },
    { name: 'Purple', hex: '#8E44AD' }, { name: 'Peach', hex: '#FFCBA4' }, { name: 'Orange', hex: '#E67E22' },
    { name: 'Beige', hex: '#F5F5DC' }, { name: 'Mustard', hex: '#FFDB58' }, { name: 'Olive', hex: '#808000' },
    { name: 'Teal', hex: '#008080' }, { name: 'Navy', hex: '#000080' }, { name: 'Grey', hex: '#7F8C8D' },
    { name: 'Brown', hex: '#8B4513' }, { name: 'Gold', hex: '#FFD700' }, { name: 'Silver', hex: '#C0C0C0' },
    { name: 'Ivory', hex: '#FFFFF0' }, { name: 'Magenta', hex: '#FF00FF' }, { name: 'Lavender', hex: '#E6E6FA' },
    { name: 'Turquoise', hex: '#40E0D0' }, { name: 'Coral', hex: '#FF7F50' }, { name: 'Mint', hex: '#98FF98' },
    { name: 'Indigo', hex: '#4B0082' }, { name: 'Rose', hex: '#FF007F' }, { name: 'Cyan', hex: '#00FFFF' }
  ];

  const colorsList = useMemo(() => {
    const c = new Set();
    products.forEach(p => {
      if (p.color) {
        p.color.split(',').forEach(col => {
          if (col.trim()) c.add(col.trim().toLowerCase());
        });
      }
      if (p.colorVariants) {
        Object.values(p.colorVariants).forEach(v => {
          if (v.name) c.add(v.name.trim().toLowerCase());
        });
      }
    });

    return [...c].filter(Boolean).map(color => color.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')).sort();
  }, [products]);

  const toggleFilter = (setter, value) => {
    setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const clearAllFilters = () => {
    setSelectedBoutiques([]);
    setSelectedMaxPrice(null);
    setSelectedFabrics([]);
    setSelectedColors([]);
    setSelectedOccasions([]);
    setSelectedSizes([]);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedBoutiques.length > 0) result = result.filter(p => selectedBoutiques.includes(p.boutique));

    if (selectedMaxPrice !== null) {
      result = result.filter(p => {
        const price = p.priceNum || parseInt((p.price || '0').toString().replace(/[^\d]/g, ''), 10) || 0;
        return price <= selectedMaxPrice;
      });
    }

    const getText = (p) => `${p.name || ''} ${p.desc || ''} ${p.shortDesc || ''} ${p.type || ''} ${p.suitType || ''} ${p.collection || ''} ${p.fabricDetails || ''} ${p.fabricName || ''}`.toLowerCase();

    if (selectedFabrics.length > 0) {
      result = result.filter(p => selectedFabrics.some(f =>
        (p.fabricName && p.fabricName.toLowerCase().includes(f.toLowerCase())) ||
        getText(p).includes(f.toLowerCase())
      ));
    }
    if (selectedColors.length > 0) {
      result = result.filter(p => selectedColors.some(c => {
        // Match explicit color field
        if (p.color && p.color.toLowerCase().includes(c.toLowerCase())) return true;
        // Match legacy text
        const regex = new RegExp(`\\b${c}\\b`, 'i');
        return regex.test(getText(p));
      }));
    }
    if (selectedOccasions.length > 0) {
      result = result.filter(p => selectedOccasions.some(o =>
        (p.occasions && p.occasions.map(x => x.toLowerCase()).includes(o.toLowerCase())) ||
        getText(p).includes(o.toLowerCase())
      ));
    }
    if (selectedSizes.length > 0) {
      result = result.filter(p => selectedSizes.some(s =>
        (p.sizes && p.sizes.map(x => x.toLowerCase()).includes(s.toLowerCase())) ||
        (p.fitOptions && p.fitOptions.map(x => x.toLowerCase()).includes(s.toLowerCase())) ||
        getText(p).includes(s.toLowerCase())
      ));
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
  }, [products, selectedBoutiques, selectedMaxPrice, selectedFabrics, selectedColors, selectedOccasions, selectedSizes, sortOption]);

  const activeFilterCount = selectedBoutiques.length + (selectedMaxPrice !== null ? 1 : 0) + selectedFabrics.length + selectedColors.length + selectedOccasions.length + selectedSizes.length;

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setView('product-details');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] mt-[110px] selection:bg-[#D4AF37] selection:text-white">

      <div className="relative w-full max-w-[1800px] mx-auto px-6 md:px-12 pt-4 pb-6 overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12 relative">

          <div className="w-full lg:w-1/2 flex flex-col justify-center z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-px bg-[#D4AF37]" />
                <span className="text-[#D4AF37] text-[10px] tracking-[0.4em] uppercase font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {banner.subtitle}
                </span>
              </div>

              <h1 className="text-6xl md:text-[80px] font-light text-[#1A0008] leading-[0.85] tracking-tight mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {banner.title}
              </h1>

              <p className="text-[#1A0008]/70 text-xs md:text-sm leading-relaxed mb-8 max-w-md font-light line-clamp-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {banner.desc}
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <button
                  onClick={() => document.getElementById('collection-start')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group relative inline-flex items-center gap-4 w-max cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full border border-[#D4AF37] flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors duration-500">
                    <ArrowRight size={14} className="text-[#D4AF37] group-hover:text-white transition-colors duration-500" />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#1A0008] group-hover:text-[#D4AF37] transition-colors duration-500">
                    Explore Collection
                  </span>
                </button>

              </div>
            </motion.div>
          </div>

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

      <div id="collection-start" className="max-w-[1800px] mx-auto px-6 md:px-12 pt-2 pb-32">
        <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">

          <div className="w-full lg:w-[260px] shrink-0">
            <div className="sticky top-[120px] max-h-[calc(100vh-140px)] overflow-y-auto pr-4 pb-10 scrollbar-thin scrollbar-thumb-[#D4AF37]/30 scrollbar-track-transparent">

              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <SlidersHorizontal size={14} className="text-[#D4AF37]" />
                  <h3 className="text-[11px] tracking-[0.3em] uppercase font-bold text-[#1A0008]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Refine By
                  </h3>
                </div>
                {activeFilterCount > 0 && (
                  <button onClick={clearAllFilters} className="text-[9px] text-[#1A0008] font-bold uppercase tracking-wider hover:text-[#D4AF37] cursor-pointer">
                    Clear All
                  </button>
                )}
              </div>

              <FilterAccordion title="Sort Collection" defaultOpen={false}>
                <div className="flex flex-col gap-4">
                  {[
                    { id: 'newest', label: 'Latest Arrivals' },
                    { id: 'price-low', label: 'Price: Ascending' },
                    { id: 'price-high', label: 'Price: Descending' },
                    { id: 'rating', label: 'Most Loved' }
                  ].map((sort) => (
                    <label key={sort.id} className="flex items-center gap-4 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <div className={`w-[14px] h-[14px] rounded-full border transition-all duration-300 ${sortOption === sort.id ? 'border-[#D4AF37]' : 'border-[#1A0008]/20 group-hover:border-[#D4AF37]/50'}`} />
                        <div className={`absolute w-1.5 h-1.5 rounded-full bg-[#D4AF37] transition-all duration-300 ${sortOption === sort.id ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
                      </div>
                      <span className={`text-[13px] transition-colors duration-300 ${sortOption === sort.id ? 'text-[#1A0008] font-medium' : 'text-[#1A0008]/60 group-hover:text-[#1A0008]'}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {sort.label}
                      </span>
                      <input type="radio" className="hidden" checked={sortOption === sort.id} onChange={() => setSortOption(sort.id)} />
                    </label>
                  ))}
                </div>
              </FilterAccordion>

              <FilterAccordion title="Price Point" defaultOpen={false}>
                <div className="pt-2 pb-4 px-1">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs text-[#1A0008]/60 font-medium font-sans">₹{globalMinPrice.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-[#1A0008] font-bold font-sans">
                      ₹{(selectedMaxPrice !== null ? selectedMaxPrice : globalMaxPrice).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={globalMinPrice}
                    max={globalMaxPrice}
                    step={100}
                    value={selectedMaxPrice !== null ? selectedMaxPrice : globalMaxPrice}
                    onChange={(e) => setSelectedMaxPrice(Number(e.target.value))}
                    className="w-full h-1 bg-[#D4AF37]/30 rounded-lg appearance-none cursor-pointer focus:outline-none"
                    style={{ accentColor: '#1A0008' }}
                  />
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-[9px] text-[#1A0008]/40 uppercase tracking-widest font-bold">Min</span>
                    <span className="text-[9px] text-[#1A0008]/40 uppercase tracking-widest font-bold">Max</span>
                  </div>
                </div>
              </FilterAccordion>

              <FilterAccordion title="Size" defaultOpen={false}>
                <div className="flex flex-wrap gap-2">
                  {sizesList.map(s => (
                    <button key={s} onClick={() => toggleFilter(setSelectedSizes, s)}
                      className={`px-3 py-1.5 border text-[11px] font-medium transition-colors cursor-pointer ${selectedSizes.includes(s) ? 'border-[#1A0008] bg-[#1A0008] text-white' : 'border-[#D4AF37]/30 text-[#6B6B6B] hover:border-[#1A0008]'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </FilterAccordion>

              {fabricsList.length > 0 && (
                <FilterAccordion title="Fabric" defaultOpen={false}>
                  <div className="space-y-4">
                    {fabricsList.map(f => (
                      <label key={f} className="flex items-center gap-4 cursor-pointer group">
                        <div className={`w-3.5 h-3.5 flex items-center justify-center transition-all duration-300 border ${selectedFabrics.includes(f) ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-[#1A0008]/20 group-hover:border-[#D4AF37]/50'}`}>
                          <Check size={10} className={`text-white transition-opacity ${selectedFabrics.includes(f) ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
                        </div>
                        <span className={`text-[13px] transition-colors duration-300 ${selectedFabrics.includes(f) ? 'text-[#1A0008] font-medium' : 'text-[#1A0008]/60 group-hover:text-[#1A0008]'}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {f}
                        </span>
                        <input type="checkbox" className="hidden" checked={selectedFabrics.includes(f)} onChange={() => toggleFilter(setSelectedFabrics, f)} />
                      </label>
                    ))}
                  </div>
                </FilterAccordion>
              )}

              {colorsList.length > 0 && (
                <FilterAccordion title="Color" defaultOpen={false}>
                  <div className="flex flex-wrap gap-2">
                    {colorsList.map(c => {
                      const isSelected = selectedColors.includes(c);
                      return (
                        <button key={c} onClick={() => toggleFilter(setSelectedColors, c)}
                          className={`px-3 py-1.5 border text-[11px] font-medium transition-colors cursor-pointer ${isSelected ? 'border-[#1A0008] bg-[#1A0008] text-white' : 'border-[#D4AF37]/30 text-[#6B6B6B] hover:border-[#1A0008]'}`}>
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </FilterAccordion>
              )}

              {/* Accordion: Occasion */}
              <FilterAccordion title="Occasion" defaultOpen={false}>
                <div className="space-y-4">
                  {occasionsList.map(o => (
                    <label key={o} className="flex items-center gap-4 cursor-pointer group">
                      <div className={`w-3.5 h-3.5 flex items-center justify-center transition-all duration-300 border ${selectedOccasions.includes(o) ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-[#1A0008]/20 group-hover:border-[#D4AF37]/50'}`}>
                        <Check size={10} className={`text-white transition-opacity ${selectedOccasions.includes(o) ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
                      </div>
                      <span className={`text-[13px] transition-colors duration-300 ${selectedOccasions.includes(o) ? 'text-[#1A0008] font-medium' : 'text-[#1A0008]/60 group-hover:text-[#1A0008]'}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
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
                        <div className={`w-3.5 h-3.5 flex items-center justify-center transition-all duration-300 border ${selectedBoutiques.includes(btq) ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-[#1A0008]/20 group-hover:border-[#D4AF37]/50'}`}>
                          <Check size={10} className={`text-white transition-opacity ${selectedBoutiques.includes(btq) ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
                        </div>
                        <span className={`text-[13px] transition-colors duration-300 ${selectedBoutiques.includes(btq) ? 'text-[#1A0008] font-medium' : 'text-[#1A0008]/60 group-hover:text-[#1A0008]'}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
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
              <span className="text-[10px] font-bold text-[#1A0008]/40 tracking-[0.2em] uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {filteredProducts.length} Results
              </span>
            </div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
                >
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="flex flex-col animate-pulse">
                      <div className="relative aspect-[4/5] bg-[#E8DDD0]/50 rounded-2xl mb-5 border border-[#1A0008]/5"></div>
                      <div className="h-6 bg-[#E8DDD0]/50 rounded w-3/4 mb-2 mt-2"></div>
                      <div className="h-4 bg-[#E8DDD0]/50 rounded w-1/3 mb-1"></div>
                    </div>
                  ))}
                </motion.div>
              ) : filteredProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-32 flex flex-col items-center justify-center text-center bg-white border border-[#D4AF37]/10 shadow-sm"
                >
                  <div className="w-16 h-16 rounded-full bg-[#FAF9F6] flex items-center justify-center mb-6">
                    <SlidersHorizontal size={24} className="text-[#D4AF37]/60" />
                  </div>
                  <h3 className="text-3xl font-light text-[#1A0008] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    No Styles Found
                  </h3>
                  <p className="text-[#1A0008]/50 text-sm max-w-sm mx-auto mb-8 font-light" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Your refined criteria yielded no results. Try removing some filters to discover our beautiful collection.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="border border-[#1A0008] text-[#1A0008] px-8 py-3 text-[10px] tracking-[0.25em] font-bold uppercase hover:bg-[#1A0008] hover:text-white transition-colors cursor-pointer"
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
                      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#F5F3F0] mb-5 group-hover:shadow-[0_10px_40px_rgb(0,0,0,0.08)] transition-all duration-500 border border-[#1A0008]/5">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

                        {/* Diagonal Premium Sash */}
                        {p.badge && (
                          <div className="absolute top-0 left-0 overflow-hidden w-28 h-28 z-20 rounded-tl-2xl pointer-events-none">
                            <div className="absolute top-5 -left-8 w-[150px] bg-gradient-to-r from-[#8B1A1A] to-[#601010] text-[#FAF9F6] text-[8px] font-black tracking-[0.25em] uppercase py-1.5 text-center shadow-lg border-y border-[#D4AF37]/40" style={{ transform: "rotate(-45deg)" }}>
                              {p.badge}
                            </div>
                          </div>
                        )}

                        <div className="absolute top-4 right-4 z-10">
                          <button onClick={(e) => { e.stopPropagation(); toggleFavorite(p.id); }}
                            className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-full shadow-sm flex items-center justify-center hover:scale-110 transition-transform text-gray-900 cursor-pointer">
                            <Heart size={16} className={favorites[p.id] ? 'fill-red-500 text-red-500' : ''} />
                          </button>
                        </div>

                        {/* Quick View & Add to Bag Drawer overlay */}
                        <div className="absolute inset-x-3 bottom-3 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20 flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(p, p.fitOptions?.includes('Unstitched') ? 'Unstitched' : (p.fitOptions?.includes('Semi-Stitched') ? 'Semi-Stitched' : (p.sizes?.length > 0 ? `Stitched - ${p.sizes[0]}` : 'Stitched')));
                            }}
                            className="flex-1 bg-white/95 backdrop-blur-md text-[#1A0008] py-3.5 rounded-full text-[10px] font-bold tracking-[0.1em] uppercase flex items-center justify-center gap-2 hover:bg-[#1A0008] hover:text-white transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-pointer"
                          >
                            <ShoppingBag size={14} /> Add to Bag
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleProductClick(p); }}
                            className="w-12 h-12 bg-white/95 backdrop-blur-md text-[#1A0008] flex items-center justify-center rounded-full hover:bg-[#D4AF37] hover:text-white transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-pointer"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Typographic Content Below */}
                      <div className="flex flex-col text-left px-2">
                        <h3
                          className="text-[20px] font-medium text-[#1A0008] leading-tight mb-2 group-hover:text-[#D4AF37] transition-colors truncate"
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
                            <div className="flex items-center gap-1 bg-[#FAF9F6] px-2 py-1 rounded-full border border-[#D4AF37]/20">
                              <span className="text-[#D4AF37] text-[9px]">★</span>
                              <span className="text-[10px] font-bold text-[#1A0008]/80 pt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
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
