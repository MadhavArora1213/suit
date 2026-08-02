import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

const FEATURED_OFFERS = [
  {
    id: 'suit_combo',
    title: 'Gulabi Silk Patiala & Silver Rakhi Set',
    category: 'Patiala',
    price: '₹8,999',
    originalPrice: '₹14,999',
    badge: '40% OFF',
    desc: 'Pure Raw Silk Kameez with Golden Gota Patti & Silver Rakhi.',
    image: '/rakhi_suit_hero_shoot.jpg',
  },
  {
    id: 'gift_hamper',
    title: 'Royal Kesari Audio QR Gift Box',
    category: 'Gift Boxes',
    price: '₹1,999',
    originalPrice: '₹3,499',
    badge: '45% OFF',
    desc: 'Padded Velvet Hamper + Silver Rakhi + Audio QR Voice Card.',
    image: '/rakhi_gift_box_hamper.jpg',
  },
  {
    id: 'kashmiri_churi',
    title: 'Royal Kashmiri Velvet & Zari Churi',
    category: 'Kashmiri Churi',
    price: '₹1,499',
    originalPrice: '₹2,499',
    badge: '30% OFF',
    desc: 'Handcrafted Kashmiri Velvet Zari Bangles with Gold Tilla.',
    image: '/kashmiri_churi_bangles.jpg',
  },
  {
    id: 'gold_kadas',
    title: 'Polki & Meenakari Gold Kadas',
    category: 'Designer Kadas',
    price: '₹2,299',
    originalPrice: '₹3,999',
    badge: 'BUY 1 GET 1',
    desc: 'Handcrafted Jaipur Polki Diamond & Gold Plated Kadas.',
    image: '/designer_kadda_bangles.jpg',
  },
];

export default function RakhiSaleOfferSection({ setView, setSelectedCategory, addToCart }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [copied, setCopied] = useState(false);

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
          <span>✨ RAKSHA BANDHAN FESTIVAL SALE • FLAT 50% OFF CODE "RAKHI50"</span>
          <span>✦</span>
          <span>FREE 925 SILVER RAKHI WITH EVERY SUIT</span>
          <span>✦</span>
          <span>FREE 'BEHEN KI AWAAZ' AUDIO QR CARD IN GIFT BOXES</span>
          <span>✦</span>
          <span>COMPLIMENTARY EXPRESS WORLDWIDE DISPATCH</span>
          <span>✦</span>
          <span>✨ RAKSHA BANDHAN FESTIVAL SALE • FLAT 50% OFF CODE "RAKHI50"</span>
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

          <p className="mt-4 px-2 text-[#555] text-sm md:text-base max-w-2xl font-light tracking-wide leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Explore special festive bundles featuring Designer Suits, Kashmiri Churi bangles, Gold Kadas, Kids Rakhis, and personalized audio gift box hampers.
          </p>
        </div>

        {/* High-End Fashion Staggered Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-10 items-center">
          
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
              <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end items-center text-center text-white z-20">
                <div className="mb-4">
                  <span className="bg-[#D4AF37] text-[#1A0008] text-[8px] sm:text-[9px] font-black uppercase px-3 sm:px-4 py-1.5 rounded-full tracking-[0.2em] shadow-lg whitespace-nowrap">
                    Grand Campaign
                  </span>
                </div>
                
                <h3 className="text-5xl lg:text-6xl font-light leading-[1.05] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Flat <span className="text-[#D4AF37] italic font-normal">50%</span> Off
                </h3>
                
                <p className="text-[13px] text-gray-200 font-light mb-8 leading-relaxed max-w-[90%] mx-auto">
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

                <div className="flex gap-2 w-full max-w-[280px]">
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
            {FEATURED_OFFERS.map((item, index) => (
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

        {/* Unique Heritage Seal Editorial Trust Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-[#1A0008]/10 mt-4">
          {/* Item 1 */}
          <div className="flex flex-col items-center justify-center text-center relative group p-4 lg:p-6 overflow-hidden cursor-default">
            {/* Giant Background Number */}
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[7rem] md:text-[9rem] font-black text-[#1A0008]/[0.03] select-none group-hover:text-[#D4AF37]/10 transition-colors duration-700 pointer-events-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              01
            </span>
            
            {/* Glowing Icon Seal */}
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-[#D4AF37]/40 flex items-center justify-center mb-5 relative z-10 bg-white/50 backdrop-blur-sm group-hover:bg-[#1A0008] group-hover:border-[#1A0008] transition-all duration-500 shadow-[0_0_20px_rgba(212,175,55,0.1)] group-hover:shadow-[0_10px_30px_rgba(26,0,8,0.2)]">
              <svg className="w-6 h-6 md:w-7 md:h-7 text-[#D4AF37] group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            
            <h5 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-[#1A0008] mb-2 relative z-10 leading-tight">100% Pure Silk</h5>
            <p className="text-[13px] md:text-[14px] text-gray-500 font-light relative z-10" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>Crafted by master artisans</p>
          </div>

          {/* Item 2 */}
          <div className="flex flex-col items-center justify-center text-center relative group p-4 lg:p-6 overflow-hidden cursor-default">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[7rem] md:text-[9rem] font-black text-[#1A0008]/[0.03] select-none group-hover:text-[#D4AF37]/10 transition-colors duration-700 pointer-events-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              02
            </span>
            
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-[#D4AF37]/40 flex items-center justify-center mb-5 relative z-10 bg-white/50 backdrop-blur-sm group-hover:bg-[#1A0008] group-hover:border-[#1A0008] transition-all duration-500 shadow-[0_0_20px_rgba(212,175,55,0.1)] group-hover:shadow-[0_10px_30px_rgba(26,0,8,0.2)]">
              <svg className="w-6 h-6 md:w-7 md:h-7 text-[#D4AF37] group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            
            <h5 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-[#1A0008] mb-2 relative z-10 leading-tight">Voice Card Included</h5>
            <p className="text-[13px] md:text-[14px] text-gray-500 font-light relative z-10" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>Free inside every gift box</p>
          </div>

          {/* Item 3 */}
          <div className="flex flex-col items-center justify-center text-center relative group p-4 lg:p-6 overflow-hidden cursor-default">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[7rem] md:text-[9rem] font-black text-[#1A0008]/[0.03] select-none group-hover:text-[#D4AF37]/10 transition-colors duration-700 pointer-events-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              03
            </span>
            
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-[#D4AF37]/40 flex items-center justify-center mb-5 relative z-10 bg-white/50 backdrop-blur-sm group-hover:bg-[#1A0008] group-hover:border-[#1A0008] transition-all duration-500 shadow-[0_0_20px_rgba(212,175,55,0.1)] group-hover:shadow-[0_10px_30px_rgba(26,0,8,0.2)]">
              <svg className="w-6 h-6 md:w-7 md:h-7 text-[#D4AF37] group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            
            <h5 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-[#1A0008] mb-2 relative z-10 leading-tight">2-7 Days Dispatch</h5>
            <p className="text-[13px] md:text-[14px] text-gray-500 font-light relative z-10" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>Express delivery before Rakhi</p>
          </div>

          {/* Item 4 */}
          <div className="flex flex-col items-center justify-center text-center relative group p-4 lg:p-6 overflow-hidden cursor-default">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[7rem] md:text-[9rem] font-black text-[#1A0008]/[0.03] select-none group-hover:text-[#D4AF37]/10 transition-colors duration-700 pointer-events-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              04
            </span>
            
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-[#D4AF37]/40 flex items-center justify-center mb-5 relative z-10 bg-white/50 backdrop-blur-sm group-hover:bg-[#1A0008] group-hover:border-[#1A0008] transition-all duration-500 shadow-[0_0_20px_rgba(212,175,55,0.1)] group-hover:shadow-[0_10px_30px_rgba(26,0,8,0.2)]">
              <svg className="w-6 h-6 md:w-7 md:h-7 text-[#D4AF37] group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            
            <h5 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-[#1A0008] mb-2 relative z-10 leading-tight">Signature Velvet Box</h5>
            <p className="text-[13px] md:text-[14px] text-gray-500 font-light relative z-10" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>Keepsake gift box included</p>
          </div>
        </div>

      </div>
    </section>
  );
}
