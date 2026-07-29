import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const sparkles = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  x: 5 + Math.random() * 90,
  y: 5 + Math.random() * 90,
  size: 3 + Math.random() * 8,
  delay: Math.random() * 6,
}));

export default function HeroRitual() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section ref={ref} className="relative w-full h-screen min-h-[800px] overflow-hidden bg-[#FAF9F6]">

      {/* HERO WRAPPER */}
      <div className="w-full h-full flex flex-col lg:flex-row">
        
        {/* LEFT PANEL - Festive Red */}
        <div className="relative lg:w-[55%] h-[55vh] lg:h-full flex flex-col items-center justify-center overflow-hidden px-6 md:px-12"
          style={{ background: 'linear-gradient(145deg, #8B1A1A 0%, #5C1018 40%, #3D000B 100%)' }}
        >
          {/* Decorative golden dots */}
          <div className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />

          {/* Sparkles */}
          {sparkles.map(s => (
            <motion.div
              key={s.id}
              className="absolute rounded-full bg-[#D4AF37] pointer-events-none"
              style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
              animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
            />
          ))}

          {/* Large background text */}
          <h2 className="absolute text-[20vw] lg:text-[14vw] font-black text-white/5 select-none pointer-events-none tracking-tighter"
            style={{ fontFamily: "'Montserrat', sans-serif", top: '5%', right: '-5%' }}>
            RAKHI
          </h2>

          {/* Content */}
          <div className="relative z-10 text-center lg:text-left">
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-[10px] tracking-[0.3em] font-bold text-[#D4AF37] uppercase border border-[#D4AF37]/30 px-4 py-2 rounded-full mb-6"
                style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Raksha Bandhan Special
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-white"
            >
              <span className="text-[14vw] sm:text-[12vw] md:text-[10vw] lg:text-[7vw] font-black leading-[1] tracking-tighter block"
                style={{ fontFamily: "'Montserrat', sans-serif" }}>
                RAKHI
              </span>
              <span className="text-[10vw] sm:text-[8vw] md:text-[6vw] lg:text-[4.5vw] font-light tracking-[0.08em] text-[#D4AF37] block -mt-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Special Collection
              </span>
            </motion.h1>

            {/* Offer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-6"
            >
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-[#D4AF37]/30 rounded-full px-6 py-3">
                <span className="text-[#D4AF37] text-[13px] md:text-[15px] font-black tracking-[0.1em]"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  FLAT 40% OFF
                </span>
                <span className="text-white/50 text-[10px] tracking-[0.15em] uppercase">+ Free Gift Wrap</span>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mt-8"
            >
              <a href="#categories"
                className="inline-flex items-center gap-3 bg-[#D4AF37] text-[#3D000B] hover:bg-white transition-colors px-10 py-4 md:px-12 md:py-4 rounded-full text-[11px] md:text-[12px] font-black tracking-[0.15em] uppercase shadow-2xl"
                style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Shop Now
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </motion.div>
          </div>

          {/* Bottom decorative strip */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
        </div>

        {/* RIGHT PANEL - Model */}
        <div className="relative lg:w-[45%] h-[45vh] lg:h-full flex items-center justify-center overflow-hidden bg-[#FAF9F6]">
          
          {/* Model image */}
          <motion.div
            style={{ y: imgY }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="h-full w-full flex items-end justify-center"
          >
            <img
              src="/luxury_model_truly_transparent.png"
              alt="Rakhi Collection"
              className="h-[95%] w-auto object-contain object-bottom"
              style={{ filter: 'drop-shadow(0px 20px 50px rgba(0,0,0,0.06))' }}
              onError={(e) => {
                e.target.src = '/model_maroon_suit_bgless.png';
                e.onerror = () => {
                  e.target.src = '/hero_model_red_bgless.png';
                };
              }}
            />
          </motion.div>

          {/* Floating badges */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="absolute top-[8%] right-[8%] bg-white shadow-lg rounded-xl px-4 py-3 border border-[#BCA58A]/10"
          >
            <p className="text-[10px] font-bold text-[#111111] tracking-[0.05em]"
              style={{ fontFamily: "'Montserrat', sans-serif" }}>
              500+ Styles
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="absolute bottom-[12%] left-[8%] bg-white shadow-lg rounded-xl px-4 py-3 border border-[#BCA58A]/10"
          >
            <p className="text-[10px] font-bold text-[#111111] tracking-[0.05em]"
              style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Free Gift Wrap
            </p>
          </motion.div>
        </div>

      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 hidden md:block"
      >
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-1">
          <span className="text-[8px] tracking-[0.2em] uppercase text-[#111111]/30 font-bold">Scroll</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.5" className="opacity-30"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
