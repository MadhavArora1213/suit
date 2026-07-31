import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

const collections = [
  { 
    id: 1, 
    title: 'The Anarkali Edit', 
    subtitle: 'Volume & Grace',
    image: '/anarkali_suit.png', 
    price: 'Starting at ₹6,999'
  },
  { 
    id: 2, 
    title: 'Sharara Silhouettes', 
    subtitle: 'Modern Festive',
    image: '/sharara_suit.png', 
    price: 'Starting at ₹5,499'
  },
  { 
    id: 3, 
    title: 'Pakistani Charm', 
    subtitle: 'Everyday Elegance',
    image: '/pakistani_suit.png', 
    price: 'Starting at ₹4,299'
  },
  { 
    id: 4, 
    title: 'Bridal Zardozi', 
    subtitle: 'Heritage Luxe',
    image: '/designer_suit_1.png', 
    price: 'Starting at ₹12,999'
  },
];

export default function HorizontalShowcase() {
  const targetRef = useRef(null);
  
  // This hook tracks how far we have scrolled past `targetRef`
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Map 0 -> 1 scroll progress to 0% -> -75% horizontal translation
  // (Assuming 4 cards, so we need to scroll 3 full card widths minus viewport)
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-70%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-[#FAF9F6]" id="collections">
      
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        
        {/* Section Header (Fixed while scrolling) */}
        <div className="absolute top-20 md:top-32 left-6 md:left-12 z-20">
          <span className="text-[10px] tracking-[0.35em] text-[#D4AF37] uppercase font-bold block mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Curated For You
          </span>
          <h2 className="text-5xl md:text-7xl font-light text-[#1A0008]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            The <em className="italic text-[#D4AF37]">Gallery</em>
          </h2>
        </div>

        {/* Horizontal Scrolling Gallery */}
        <motion.div style={{ x }} className="flex gap-8 md:gap-16 px-6 md:px-12 md:pl-[30vw] pt-32 h-[65vh] md:h-[75vh]">
          {collections.map((item, index) => (
            <div 
              key={item.id} 
              className="relative w-[85vw] md:w-[45vw] lg:w-[35vw] h-full flex-shrink-0 group overflow-hidden bg-[#E8DDD0]"
            >
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0008]/80 via-transparent to-[#1A0008]/10 opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              
              {/* Content Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-[10px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase mb-2 block" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {item.subtitle}
                </span>
                <h3 className="text-3xl md:text-4xl text-[#FAF9F6] mb-2 font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {item.title}
                </h3>
                <p className="text-[#FAF9F6]/70 text-sm tracking-wide mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {item.price}
                </p>
                
                {/* Shop Button */}
                <button className="bg-[#D4AF37] hover:bg-[#a38f76] text-[#1A0008] px-8 py-4 flex items-center justify-center gap-3 text-[10px] tracking-[0.25em] font-bold transition-all cursor-pointer opacity-0 group-hover:opacity-100 w-full" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <ShoppingBag size={14} />
                  <span>SHOP COLLECTION</span>
                </button>
              </div>
            </div>
          ))}
        </motion.div>
        
        {/* Progress Bar Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E8DDD0]">
          <motion.div 
            style={{ scaleX: scrollYProgress, transformOrigin: 'left' }} 
            className="h-full bg-[#D4AF37]"
          />
        </div>

      </div>
    </section>
  );
}
