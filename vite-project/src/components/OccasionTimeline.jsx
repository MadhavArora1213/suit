import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllProducts } from '../utils/adminStore';

const OCCASIONS = [
  { id: 'daily-wear', label: 'Daily Wear' },
  { id: 'casual', label: 'Casual' },
  { id: 'festive', label: 'Festive' },
  { id: 'party', label: 'Party' },
  { id: 'wedding', label: 'Wedding' },
  { id: 'luxury', label: 'Luxury Edit' },
];

const FALLBACK_PRODUCTS = [
  { id: 'fb1', name: 'Elegant Ethnic Suit', price: '₹5,000', image: '/cotton_suit.png' },
  { id: 'fb2', name: 'Designer Kurta Set', price: '₹7,500', image: '/designer_suit_1.png' },
  { id: 'fb3', name: 'Traditional Anarkali', price: '₹9,000', image: '/anarkali_suit.png' },
  { id: 'fb4', name: 'Premium Sharara Set', price: '₹12,000', image: '/sharara_suit.png' },
];

function seededRandom(seed) {
  let s = seed || 1;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function shuffleWithSeed(arr, seed) {
  const shuffled = [...arr];
  const rng = seededRandom(seed);
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function toSlug(name) {
  return (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

let globalSeed = 1;

export default function OccasionTimeline() {
  const [activeOccasion, setActiveOccasion] = useState(OCCASIONS[0].id);
  const [allProducts, setAllProducts] = useState(() => getAllProducts());
  const [seedTick, setSeedTick] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setAllProducts(getAllProducts());
    window.addEventListener('admin-data-updated', handleUpdate);
    return () => window.removeEventListener('admin-data-updated', handleUpdate);
  }, []);

  const reshuffle = useCallback(() => {
    globalSeed = (globalSeed * 9301 + 49297) % 233280;
    setSeedTick(globalSeed);
  }, []);

  const activeProducts = useMemo(() => {
    const pool = allProducts.length > 0 ? allProducts : [];
    if (pool.length === 0) return FALLBACK_PRODUCTS;
    return shuffleWithSeed(pool, seedTick + OCCASIONS.findIndex(o => o.id === activeOccasion)).slice(0, 4);
  }, [allProducts, seedTick, activeOccasion]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveOccasion((current) => {
        const idx = OCCASIONS.findIndex(o => o.id === current);
        return OCCASIONS[(idx + 1) % OCCASIONS.length].id;
      });
      reshuffle();
    }, 4500);
    
    return () => clearInterval(timer);
  }, [reshuffle]);

  const handleOccasionClick = useCallback((id) => {
    setActiveOccasion(id);
    reshuffle();
    const rail = document.getElementById('occasion-product-rail');
    if (rail) {
      const y = rail.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [reshuffle]);

  const activeIndex = OCCASIONS.findIndex(o => o.id === activeOccasion);

  return (
    <section 
      className="py-24 md:py-32 bg-[#FAF9F6] border-y border-[#1A0008]/10 relative overflow-hidden"
    >
      {/* Subtle Ambient Background Flourishes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-[1300px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div>
            <motion.p 
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-[10px] tracking-[0.4em] text-[#D4AF37] uppercase font-bold mb-4" 
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Curated Masterpieces
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} 
              className="text-4xl md:text-5xl lg:text-6xl font-light text-[#1A0008]" 
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Shop by <span className="italic text-[#D4AF37]">Occasion</span>
            </motion.h2>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} 
            className="hidden md:flex items-center gap-4"
          >
             <span className="w-16 h-px bg-[#1A0008]/20" />
             <span className="text-xs text-[#1A0008]/40 uppercase tracking-[0.2em] font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
               Select a moment
             </span>
          </motion.div>
        </div>

        {/* The Luxury Timeline Tracker */}
        <div className="relative w-full mb-32 px-4 md:px-8">
           {/* The Base Track */}
           <div className="absolute top-[16px] left-0 w-full h-[1px] bg-[#1A0008]/10" />

           {/* The Animated Gold Progress Line */}
           <div 
             className="absolute top-[16px] left-0 h-[1.5px] bg-[#D4AF37] transition-all duration-700 ease-in-out z-0" 
             style={{ width: `${(activeIndex / (OCCASIONS.length - 1)) * 100}%` }} 
           />

           <div className="flex justify-between relative z-10">
             {OCCASIONS.map((occasion, idx) => {
               const isActive = activeOccasion === occasion.id;
               
               return (
                 <div 
                   key={occasion.id} 
                   onClick={() => handleOccasionClick(occasion.id)}
                   className="relative flex flex-col items-center cursor-pointer group"
                 >
                   {/* The Diamond Node */}
                   <div className="relative flex items-center justify-center w-8 h-8 mb-6">
                     <div className={`absolute inset-0 bg-[#FAF9F6] transition-all duration-500 ease-out ${isActive ? 'scale-100 rotate-45 border border-[#D4AF37] shadow-md' : 'scale-[0.6] rotate-0 border border-[#1A0008]/20 group-hover:border-[#D4AF37] group-hover:rotate-45'}`} />
                     
                     {/* Inner dot */}
                     <div className={`w-1.5 h-1.5 transition-all duration-500 z-10 ${isActive ? 'bg-[#D4AF37] scale-100' : 'bg-[#1A0008]/20 scale-0 group-hover:scale-100 group-hover:bg-[#D4AF37]/50'}`} style={{ transform: isActive ? 'rotate(-45deg)' : 'rotate(0)' }} />
                     
                     {/* Soft Glow */}
                     {isActive && (
                       <motion.div layoutId="nodeGlow" className="absolute inset-0 bg-[#D4AF37]/30 blur-md rounded-full pointer-events-none" />
                     )}
                   </div>

                   {/* Typography / Labels */}
                   <div className="text-center absolute top-14 w-32 -left-12 flex flex-col items-center">
                     <span className={`block text-[9px] tracking-[0.2em] uppercase transition-all duration-500 ${isActive ? 'text-[#1A0008] font-bold' : 'text-[#1A0008]/40 group-hover:text-[#1A0008]/70'}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                       {occasion.label}
                     </span>
                     <span className={`block mt-2 font-light italic text-xl transition-all duration-500 ${isActive ? 'opacity-100 text-[#D4AF37] translate-y-0' : 'opacity-0 -translate-y-2'}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                       0{idx + 1}
                     </span>
                   </div>
                 </div>
               )
             })}
           </div>
        </div>

        {/* Product Rail Header */}
        <div id="occasion-product-rail" className="relative pt-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
              <div>
                <motion.h3 
                  key={activeOccasion}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-3xl font-light text-[#1A0008]" 
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {OCCASIONS.find(o => o.id === activeOccasion)?.label} <span className="italic text-[#D4AF37]">Edit</span>
                </motion.h3>
              </div>
              <a href="#shop" className="group flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-bold text-[#1A0008] hover:text-[#D4AF37] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                View Full Collection
                <span className="w-6 h-px bg-[#1A0008] group-hover:bg-[#D4AF37] transition-colors" />
              </a>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <AnimatePresence mode="popLayout">
                {activeProducts.map((product, i) => (
                  <motion.div
                    key={`${activeOccasion}-${product.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                    className="group cursor-pointer flex flex-col"
                  >
                    <a href={`/product/${toSlug(product.name)}`} className="block">
                      <div className="relative aspect-[3/4] overflow-hidden bg-[#F0EBE2] mb-5 border border-black/5 group-hover:shadow-2xl transition-all duration-500">
                        <img src={product.image || '/cotton_suit.png'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out" loading="lazy" />
                        
                        {(() => {
                          const priceNum = parseInt(String(product.price).replace(/[^0-9]/g, '')) || product.priceNum || 0;
                          const origNum = parseInt(String(product.originalPrice).replace(/[^0-9]/g, '')) || product.originalPriceNum || 0;
                          const pctOff = origNum > priceNum ? Math.round(((origNum - priceNum) / origNum) * 100) : 0;
                          return pctOff > 0 ? (
                            <span className="absolute top-3 left-3 bg-[#1A0008] text-white text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                              {pctOff}% OFF
                            </span>
                          ) : product.badge ? (
                            <span className="absolute top-3 left-3 bg-[#D4AF37] text-white text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                              {product.badge}
                            </span>
                          ) : null;
                        })()}
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                           <span className="bg-white/95 text-[#1A0008] text-[9px] uppercase tracking-[0.2em] font-bold px-8 py-3.5 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                             Quick View
                           </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[13px] text-[#1A0008] font-medium mb-1.5 line-clamp-1 transition-colors group-hover:text-[#D4AF37]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            {product.name}
                          </h4>
                          <p className="text-[9px] text-[#1A0008]/40 tracking-[0.15em] uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            {OCCASIONS.find(o => o.id === activeOccasion)?.label}
                          </p>
                        </div>
                        <div className="flex flex-col items-end whitespace-nowrap">
                          {(() => {
                            const priceNum = parseInt(String(product.price).replace(/[^0-9]/g, '')) || product.priceNum || 0;
                            const origNum = parseInt(String(product.originalPrice).replace(/[^0-9]/g, '')) || product.originalPriceNum || 0;
                            const hasDiscount = origNum > priceNum;
                            return (
                              <>
                                {hasDiscount && (
                                  <span className="text-[#1A0008]/40 text-[11px] line-through" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                    {product.originalPrice || `₹${origNum.toLocaleString('en-IN')}`}
                                  </span>
                                )}
                                <span className="text-[#1A0008] text-[15px] font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                  {product.price || `₹${priceNum.toLocaleString('en-IN')}`}
                                </span>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </a>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
        </div>
      </div>
    </section>
  );
}
