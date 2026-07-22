import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function HeroRitual() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const yImage = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section ref={containerRef} className="relative w-full h-screen min-h-[850px] bg-[#FAF9F6] pt-[15vh] overflow-hidden flex flex-col items-center">
      
      {/* Massive Background Typography */}
      <motion.div 
        style={{ y: yText }}
        className="absolute top-[12%] left-0 right-0 w-full flex flex-col items-center justify-center text-center z-0 pointer-events-none select-none px-4"
      >
        <h1 className="text-[8vw] leading-[1.05] font-black text-[#111111] uppercase tracking-tighter" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          HERITAGE THAT <br/> SPEAKS <br/> BEFORE YOU DO
        </h1>
      </motion.div>

      <div className="max-w-[1600px] w-full h-full mx-auto relative z-10">
        
        {/* Center: Cutout Model (Replicated from Seller Hero) */}
        <motion.div 
          style={{ 
            y: yImage, 
            x: '-50%',
            width: 'clamp(480px, 120vw, 1500px)' 
          }}
          initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-[14vh] left-[50%] h-[92vh] z-30 pointer-events-none overflow-visible"
        >
          <img 
            src="/luxury_model_truly_transparent.png" 
            alt="Model" 
            className="w-full h-[120%] lg:h-[130%] object-contain object-bottom block origin-bottom transition-transform duration-700 pointer-events-auto hover:scale-[1.05]"
            style={{ 
              transform: 'scale(1.10)',
              filter: "drop-shadow(0px 30px 50px rgba(0,0,0,0.3))"
            }}
          />
        </motion.div>
          
        {/* Left Column: Text & Avatars (Absolute Bottom Left) */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.2 }}
          className="hidden md:flex flex-col justify-end absolute left-8 lg:left-12 bottom-[28%] max-w-[280px] z-40 bg-[#FAF9F6]/60 backdrop-blur-md p-6 rounded-3xl lg:bg-transparent lg:backdrop-blur-none lg:p-0 lg:rounded-none"
        >
          <p className="text-[12px] text-[#111111]/80 leading-[2] font-bold uppercase tracking-widest mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Discover the latest drops curated for everyday elegance — bold looks with timeless vibes.
          </p>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              <img src="/banarasi_suit.png" className="w-12 h-12 rounded-full border-2 border-[#FAF9F6] shadow-sm object-cover object-top" alt="Suit" />
              <img src="/anarkali_suit.png" className="w-12 h-12 rounded-full border-2 border-[#FAF9F6] shadow-sm object-cover object-top" alt="Suit" />
              <img src="/chikankari_suit.png" className="w-12 h-12 rounded-full border-2 border-[#FAF9F6] shadow-sm object-cover object-top" alt="Suit" />
              <div className="w-12 h-12 rounded-full border-2 border-[#FAF9F6] bg-[#111111] shadow-sm flex items-center justify-center text-white cursor-pointer hover:bg-[#BCA58A] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Stats Grid (Absolute Bottom Right) */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.4 }}
          className="hidden md:grid grid-cols-2 gap-x-6 gap-y-10 absolute right-8 lg:right-12 bottom-[25%] z-40 bg-[#FAF9F6]/60 backdrop-blur-md p-6 rounded-3xl lg:bg-transparent lg:backdrop-blur-none lg:p-0 lg:rounded-none"
        >
          <div>
            <h3 className="text-3xl xl:text-4xl font-black text-[#111111] tracking-tighter mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>10K+</h3>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#111111]/70 leading-relaxed">Happy<br/>Shoppers</p>
          </div>
          <div>
            <h3 className="text-3xl xl:text-4xl font-black text-[#111111] tracking-tighter mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>100+</h3>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#111111]/70 leading-relaxed">Unique<br/>Styles</p>
          </div>
          <div>
            <h3 className="text-3xl xl:text-4xl font-black text-[#111111] tracking-tighter mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>50+</h3>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#111111]/70 leading-relaxed">Countries<br/>Served</p>
          </div>
          <div>
            <h3 className="text-3xl xl:text-4xl font-black text-[#111111] tracking-tighter mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>250K+</h3>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#111111]/70 leading-relaxed">Products<br/>Sold</p>
          </div>
        </motion.div>

        {/* Bottom Center: Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6 }}
          className="absolute bottom-[10%] left-1/2 -translate-x-1/2 z-50"
        >
          <a href="#categories" className="inline-flex items-center gap-3 bg-[#111111] text-white hover:bg-[#BCA58A] transition-colors px-10 py-4 xl:px-12 xl:py-5 rounded-full shadow-2xl group">
            <span className="text-[11px] xl:text-[12px] font-bold tracking-[0.1em] uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>Start Shopping</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </motion.div>

      </div>

      {/* Slanted Bottom Marquee */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden z-[60] origin-bottom-left -rotate-2 scale-[1.05] translate-y-3">
        <div className="w-full bg-[#111111] py-3 xl:py-4 flex overflow-hidden whitespace-nowrap shadow-2xl border-t border-[#111111]">
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-12 text-white text-[13px] xl:text-[15px] font-black uppercase tracking-[0.3em]" style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {Array(15).fill('GURNAAZ ✦').map((text, i) => (
              <span key={i}>{text}</span>
            ))}
          </motion.div>
        </div>
      </div>

    </section>
  );
}
