import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllProducts } from '../utils/adminStore';

const COLOR_MAP = {
  'lavender': { hex: '#D6CADD', image: '/lavender_generated.png' },
  'purple': { hex: '#6B3A6B', image: '/lavender_generated.png' },
  'wine': { hex: '#5B2A34', image: '/wine_generated.png' },
  'maroon': { hex: '#6B1D1D', image: '/wine_generated.png' },
  'red': { hex: '#8B1A1A', image: '/wine_generated.png' },
  'black': { hex: '#1A1A1A', image: '/black_generated.png' },
  'green': { hex: '#1E3F33', image: '/bottle_green_generated.png' },
  'bottle green': { hex: '#1E3F33', image: '/bottle_green_generated.png' },
  'emerald': { hex: '#1E6B3F', image: '/bottle_green_generated.png' },
  'yellow': { hex: '#E2C792', image: '/yellow_generated.png' },
  'mustard': { hex: '#C4A236', image: '/yellow_generated.png' },
  'gold': { hex: '#D4AF37', image: '/yellow_generated.png' },
  'blue': { hex: '#2B4C7E', image: '/lavender_generated.png' },
  'navy': { hex: '#1A2744', image: '/black_generated.png' },
  'pink': { hex: '#D4849B', image: '/lavender_generated.png' },
  'peach': { hex: '#E8B4A0', image: '/lavender_generated.png' },
  'white': { hex: '#F5F5F0', image: '/designer_suit_1.png' },
  'ivory': { hex: '#FFFFF0', image: '/designer_suit_1.png' },
  'beige': { hex: '#D4C5A9', image: '/designer_suit_1.png' },
  'grey': { hex: '#808080', image: '/black_generated.png' },
  'gray': { hex: '#808080', image: '/black_generated.png' },
  'orange': { hex: '#D4721A', image: '/yellow_generated.png' },
  'rust': { hex: '#B7472A', image: '/wine_generated.png' },
  'teal': { hex: '#2E8B8B', image: '/bottle_green_generated.png' },
  'brown': { hex: '#6B4226', image: '/wine_generated.png' },
  'mauve': { hex: '#915F6D', image: '/lavender_generated.png' },
};

function getColorInfo(colorName) {
  if (!colorName) return null;
  const lower = colorName.toLowerCase().trim();
  if (COLOR_MAP[lower]) return { name: colorName.trim(), ...COLOR_MAP[lower] };
  for (const [key, val] of Object.entries(COLOR_MAP)) {
    if (lower.includes(key) || key.includes(lower)) return { name: colorName.trim(), ...val };
  }
  return { name: colorName.trim(), hex: '#8B7355', image: '/designer_suit_1.png' };
}

export default function ShopByColor({ setView, setSelectedCategory }) {
  const navigate = useNavigate();
  const [activeColorId, setActiveColorId] = useState(null);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    setAllProducts(getAllProducts());
    const handler = () => setAllProducts(getAllProducts());
    window.addEventListener('admin-data-updated', handler);
    window.addEventListener('gurnaaz-firebase-updated', handler);
    return () => {
      window.removeEventListener('admin-data-updated', handler);
      window.removeEventListener('gurnaaz-firebase-updated', handler);
    };
  }, []);

  const COLORS = useMemo(() => {
    const colorCounts = {};
    allProducts.forEach(p => {
      const colorName = (p.color || '').trim();
      if (!colorName) return;
      const lower = colorName.toLowerCase();
      if (!colorCounts[lower]) {
        colorCounts[lower] = { name: colorName, count: 0, image: p.coverImage || p.image || '/designer_suit_1.png' };
      }
      colorCounts[lower].count++;
    });

    const sorted = Object.entries(colorCounts)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([key, val]) => {
        const info = getColorInfo(val.name);
        return {
          id: key,
          name: val.name,
          hex: info.hex,
          image: val.image || info.image,
        };
      });

    return sorted;
  }, [allProducts]);

  useEffect(() => {
    if (COLORS.length > 0 && !activeColorId) {
      setActiveColorId(COLORS[0].id);
    }
  }, [COLORS, activeColorId]);

  const activeColor = COLORS.find(c => c.id === activeColorId) || COLORS[0];

  if (!activeColor) return null;

  return (
    <section className="py-24 relative overflow-hidden bg-[#FAF9F6] min-h-[900px] flex items-center justify-center border-y border-[#1A0008]/10">
        
       {/* Grid Pattern Background to match Hero */}
       <div className="absolute inset-0 opacity-[0.2] pointer-events-none"
         style={{
           backgroundImage: 'linear-gradient(#8B1A1A 1px, transparent 1px), linear-gradient(90deg, #8B1A1A 1px, transparent 1px)',
           backgroundSize: '30px 30px',
         }} />

       {/* Ambient Glows */}
       <div 
         className="absolute inset-0 transition-colors duration-[1.5s] ease-in-out opacity-10 blur-[150px]"
         style={{ backgroundColor: activeColor.hex }}
       />

       {/* Floating Massive Background Text for Depth - Stretched Vertically */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-full text-center z-0 pointer-events-none select-none">
          <AnimatePresence mode="wait">
             <motion.h1
               key={activeColor.name}
               initial={{ opacity: 0, scaleX: 0.9, scaleY: 1.5, y: 20 }}
               animate={{ opacity: 0.04, scaleX: 1, scaleY: 2, y: 0 }}
               exit={{ opacity: 0, scaleX: 1.1, scaleY: 2.2, y: -20 }}
               transition={{ duration: 0.8 }}
               className="text-[16vw] md:text-[14vw] lg:text-[13vw] font-bold text-[#1A0008] uppercase tracking-tighter leading-none whitespace-nowrap origin-center"
               style={{ fontFamily: "'Cormorant Garamond', serif" }}
             >
                {activeColor.name}
             </motion.h1>
          </AnimatePresence>
       </div>

       <div className="max-w-[1400px] w-full mx-auto px-6 relative z-10 flex flex-col items-center">
           
           {/* Section Header */}
           <div className="text-center mb-12 md:mb-16">
              <p className="text-[11px] tracking-[0.3em] text-[#8B1A1A] uppercase font-bold mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                 The Signature Collection
              </p>
              <h2 className="text-6xl md:text-7xl font-light text-[#1A0008]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                 Shop By <span className="italic text-[#D4AF37]">Color</span>
              </h2>
           </div>

           {/* Central Portrait Image - The Main Stage (Restored Luxury Arch) */}
           <div onClick={() => navigate(`/shop?color=${encodeURIComponent(activeColor.name)}`)} className="relative w-full max-w-[420px] h-[550px] md:h-[650px] rounded-t-full rounded-b-xl shadow-[0_30px_80px_rgba(0,0,0,0.15)] overflow-hidden border-[6px] border-white z-20 transition-all duration-700 mt-4 group cursor-pointer">
              <AnimatePresence mode="wait">
                  <motion.div
                     key={activeColor.id}
                     initial={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
                     animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                     exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
                     transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                     className="absolute inset-0"
                  >
                      <img 
                        src={activeColor.image} 
                        alt={activeColor.name}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                     
                      {/* Inner elegant border */}
                     <div className="absolute inset-3 border border-white/30 rounded-t-full rounded-b-md pointer-events-none" />

                     {/* Gradient for text */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90" />
                     
                      {/* Elegant Button Overlaid on Image */}
                      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full text-center px-4">
                         <button onClick={(e) => { e.stopPropagation(); navigate(`/shop?color=${encodeURIComponent(activeColor.name)}`); }} className="px-10 py-3.5 bg-white/20 backdrop-blur-md border border-white/40 text-white rounded-full text-[10px] tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all font-semibold shadow-2xl">
                            Explore {activeColor.name}
                         </button>
                      </div>
                  </motion.div>
              </AnimatePresence>
           </div>

           {/* The Dynamic Glassmorphic Navigation Dock */}
           <div className="mt-12 md:mt-16 bg-white/60 backdrop-blur-xl border border-white/60 p-2 md:p-3 rounded-full shadow-[0_20px_40px_-15px_rgba(26,0,8,0.1)] flex items-center justify-center gap-2 md:gap-4 z-30 max-w-full overflow-x-auto no-scrollbar relative">
              {COLORS.map((color) => {
                  const isActive = activeColorId === color.id;
                 
  if (!COLORS.length || !activeColor) return null;

  return (
                    <div 
                      key={color.id}
                      onClick={() => setActiveColorId(color.id)}
                      className={`relative group cursor-pointer rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center ${isActive ? 'w-[160px] md:w-[200px] bg-white shadow-md px-2' : 'w-12 h-12 md:w-16 md:h-16 bg-transparent hover:bg-white/50'}`}
                      style={{ height: isActive ? (typeof window !== 'undefined' && window.innerWidth < 768 ? '56px' : '64px') : '' }}
                    >
                       {/* Dynamic Thumbnail */}
                       <div className={`flex-shrink-0 rounded-full overflow-hidden transition-all duration-500 ${isActive ? 'w-10 h-10 md:w-12 md:h-12 border border-[#1A0008]/10 shadow-sm' : 'w-full h-full border-2 border-white/50 group-hover:border-white shadow-sm'}`}>
                           <img src={color.image} className="w-full h-full object-cover object-top" />
                       </div>
                       
                        {/* Expanded Pill Text (Only visible when active) */}
                        <div className={`overflow-hidden transition-all duration-500 flex flex-col justify-center ${isActive ? 'w-full opacity-100 ml-3' : 'w-0 opacity-0 ml-0'}`}>
                            <p className="text-[#1A0008] font-bold text-xs md:text-sm whitespace-nowrap" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                               {color.name}
                            </p>
                            <p className="text-[#1A0008]/50 text-[9px] tracking-[0.2em] uppercase whitespace-nowrap">
                               {allProducts.filter(p => (p.color || '').toLowerCase() === color.id).length} Products
                            </p>
                        </div>
                       
                     </div>
                 )
              })}
            </div>

       </div>
    </section>
  );
}
