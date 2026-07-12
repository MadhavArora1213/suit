import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getPromo } from '../utils/adminStore';

const staticFabrics = [
  { name: 'Heritage Banarasi Silk', image: '/banarasi_suit.png', desc: 'Handwoven pure zari panels.' },
  { name: 'Lucknowi Chikankari', image: '/chikankari_suit.png', desc: 'Detailed shadow stitch artistry.' },
  { name: 'Summer Gota Patti', image: '/sharara_suit.png', desc: 'Traditional royal gold borders.' }
];

const defaultPromo = {
  title: 'Summer Festive Edit',
  discount: '40',
  couponCode: 'FESTIVE40',
  endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  endTime: '23:59',
  fabrics: staticFabrics,
};

export default function SpecialOffer() {
  const [promo, setPromo] = useState(defaultPromo);
  const [fabrics, setFabrics] = useState(staticFabrics);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [copied, setCopied] = useState(false);
  const [activeFabric, setActiveFabric] = useState(0);

  const loadPromoData = () => {
    const data = getPromo(defaultPromo);
    setPromo(data);
    setFabrics(data.fabrics || staticFabrics);
  };

  useEffect(() => {
    loadPromoData();
    window.addEventListener('admin-data-updated', loadPromoData);
    return () => window.removeEventListener('admin-data-updated', loadPromoData);
  }, []);

  useEffect(() => {
    if (!promo.endDate) return;

    const calculateTimeLeft = () => {
      const endDateTimeStr = `${promo.endDate}T${promo.endTime || '00:00'}:00`;
      const difference = +new Date(endDateTimeStr) - +new Date();
      
      let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      setTimeLeft(newTimeLeft);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [promo]);

  const formatNumber = (num) => String(num).padStart(2, '0');

  const timerItems = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hrs' },
    { value: timeLeft.minutes, label: 'Mins' },
    { value: timeLeft.seconds, label: 'Secs' },
  ];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promo.couponCode || 'FESTIVE40');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nextFabric = () => {
    setActiveFabric((prev) => (prev + 1) % fabrics.length);
  };

  const prevFabric = () => {
    setActiveFabric((prev) => (prev - 1 + fabrics.length) % fabrics.length);
  };

  return (
    <section className="py-40 bg-[#FAF9F6] overflow-hidden relative text-left border-t border-[#111111]/5">
      
      {/* Background Graphic Lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100 100 C 200 300, 400 0, 1000 200" fill="none" stroke="#111111" strokeWidth="0.5" />
          <path d="M0 300 C 300 500, 600 200, 1200 400" fill="none" stroke="#111111" strokeWidth="0.3" />
        </svg>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-[11px] tracking-[0.5em] text-[#BCA58A] uppercase block mb-6 font-medium"
              style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Seasonal Promotion
            </span>
            <h2 className="text-6xl md:text-8xl font-light text-[#111111] mb-6 leading-none tracking-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {promo.title}<br />
              <em className="italic text-[#BCA58A] font-light">Up to {promo.discount}% Off</em>
            </h2>
            
            <p className="text-[#555] text-[13px] tracking-wide mb-12 leading-loose max-w-lg font-light"
              style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Indulge in our collection of hand-embroidered luxury. Verified craftsmanship at irresistible prices.
            </p>

            {/* Countdown Clock Grid */}
            <div className="flex gap-4 mb-12">
              {timerItems.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-white shadow-xl flex items-center justify-center text-3xl md:text-5xl font-light text-[#111111] hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 relative border border-[#111111]/5"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {formatNumber(item.value)}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/[0.02] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <span className="text-[10px] tracking-[0.3em] text-[#555] uppercase mt-4 font-medium"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Interactive Promo Coupon code */}
            <div className="mb-12 flex flex-wrap items-center gap-6">
              <span className="text-[10px] tracking-[0.3em] text-[#111111]/60 font-medium uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>USE DISCOUNT CODE:</span>
              <button
                onClick={handleCopyCode}
                className="group relative bg-white hover:bg-[#111111] border border-[#111111]/10 hover:border-[#111111] px-6 py-3 shadow-lg text-[#111111] hover:text-white font-mono font-light tracking-widest text-sm flex items-center gap-4 transition-all duration-500 cursor-pointer"
              >
                <span>{promo.couponCode || 'FESTIVE40'}</span>
                {copied ? <Check size={16} strokeWidth={1.5} className="text-[#BCA58A]" /> : <Copy size={16} strokeWidth={1.5} className="text-[#111111]/40 group-hover:text-[#BCA58A]" />}
                
                {/* Floating tooltip */}
                <AnimatePresence>
                  {copied && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: -45 }}
                      exit={{ opacity: 0 }}
                      className="absolute left-1/2 -translate-x-1/2 bg-[#111111] text-white text-[10px] font-medium py-2 px-4 shadow-xl uppercase tracking-[0.2em]"
                    >
                      Copied!
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-4 bg-[#111111] hover:bg-[#BCA58A] text-[#FAF9F6] px-12 py-5 tracking-[0.3em] text-[10px] font-medium transition-all duration-500 group cursor-pointer uppercase"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              SHOP THE SALE
              <ArrowRight size={16} strokeWidth={1.5} className="group-hover:translate-x-2 transition-transform duration-500" />
            </motion.button>
          </motion.div>

          {/* Right Side Visual Showcase (Fabric Carousel) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="relative justify-self-center lg:justify-self-end w-full max-w-lg"
          >
            {/* Elegant Fabric Pattern Photo */}
            <div className="aspect-[3/4] overflow-hidden bg-white relative border border-[#111111]/5 shadow-2xl group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeFabric}
                  src={fabrics[activeFabric].image}
                  alt={fabrics[activeFabric].name}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="w-full h-full object-cover object-center"
                />
              </AnimatePresence>
              

              {/* Slider Controls */}
              <button
                onClick={prevFabric}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-[#111111] transition-all duration-500 cursor-pointer backdrop-blur-md shadow-lg"
              >
                <ChevronLeft size={18} strokeWidth={1} />
              </button>
              <button
                onClick={nextFabric}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-[#111111] transition-all duration-500 cursor-pointer backdrop-blur-md shadow-lg"
              >
                <ChevronRight size={18} strokeWidth={1} />
              </button>

              {/* Fabric label overlay */}
              <div className="absolute bottom-6 left-8 right-8 bg-white/95 backdrop-blur-xl p-6 shadow-xl border border-[#111111]/5 text-left transition-all duration-500">
                <span className="text-[10px] font-medium text-[#BCA58A] tracking-[0.3em] uppercase block mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>Showcase</span>
                <h4 className="text-2xl font-light text-[#111111] tracking-wide mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{fabrics[activeFabric].name}</h4>
                <p className="text-[12px] text-[#555] font-light" style={{ fontFamily: "'Montserrat', sans-serif" }}>{fabrics[activeFabric].desc}</p>
              </div>
            </div>

            {/* Float Badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-10 -right-10 bg-[#111111] border border-[#111111]/10 p-6 shadow-2xl text-left max-w-[200px] hidden sm:block z-20"
            >
              <span className="text-[10px] font-medium text-[#BCA58A] tracking-[0.3em] uppercase block mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Special Offer
              </span>
              <p className="text-sm font-light text-[#FAF9F6] leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Free shipping on orders over ₹4,999
              </p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
