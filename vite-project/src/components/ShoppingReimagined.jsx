import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const CRAFTS = [
  { id: 'intro', title: 'The Artisanal Edit', subtitle: 'Curated by Craft', type: 'intro' },
  { id: 'banarasi', title: 'The Banarasi Weave', subtitle: 'Royal, heavy silk with intricate zari work originating from Varanasi.', image: '/banarasi_suit.png' },
  { id: 'chikankari', title: 'Pure Chikankari', subtitle: 'Delicate and artful hand embroidery from the heart of Lucknow.', image: '/chikankari_suit.png' },
  { id: 'pakistani', title: 'Pakistani Silhouettes', subtitle: 'Long, flowing kameez paired with wide trousers for a dramatic look.', image: '/pakistani_suit.png' },
  { id: 'patiala', title: 'Classic Patiala', subtitle: 'Voluminous pleats and a short kurti for the traditional Punjabi drape.', image: '/patiala_suit.png' },
  { id: 'cotton', title: 'Breathable Cottons', subtitle: 'Minimalist, comfortable ethnic wear tailored for everyday luxury.', image: '/cotton_suit.png' }
];

export default function ShoppingReimagined() {
  const targetRef = useRef(null);
  
  // The section is 300vh tall to allow for plenty of scrolling time
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Map the vertical scroll progress to horizontal movement
  // -100% minus the viewport width to ensure all cards scroll fully into and out of view
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-[#111111]">
      
      {/* Sticky Container - Pins to the screen while scrolling */}
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        
        <motion.div style={{ x }} className="flex gap-8 md:gap-16 px-6 md:px-[10vw]">
          
          {CRAFTS.map((craft, idx) => {
            
            // Intro Slide
            if (craft.type === 'intro') {
              return (
                <div key={craft.id} className="w-[85vw] md:w-[40vw] h-[60vh] md:h-[70vh] flex flex-col justify-center shrink-0">
                  <p className="text-[10px] tracking-[0.4em] text-[#BCA58A] uppercase font-bold mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {craft.title}
                  </p>
                  <h2 className="text-5xl md:text-7xl lg:text-[100px] font-light text-white leading-none tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {craft.subtitle.split(' ')[0]} <br/>
                    <span className="italic text-[#BCA58A]">{craft.subtitle.split(' ').slice(1).join(' ')}</span>
                  </h2>
                  <div className="w-16 h-px bg-[#BCA58A]/50 mt-12 mb-6" />
                  <p className="text-white/40 text-sm max-w-sm tracking-widest uppercase">
                    Scroll to Explore
                  </p>
                </div>
              );
            }

            // Craft Cards
            return (
              <div 
                key={craft.id} 
                className="relative w-[85vw] md:w-[45vw] lg:w-[35vw] h-[60vh] md:h-[70vh] shrink-0 rounded-2xl overflow-hidden group shadow-2xl"
              >
                {/* Image with subtle constant zoom to feel alive */}
                <img 
                  src={craft.image} 
                  alt={craft.title} 
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-[2s] ease-out group-hover:scale-110"
                />
                
                {/* Gradient Overlay for Text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                
                {/* Card Content */}
                <div className="absolute bottom-8 left-8 right-8 z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[#BCA58A] text-xs font-bold tracking-widest" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      0{idx}
                    </span>
                    <div className="h-px w-12 bg-[#BCA58A]/50" />
                  </div>
                  <h3 className="text-4xl md:text-5xl text-white font-medium tracking-wide mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {craft.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed max-w-sm mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {craft.subtitle}
                  </p>
                  <a href="#explore" className="inline-flex items-center gap-2 text-white/50 hover:text-white uppercase tracking-widest text-[10px] font-bold transition-colors">
                    Explore Collection
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            );
          })}
          
        </motion.div>

      </div>
    </section>
  );
}
