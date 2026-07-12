import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ShoppingBag, Info } from 'lucide-react';
import { getLookbook, getAllProducts } from '../utils/adminStore';

const initialHotspots = [
  {
    id: 1,
    top: '35%',
    left: '42%',
    productName: 'Royal Zari Dupatta',
    price: '₹3,499',
    desc: 'Handwoven pure silk banarasi dupatta with intricate gold zari borders.',
    image: '/designer_suit_1.png',
    realId: 'b3'
  },
  {
    id: 2,
    top: '60%',
    left: '55%',
    productName: 'Crimson Anarkali Flare',
    price: '₹14,999',
    desc: 'Voluminous 24-kali silk anarkali with hand-embroidered waist belt.',
    image: '/anarkali_suit.png',
    realId: 'f3'
  },
  {
    id: 3,
    top: '75%',
    left: '38%',
    productName: 'Handcrafted Zardozi Kurti',
    price: '₹8,999',
    desc: 'Deep maroon raw silk kurti featuring heavy zardozi neckwork.',
    image: '/sharara_suit.png',
    realId: 'b1'
  }
];

const defaultLookbook = {
  bgImage: '/hero_campaign_palace.png',
  hotspots: initialHotspots
};

export default function InteractiveLookbook({ addToCart, setView, setSelectedProduct }) {
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [bgImage, setBgImage] = useState(defaultLookbook.bgImage);
  const [hotspots, setHotspots] = useState(defaultLookbook.hotspots);
  const [allProducts, setAllProducts] = useState([]);

  const loadLookbook = () => {
    const data = getLookbook(defaultLookbook);
    setBgImage(data.bgImage || defaultLookbook.bgImage);
    setHotspots(data.hotspots || defaultLookbook.hotspots);
    setAllProducts(getAllProducts());
  };

  useEffect(() => {
    loadLookbook();
    window.addEventListener('admin-data-updated', loadLookbook);
    return () => window.removeEventListener('admin-data-updated', loadLookbook);
  }, []);

  return (
    <section className="bg-[#FAF9F6] relative h-[100vh] md:h-[120vh] overflow-hidden" id="lookbook">
      
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <img 
          src={bgImage} 
          alt="Campaign Lookbook" 
          className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-transparent to-[#FAF9F6]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F6]/80 via-transparent to-transparent" />
      </div>

      {/* Intro Text Overlay */}
      <div className="absolute top-32 left-6 md:left-14 z-10 max-w-lg pointer-events-none">
        <span className="text-[11px] tracking-[0.5em] text-[#BCA58A] uppercase block mb-6 font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>Interactive Editorial</span>
        <h2 className="text-6xl md:text-8xl font-light text-[#111111] leading-none mb-6 tracking-tight"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Shop The <br/><em className="italic text-[#BCA58A] font-light">Campaign</em>
        </h2>
        <p className="text-[#555] text-[13px] leading-loose font-light" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          Hover or tap the glowing points to explore the individual handcrafted pieces worn in this editorial shoot.
        </p>
      </div>

      {/* Hotspots Container */}
      <div className="absolute inset-0 z-20">
        {hotspots.map((hotspot) => (
          <div 
            key={hotspot.id} 
            className="absolute" 
            style={{ top: hotspot.top, left: hotspot.left }}
          >
            {/* Glowing Dot */}
            <button 
              onClick={() => setActiveHotspot(hotspot)}
              className="relative group cursor-pointer"
            >
              <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-30 scale-150" />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl backdrop-blur-md border ${
                activeHotspot?.id === hotspot.id 
                  ? 'bg-white border-white text-[#111111] scale-110' 
                  : 'bg-white/40 border-white/50 text-[#111111] hover:bg-white hover:text-[#111111] hover:scale-110'
              }`}>
                <Plus size={14} strokeWidth={1.5} className={`transition-transform duration-500 ${activeHotspot?.id === hotspot.id ? 'rotate-45' : ''}`} />
              </div>
              
              {/* Tooltip hint (only shows on hover when not active) */}
              <div className="absolute left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none whitespace-nowrap bg-white/90 backdrop-blur-md border border-[#111111]/5 text-[#111111] text-[10px] uppercase tracking-[0.3em] font-medium px-4 py-2 shadow-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                View Details
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Slide-out Drawer */}
      <AnimatePresence>
        {activeHotspot && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95, transition: { duration: 0.2 } }}
            className="fixed md:absolute bottom-6 left-6 right-6 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:right-14 md:left-auto w-auto md:w-full md:max-w-[380px] bg-white/95 backdrop-blur-xl border border-[#111111]/5 shadow-2xl p-8 z-30"
          >
            <button 
              onClick={() => setActiveHotspot(null)}
              className="absolute top-6 right-6 text-[#111111]/40 hover:text-[#111111] transition-colors cursor-pointer z-40"
            >
              <X size={20} strokeWidth={1} />
            </button>
            
            <div 
              onClick={() => {
                const found = allProducts.find(p => p.id === activeHotspot.realId);
                if (found) {
                  setSelectedProduct(found);
                  setView('product-details');
                  setActiveHotspot(null);
                }
              }}
              className="w-full aspect-[4/5] bg-[#E8DDD0] mb-5 overflow-hidden cursor-pointer hover:opacity-90 transition-all rounded"
            >
              <img src={activeHotspot.image} alt={activeHotspot.productName} className="w-full h-full object-cover" />
            </div>

            <div className="flex items-center gap-3 mb-4 text-[#BCA58A]">
              <Info size={14} strokeWidth={1.5} />
              <span className="text-[10px] font-medium tracking-[0.3em] uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>Spotted in Look 01</span>
            </div>
            
            <h3 
              onClick={() => {
                const found = allProducts.find(p => p.id === activeHotspot.realId);
                if (found) {
                  setSelectedProduct(found);
                  setView('product-details');
                  setActiveHotspot(null);
                }
              }}
              className="text-3xl font-light text-[#111111] mb-2 hover:text-[#BCA58A] transition-colors cursor-pointer" 
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {activeHotspot.productName}
            </h3>
            <span className="text-[12px] tracking-[0.2em] font-medium text-[#111111] block mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>{activeHotspot.price}</span>
            
            <p className="text-[13px] text-[#555] leading-loose mb-8 font-light" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {activeHotspot.desc}
            </p>

            <div className="flex gap-2">
              <button 
                onClick={() => {
                  const found = allProducts.find(p => p.id === activeHotspot.realId);
                  if (found) {
                    addToCart(found, 'M');
                    alert(`Added ${found.name} (Size M) to your bag!`);
                    setActiveHotspot(null);
                  }
                }}
                className="w-full bg-[#111111] hover:bg-[#BCA58A] text-white py-4 text-[10px] font-medium tracking-[0.3em] uppercase flex items-center justify-center gap-3 transition-colors duration-500 cursor-pointer"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <ShoppingBag size={14} strokeWidth={1.5} /> Add to Bag
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
