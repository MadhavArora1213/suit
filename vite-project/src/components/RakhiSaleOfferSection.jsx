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

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 pt-10">
        
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

        {/* 10/10 Split Magazine Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14 items-stretch">
          
          {/* LEFT SIDE (5/12): Main Hero Campaign Offer Box */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#1A0008] via-[#2A0510] to-[#1A0008] border-2 border-[#D4AF37] rounded-3xl p-7 md:p-8 flex flex-col justify-between text-white relative overflow-hidden shadow-[0_25px_60px_rgba(26,0,8,0.25)] group">
            
            {/* Ambient Lighting Accent */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#D4AF37]/30 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="bg-[#F5D76E] text-[#1A0008] text-[10px] font-black uppercase px-3.5 py-1.5 rounded-full tracking-[0.2em] shadow">
                  SPECIAL FESTIVE OFFER
                </span>
                <span className="text-[#F5D76E] text-xs font-bold font-mono">CODE: RAKHI50</span>
              </div>

              <h3 className="text-3xl md:text-4xl font-extrabold text-[#F5D76E] font-serif leading-tight mb-2">
                FLAT 50% OFF <br/>ON ALL COMBOS
              </h3>
              <p className="text-xs text-gray-200 font-light leading-relaxed mb-6">
                Applicable on Silk Suits, Silver Rakhi Combos & Audio QR Gift Box Hampers above ₹2,999.
              </p>

              {/* Photo Preview inside Left Box */}
              <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden border border-[#D4AF37]/40 relative mb-6 shadow-md">
                <img 
                  src="/rakhi_suit_hero_shoot.jpg" 
                  alt="Rakhi Suit Campaign" 
                  className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A0008] via-transparent to-transparent opacity-70" />
                <div className="absolute bottom-3 left-4 text-left">
                  <div className="text-[10px] text-[#F5D76E] font-bold uppercase tracking-widest">Featured Bundle</div>
                  <div className="text-sm font-bold text-white">Silk Suit + Pure Silver Rakhi</div>
                </div>
              </div>

              {/* Ticking Countdown Timer */}
              <div className="mb-6">
                <div className="text-[10px] uppercase font-bold text-[#F5D76E] tracking-widest mb-2 text-center">
                  ⚡ FLASH DEAL ENDS IN
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-white/10 border border-[#D4AF37]/40 rounded-xl p-2.5 backdrop-blur-sm">
                    <div className="text-xl font-extrabold text-[#F5D76E] tabular-nums">{String(timeLeft.days).padStart(2, '0')}</div>
                    <div className="text-[8px] text-gray-300 uppercase font-bold mt-0.5">Days</div>
                  </div>
                  <div className="bg-white/10 border border-[#D4AF37]/40 rounded-xl p-2.5 backdrop-blur-sm">
                    <div className="text-xl font-extrabold text-[#F5D76E] tabular-nums">{String(timeLeft.hours).padStart(2, '0')}</div>
                    <div className="text-[8px] text-gray-300 uppercase font-bold mt-0.5">Hours</div>
                  </div>
                  <div className="bg-white/10 border border-[#D4AF37]/40 rounded-xl p-2.5 backdrop-blur-sm">
                    <div className="text-xl font-extrabold text-[#F5D76E] tabular-nums">{String(timeLeft.mins).padStart(2, '0')}</div>
                    <div className="text-[8px] text-gray-300 uppercase font-bold mt-0.5">Mins</div>
                  </div>
                  <div className="bg-white/10 border border-[#D4AF37]/40 rounded-xl p-2.5 backdrop-blur-sm">
                    <div className="text-xl font-extrabold text-[#F5D76E] tabular-nums">{String(timeLeft.secs).padStart(2, '0')}</div>
                    <div className="text-[8px] text-gray-300 uppercase font-bold mt-0.5">Secs</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Coupon Copy & Action */}
            <div>
              <div className="bg-white/10 border border-dashed border-[#D4AF37] p-3 rounded-2xl flex items-center justify-between gap-2 mb-4">
                <div className="text-left pl-2">
                  <div className="text-[9px] text-[#F5D76E] uppercase font-bold">Use Coupon</div>
                  <div className="font-mono text-xl font-black text-white">RAKHI50</div>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-4 py-2 bg-[#D4AF37] hover:bg-white text-[#1A0008] text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95"
                >
                  {copied ? '✓ COPIED' : 'COPY'}
                </button>
              </div>

              <button
                onClick={() => handleCategoryClick('Rakhi Special')}
                className="w-full py-4 bg-gradient-to-r from-[#D4AF37] via-[#F5D76E] to-[#D4AF37] text-[#1A0008] font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl hover:scale-[1.02] active:scale-98"
              >
                Claim Festive Deal Now →
              </button>
            </div>

          </div>

          {/* RIGHT SIDE (7/12): 4 Curated Category Deal Cards Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURED_OFFERS.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -6 }}
                className="bg-white border-2 border-gray-200/80 hover:border-[#D4AF37] rounded-3xl p-5 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                onClick={() => handleCategoryClick(item.category)}
              >
                <div>
                  {/* Photo */}
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 mb-4 border border-gray-200 relative">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700" 
                    />
                    <span className="absolute top-2.5 left-2.5 bg-[#1A0008] text-[#F5D76E] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                      {item.badge}
                    </span>
                  </div>

                  <span className="text-[10px] text-[#8B1A1A] font-black uppercase tracking-widest block mb-1">
                    {item.category}
                  </span>

                  <h4 className="text-lg font-bold text-[#1A0008] group-hover:text-[#8B1A1A] transition-colors line-clamp-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {item.title}
                  </h4>

                  <p className="text-xs text-gray-500 font-light mt-1 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-base font-black text-[#1A0008]">{item.price}</span>
                    <span className="text-xs text-gray-400 line-through font-light ml-2">{item.originalPrice}</span>
                  </div>

                  <span className="px-3.5 py-1.5 bg-[#1A0008] group-hover:bg-[#8B1A1A] text-[#F5D76E] text-xs font-bold rounded-xl transition-colors shadow">
                    Shop →
                  </span>
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
