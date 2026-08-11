import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

function getTimeLeft() {
  const now = new Date();
  const rakhi = new Date(now.getFullYear(), 7, 28, 23, 59, 59);
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', handleResize);
    };
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
        
        <p className="mt-6 text-[#555] text-[13px] sm:text-[14px] md:text-[16px] max-w-2xl tracking-wide font-light px-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Up to 50% Off on premium ethnic suits and signature Rakhi boxes. <br className="hidden md:block" />
          Every order includes the exclusive 'Behen Ki Awaaz' QR card.
        </p>

        {mounted && (
          <div className="mt-6 flex flex-col items-center gap-4">
            <div className="text-sm bg-white/80 backdrop-blur-md border-2 border-[#D4AF37] px-6 py-2.5 rounded-full shadow-[0_10px_30px_rgba(212,175,55,0.25)] flex items-center gap-3 font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <span className="text-[#8B1A1A] tracking-widest text-[11px] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#8B1A1A] animate-ping" />
                FESTIVE SALE ENDS IN:
              </span>
              <span className="text-[#1A0008] tabular-nums tracking-widest text-[13px] font-black">{String(timeLeft.days).padStart(2, '0')}d : {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.mins).padStart(2, '0')}m : {String(timeLeft.secs).padStart(2, '0')}s</span>
            </div>

            <button 
              onClick={() => {
                const el = document.getElementById('rakhi-offers-sale');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mt-2 inline-flex items-center gap-2 bg-[#1A0008] hover:bg-[#8B1A1A] text-[#F5D76E] px-7 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-bold transition-all transform hover:scale-105 shadow-xl border border-[#D4AF37]/40"
            >
              Explore Exclusive Offers ↓
            </button>
          </div>
        )}
      </div>

      {/* Overlapping Cards Container (Daisy Style in Light Theme) */}
      <div className="relative z-10 w-full flex-grow mt-8 md:mt-12 pb-16 md:pb-28 flex justify-center items-center overflow-visible px-6 sm:px-10 lg:px-0">
        <div className="relative w-full max-w-[1100px] lg:h-[500px] mx-auto grid grid-cols-2 gap-4 sm:gap-6 lg:block">
          
          {/* Card 1: The Suit Photo (Polaroid style with Gold Border) */}
          <motion.div 
            initial={{ opacity: 0, y: 50, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: isMobile ? 0 : -12 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
            whileHover={{ scale: 1.05, rotate: isMobile ? 0 : -8, zIndex: 40 }}
            className="relative lg:absolute lg:left-[6%] lg:top-[10%] w-full lg:w-[270px] aspect-[3/4] lg:aspect-auto lg:h-[370px] bg-white p-1.5 md:p-2.5 pb-8 md:pb-10 border md:border-2 border-[#D4AF37] rounded-xl shadow-lg md:shadow-[0_20px_50px_rgba(26,0,8,0.2)] z-10 group transition-all"
          >
            <div className="w-full h-full overflow-hidden bg-[#E8DDD0] rounded-lg border border-gray-200 relative">
              <img src="/rakhi_suit_hero_shoot.jpg" alt="Rakhi Suit Model Shoot" className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0008]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2 md:p-3 text-white text-[9px] md:text-xs font-bold">
                Silk Patiala & Silver Rakhi Set
              </div>
            </div>
            
            {/* Sticker Top Left */}
            <div className="absolute -top-2 -left-2 lg:-top-4 lg:-left-6 bg-[#D4AF37] border md:border-2 border-[#1A0008] px-2 py-1 md:px-3.5 md:py-1.5 rounded-md md:rounded-lg text-[#1A0008] text-[7px] md:text-xs font-black tracking-widest rotate-[-10deg] shadow-[2px_2px_0px_rgba(26,0,8,1)] md:shadow-[3px_3px_0px_rgba(26,0,8,1)] z-20" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              THE FESTIVE EDIT
            </div>
          </motion.div>

          {/* Card 2: The Audio QR Box (Dark Contrast Theme with Gold Glow) */}
          <motion.div 
            initial={{ opacity: 0, y: 50, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: isMobile ? 0 : -2 }}
            transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
            whileHover={{ scale: 1.05, rotate: 0, zIndex: 40 }}
            className="relative lg:absolute lg:left-[24%] lg:top-[5%] w-full lg:w-[310px] aspect-[3/4] lg:aspect-auto lg:h-[410px] bg-[#1A0008] border md:border-2 border-[#D4AF37] rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg md:shadow-[0_25px_60px_rgba(212,175,55,0.3)] z-20 flex flex-col justify-center items-center text-center text-white overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/30 via-transparent to-transparent opacity-60 pointer-events-none" />
            
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white border md:border-2 border-[#D4AF37] p-1 md:p-1.5 rounded-lg md:rounded-xl mb-2 md:mb-4 flex items-center justify-center relative z-10 shadow-[2px_2px_0px_rgba(212,175,55,1)] md:shadow-[4px_4px_0px_rgba(212,175,55,1)]">
              {/* Dummy QR Code */}
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Gurnaaz+Rakhi+Special" alt="QR Code" className="w-full h-full object-contain opacity-90" />
            </div>
            
            <h3 className="text-[16px] sm:text-[22px] md:text-[36px] mb-1 md:mb-2 leading-tight text-[#F5D76E] font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Behen<br/>Ki Awaaz 🎙️
            </h3>
            
            <p className="text-[7px] sm:text-[9px] md:text-[12px] text-[#FAF9F6]/90 border border-[#D4AF37]/40 p-1.5 md:p-2.5 rounded-lg md:rounded-xl w-full bg-white/10 relative z-10 backdrop-blur-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Scan the QR code inside your gift box to play her voice note.
            </p>
            
            <div className="absolute bottom-3 md:bottom-5 text-[6px] md:text-[9px] tracking-[0.2em] md:tracking-[0.3em] text-[#D4AF37] uppercase font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Scan to Play Audio
            </div>
          </motion.div>

          {/* Card 3: The Rakhi Graphic (Light Gold/Maroon Theme) */}
          <motion.div 
            initial={{ opacity: 0, y: 50, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: isMobile ? 0 : 6 }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
            whileHover={{ scale: 1.05, rotate: isMobile ? 0 : 3, zIndex: 40 }}
            className="relative lg:absolute lg:right-[24%] lg:top-[15%] w-full lg:w-[260px] aspect-[3/4] lg:aspect-auto lg:h-[360px] bg-[#F5D76E] border md:border-2 border-[#1A0008] rounded-xl md:rounded-2xl p-2 md:p-4 shadow-lg md:shadow-[0_20px_50px_rgba(26,0,8,0.2)] z-30 flex flex-col justify-between"
          >
            <div className="text-center text-sm sm:text-lg md:text-2xl mt-2 md:mt-4 text-[#1A0008] font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Signature <br/> Silver Rakhis
            </div>
            <div className="flex-grow flex items-center justify-center">
              <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-[2px] md:border-[3px] border-[#1A0008] shadow-[2px_2px_0px_rgba(26,0,8,1)] md:shadow-[4px_4px_0px_rgba(26,0,8,1)] bg-white p-0.5 md:p-1">
                <img src="/rakhi_campaign_hero.png" alt="Signature Rakhi" className="w-full h-full object-cover rounded-full hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="text-[6px] sm:text-[7px] md:text-[10px] border-t border-[#1A0008]/20 md:border-t-2 pt-2 md:pt-3 text-[#1A0008] text-center tracking-[0.1em] md:tracking-widest uppercase font-black" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Included in Gift Hampers
            </div>
          </motion.div>

          {/* Card 4: Model Image 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 50, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: isMobile ? 0 : 12 }}
            transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
            whileHover={{ scale: 1.05, rotate: isMobile ? 0 : 8, zIndex: 40 }}
            className="relative lg:absolute lg:right-[6%] lg:top-[8%] w-full lg:w-[250px] aspect-[3/4] lg:aspect-auto lg:h-[330px] bg-white p-1.5 md:p-2.5 pb-8 md:pb-10 border md:border-2 border-[#D4AF37] rounded-xl overflow-hidden shadow-lg md:shadow-[0_20px_50px_rgba(26,0,8,0.2)] z-10 group"
          >
            <div className="w-full h-full rounded-lg overflow-hidden bg-[#FAF9F6] border border-[#1A0008]/10">
              <img src="/designer_suit_1.png" alt="Designer Suit" className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700" />
            </div>
            
            {/* Sticker Bottom Right */}
            <div className="absolute bottom-1 -right-2 lg:bottom-2 lg:-right-4 bg-[#8B1A1A] border md:border-2 border-[#1A0008] px-2 py-1 md:px-3 md:py-2 rounded-md md:rounded-lg text-[#FAF9F6] text-[6px] md:text-[10px] font-bold tracking-wider rotate-[-5deg] shadow-[2px_2px_0px_rgba(26,0,8,1)] md:shadow-[3px_3px_0px_rgba(26,0,8,1)] z-30" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              GIFT HER THE BEST
            </div>
          </motion.div>

          {/* Spinning Circle Text */}
          <div className="absolute top-[50%] left-[50%] lg:top-[-20px] lg:left-auto lg:right-[30%] -translate-x-1/2 -translate-y-1/2 lg:translate-x-0 lg:translate-y-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 z-50 pointer-events-none lg:pointer-events-auto flex items-center justify-center">
            
            {/* Backdrop circle to prevent text clashing with dark cards */}
            <div className="absolute inset-0 bg-[#FAF9F6] rounded-full shadow-lg border border-[#D4AF37]/40 scale-95" />

            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible animate-[spin_12s_linear_infinite] relative z-10">
              <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
              <text fontSize="10.5" fontWeight="900" letterSpacing="1.5" fill="#8B1A1A" style={{ fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase' }}>
                <textPath href="#circlePath" startOffset="0%">
                  UP TO 50% OFF SALE • LIVE IN BANARAS •
                </textPath>
              </text>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F5D76E] border-2 border-[#1A0008] shadow-[2px_2px_0px_rgba(26,0,8,1)]"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
