import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { getCategories } from '../utils/adminStore';

export default function ShoppingReimagined({ setView, setSelectedCategory }) {
  const targetRef = useRef(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchAndSetCategories = () => {
      const activeCats = getCategories()
        .filter(c => c.active !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      setCategories(activeCats);
    };
    
    fetchAndSetCategories();
    window.addEventListener('admin-data-updated', fetchAndSetCategories);
    return () => window.removeEventListener('admin-data-updated', fetchAndSetCategories);
  }, []);

  // Construct dynamic CRAFTS array
  const dynamicCrafts = [
    { id: 'intro', title: 'Signature Collections', subtitle: 'Shop by Fabric', type: 'intro' },
    ...categories.map(cat => ({
      id: cat.id || cat.name,
      title: cat.name,
      subtitle: cat.tagline || 'Explore our exclusive collection.',
      image: cat.image || '/placeholder_suit.png',
      type: 'craft'
    }))
  ];
  
  // The section is 300vh tall to allow for plenty of scrolling time
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Map the vertical scroll progress to horizontal movement
  // -100% minus the viewport width to ensure all cards scroll fully into and out of view
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-[#FAF9F6]">
      
      {/* Grid Pattern Background - Light Theme */}
      <div className="absolute inset-0 opacity-[0.2] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#8B1A1A 1px, transparent 1px), linear-gradient(90deg, #8B1A1A 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />

      {/* Sticky Container - Pins to the screen while scrolling */}
      <div className="sticky top-0 h-screen flex items-center overflow-hidden z-10">
        
        <motion.div style={{ x }} className="flex gap-8 md:gap-16 px-6 md:px-[10vw]">
          
          {dynamicCrafts.map((craft, idx) => {
            
            // Intro Slide
            if (craft.type === 'intro') {
              return (
                <div key={craft.id} className="w-[85vw] md:w-[40vw] h-[60vh] md:h-[70vh] flex flex-col justify-center shrink-0">
                  <div className="inline-block self-start text-[#8B1A1A] font-bold mb-6 uppercase tracking-[0.3em] text-[10px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {craft.title}
                  </div>
                  <h2 className="text-5xl md:text-7xl lg:text-[90px] font-light text-[#1A0008] leading-none tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {craft.subtitle.split(' ')[0]} <br/>
                    <span className="italic text-[#D4AF37]">{craft.subtitle.split(' ').slice(1).join(' ')}</span>
                  </h2>
                  <div className="w-16 h-px bg-[#1A0008]/20 mt-12 mb-6" />
                  <p className="text-[#1A0008]/50 text-sm max-w-sm tracking-widest uppercase font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Scroll to Explore
                  </p>
                </div>
              );
            }

            // Craft Cards (Sleek and Elegant)
            return (
              <div 
                key={craft.id} 
                className="relative w-[85vw] md:w-[45vw] lg:w-[35vw] h-[60vh] md:h-[70vh] shrink-0 rounded-xl overflow-hidden group shadow-xl"
              >
                {/* Image Container */}
                <div className="relative w-full h-full bg-[#E8DDD0]">
                  <img 
                    src={craft.image} 
                    alt={craft.title} 
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-[2s] ease-out group-hover:scale-105"
                  />
                  {/* Elegant Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                </div>
                
                {/* Card Content Over Image */}
                <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 right-6 md:right-8 z-10 flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[#D4AF37] text-xs font-bold tracking-widest" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      0{idx}
                    </span>
                    <div className="h-px w-12 bg-[#D4AF37]/50" />
                  </div>
                  <h3 className="text-4xl md:text-5xl text-white font-medium tracking-wide mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {craft.title}
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed max-w-sm mb-6 font-light" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {craft.subtitle}
                  </p>
                  <button 
                    onClick={() => {
                      if (setSelectedCategory) setSelectedCategory(craft.title);
                      if (setView) setView('category');
                    }} 
                    className="inline-flex items-center gap-2 text-white/70 hover:text-white uppercase tracking-widest text-[10px] font-bold transition-colors cursor-pointer w-fit"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Explore Collection
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
          
        </motion.div>

      </div>
    </section>
  );
}
