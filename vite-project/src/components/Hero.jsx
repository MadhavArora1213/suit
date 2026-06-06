import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

const slides = [
  {
    num: "01",
    subtitle: "End of Season",
    title: "SALE",
    ribbon: "PREVIEW",
    tagline: "First-Time Discount on New Arrivals",
    upto: "50%",
    extra: "5%",
    coupon: "EXTRA5",
    image: "/hero_campaign_suits.png",
    overlayColor: "bg-[#5C2315]/85", // Rich warm rust-maroon tint to fit garden suit tones
    link: "#collections"
  },
  {
    num: "02",
    subtitle: "Artisanal Heritage Curation",
    title: "FESTIVE EDIT",
    ribbon: "EXCLUSIVE",
    tagline: "Unveiling Signature Weaver Masterpieces",
    upto: "40%",
    extra: "10%",
    coupon: "FESTIVE10",
    image: "/hero_campaign_palace.png",
    overlayColor: "bg-[#4A1E2F]/85", // Deep royal burgundy wine tint to fit haveli courtyard tones
    link: "#collections"
  }
];

export default function Hero({ addToCart }) {
  const [current, setCurrent] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
    setCopied(false);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setCopied(false);
  };

  const handleCopyCoupon = (couponCode) => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="pt-[106px] pb-0 bg-[#111111] overflow-hidden relative w-full select-none">
      
      {/* Cinematic Viewport Slider Wrapper */}
      <div className="relative w-full h-[600px] lg:h-[700px] bg-black">
        
        {/* Full-Bleed Campaign Image Transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-0"
          >
            {/* Background Image with Slow Pan zoom */}
            <motion.img
              src={slides[current].image}
              alt="Luxury suits campaign look"
              className="w-full h-full object-cover object-[center_35%]"
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10, ease: 'easeOut' }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Global Dark overlay to ensure contrast on left/middle */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/10 z-10 pointer-events-none"></div>

        {/* Dynamic Split Layout: Right Overlay Content */}
        <div className="absolute inset-0 z-20 flex justify-end">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 80, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`w-full lg:w-[480px] h-full ${slides[current].overlayColor} backdrop-blur-[4px] border-l border-white/5 px-8 md:px-12 flex flex-col justify-center text-center text-white relative`}
            >
              
              {/* Gold Playfair Serif Heading */}
              <span className="font-display font-medium text-2xl md:text-3xl text-[#FFD700] italic tracking-wide mb-1 block">
                {slides[current].subtitle}
              </span>

              {/* Bold White Sans-Serif Sale Title */}
              <h1 className="font-display font-black text-6xl md:text-8.5xl tracking-widest leading-none my-2 text-white uppercase drop-shadow-md">
                {slides[current].title}
              </h1>

              {/* Gold Banner Ribbon */}
              <div className="w-full py-1.5 bg-[#FFD700] text-black font-sans font-bold text-xs tracking-[0.35em] uppercase mb-8 shadow-sm">
                {slides[current].ribbon}
              </div>

              {/* Subheading details */}
              <p className="font-body text-sm md:text-base text-white/90 font-medium tracking-wide mb-8 leading-relaxed">
                {slides[current].tagline}
              </p>

              {/* Biba-style Large Percentage discount layout */}
              <div className="flex justify-center items-center gap-5 text-white mb-8 border-y border-white/10 py-6">
                <div className="text-center">
                  <span className="block text-[9px] tracking-[0.2em] text-[#FFD700] uppercase font-bold mb-1">Upto</span>
                  <span className="text-4xl md:text-5.5xl font-display font-bold text-white tracking-tight">
                    {slides[current].upto}
                    <span className="text-lg md:text-xl font-bold ml-0.5">ff</span>
                  </span>
                </div>
                
                <span className="text-3xl font-display font-light text-[#FFD700]">+</span>
                
                <div className="text-center">
                  <span className="block text-[9px] tracking-[0.2em] text-[#FFD700] uppercase font-bold mb-1">Extra</span>
                  <span className="text-4xl md:text-5.5xl font-display font-bold text-white tracking-tight">
                    {slides[current].extra}
                    <span className="text-lg md:text-xl font-bold ml-0.5">ff</span>
                  </span>
                </div>
              </div>

              {/* Interactive Coupon Code copy tool */}
              <div className="mb-10 flex flex-col items-center">
                <button
                  onClick={() => handleCopyCoupon(slides[current].coupon)}
                  className="group relative inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] text-[#FFD700] hover:text-white uppercase transition-colors"
                >
                  <span>COUPON CODE :</span>
                  <span className="bg-black/40 border border-[#FFD700]/30 px-3 py-1 rounded text-white font-mono font-bold flex items-center gap-1.5 hover:border-[#FFD700] transition-colors">
                    {slides[current].coupon}
                    {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </span>

                  {/* Copy Alert Tooltip */}
                  <AnimatePresence>
                    {copied && (
                      <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: -25 }}
                        exit={{ opacity: 0 }}
                        className="absolute left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[9px] font-bold py-1 px-2.5 rounded shadow-lg uppercase tracking-wider whitespace-nowrap z-50"
                      >
                        Discount Code Copied!
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>

              {/* Rectangular Outline Shop Button */}
              <div className="flex justify-center">
                <a href={slides[current].link} className="w-full max-w-[280px]">
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: '#FFD700', borderColor: '#FFD700', color: '#000000' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full border border-white text-white py-4.5 tracking-[0.25em] text-xs font-bold uppercase transition-all duration-300 bg-transparent rounded shadow-sm"
                  >
                    SHOP NOW
                  </motion.button>
                </a>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Square Edge-Aligned Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white hover:bg-[#FFD700] text-black flex items-center justify-center transition-all duration-300 z-30 focus:outline-none cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white hover:bg-[#FFD700] text-black flex items-center justify-center transition-all duration-300 z-30 focus:outline-none cursor-pointer"
        >
          <ChevronRight size={20} />
        </button>

        {/* Slide Indicator Numbers */}
        <div className="absolute bottom-6 left-8 flex items-center gap-4 z-30 hidden lg:flex">
          {slides.map((slide, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
            >
              <span className={`text-xs font-mono font-bold transition-colors duration-300 ${
                current === index ? 'text-[#FFD700]' : 'text-white/40 group-hover:text-white'
              }`}>
                {slide.num}
              </span>
              <span className={`text-[9px] tracking-[0.2em] font-sans uppercase font-bold transition-colors duration-300 ${
                current === index ? 'text-white' : 'text-white/30'
              }`}>
                {slide.title}
              </span>
              {current === index && (
                <motion.div
                  layoutId="heroIndicatorBar"
                  className="h-[1.5px] w-5 bg-[#FFD700]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

      </div>

    </section>
  );
}
