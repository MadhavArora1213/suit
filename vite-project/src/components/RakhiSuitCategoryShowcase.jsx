import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useMotionTemplate } from 'framer-motion';
import { getAllProducts } from '../utils/adminStore';

function Showcase3DCard({ product, index, favorites, toggleFavorite, setQuickViewProduct, addToCart, handleCardClick }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const isFav = favorites?.[product.id];

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left - width / 2);
    mouseY.set(clientY - top - height / 2);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, delay: (index % 8) * 0.05, ease: "easeOut" }}
      className="group cursor-pointer flex flex-col relative bg-transparent [perspective:1200px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
      onClick={() => handleCardClick(product)}
    >
      <motion.div 
        style={{
          rotateX: useTransform(mouseY, [-250, 250], [8, -8]),
          rotateY: useTransform(mouseX, [-250, 250], [-8, 8]),
          transformStyle: "preserve-3d"
        }}
        className="relative w-full aspect-[3/4] overflow-hidden rounded-[20px] bg-white shadow-[0_10px_30px_rgba(26,0,8,0.06)] group-hover:shadow-[0_30px_60px_rgba(212,175,55,0.2)] transition-shadow duration-700 border-[8px] border-white"
      >
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-all duration-[2s] group-hover:scale-110 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" 
        />
        
        {/* Holographic Shine Effect */}
        <motion.div 
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-overlay"
          style={{
            background: useMotionTemplate`radial-gradient(circle at ${useTransform(mouseX, [-200, 200], [0, 100])}% ${useTransform(mouseY, [-200, 200], [0, 100])}%, rgba(255,255,255,0.4) 0%, transparent 60%)`
          }}
        />

        {/* 3D Floating Elements */}
        <div className="absolute inset-0 z-10 p-4 flex flex-col justify-between pointer-events-none" style={{ transform: "translateZ(40px)" }}>
          
          <div className="flex justify-between items-start w-full">
            {product.badge ? (
              <span className="bg-[#1A0008] text-[#D4AF37] text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg pointer-events-auto">
                {product.badge}
              </span>
            ) : <span/>}
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (toggleFavorite) toggleFavorite(product.id);
              }}
              className="p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:scale-110 transition-transform pointer-events-auto border border-gray-100"
            >
              {isFav ? (
                <svg className="w-4 h-4 fill-current text-[#8B1A1A]" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              ) : (
                <svg className="w-4 h-4 fill-none stroke-[#1A0008] stroke-[1.5]" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              )}
            </button>
          </div>

          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0 ease-[0.25,1,0.5,1]">
             <button
                onClick={(e) => { e.stopPropagation(); setQuickViewProduct(product); }}
                className="flex-1 py-3 bg-white/95 backdrop-blur-md text-[#1A0008] text-[9px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-[#D4AF37] hover:text-white transition-colors pointer-events-auto shadow-xl"
             >
               View
             </button>
             <button
                onClick={(e) => { e.stopPropagation(); if (addToCart) addToCart(product); }}
                className="flex-1 py-3 bg-[#1A0008] text-[#D4AF37] text-[9px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-[#D4AF37] hover:text-white transition-colors pointer-events-auto shadow-xl"
             >
               Add
             </button>
          </div>
        </div>
      </motion.div>
      
      {/* Product Details (No 3D effect to keep it readable) */}
      <div className="pt-5 pb-2 px-2 flex flex-col items-center text-center">
        <span className="text-[9px] text-[#D4AF37] font-black uppercase tracking-[0.25em] mb-2 flex items-center gap-2">
          <span className="w-2 h-[1px] bg-[#D4AF37]/50" />
          {product.boutique || 'Artisan Collection'}
          <span className="w-2 h-[1px] bg-[#D4AF37]/50" />
        </span>
        <h3 className="text-[1.2rem] text-[#1A0008] leading-tight mb-2 group-hover:text-[#D4AF37] transition-colors line-clamp-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {product.name}
        </h3>
        <div className="flex items-center justify-center gap-3">
          {product.originalPrice && <span className="text-[11px] text-gray-400 line-through font-light tracking-wide">{product.originalPrice}</span>}
          <span className="text-[14px] font-bold text-[#1A0008] tracking-widest">{product.price}</span>
        </div>
      </div>
    </motion.div>
  );
}

const CATEGORIES = [
  { id: 'all', label: 'All Festive Collection' },
  { id: 'suits', label: 'Designer Suits', type: 'Patiala' },
  { id: 'rakhi', label: 'Rakhi Specials', type: 'Rakhi Collection' },
  { id: 'kids', label: 'Bacheya Ki Rakhi', type: 'Kids Rakhi' },
  { id: 'kashmiri', label: 'Girls Kashmiri Churi', type: 'Kashmiri Churi' },
  { id: 'kadas', label: 'Girls Designer Kadas', type: 'Designer Kadas' },
  { id: 'hampers', label: 'Gift Box Hampers', type: 'Gift Box' },
];

export default function RakhiSuitCategoryShowcase({ setView, setSelectedProduct, addToCart, toggleFavorite, favorites }) {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    setProducts(getAllProducts());
    const handleUpdate = () => setProducts(getAllProducts());
    window.addEventListener('admin-data-updated', handleUpdate);
    return () => window.removeEventListener('admin-data-updated', handleUpdate);
  }, []);

  const getFilteredProducts = () => {
    if (activeTab === 'all') {
      // Create a visually balanced mix of categories for the 'All' tab
      const suits = [];
      const rakhis = [];
      const kids = [];
      const hampers = [];
      const kadas = [];
      const others = [];

      products.forEach(p => {
        const pCat = (p.category || '').toLowerCase();
        const pType = (p.type || '').toLowerCase();
        const pName = (p.name || '').toLowerCase();

        if (pType.includes('patiala') || pType.includes('suit') || pCat.includes('suit') || pName.includes('suit')) {
          suits.push(p);
        } else if (pCat.includes('kids') || pName.includes('kids') || pType.includes('kids')) {
          kids.push(p);
        } else if (pCat.includes('rakhi') || pType.includes('rakhi') || pName.includes('rakhi')) {
          rakhis.push(p);
        } else if (pCat.includes('box') || pCat.includes('hamper') || pName.includes('box')) {
          hampers.push(p);
        } else if (pCat.includes('kada') || pName.includes('kada') || pName.includes('churi') || pCat.includes('kashmiri')) {
          kadas.push(p);
        } else {
          others.push(p);
        }
      });

      const mixed = [];
      const seen = new Set();
      const tryAdd = (item) => {
        if (item && !seen.has(item.id)) {
          mixed.push(item);
          seen.add(item.id);
        }
      };

      // Interleave items to ensure variety in the top 20
      const maxLen = Math.max(suits.length, rakhis.length, kids.length, hampers.length, kadas.length, others.length);
      for (let i = 0; i < maxLen; i++) {
        tryAdd(suits[i]);
        tryAdd(rakhis[i]);
        tryAdd(kids[i]);
        tryAdd(hampers[i]);
        tryAdd(kadas[i]);
        tryAdd(others[i]);
      }
      return mixed;
    }

    return products.filter(p => {
      const pCat = (p.category || '').toLowerCase();
      const pType = (p.type || '').toLowerCase();
      const pColl = (p.collection || '').toLowerCase();
      const pName = (p.name || '').toLowerCase();

      if (activeTab === 'suits') {
        return ['anarkali', 'patiala', 'banarasi', 'chikankari', 'sharara', 'pakistani', 'kashmiri', 'designer suits', 'suit'].some(k => pType.includes(k) || pCat.includes(k) || pName.includes(k));
      }
      if (activeTab === 'rakhi') {
        return pCat.includes('rakhi') || pColl.includes('rakhi') || pName.includes('rakhi') || pType.includes('rakhi');
      }
      if (activeTab === 'kids') {
        return pCat.includes('kids') || pColl.includes('kids') || pName.includes('kids') || pType.includes('kids');
      }
      if (activeTab === 'kashmiri') {
        return pCat.includes('kashmiri') || pColl.includes('kashmiri') || pName.includes('kashmiri') || pName.includes('churi');
      }
      if (activeTab === 'kadas') {
        return pCat.includes('kada') || pColl.includes('kada') || pName.includes('kada') || pType.includes('kada');
      }
      if (activeTab === 'hampers') {
        return pCat.includes('box') || pCat.includes('hamper') || pColl.includes('box') || pName.includes('box') || pName.includes('hamper');
      }
      return true;
    });
  };

  const filteredProducts = getFilteredProducts().slice(0, 20);

  const handleCardClick = (product) => {
    if (setSelectedProduct) setSelectedProduct(product);
    if (setView) setView('product-details');
  };

  return (
    <section className="w-full py-20 bg-gradient-to-b from-[#FAF9F6] via-white to-[#FAF9F6] border-b border-gray-200/80 relative overflow-hidden">
      
      {/* Subtle Background Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8B1A1A]/10 border border-[#8B1A1A]/30 text-[#8B1A1A] text-xs font-bold uppercase tracking-[0.25em] mb-3">
            <span>✨</span> Handcrafted Festival Edition
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#1A0008] tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Explore <span className="italic text-[#8B1A1A] font-normal">Rakhi & Ethnic Collections</span>
          </h2>
          <p className="text-gray-600 text-xs md:text-sm mt-3 max-w-xl mx-auto font-light leading-relaxed">
            Discover exquisite Suits, Kids Rakhis, Kashmiri Churi Bangles, Designer Gold Kadas, and Luxury Audio QR Gift Hampers.
          </p>
        </div>

        {/* Minimalist Editorial Tabs Bar */}
        <div className="w-full flex justify-center mb-16">
          <div className="flex items-center gap-8 md:gap-12 overflow-x-auto pb-4 max-w-full no-scrollbar border-b border-[#1A0008]/10 px-4 md:px-8">
            {CATEGORIES.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`shrink-0 text-[10px] md:text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-500 relative pb-2 ${
                    isActive
                      ? 'text-[#1A0008]'
                      : 'text-gray-400 hover:text-[#1A0008]/70'
                  }`}
                >
                  {cat.label}
                  {isActive && (
                    <motion.div layoutId="activeCategoryTab" className="absolute -bottom-[17px] left-0 right-0 h-[1.5px] bg-[#D4AF37]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Holographic 3D Cards Grid */}
        <div className="w-full relative z-10 px-2 md:px-0">
          <motion.div layout className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 pt-8 pb-24">
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <Showcase3DCard 
                  key={product.id} 
                  product={product} 
                  index={index}
                  favorites={favorites} 
                  toggleFavorite={toggleFavorite} 
                  setQuickViewProduct={setQuickViewProduct} 
                  addToCart={addToCart} 
                  handleCardClick={handleCardClick}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#D4AF37]/50 relative"
            >
              <button 
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold flex items-center justify-center"
              >
                ✕
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="aspect-[4/5] bg-gray-100">
                  <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover" />
                </div>

                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-[#8B1A1A] font-bold uppercase tracking-widest">{quickViewProduct.category || 'Festive Collection'}</span>
                    <h3 className="text-2xl font-bold text-[#1A0008] mt-1 mb-2 font-serif">{quickViewProduct.name}</h3>
                    <div className="text-xl font-bold text-[#8B1A1A] mb-3">{quickViewProduct.price} <span className="text-xs text-gray-400 line-through font-normal">{quickViewProduct.originalPrice}</span></div>
                    
                    <p className="text-xs text-gray-600 mb-4">{quickViewProduct.shortDesc || quickViewProduct.fabricDetails}</p>

                    {quickViewProduct.sizes && (
                      <div className="mb-4">
                        <span className="text-xs font-bold text-gray-700 block mb-1">Available Sizes:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {quickViewProduct.sizes.map((sz) => (
                            <span key={sz} className="text-[11px] px-2.5 py-1 bg-gray-100 rounded-md font-medium text-gray-700 border border-gray-200">{sz}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                        if (addToCart) addToCart(quickViewProduct);
                        setQuickViewProduct(null);
                      }}
                      className="flex-1 py-3 bg-[#1A0008] hover:bg-[#8B1A1A] text-[#F5D76E] text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg"
                    >
                      Add To Bag
                    </button>
                    <button
                      onClick={() => {
                        if (setSelectedProduct) setSelectedProduct(quickViewProduct);
                        if (setView) setView('product-details');
                        setQuickViewProduct(null);
                      }}
                      className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-all"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
