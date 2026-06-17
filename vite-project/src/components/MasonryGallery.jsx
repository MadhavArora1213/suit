import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

const col1 = [
  { id: 1, name: 'Royal Banarasi', price: '₹9,299', image: '/banarasi_suit.png', height: 'h-[60vh]' },
  { id: 2, name: 'Chikankari Set', price: '₹7,499', image: '/chikankari_suit.png', height: 'h-[40vh]' },
  { id: 3, name: 'Velvet Heritage', price: '₹14,999', image: '/designer_suit_1.png', height: 'h-[50vh]' },
];

const col2 = [
  { id: 4, name: 'Zari Anarkali', price: '₹14,999', image: '/anarkali_suit.png', height: 'h-[45vh]' },
  { id: 5, name: 'Bridal Couture', price: '₹24,999', image: '/hero_campaign_palace.png', height: 'h-[70vh]' },
  { id: 6, name: 'Modern Sharara', price: '₹8,999', image: '/sharara_suit.png', height: 'h-[45vh]' },
];

const col3 = [
  { id: 7, name: 'Classic Straight', price: '₹5,499', image: '/pakistani_suit.png', height: 'h-[50vh]' },
  { id: 8, name: 'Heritage Luxe', price: '₹12,499', image: '/hero_campaign_suits.png', height: 'h-[60vh]' },
  { id: 9, name: 'Glacier Blue Organza', price: '₹14,500', image: '/sky_blue_suit.jpg', height: 'h-[40vh]' },
];

const ProductCard = ({ item }) => (
  <div className={`relative group w-full ${item.height} rounded-xl overflow-hidden cursor-pointer shadow-lg border border-[#111111]/5`}>
    <img 
      src={item.image} 
      alt={item.name} 
      className="w-full h-full object-cover object-top scale-105 group-hover:scale-100 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
    />
    
    {/* Cinematic Glass Overlay */}
    <div className="absolute inset-0 bg-[#111111]/40 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all duration-500" />
    
    {/* Content */}
    <div className="absolute inset-0 p-8 flex flex-col justify-end transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 group-hover:opacity-100">
      <h3 className="text-3xl text-[#FAF9F6] mb-1 font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {item.name}
      </h3>
      <p className="text-[#BCA58A] text-[10px] tracking-widest mb-6 font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {item.price}
      </p>
      
      <button className="w-full bg-[#FAF9F6] hover:bg-[#BCA58A] hover:text-[#FAF9F6] text-[#111111] py-4 flex items-center justify-center gap-2 text-[10px] tracking-[0.2em] font-bold transition-colors">
        <ShoppingBag size={14} />
        <span>QUICK ADD</span>
      </button>
    </div>
  </div>
);

export default function ParallaxMasonry() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Reduced translation speeds to prevent massive empty gaps at the bottom
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "-5%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["5%", "-15%"]); 
  const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  return (
    <section ref={containerRef} className="relative bg-[#FAF9F6] pt-32 pb-12 overflow-hidden" id="collections">
      
      {/* Background Accent */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-24 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none w-full">
            <span className="text-[180px] md:text-[300px] font-light leading-none tracking-tighter" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Gallery
            </span>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="relative z-10"
          >
            <span className="text-[10px] tracking-[0.4em] text-[#BCA58A] uppercase font-bold mb-6 block" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              The Masterpieces
            </span>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-light text-[#111111] leading-[0.9]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Curated <br/>
              <em className="italic text-[#BCA58A]">Silhouettes</em>
            </h2>
            <p className="mt-8 text-[#6B6B6B] text-xs tracking-widest font-bold uppercase max-w-sm mx-auto leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Explore our vast collection of handcrafted luxury. Every piece is woven with heritage.
            </p>
          </motion.div>
        </div>

        {/* Parallax Columns */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-12 pb-12">
          
          {/* Column 1 */}
          <motion.div style={{ y: y1 }} className="flex-1 flex flex-col gap-6 md:gap-8 lg:gap-12">
            {col1.map(item => <ProductCard key={item.id} item={item} />)}
          </motion.div>

          {/* Column 2 (Middle - Offset and Faster) */}
          <motion.div style={{ y: y2 }} className="flex-1 flex flex-col gap-6 md:gap-8 lg:gap-12 md:mt-24">
            {col2.map(item => <ProductCard key={item.id} item={item} />)}
          </motion.div>

          {/* Column 3 */}
          <motion.div style={{ y: y3 }} className="flex-1 flex flex-col gap-6 md:gap-8 lg:gap-12 md:mt-12">
            {col3.map(item => <ProductCard key={item.id} item={item} />)}
          </motion.div>

        </div>
        
      </div>
    </section>
  );
}
