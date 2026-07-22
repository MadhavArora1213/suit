import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OCCASIONS = [
  { id: 'daily-wear', label: 'Daily Wear' },
  { id: 'casual', label: 'Casual' },
  { id: 'festive', label: 'Festive' },
  { id: 'party', label: 'Party' },
  { id: 'wedding', label: 'Wedding' },
  { id: 'luxury', label: 'Luxury Edit' },
];

const MOCK_PRODUCTS = {
  'daily-wear': [
    { id: 1, name: 'Cotton Block Print Suit', price: '₹2,500', image: '/cotton_suit.png' },
    { id: 2, name: 'Simple Chanderi Kurta', price: '₹3,200', image: '/designer_suit_1.png' },
    { id: 3, name: 'Everyday Cotton Saree', price: '₹1,500', image: '/anarkali_suit.png' },
    { id: 4, name: 'Linen Salwar Set', price: '₹2,900', image: '/pakistani_suit.png' }
  ],
  'casual': [
    { id: 5, name: 'Pastel Organza Kurta', price: '₹4,500', image: '/chikankari_suit.png' },
    { id: 6, name: 'Georgette Day Suit', price: '₹3,800', image: '/cotton_suit.png' },
    { id: 7, name: 'Printed Silk Tunic', price: '₹5,200', image: '/designer_suit_1.png' },
    { id: 8, name: 'Minimalist Sharara', price: '₹6,000', image: '/sharara_suit.png' }
  ],
  'festive': [
    { id: 9, name: 'Diwali Special Banarasi', price: '₹12,000', image: '/banarasi_suit.png' },
    { id: 10, name: 'Festive Velvet Suit', price: '₹9,500', image: '/anarkali_suit.png' },
    { id: 11, name: 'Zari Work Anarkali', price: '₹14,500', image: '/designer_suit_1.png' },
    { id: 12, name: 'Embroidered Sharara', price: '₹11,000', image: '/sharara_suit.png' }
  ],
  'party': [
    { id: 13, name: 'Sequined Evening Gown', price: '₹18,000', image: '/pakistani_suit.png' },
    { id: 14, name: 'Cocktail Saree', price: '₹15,500', image: '/designer_suit_1.png' },
    { id: 15, name: 'Mirrorwork Lehenga', price: '₹22,000', image: '/anarkali_suit.png' },
    { id: 16, name: 'Designer Drape Dress', price: '₹19,000', image: '/chikankari_suit.png' }
  ],
  'wedding': [
    { id: 17, name: 'Bridal Red Lehenga', price: '₹85,000', image: '/sharara_suit.png' },
    { id: 18, name: 'Heavy Zardozi Suit', price: '₹42,000', image: '/anarkali_suit.png' },
    { id: 19, name: 'Pure Silk Banarasi', price: '₹35,000', image: '/banarasi_suit.png' },
    { id: 20, name: 'Handcrafted Gharara', price: '₹48,000', image: '/designer_suit_1.png' }
  ],
  'luxury': [
    { id: 21, name: 'Heirloom Kanjeevaram', price: '₹65,000', image: '/banarasi_suit.png' },
    { id: 22, name: 'Exclusive Danka Work', price: '₹55,000', image: '/sharara_suit.png' },
    { id: 23, name: 'Premium Organza Set', price: '₹45,000', image: '/anarkali_suit.png' },
    { id: 24, name: 'Bespoke Tissue Saree', price: '₹75,000', image: '/designer_suit_1.png' }
  ]
};

// Fallback to daily-wear if missing
const getMockProducts = (id) => MOCK_PRODUCTS[id] || MOCK_PRODUCTS['daily-wear'];

export default function OccasionTimeline() {
  const [activeOccasion, setActiveOccasion] = useState(OCCASIONS[0].id);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveOccasion((current) => {
        const idx = OCCASIONS.findIndex(o => o.id === current);
        return OCCASIONS[(idx + 1) % OCCASIONS.length].id;
      });
    }, 4500); // Auto-slides every 4.5 seconds
    
    return () => clearInterval(timer);
  }, []);

  const handleOccasionClick = (id) => {
    setActiveOccasion(id);
    const rail = document.getElementById('occasion-product-rail');
    if (rail) {
      const y = rail.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const activeProducts = getMockProducts(activeOccasion);
  const activeIndex = OCCASIONS.findIndex(o => o.id === activeOccasion);

  return (
    <section 
      className="py-24 md:py-32 bg-[#FAF9F6] border-y border-[#111111]/10 relative overflow-hidden"
    >
      {/* Subtle Ambient Background Flourishes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#BCA58A]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#BCA58A]/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-[1300px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div>
            <motion.p 
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-[10px] tracking-[0.4em] text-[#BCA58A] uppercase font-bold mb-4" 
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Curated Masterpieces
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} 
              className="text-4xl md:text-5xl lg:text-6xl font-light text-[#111111]" 
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Shop by <span className="italic text-[#BCA58A]">Occasion</span>
            </motion.h2>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} 
            className="hidden md:flex items-center gap-4"
          >
             <span className="w-16 h-px bg-[#111111]/20" />
             <span className="text-xs text-[#111111]/40 uppercase tracking-[0.2em] font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
               Select a moment
             </span>
          </motion.div>
        </div>

        {/* The Luxury Timeline Tracker */}
        <div className="relative w-full mb-32 px-4 md:px-8">
           {/* The Base Track */}
           <div className="absolute top-[16px] left-0 w-full h-[1px] bg-[#111111]/10" />

           {/* The Animated Gold Progress Line */}
           <div 
             className="absolute top-[16px] left-0 h-[1.5px] bg-[#BCA58A] transition-all duration-700 ease-in-out z-0" 
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
                     <div className={`absolute inset-0 bg-[#FAF9F6] transition-all duration-500 ease-out ${isActive ? 'scale-100 rotate-45 border border-[#BCA58A] shadow-md' : 'scale-[0.6] rotate-0 border border-[#111111]/20 group-hover:border-[#BCA58A] group-hover:rotate-45'}`} />
                     
                     {/* Inner dot */}
                     <div className={`w-1.5 h-1.5 transition-all duration-500 z-10 ${isActive ? 'bg-[#BCA58A] scale-100' : 'bg-[#111111]/20 scale-0 group-hover:scale-100 group-hover:bg-[#BCA58A]/50'}`} style={{ transform: isActive ? 'rotate(-45deg)' : 'rotate(0)' }} />
                     
                     {/* Soft Glow */}
                     {isActive && (
                       <motion.div layoutId="nodeGlow" className="absolute inset-0 bg-[#BCA58A]/30 blur-md rounded-full pointer-events-none" />
                     )}
                   </div>

                   {/* Typography / Labels */}
                   <div className="text-center absolute top-14 w-32 -left-12 flex flex-col items-center">
                     <span className={`block text-[9px] tracking-[0.2em] uppercase transition-all duration-500 ${isActive ? 'text-[#111111] font-bold' : 'text-[#111111]/40 group-hover:text-[#111111]/70'}`} style={{ fontFamily: "'Montserrat', sans-serif" }}>
                       {occasion.label}
                     </span>
                     <span className={`block mt-2 font-light italic text-xl transition-all duration-500 ${isActive ? 'opacity-100 text-[#BCA58A] translate-y-0' : 'opacity-0 -translate-y-2'}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
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
                  className="text-3xl font-light text-[#111111]" 
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {OCCASIONS.find(o => o.id === activeOccasion)?.label} <span className="italic text-[#BCA58A]">Edit</span>
                </motion.h3>
              </div>
              <a href="#shop" className="group flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-bold text-[#111111] hover:text-[#BCA58A] transition-colors" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                View Full Collection
                <span className="w-6 h-px bg-[#111111] group-hover:bg-[#BCA58A] transition-colors" />
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
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#F0EBE2] mb-5 border border-black/5 group-hover:shadow-2xl transition-all duration-500">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out" />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                         <span className="bg-white/95 text-[#111] text-[9px] uppercase tracking-[0.2em] font-bold px-8 py-3.5 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                           Quick View
                         </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h4 className="text-[13px] text-[#111111] font-medium mb-1.5 line-clamp-1 transition-colors group-hover:text-[#BCA58A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {product.name}
                        </h4>
                        <p className="text-[9px] text-[#111111]/40 tracking-[0.15em] uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          {OCCASIONS.find(o => o.id === activeOccasion)?.label}
                        </p>
                      </div>
                      <p className="text-[#111111] text-[15px] font-semibold whitespace-nowrap" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {product.price}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
        </div>
      </div>
    </section>
  );
}
