import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

function getTimeLeft() {
  const now = new Date();
  const rakhi = new Date(now.getFullYear(), 7, 28, 0, 0, 0);
  if (now > rakhi) {
    rakhi.setFullYear(rakhi.getFullYear() + 1);
  }
  const diff = rakhi - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  return { days, hours, mins, secs };
}

export default function HeroRitual({ onSelectFilter }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={ref} className="relative w-full min-h-screen overflow-hidden bg-white flex flex-col pt-10">
      
      {/* Grid Pattern Background - Light Theme */}
      <div className="absolute inset-0 opacity-[0.2] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#8B1A1A 1px, transparent 1px), linear-gradient(90deg, #8B1A1A 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />

      {/* Main Headline */}
      <div className="relative z-20 flex flex-col items-center text-center mt-20 md:mt-24 px-4">
        <div className="inline-block bg-[#1A0008] text-[#F5D76E] font-bold px-4 py-1.5 rounded-full border border-[#D4AF37]/50 shadow-[0_4px_15px_rgba(0,0,0,0.1)] mb-4 uppercase tracking-[0.2em] text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          🔥 The Ultimate Rakhi Sale
        </div>
        
        <h1 className="text-[10vw] md:text-[6vw] lg:text-[4.5vw] font-light leading-[1.1] tracking-tight text-[#1A0008] max-w-5xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Celebrate the purest bond. Claim <br className="hidden md:block" />
          the best offers on our <span className="relative inline-block px-2">
            <span className="relative z-10 text-[#8B1A1A] italic">exclusive collection.</span>
            {/* Soft Gold Highlight behind text */}
            <span className="absolute bottom-1 left-0 w-full h-[40%] bg-[#F5D76E]/60 -z-10 -rotate-1" />
          </span>
        </h1>
        
        <p className="mt-6 text-[#555] text-[14px] md:text-[16px] max-w-2xl tracking-wide font-light" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Up to 40% Off on premium ethnic suits and signature Rakhi boxes. <br className="hidden md:block" />
          Every order includes the exclusive 'Behen Ki Awaaz' QR card.
        </p>

        {mounted && (
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="text-sm bg-white border border-[#D4AF37] px-5 py-2.5 rounded-full shadow-[4px_4px_0px_rgba(26,0,8,1)] flex items-center gap-3 font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <span className="text-[#8B1A1A] tracking-widest text-[10px]">OFFER ENDS IN:</span>
              <span className="text-[#1A0008] tabular-nums tracking-widest text-[12px]">{String(timeLeft.days).padStart(2, '0')}d : {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.mins).padStart(2, '0')}m</span>
            </div>
            <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#1A0008]/50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Offer valid till August 28th
            </p>
          </div>
        )}
      </div>

      {/* Overlapping Cards Container (Daisy Style in Light Theme) */}
      <div className="relative z-10 w-full flex-grow mt-16 pb-32 flex justify-center items-center overflow-x-visible">
        <div className="relative w-full max-w-[1100px] h-[400px] md:h-[500px] mx-auto">
          
          {/* Card 1: The Suit Photo (Polaroid style) */}
          <motion.div 
            initial={{ opacity: 0, y: 100, rotate: -20 }}
            animate={{ opacity: 1, y: 0, rotate: -12 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
            className="absolute left-[2%] md:left-[6%] top-[10%] w-[180px] md:w-[260px] h-[250px] md:h-[360px] bg-white p-2 pb-10 border-2 border-[#1A0008] rounded-sm shadow-xl z-10 group"
          >
            <div className="w-full h-full overflow-hidden bg-[#E8DDD0] border border-gray-200">
              <img src="/model_maroon_suit_bgless.png" alt="Suit" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
            </div>
            
            {/* Sticker Top Left */}
            <div className="absolute -top-4 -left-6 bg-[#D4AF37] border-2 border-[#1A0008] px-3 py-1.5 rounded-md text-[#1A0008] text-xs font-black tracking-widest rotate-[-10deg] shadow-[3px_3px_0px_rgba(26,0,8,1)]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              THE FESTIVE EDIT
            </div>
          </motion.div>

          {/* Card 2: The Audio QR Box (Dark Contrast Theme) */}
          <motion.div 
            initial={{ opacity: 0, y: 100, rotate: 10 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
            className="absolute left-[22%] md:left-[24%] top-[5%] w-[200px] md:w-[300px] h-[280px] md:h-[400px] bg-[#1A0008] border-2 border-[#1A0008] rounded-2xl p-6 shadow-2xl z-20 flex flex-col justify-center items-center text-center text-white relative overflow-hidden"
          >
            {/* Subtle background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/20 via-transparent to-transparent opacity-50" />
            
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white border-2 border-[#D4AF37] p-1.5 rounded-lg mb-4 flex items-center justify-center relative z-10 shadow-[3px_3px_0px_rgba(212,175,55,1)]">
              {/* Real-looking Dummy QR Code */}
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Gurnaaz+Rakhi+Special" alt="QR Code" className="w-full h-full object-contain opacity-90" />
            </div>
            
            <h3 className="text-[28px] md:text-[34px] mb-2 leading-tight text-[#F5D76E]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Behen<br/>Ki Awaaz
            </h3>
            
            <p className="text-[10px] md:text-[12px] text-[#FAF9F6]/80 border border-[#D4AF37]/30 p-2.5 rounded-lg w-full bg-white/5 relative z-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Scan the QR in your box to hear her voice note. 🎙️
            </p>
            
            <div className="absolute bottom-5 text-[9px] tracking-[0.3em] text-[#D4AF37] uppercase font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Scan to Play
            </div>
          </motion.div>

          {/* Card 3: The Rakhi Graphic (Light Gold/Maroon Theme) */}
          <motion.div 
            initial={{ opacity: 0, y: 100, rotate: -5 }}
            animate={{ opacity: 1, y: 0, rotate: 6 }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
            className="absolute right-[22%] md:right-[24%] top-[12%] md:top-[15%] w-[180px] md:w-[250px] h-[260px] md:h-[350px] bg-[#F5D76E] border-2 border-[#1A0008] rounded-2xl p-4 shadow-xl z-30 flex flex-col justify-between"
          >
            <div className="text-center text-xl md:text-2xl mt-4 text-[#1A0008]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Premium <br/> Bhabhi Rakhis
            </div>
            <div className="flex-grow flex items-center justify-center">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-[3px] border-[#1A0008] shadow-[4px_4px_0px_rgba(26,0,8,1)] bg-white p-1">
                <img src="/rakhi_campaign_hero.png" alt="Signature Rakhi" className="w-full h-full object-cover rounded-full" />
              </div>
            </div>
            <div className="text-[9px] md:text-[10px] border-t-2 border-[#1A0008]/20 pt-3 text-[#1A0008]/80 text-center tracking-widest uppercase font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Included in Signature Box
            </div>
          </motion.div>

          {/* Card 4: Model Image 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 100, rotate: 15 }}
            animate={{ opacity: 1, y: 0, rotate: 12 }}
            transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
            className="absolute right-[2%] md:right-[6%] top-[8%] w-[160px] md:w-[240px] h-[230px] md:h-[320px] bg-white p-2 pb-10 border-2 border-[#1A0008] rounded-sm overflow-hidden shadow-xl z-10 group"
          >
            <div className="w-full h-full rounded-sm overflow-hidden bg-[#FAF9F6] border border-[#1A0008]/10">
              <img src="/designer_suit_1.png" alt="Suit" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
            </div>
            
            {/* Sticker Bottom Right */}
            <div className="absolute bottom-2 -right-4 bg-[#8B1A1A] border-2 border-[#1A0008] px-3 py-2 rounded-md text-[#FAF9F6] text-[10px] font-bold tracking-wider rotate-[-5deg] shadow-[3px_3px_0px_rgba(26,0,8,1)] z-30" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              GIFT HER THE BEST
            </div>
          </motion.div>

          {/* Spinning Circle Text */}
          <div className="absolute top-[-20px] right-[20%] md:right-[30%] w-24 h-24 md:w-32 md:h-32 z-30">
            <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_12s_linear_infinite]">
              <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
              <text className="text-[11px] font-black tracking-[0.2em] fill-[#1A0008]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <textPath href="#circlePath">
                  FLAT 40% OFF SALE • LIVE IN BANARAS •
                </textPath>
              </text>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F5D76E] border-2 border-[#1A0008] shadow-[2px_2px_0px_rgba(26,0,8,1)]"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
