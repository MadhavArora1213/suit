import { useState, useRef, useEffect } from 'react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';

const galleryItems = [
  { id: 1, image: '/hero_campaign_suits.png', name: 'Banarasi Silk' },
  { id: 2, image: '/anarkali_suit.png', name: 'Royal Anarkali' },
  { id: 3, image: '/sharara_suit.png', name: 'Modern Sharara' },
  { id: 4, image: '/sky_blue_suit.jpg', name: 'Glacier Blue Organza' },
  { id: 5, image: '/hero_campaign_palace.png', name: 'Bridal Couture' },
  { id: 6, image: '/designer_suit_1.png', name: 'Heritage Luxe' },
];

export default function Hero({ addToCart }) {
  const infiniteItems = [...galleryItems, ...galleryItems];
  
  // Magnetic Button State
  const buttonRef = useRef(null);
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });

  // Floating Image Reveal on Text Hover
  const [isTextHovered, setIsTextHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });

    // Magnetic Button Logic
    if (buttonRef.current) {
      const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
      // Check if mouse is near the button
      const dist = Math.hypot(e.clientX - (left + width/2), e.clientY - (top + height/2));
      if (dist < 150) {
        const x = (e.clientX - (left + width / 2)) * 0.4;
        const y = (e.clientY - (top + height / 2)) * 0.4;
        setBtnPos({ x, y });
      } else {
        setBtnPos({ x: 0, y: 0 });
      }
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const springX = useSpring(btnPos.x, { stiffness: 150, damping: 15 });
  const springY = useSpring(btnPos.y, { stiffness: 150, damping: 15 });
  
  // Springs for the floating text-hover image
  const floatX = useSpring(mousePos.x, { stiffness: 100, damping: 20 });
  const floatY = useSpring(mousePos.y, { stiffness: 100, damping: 20 });

  return (
    <section className="relative w-full h-screen min-h-[700px] bg-[#FAF9F6] flex flex-col md:flex-row overflow-hidden cursor-default">
      
      {/* Subtle Film Grain Overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      {/* Floating Image Reveal (When hovering "Masterpieces") */}
      <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden hidden md:block">
        <AnimatePresence>
          {isTextHovered && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 5 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute w-48 h-64 rounded-xl overflow-hidden shadow-2xl border-4 border-[#FAF9F6]"
              style={{ 
                x: floatX, 
                y: floatY,
                marginLeft: '-6rem',
                marginTop: '-8rem'
              }}
            >
              <img src="/designer_suit_1.png" alt="Floating Detail" className="w-full h-full object-cover" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Left Side: Editorial Canvas */}
      <div className="relative w-full md:w-[45%] lg:w-[40%] h-[40vh] md:h-full flex flex-col justify-center px-6 md:px-12 lg:px-20 z-20 bg-[#FAF9F6] shadow-[20px_0_40px_rgba(0,0,0,0.03)] pt-20 md:pt-0">
        
        {/* Massive Background Number */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 pl-12 opacity-[0.03] pointer-events-none select-none">
          <span className="text-[300px] font-light leading-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            01
          </span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-px bg-[#BCA58A]" />
            <span className="text-[9px] tracking-[0.4em] text-[#BCA58A] uppercase font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Edition 2026
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-[#111111] leading-[0.9] tracking-tight mb-8 relative z-20" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Unveiling <br/>
            <span 
              className="italic text-[#BCA58A] pl-8 block cursor-pointer transition-colors hover:text-[#111111]"
              onMouseEnter={() => setIsTextHovered(true)}
              onMouseLeave={() => setIsTextHovered(false)}
            >
              Masterpieces
            </span>
          </h1>
          
          <p className="text-[#6B6B6B] text-xs tracking-widest uppercase font-bold max-w-xs mb-12 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            A curated journey through heritage craftsmanship and modern luxury silhouettes.
          </p>
          
          <div className="flex items-start">
            <motion.a 
              ref={buttonRef}
              href="#collections" 
              style={{ x: springX, y: springY }}
              className="relative flex items-center justify-center w-36 h-36 rounded-full border border-[#111111]/20 text-[#111111] group overflow-hidden transition-colors hover:border-[#BCA58A] z-30 bg-[#FAF9F6]"
            >
              <div className="absolute inset-0 bg-[#BCA58A] scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full ease-[cubic-bezier(0.16,1,0.3,1)] origin-center" />
              <div className="relative z-10 flex flex-col items-center gap-2 group-hover:text-[#FAF9F6] transition-colors duration-300">
                <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-center px-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Explore <br/> Gallery
                </span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Skewed Auto-Scrolling Gallery */}
      <div className="w-full md:w-[55%] lg:w-[60%] h-[60vh] md:h-full relative overflow-hidden bg-[#FAF9F6]">
        
        {/* Soft edge gradients */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#FAF9F6] to-transparent z-10 hidden md:block pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#FAF9F6] to-transparent z-10 hidden md:block pointer-events-none" />

        <motion.div 
          className="flex flex-wrap md:flex-col gap-4 p-4 md:p-12 md:pl-0"
          animate={{ y: ["0%", "-50%"] }}
          transition={{ y: { repeat: Infinity, repeatType: "loop", duration: 40, ease: "linear" } }}
        >
          <div className="grid grid-cols-2 gap-4 md:gap-12 w-full">
            {infiniteItems.map((item, index) => (
              <div 
                key={`${item.id}-${index}`} 
                className={`relative group w-full aspect-[3/4] md:aspect-[4/5] rounded-xl overflow-hidden shadow-2xl cursor-pointer bg-[#111111] ${index % 2 !== 0 ? 'md:mt-24' : ''}`}
              >
                {/* Subtle Image Skew on load */}
                <motion.img 
                  initial={{ scale: 1.1, filter: "blur(4px)" }}
                  animate={{ scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 1.5, delay: index * 0.1 }}
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] opacity-90 group-hover:opacity-100"
                />
                
                <div className="absolute inset-0 bg-[#111111]/60 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all duration-500" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 group-hover:opacity-100">
                  <span className="text-[#BCA58A] text-[9px] tracking-[0.3em] font-bold uppercase mb-2 block" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    New Arrival
                  </span>
                  <h3 className="text-[#FAF9F6] text-3xl mb-6 font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {item.name}
                  </h3>
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); addToCart && addToCart(item); }}
                    className="w-full bg-[#FAF9F6] text-[#111111] hover:bg-[#BCA58A] hover:text-[#FAF9F6] py-4 flex items-center justify-center gap-2 text-[10px] tracking-[0.25em] font-bold transition-colors"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <ShoppingBag size={14} />
                    ADD TO BAG
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

    </section>
  );
}
