import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = [
  { id: 'lavender', name: 'Lavender', hex: '#D6CADD', image: '/lavender_generated.png' },
  { id: 'wine', name: 'Wine', hex: '#5B2A34', image: '/wine_generated.png' },
  { id: 'black', name: 'Black', hex: '#1A1A1A', image: '/black_generated.png' },
  { id: 'bottle-green', name: 'Bottle Green', hex: '#1E3F33', image: '/bottle_green_generated.png' },
  { id: 'yellow', name: 'Yellow', hex: '#E2C792', image: '/yellow_generated.png' },
  { id: 'custom', name: 'Bespoke', hex: 'Match Color', image: '/designer_suit_1.png', isCustom: true }
];

export default function ShopByColor() {
  const [activeColorId, setActiveColorId] = useState(COLORS[0].id);
  const [customColor, setCustomColor] = useState('#BCA58A');

  const activeColor = activeColorId === 'custom' 
    ? { id: 'custom', name: 'Bespoke', hex: customColor, image: '/designer_suit_1.png' }
    : COLORS.find(c => c.id === activeColorId);

  return (
    <section className="py-24 relative overflow-hidden bg-[#FAF9F6] min-h-[900px] flex items-center justify-center border-y border-[#111111]/5">
        
       {/* Massive Ambient Background Glow */}
       <div 
         className="absolute inset-0 transition-colors duration-[1.5s] ease-in-out opacity-20 blur-[150px]"
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
               className="text-[16vw] md:text-[14vw] lg:text-[13vw] font-bold text-black uppercase tracking-tighter leading-none whitespace-nowrap origin-center"
               style={{ fontFamily: "'Montserrat', sans-serif" }}
             >
                {activeColor.name}
             </motion.h1>
          </AnimatePresence>
       </div>

       <div className="max-w-[1400px] w-full mx-auto px-6 relative z-10 flex flex-col items-center">
           
           {/* Section Header */}
           <div className="text-center mb-12 md:mb-16">
              <h2 className="text-5xl md:text-6xl font-light text-[#111111] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                 Shop By <span className="italic text-[#BCA58A]">Color</span>
              </h2>
              <p className="text-[10px] tracking-[0.4em] text-[#111111]/40 uppercase font-bold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                 The Signature Collection
              </p>
           </div>

           {/* Central Portrait Image - The Main Stage */}
           <div className="relative w-full max-w-[420px] h-[550px] md:h-[650px] rounded-t-full rounded-b-xl shadow-[0_30px_80px_rgba(0,0,0,0.15)] overflow-hidden border-[6px] border-white z-20 transition-all duration-700">
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
                       className={`w-full h-full object-cover object-top ${activeColorId === 'custom' ? 'grayscale contrast-125' : ''}`}
                     />
                     
                     {/* Bespoke Real-Time Tinting */}
                     {activeColorId === 'custom' && (
                       <>
                         <div className="absolute inset-0 mix-blend-color opacity-80 transition-colors duration-100" style={{ backgroundColor: activeColor.hex }} />
                         <div className="absolute inset-0 mix-blend-multiply opacity-50 transition-colors duration-100" style={{ backgroundColor: activeColor.hex }} />
                       </>
                     )}
                     
                     {/* Inner elegant border */}
                     <div className="absolute inset-3 border border-white/30 rounded-t-full rounded-b-md pointer-events-none" />

                     {/* Gradient for text */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90" />
                     
                     {/* Hover Action / Label */}
                     <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full text-center px-4">
                        <button className="px-8 py-3 bg-white/20 backdrop-blur-md border border-white/40 text-white rounded-full text-[10px] tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all font-semibold shadow-lg">
                           Explore {activeColor.name}
                        </button>
                     </div>
                  </motion.div>
              </AnimatePresence>
           </div>

           {/* The Dynamic Glassmorphism Navigation Dock */}
           <div className="mt-12 md:mt-16 bg-white/40 backdrop-blur-xl border border-white/60 p-2 md:p-3 rounded-full shadow-lg flex items-center justify-center gap-2 md:gap-4 z-30 max-w-full overflow-x-auto no-scrollbar">
              {COLORS.map((color) => {
                 const isActive = activeColorId === color.id;
                 const isCustom = color.isCustom;
                 
                 return (
                    <div 
                      key={color.id}
                      onClick={() => setActiveColorId(color.id)}
                      className={`relative group cursor-pointer rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center ${isActive ? 'w-[160px] md:w-[200px] bg-white shadow-md px-2' : 'w-12 h-12 md:w-16 md:h-16 bg-transparent hover:bg-white/50'}`}
                      style={{ height: isActive ? (typeof window !== 'undefined' && window.innerWidth < 768 ? '56px' : '64px') : '' }}
                    >
                       {/* Dynamic Thumbnail */}
                       <div className={`flex-shrink-0 rounded-full overflow-hidden transition-all duration-500 ${isActive ? 'w-10 h-10 md:w-12 md:h-12 border border-[#111111]/10 shadow-sm' : 'w-full h-full border-2 border-white/50 group-hover:border-white shadow-sm'}`}>
                          {isCustom ? (
                             <div className="relative w-full h-full bg-[#111111] flex items-center justify-center">
                                 <div className="absolute inset-0 mix-blend-color opacity-80" style={{ backgroundColor: customColor }} />
                                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="relative z-10">
                                   <circle cx="12" cy="12" r="4"/>
                                   <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                                 </svg>
                             </div>
                          ) : (
                             <img src={color.image} className="w-full h-full object-cover object-top" />
                          )}
                       </div>
                       
                       {/* Expanded Pill Text (Only visible when active) */}
                       <div className={`overflow-hidden transition-all duration-500 flex flex-col justify-center ${isActive ? 'w-full opacity-100 ml-3' : 'w-0 opacity-0 ml-0'}`}>
                           <p className="text-[#111111] font-semibold text-xs md:text-sm whitespace-nowrap" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                              {color.name}
                           </p>
                           <p className="text-[#111111]/50 text-[9px] tracking-wider uppercase whitespace-nowrap">
                              {color.hex}
                           </p>
                       </div>
                       
                       {/* Invisible Color Input overlay covering the active pill for Bespoke */}
                       {isCustom && isActive && (
                          <input 
                             type="color" 
                             value={customColor} 
                             onChange={(e) => setCustomColor(e.target.value)}
                             className="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-10"
                             title="Pick a custom shade"
                          />
                       )}
                    </div>
                 )
              })}
           </div>
           
           <AnimatePresence>
             {activeColorId === 'custom' && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6 text-[#111111]/50 text-[10px] tracking-widest uppercase font-medium"
                >
                   Tap the bespoke pill to open color picker
                </motion.p>
             )}
           </AnimatePresence>

       </div>
    </section>
  );
}
