import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getFestiveOffers } from '../utils/adminStore';

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

export default function RakhiSaleOfferSection({ setView, setSelectedCategory, addToCart }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [copied, setCopied] = useState(false);
  const [offers, setOffers] = useState(() => getFestiveOffers().filter(o => o.active !== false));

  useEffect(() => {
    const handleUpdate = () => {
      setOffers(getFestiveOffers().filter(o => o.active !== false));
    };
    window.addEventListener('admin-data-updated', handleUpdate);
    return () => window.removeEventListener('admin-data-updated', handleUpdate);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText('RAKHI50');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCategoryClick = (catName) => {
    if (setSelectedCategory) setSelectedCategory(catName);
    if (setView) setView('category');
  };

  return (
    <section id="rakhi-offers-sale" className="relative w-full py-20 bg-[#FAF9F6] text-[#1A0008] border-y border-[#1A0008]/10 overflow-hidden">
      
      {/* Top Gold Continuous Marquee Ribbon */}
      <div className="w-full bg-[#1A0008] text-[#F5D76E] py-3 overflow-hidden flex whitespace-nowrap border-b border-[#D4AF37]/50 shadow-md">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, duration: 22, ease: 'linear' }}
          className="flex items-center gap-10 font-bold text-xs uppercase tracking-[0.25em]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <span>✨ RAKSHA BANDHAN FESTIVAL SALE • UP TO 50% OFF</span>
          <span>✦</span>
          <span>FREE 925 SILVER RAKHI WITH EVERY SUIT</span>
          <span>✦</span>
          <span>FREE 'BEHEN KI AWAAZ' AUDIO QR CARD IN GIFT BOXES</span>
          <span>✦</span>
          <span>COMPLIMENTARY EXPRESS WORLDWIDE DISPATCH</span>
          <span>✦</span>
          <span>✨ RAKSHA BANDHAN FESTIVAL SALE • UP TO 50% OFF</span>
          <span>✦</span>
        </motion.div>
      </div>

      {/* Signature Fine Grid Pattern Texture */}
      <div 
        className="absolute inset-0 opacity-[0.12] pointer-events-none mt-12"
        style={{
          backgroundImage: 'linear-gradient(#8B1A1A 1px, transparent 1px), linear-gradient(90deg, #8B1A1A 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }} 
      />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10 pt-10">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <span 
            className="text-2xl md:text-3xl text-[#8B1A1A] font-normal mb-1" 
            style={{ fontFamily: "'Great Vibes', cursive" }}
          >
            Celebrations of Love & Tradition
          </span>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-[#1A0008] tracking-tight max-w-4xl leading-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Raksha Bandhan <span className="relative inline-block px-2">
              <span className="relative z-10 text-[#8B1A1A] italic font-normal">Grand Festive Edit</span>
              <span className="absolute bottom-2 left-0 w-full h-[35%] bg-[#F5D76E]/70 -z-10 -rotate-1" />
            </span>
          </h2>

          <p className="mt-4 text-[#555] text-sm md:text-base max-w-2xl font-light tracking-wide leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Explore special festive bundles featuring Designer Suits, Kashmiri Churi bangles, Gold Kadas, Kids Rakhis, and personalized audio gift box hampers.
          </p>
        </div>

        {/* High-End Fashion Staggered Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-24 items-center">
          
          {/* LEFT SIDE (5/12): Hero Magazine Cover */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Arched Magazine Window */}
            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-t-full rounded-b-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(26,0,8,0.2)] border-[8px] border-white group z-10">
              
              <img 
                src="/rakhi_suit_hero_shoot.jpg" 
                alt="Festive Collection" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" 
              />
              
              {/* Rich gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0008] via-[#1A0008]/40 to-transparent opacity-90" />
              
              {/* Content overlay */}
              <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end text-white z-20">
                <div className="mb-4">
                  <span className="bg-[#D4AF37] text-[#1A0008] text-[9px] font-black uppercase px-4 py-1.5 rounded-full tracking-[0.25em] shadow-lg">
                    Grand Campaign
                  </span>
                </div>
                
                <h3 className="text-5xl lg:text-6xl font-light leading-[1.05] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Up to <span className="text-[#D4AF37] italic font-normal">50%</span> Off
                </h3>
                
                <p className="text-[13px] text-gray-200 font-light mb-8 leading-relaxed max-w-[90%]">
                  Exclusive Rakhi bundles featuring premium Silk Suits & audio QR gift hampers.
                </p>

                {/* Minimalist Floating Timer */}
                <div className="flex items-center justify-between gap-3 mb-8 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 shadow-inner">
                    <div className="flex flex-col items-center flex-1">
                      <span className="text-xl font-light text-white tabular-nums">{String(timeLeft.days).padStart(2, '0')}</span>
                      <span className="text-[7px] text-[#D4AF37] uppercase font-bold tracking-widest mt-1">Days</span>
                    </div>
                    <span className="text-white/30 text-xl font-light">:</span>
                    <div className="flex flex-col items-center flex-1">
                      <span className="text-xl font-light text-white tabular-nums">{String(timeLeft.hours).padStart(2, '0')}</span>
                      <span className="text-[7px] text-[#D4AF37] uppercase font-bold tracking-widest mt-1">Hrs</span>
                    </div>
                    <span className="text-white/30 text-xl font-light">:</span>
                    <div className="flex flex-col items-center flex-1">
                      <span className="text-xl font-light text-white tabular-nums">{String(timeLeft.mins).padStart(2, '0')}</span>
                      <span className="text-[7px] text-[#D4AF37] uppercase font-bold tracking-widest mt-1">Mins</span>
                    </div>
                    <span className="text-white/30 text-xl font-light">:</span>
                    <div className="flex flex-col items-center flex-1">
                      <span className="text-xl font-light text-white tabular-nums">{String(timeLeft.secs).padStart(2, '0')}</span>
                      <span className="text-[7px] text-[#D4AF37] uppercase font-bold tracking-widest mt-1">Secs</span>
                    </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between">
                    <span className="text-[8px] text-gray-400 uppercase tracking-widest">Code</span>
                    <span className="font-mono text-sm font-bold text-[#D4AF37]">RAKHI50</span>
                  </div>
                  <button onClick={handleCopyCode} className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#1A0008] hover:bg-[#D4AF37] transition-colors shrink-0">
                    {copied ? <span className="text-sm font-bold">✓</span> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Rotating Graphic Badge */}
            <div className="absolute top-12 -right-6 lg:-right-10 w-28 h-28 bg-[#D4AF37] rounded-full flex items-center justify-center animate-[spin_12s_linear_infinite] shadow-[0_10px_30px_rgba(212,175,55,0.4)] z-20 border-4 border-[#FAF9F6] hidden md:flex">
               <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                 <path id="textPath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
                 <text className="text-[11.5px] font-black uppercase tracking-[0.25em]" fill="#1A0008">
                   <textPath href="#textPath" startOffset="0%">★ LIMITED EDITION ★ FESTIVE SALE</textPath>
                 </text>
               </svg>
               <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-xl">✨</span>
               </div>
            </div>
          </div>

          {/* RIGHT SIDE (7/12): Staggered Bare Capsule Products */}
          <div className="lg:col-span-7 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 lg:gap-y-0 px-2 lg:px-0">
            {offers.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
                className={`flex flex-col group cursor-pointer ${index % 2 === 1 ? 'lg:mt-16' : 'lg:-mt-10'}`}
                onClick={() => handleCategoryClick(item.category)}
              >
                {/* Image Container with out-of-bounds badge */}
                <div className="w-full aspect-[2/3.2] mb-6 relative">
                  
                  {/* Bare Image in Capsule Shape (No white card) */}
                  <div className="w-full h-full rounded-full overflow-hidden relative shadow-[0_15px_40px_rgba(26,0,8,0.08)] border-[5px] border-white group-hover:border-[#D4AF37]/30 transition-all duration-500">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" 
                    />
                    
                    {/* Subtle Dark Gradient at bottom for contrast if needed */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Floating Action Button inside image */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-[9px] font-black uppercase text-[#1A0008] tracking-widest shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 whitespace-nowrap">
                      View Details
                    </div>
                  </div>
                  
                  {/* Chic floating badge intersecting the bottom border (Moved from top to avoid covering faces) */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#1A0008] text-[#F5D76E] text-[8px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest whitespace-nowrap shadow-md z-10 border border-[#D4AF37]/20">
                    {item.badge}
                  </div>
                </div>

                {/* Free-floating Typography below image */}
                <div className="text-center px-2 flex flex-col items-center">
                  <span className="text-[9px] text-[#D4AF37] font-black uppercase tracking-[0.25em] mb-2 flex items-center gap-2">
                    <span className="w-2 h-[1px] bg-[#D4AF37]/50"></span>
                    {item.category}
                    <span className="w-2 h-[1px] bg-[#D4AF37]/50"></span>
                  </span>
                  
                  <h4 className="text-[1.1rem] lg:text-lg font-bold text-[#1A0008] leading-tight mb-2 group-hover:text-[#8B1A1A] transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {item.title}
                  </h4>

                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] text-gray-400 line-through font-light">{item.originalPrice}</span>
                    <span className="text-[15px] font-bold text-[#1A0008]">{item.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Customer Trust Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center pt-6 border-t border-[#1A0008]/10">
          <div className="p-4 bg-white rounded-2xl border border-gray-200/80 flex flex-col items-center shadow-sm">
            <span className="text-2xl mb-1">🛡️</span>
            <span className="text-xs font-bold text-[#1A0008]">100% Pure Handloom Silk</span>
            <span className="text-[10px] text-gray-500 font-light">Crafted by Master Artisans</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-gray-200/80 flex flex-col items-center shadow-sm">
            <span className="text-2xl mb-1">🎙️</span>
            <span className="text-xs font-bold text-[#1A0008]">Behen Ki Awaaz Voice Card</span>
            <span className="text-[10px] text-gray-500 font-light">Free inside every gift box</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-gray-200/80 flex flex-col items-center shadow-sm">
            <span className="text-2xl mb-1">🚚</span>
            <span className="text-xs font-bold text-[#1A0008]">48-Hour Dispatch Guarantee</span>
            <span className="text-[10px] text-gray-500 font-light">Express delivery before Rakhi</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-gray-200/80 flex flex-col items-center shadow-sm">
            <span className="text-2xl mb-1">🎁</span>
            <span className="text-xs font-bold text-[#1A0008]">Signature Velvet Packaging</span>
            <span className="text-[10px] text-gray-500 font-light">Keepsake gift box included</span>
          </div>
        </div>

      </div>
    </section>
  );
}
