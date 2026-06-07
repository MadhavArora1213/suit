import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const storySteps = [
  {
    subtitle: 'The Heritage',
    title: 'Woven by Masters',
    text: 'We partner directly with over 40+ heritage weavers across Banaras and Lucknow. Each thread is a testament to centuries of ancestral knowledge, keeping the authentic handloom legacy alive in the modern era.'
  },
  {
    subtitle: 'The Artistry',
    title: '140 Hours of Precision',
    text: 'From hand-sewn zardozi wires to meticulously applied gota patti pieces, a single garment requires between 12 to 140 hours of intensive handcrafted work. We firmly refuse machine replication.'
  },
  {
    subtitle: 'The Promise',
    title: 'Inspected to Perfection',
    text: 'Our masters inspect every suit across four strict stages: fabric strength, embroidery lock checks, seam density, and fit measurements. Perfection is not an option; it is our standard.'
  }
];

export default function ScrollytellingCraft() {
  const containerRef = useRef(null);
  
  // Track scroll through the whole section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Parallax the background image slowly
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  return (
    <section ref={containerRef} className="relative bg-[#0A0A0A] h-[300vh]" id="craftsmanship">
      
      {/* Sticky Background Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <motion.div style={{ scale }} className="w-full h-full">
            <img 
              src="/chikankari_suit.png" 
              alt="Craftsmanship" 
              className="w-full h-full object-cover opacity-30 mix-blend-luminosity" 
            />
          </motion.div>
          {/* Gradients to blend with previous/next sections and make text readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-[#0A0A0A]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/80 via-transparent to-[#0A0A0A]/80" />
        </div>

        {/* The Text Steps that Fade In and Out based on scroll */}
        <div className="relative z-10 w-full max-w-[800px] px-6 text-center">
          {storySteps.map((step, i) => {
            // Calculate when this specific step should be visible
            const startVisible = i * (1 / storySteps.length);
            const peakVisible = startVisible + (0.5 / storySteps.length);
            const endVisible = startVisible + (1 / storySteps.length);
            
            const opacity = useTransform(
              scrollYProgress,
              [startVisible, peakVisible, endVisible],
              [0, 1, 0]
            );
            
            const y = useTransform(
              scrollYProgress,
              [startVisible, peakVisible, endVisible],
              [50, 0, -50]
            );

            return (
              <motion.div 
                key={i} 
                style={{ opacity, y }} 
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              >
                <span className="text-[10px] tracking-[0.4em] text-[#BCA58A] uppercase font-bold mb-6 border border-[#BCA58A]/30 px-4 py-1.5 rounded-full backdrop-blur-sm">
                  {step.subtitle}
                </span>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-[#FAF9F6] mb-8 leading-tight"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {step.title}
                </h2>
                <p className="text-base md:text-lg text-[#FAF9F6]/70 leading-relaxed max-w-lg font-light"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {step.text}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
