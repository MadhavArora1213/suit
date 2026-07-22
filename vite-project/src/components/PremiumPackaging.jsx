import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate, useTransform } from 'framer-motion';
import gurnaazLogo from '../assets/gurnaaz.png';
import gurnaazMonogram from '../assets/gurnaaz-monogram.png';

export default function PremiumPackaging() {
  const containerRef = useRef(null);

  // Framer motion values for mask tracking (absolute pixels)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const maskSize = useMotionValue(0);

  // Framer motion values for 3D tilt (normalized -1 to 1)
  const normX = useMotionValue(0);
  const normY = useMotionValue(0);

  // Springs for buttery smooth physics
  const smoothX = useSpring(mouseX, { stiffness: 200, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 200, damping: 25 });
  const smoothSize = useSpring(maskSize, { stiffness: 120, damping: 25 });
  
  const smoothNormX = useSpring(normX, { stiffness: 150, damping: 20 });
  const smoothNormY = useSpring(normY, { stiffness: 150, damping: 20 });

  // Map normalized mouse position to 3D rotation angles
  const rotateX = useTransform(smoothNormY, [-1, 1], [10, -10]);
  const rotateY = useTransform(smoothNormX, [-1, 1], [-10, 10]);

  // Generate the CSS mask image
  const maskImage = useMotionTemplate`radial-gradient(circle at ${smoothX}px ${smoothY}px, transparent 0%, transparent ${smoothSize}px, black calc(${smoothSize}px + 80px))`;

  // Generate a glowing spotlight overlay that tracks the mouse
  const spotlightOverlay = useMotionTemplate`radial-gradient(circle at ${smoothX}px ${smoothY}px, rgba(255,255,255,0.15) 0%, transparent 150px)`;

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Set absolute coordinates for the mask
    mouseX.set(x);
    mouseY.set(y);

    // Set normalized coordinates (-1 to 1) for the 3D tilt
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    normX.set((x - centerX) / centerX);
    normY.set((y - centerY) / centerY);
  };

  const handleMouseEnter = () => {
    maskSize.set(380);
  };

  const handleMouseLeave = () => {
    maskSize.set(0);
    // Reset tilt
    normX.set(0);
    normY.set(0);
  };

  return (
    <section className="py-24 md:py-36 bg-[#111] relative border-t border-white/10 overflow-hidden" style={{ perspective: '2000px' }}>
      
      {/* ═══ Ambient Glows ═══ */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#BCA58A]/15 to-transparent rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#FAF9F6]/5 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left: Text Content */}
          <div className="w-full lg:w-5/12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[#BCA58A] text-[9px] md:text-[11px] tracking-[0.4em] uppercase font-bold"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  A Unique Discovery
                </span>
                <div className="w-12 h-[1px] bg-[#BCA58A]/50" />
              </div>

              <h2 className="text-[40px] sm:text-[50px] md:text-[64px] font-light text-[#FAF9F6] leading-[1.1] tracking-tighter mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Peek Inside <br />
                <span className="italic text-[#BCA58A] font-light">The Magic</span>
              </h2>

              <p className="text-[14px] md:text-[16px] text-white/60 leading-relaxed font-light mb-12 max-w-md" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                True luxury is in the unseen details. Move your cursor over the signature box to act as a spotlight, revealing the meticulous layers of our premium packaging ritual hidden beneath the surface.
              </p>

              {/* Layer Features */}
              <div className="flex flex-col gap-6">
                {[
                  { title: 'Branded Butter Paper', desc: 'Garments delicately enveloped in premium butter paper.' },
                  { title: 'Signature Stickers', desc: 'Custom brand stickers for a perfect, secure finish.' },
                  { title: 'Thank You Card', desc: 'A heartfelt, personalized note of gratitude.' },
                  { title: 'Stamped Business Card', desc: 'Our authentic brand mark stamped with care.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-5 group cursor-default">
                    <div className="w-8 h-8 rounded-full border border-[#BCA58A]/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#BCA58A] transition-colors duration-500">
                      <span className="text-[#BCA58A] group-hover:text-[#111] text-[10px] font-bold transition-colors duration-500">{idx + 1}</span>
                    </div>
                    <div>
                      <h4 className="text-[#FAF9F6] text-[18px] md:text-[20px] font-light mb-1 leading-tight group-hover:text-[#BCA58A] transition-colors duration-500" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {item.title}
                      </h4>
                      <p className="text-white/40 text-[13px] font-light leading-relaxed max-w-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </motion.div>
          </div>

          {/* Right: The Interactive Spotlight Box */}
          <div className="w-full lg:w-7/12 flex justify-center items-center">
            
            {/* The 3D Parallax Wrapper */}
            <motion.div 
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{ 
                rotateX, 
                rotateY,
                transformStyle: "preserve-3d" 
              }}
              className="relative w-full max-w-[460px] aspect-[4/5] cursor-none rounded-md shadow-[0_40px_80px_rgba(0,0,0,0.8)] group"
            >
              
              {/* --- LAYER 1: THE INSIDE (Hidden underneath) --- */}
              <div className="absolute inset-0 bg-[#E8DDD0] border-[16px] md:border-[20px] border-[#D4C3B3] overflow-hidden rounded-md z-0 shadow-inner">
                
                {/* Product Background with deep inner shadow for realistic box depth */}
                <img 
                  src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80" 
                  alt="Folded Premium Fabric" 
                  className="absolute inset-0 w-full h-full object-cover opacity-100 transition-transform duration-[3s] ease-out group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute inset-0 shadow-[inset_0_20px_60px_rgba(0,0,0,0.6)] pointer-events-none z-0" />

                {/* Tissue Wrap Layer */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] flex items-center justify-center pointer-events-none z-0">
                  <div className="w-[calc(100%-40px)] h-[calc(100%-40px)] border-[2px] border-white/20 border-dashed" />
                </div>

                {/* Business Card Layer - Hyper-Realistic Matte Black with Gold Foil */}
                <div className="absolute top-10 left-10 w-[140px] md:w-[150px] aspect-[1.75/1] bg-[#1a1a1a] shadow-[0_15px_30px_rgba(0,0,0,0.7)] flex items-center justify-center transform -rotate-12 transition-transform duration-[1.5s] ease-out group-hover:-rotate-6 z-10 overflow-hidden rounded-[2px]">
                  <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-felt.png')]" />
                  <div className="absolute inset-1 border border-[#D4AF37]/30" />
                  <img src={gurnaazMonogram} alt="Gurnaaz" className="h-[90%] w-auto object-contain relative z-10 mix-blend-screen brightness-110 drop-shadow-md" />
                </div>

                {/* Thank You Card Layer - Hyper-Realistic Textured Paper */}
                <div className="absolute bottom-12 right-6 w-[200px] md:w-[240px] aspect-[3/2] bg-[#FAF9F6] shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center p-5 transform rotate-6 transition-transform duration-[1.5s] ease-out group-hover:rotate-3 z-20 overflow-hidden rounded-[2px]">
                  <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />
                  <div className="absolute inset-2 border border-[#BCA58A]/30" />
                  <span className="text-[#8b7355] font-light text-2xl md:text-3xl italic mb-2 relative z-10 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Thank You
                  </span>
                  <div className="w-10 h-px bg-[#BCA58A]/40 mb-3 relative z-10" />
                  <p className="text-[#555] text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-center relative z-10 font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    For choosing <br/>handcrafted luxury.
                  </p>
                </div>

                {/* Sticker / Stamp Layer - Hyper-Realistic Foil Embossed */}
                <div className="absolute top-1/2 left-8 -translate-y-1/2 transform rotate-12 z-30 transition-transform duration-[1.5s] ease-out group-hover:rotate-0">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-[#1a1a1a] rounded-full shadow-[0_15px_25px_rgba(0,0,0,0.5)] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-felt.png')]" />
                    <div className="absolute inset-[3px] rounded-full border-[1.5px] border-[#D4AF37]/40 flex items-center justify-center bg-[#0a0a0a]">
                       <img src={gurnaazMonogram} alt="G" className="h-[75%] w-auto object-contain mix-blend-screen brightness-110 drop-shadow-sm" />
                    </div>
                  </div>
                </div>

                {/* Ambient glowing spotlight illuminating the inside elements */}
                <motion.div 
                  className="absolute inset-0 pointer-events-none mix-blend-overlay z-40"
                  style={{ background: spotlightOverlay }}
                />
              </div>

              {/* --- LAYER 2: THE LID (Sits on top, gets a hole masked into it!) --- */}
              <motion.div 
                className="absolute inset-0 bg-[#0A0A0A] border-[8px] border-[#1A1A1A] rounded-md flex flex-col items-center justify-center z-50 pointer-events-none"
                style={{ 
                  WebkitMaskImage: maskImage,
                  maskImage: maskImage
                }}
              >
                {/* Ultra-premium lid styling: Double Gold Border */}
                <div className="absolute inset-[12px] border border-[#BCA58A]/30" />
                <div className="absolute inset-[20px] border border-[#BCA58A]/10" />

                {/* Lid Texture */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-40 mix-blend-overlay" />
                
                {/* Center Logo on the Lid */}
                <div className="relative z-10 flex flex-col items-center">
                  <img src={gurnaazMonogram} alt="Gurnaaz" className="h-32 md:h-40 w-auto object-contain mix-blend-screen opacity-90 drop-shadow-2xl" />
                </div>

                {/* Instruction Pill on the Lid */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/5 backdrop-blur-md px-8 py-3 rounded-full border border-white/10 animate-pulse shadow-xl">
                  <span className="text-white/80 text-[10px] md:text-[11px] tracking-[0.2em] uppercase font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Move Cursor to Peek Inside
                  </span>
                </div>
              </motion.div>

              {/* Custom Cursor Ring (Follows the mouse exactly) */}
              <motion.div 
                className="absolute top-0 left-0 w-16 h-16 border border-white/20 rounded-full pointer-events-none z-50 flex items-center justify-center backdrop-blur-[2px] shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                style={{ 
                  x: mouseX, 
                  y: mouseY,
                  translateX: '-50%',
                  translateY: '-50%',
                  opacity: maskSize.get() > 0 ? 1 : 0
                }}
              >
                <div className="w-1.5 h-1.5 bg-[#BCA58A] rounded-full shadow-[0_0_10px_#BCA58A]" />
              </motion.div>

            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
