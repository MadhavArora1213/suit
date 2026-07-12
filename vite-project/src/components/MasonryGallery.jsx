import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { getAllProducts } from '../utils/adminStore';

const col1 = [
  { id: 1, realId: 'b3', name: 'Royal Banarasi', price: '₹9,299', image: '/banarasi_suit.png', height: 'h-[60vh]' },
  { id: 2, realId: 'b2', name: 'Chikankari Set', price: '₹7,499', image: '/chikankari_suit.png', height: 'h-[40vh]' },
  { id: 3, realId: 'b1', name: 'Velvet Heritage', price: '₹8,999', image: '/banarasi_suit.png', height: 'h-[50vh]' },
];

const col2 = [
  { id: 4, realId: 't1', name: 'Zari Anarkali', price: '₹4,299', image: '/designer_suit_1.png', height: 'h-[45vh]' },
  { id: 5, realId: 'f1', name: 'Bridal Couture', price: '₹11,499', image: '/sharara_suit.png', height: 'h-[70vh]' },
  { id: 6, realId: 't3', name: 'Modern Sharara', price: '₹5,499', image: '/sharara_suit.png', height: 'h-[45vh]' },
];

const col3 = [
  { id: 7, realId: 't4', name: 'Classic Straight', price: '₹4,799', image: '/pakistani_suit.png', height: 'h-[50vh]' },
  { id: 8, realId: 'f3', name: 'Heritage Luxe', price: '₹13,999', image: '/anarkali_suit.png', height: 'h-[60vh]' },
  { id: 9, realId: 'n3', name: 'Glacier Blue Organza', price: '₹14,500', image: '/sky_blue_suit.jpg', height: 'h-[40vh]' },
];

const ProductCard = ({ item, onClickCard, onQuickAdd }) => (
  <div 
    onClick={() => onClickCard(item.realId)}
    className={`relative group w-full ${item.height} rounded-xl overflow-hidden cursor-pointer shadow-lg border border-[#111111]/5`}
  >
    <img 
      src={item.image} 
      alt={item.name} 
      className="w-full h-full object-cover object-top scale-105 group-hover:scale-100 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
    />
    
    {/* Cinematic Glass Overlay */}
    <div className="absolute inset-0 bg-[#111111]/40 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all duration-500" />
    
    {/* Content */}
    <div className="absolute inset-0 p-8 flex flex-col justify-end transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 group-hover:opacity-100">
      <h3 className="text-3xl md:text-4xl text-[#FAF9F6] mb-1 font-light tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {item.name}
      </h3>
      <p className="text-[#BCA58A] text-[11px] tracking-[0.3em] mb-6 uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>
        {item.price}
      </p>
      
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onQuickAdd(item.realId);
        }}
        className="w-full bg-[#FAF9F6]/10 hover:bg-[#FAF9F6] backdrop-blur-md text-[#FAF9F6] hover:text-[#111111] py-4 flex items-center justify-center gap-2 text-[10px] tracking-[0.3em] font-medium transition-all duration-500 border border-[#FAF9F6]/20 hover:border-[#FAF9F6]"
      >
        <ShoppingBag size={14} strokeWidth={1.5} />
        <span>QUICK ADD</span>
      </button>
    </div>
  </div>
);

export default function ParallaxMasonry({ setView, setSelectedProduct, addToCart }) {
  const containerRef = useRef(null);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    setAllProducts(getAllProducts());
    const handleUpdate = () => {
      setAllProducts(getAllProducts());
    };
    window.addEventListener('admin-data-updated', handleUpdate);
    return () => window.removeEventListener('admin-data-updated', handleUpdate);
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Reduced translation speeds to prevent massive empty gaps at the bottom
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "-5%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["5%", "-15%"]); 
  const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  const handleCardClick = (realId) => {
    const found = allProducts.find(p => p.id === realId);
    if (found) {
      setSelectedProduct(found);
      setView('product-details');
    }
  };

  const handleQuickAdd = (realId) => {
    const found = allProducts.find(p => p.id === realId);
    if (found) {
      addToCart(found, 'M');
      alert(`Added ${found.name} (Size M) to your bag!`);
    }
  };

  return (
    <section ref={containerRef} className="relative bg-[#FAF9F6] pt-32 pb-12 overflow-hidden" id="collections">
      
      {/* Background Accent */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-32 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none select-none w-full overflow-hidden flex justify-center">
            <span className="text-[180px] md:text-[380px] font-light leading-none tracking-tighter" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Gallery
            </span>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10"
          >
            <span className="text-[11px] tracking-[0.5em] text-[#BCA58A] uppercase font-medium mb-6 block" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              The Masterpieces
            </span>
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-light text-[#111111] leading-[0.9] tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Curated <br/>
              <em className="italic text-[#BCA58A] font-light">Silhouettes</em>
            </h2>
            <p className="mt-8 text-[#555] text-[10px] tracking-[0.3em] uppercase max-w-md mx-auto leading-loose" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Explore our vast collection of handcrafted luxury. Every piece is woven with heritage.
            </p>
          </motion.div>
        </div>

        {/* Parallax Columns */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-12 pb-12">
          
          {/* Column 1 */}
          <motion.div style={{ y: y1 }} className="flex-1 flex flex-col gap-6 md:gap-8 lg:gap-12">
            {col1.map(item => (
              <ProductCard 
                key={item.id} 
                item={item} 
                onClickCard={handleCardClick}
                onQuickAdd={handleQuickAdd}
              />
            ))}
          </motion.div>

          {/* Column 2 (Middle - Offset and Faster) */}
          <motion.div style={{ y: y2 }} className="flex-1 flex flex-col gap-6 md:gap-8 lg:gap-12 md:mt-24">
            {col2.map(item => (
              <ProductCard 
                key={item.id} 
                item={item} 
                onClickCard={handleCardClick}
                onQuickAdd={handleQuickAdd}
              />
            ))}
          </motion.div>

          {/* Column 3 */}
          <motion.div style={{ y: y3 }} className="flex-1 flex flex-col gap-6 md:gap-8 lg:gap-12 md:mt-12">
            {col3.map(item => (
              <ProductCard 
                key={item.id} 
                item={item} 
                onClickCard={handleCardClick}
                onQuickAdd={handleQuickAdd}
              />
            ))}
          </motion.div>

        </div>
        
      </div>
    </section>
  );
}
