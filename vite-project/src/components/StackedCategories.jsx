import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const categories = [
  { 
    id: 1, 
    name: 'Anarkali Set', 
    image: '/anarkali_suit.png', 
    desc: 'The Royal Flare. Hand-stitched with voluminous tiers for majestic celebrations.',
    color: '#1E1E1E'
  },
  { 
    id: 2, 
    name: 'Sharara Set', 
    image: '/sharara_suit.png', 
    desc: 'Modern Festive. Playful flared bottoms paired with intricate short kurtis.',
    color: '#2A2A2A'
  },
  { 
    id: 3, 
    name: 'Pakistani Suits', 
    image: '/pakistani_suit.png', 
    desc: 'Everyday Elegance. Flowy silhouettes that blend comfort with sophisticated charm.',
    color: '#1A1A1A'
  },
  { 
    id: 4, 
    name: 'Bridal Zardozi', 
    image: '/designer_suit_1.png', 
    desc: 'Heritage Luxe. Exquisite silk fabric with heavy antique gold detailing.',
    color: '#242424'
  },
];

const Card = ({ i, cat, progress, range, targetScale }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start']
  });

  // Parallax the image slightly as it scrolls into view
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.3, 1]);
  // Scale down the card when the next card comes over it
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div ref={containerRef} className="h-screen flex items-center justify-center sticky top-0">
      <motion.div 
        style={{ scale, backgroundColor: cat.color, top: `calc(-10vh + ${i * 40}px)` }} 
        className="relative flex flex-col md:flex-row w-full max-w-[1200px] h-[75vh] md:h-[80vh] shadow-2xl rounded-3xl overflow-hidden origin-top border border-[#BCA58A]/20"
      >
        {/* Left Text Panel */}
        <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center text-left bg-gradient-to-br from-[#111111]/80 to-transparent z-10">
          <span className="text-[10px] md:text-xs tracking-[0.4em] text-[#BCA58A] uppercase font-bold mb-6 block">
            0{i + 1} &mdash; Collection
          </span>
          <h2 className="text-5xl md:text-7xl font-light text-[#FAF9F6] mb-6 leading-none"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {cat.name}
          </h2>
          <p className="text-sm md:text-base text-[#6B6B6B] leading-relaxed max-w-sm mb-10"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {cat.desc}
          </p>
          <motion.button 
            whileHover={{ x: 10 }}
            className="flex items-center gap-4 text-[#FAF9F6] group cursor-pointer w-fit"
          >
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Explore Collection</span>
            <div className="w-10 h-10 rounded-full border border-[#BCA58A]/40 flex items-center justify-center group-hover:bg-[#BCA58A] group-hover:border-[#BCA58A] group-hover:text-[#111111] transition-all duration-300">
              <ArrowRight size={14} />
            </div>
          </motion.button>
        </div>

        {/* Right Image Panel */}
        <div className="w-full md:w-1/2 h-full absolute md:relative right-0 top-0 overflow-hidden opacity-40 md:opacity-100">
          <motion.div style={{ scale: imageScale }} className="w-full h-full">
            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover object-top" />
          </motion.div>
          {/* Subtle gradient overlay to blend on mobile */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#111111] to-transparent md:hidden" />
        </div>
      </motion.div>
    </div>
  );
};

export default function StackedCategories() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  return (
    <section ref={containerRef} className="bg-[#0A0A0A] relative pb-24" id="collections">
      
      {/* Intro Header */}
      <div className="pt-32 pb-16 text-center sticky top-0 z-0 h-[40vh] flex flex-col justify-center items-center">
        <span className="text-[10px] tracking-[0.35em] text-[#BCA58A] uppercase block mb-4 font-medium">Curated Silhouettes</span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#FAF9F6]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          The <em className="italic text-[#BCA58A]">Masterpieces</em>
        </h2>
      </div>

      {/* Stacked Cards Container */}
      <div className="relative z-10 px-6">
        {categories.map((cat, i) => {
          const targetScale = 1 - (categories.length - i) * 0.05;
          return (
            <Card 
              key={cat.id} 
              i={i} 
              cat={cat} 
              progress={scrollYProgress} 
              range={[i * 0.25, 1]} 
              targetScale={targetScale} 
            />
          );
        })}
      </div>
    </section>
  );
}
