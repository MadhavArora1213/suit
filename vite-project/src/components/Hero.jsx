import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const slides = [
  {
    num: "01",
    eyebrow: "End of Season",
    title: "GRAND",
    titleItalic: "Sale",
    tagline: "First-Time Discount on New Arrivals",
    upto: "50%",
    extra: "5%",
    coupon: "EXTRA5",
    image: "/hero_campaign_suits.png",
    accent: "#BCA58A",
    link: "#collections"
  },
  {
    num: "02",
    eyebrow: "Artisanal Heritage Curation",
    title: "FESTIVE",
    titleItalic: "Edit",
    tagline: "Unveiling Signature Weaver Masterpieces",
    upto: "40%",
    extra: "10%",
    coupon: "FESTIVE10",
    image: "/hero_campaign_palace.png",
    accent: "#BCA58A",
    link: "#collections"
  }
];

export default function Hero({ addToCart }) {
  const [current, setCurrent] = useState(0);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => { setCurrent((prev) => (prev + 1) % slides.length); setCopied(false); };
  const prevSlide = () => { setCurrent((prev) => (prev - 1 + slides.length) % slides.length); setCopied(false); };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const slide = slides[current];

  return (
    <section ref={containerRef} className="relative w-full h-screen min-h-[700px] overflow-hidden bg-[#111111] select-none">

      {/* Background Image with Parallax */}
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1.0 }} className="absolute inset-0 z-0" style={{ y, opacity }}>
          <motion.img src={slide.image} alt="Campaign"
            className="w-full h-full object-cover object-center"
            initial={{ scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 10, ease: 'easeOut' }} />
          {/* Deep gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/95 via-[#111111]/60 to-[#111111]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/10 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Fine vertical rule on left */}
      <motion.div style={{ opacity }} className="absolute left-[88px] top-0 h-full w-px bg-[#BCA58A]/10 hidden xl:block z-10" />

      {/* Content */}
      <div className="relative z-20 h-full max-w-[1600px] mx-auto px-8 md:px-16 flex flex-col justify-center pt-32">
        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[640px]">

            {/* Eyebrow */}
            <div className="flex items-center gap-4 mb-6 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: 32 }} transition={{ duration: 0.8, delay: 0.2 }} className="h-px bg-[#BCA58A]" />
              <span className="text-[10px] tracking-[0.35em] text-[#BCA58A] uppercase font-medium"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {slide.eyebrow}
              </span>
            </div>

            {/* Headline */}
            <h1 className="leading-none mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              <span className="block text-[72px] md:text-[100px] lg:text-[120px] font-bold tracking-[0.06em] text-[#FAF9F6]">
                {slide.title}
              </span>
              <span className="block text-[60px] md:text-[84px] lg:text-[100px] font-light italic text-[#BCA58A] -mt-4">
                {slide.titleItalic}
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-[#FAF9F6]/55 text-sm md:text-base mb-10 max-w-md leading-relaxed tracking-wide"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {slide.tagline}
            </p>

            {/* Discount row */}
            <div className="flex items-center gap-8 mb-10 py-6 border-y border-[#BCA58A]/15 backdrop-blur-sm bg-[#111111]/20">
              <div>
                <span className="block text-[9px] tracking-[0.25em] text-[#BCA58A] uppercase mb-1"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>Upto</span>
                <span className="text-4xl md:text-5xl font-semibold text-[#FAF9F6]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {slide.upto} <span className="text-2xl">Off</span>
                </span>
              </div>
              <div className="text-2xl text-[#BCA58A]/50" style={{ fontFamily: "'Cormorant Garamond', serif" }}>+</div>
              <div>
                <span className="block text-[9px] tracking-[0.25em] text-[#BCA58A] uppercase mb-1"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>Extra</span>
                <span className="text-4xl md:text-5xl font-semibold text-[#FAF9F6]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {slide.extra} <span className="text-2xl">Off</span>
                </span>
              </div>
            </div>

            {/* Coupon + CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <button onClick={() => handleCopy(slide.coupon)}
                className="relative group inline-flex items-center gap-3 text-[10px] tracking-[0.18em] text-[#BCA58A] border border-[#BCA58A]/30 hover:border-[#BCA58A] px-4 py-2.5 transition-all cursor-pointer backdrop-blur-sm bg-[#111111]/30"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <span>CODE: <span className="font-bold">{slide.coupon}</span></span>
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <AnimatePresence>
                  {copied && (
                    <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: -28 }} exit={{ opacity: 0 }}
                      className="absolute left-1/2 -translate-x-1/2 bg-[#BCA58A] text-[#111111] text-[9px] font-bold py-1 px-2.5 whitespace-nowrap z-50">
                      Copied!
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <a href={slide.link}>
                <motion.button whileHover={{ scale: 1.02, backgroundColor: '#BCA58A', color: '#111111', borderColor: '#BCA58A' }}
                  whileTap={{ scale: 0.98 }}
                  className="border border-[#FAF9F6]/40 text-[#FAF9F6] bg-[#111111]/30 backdrop-blur-sm px-8 py-3 text-[10px] font-semibold tracking-[0.3em] uppercase transition-all duration-300 cursor-pointer"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  SHOP NOW
                </motion.button>
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide counter bottom-left */}
      <motion.div style={{ opacity }} className="absolute bottom-10 left-8 md:left-16 z-30 flex items-center gap-6">
        {slides.map((s, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className="flex items-center gap-2 group cursor-pointer">
            <span className={`text-[10px] font-mono transition-colors duration-300 ${i === current ? 'text-[#BCA58A]' : 'text-[#FAF9F6]/30 group-hover:text-[#FAF9F6]/60'}`}>
              {s.num}
            </span>
            <span className={`text-[9px] tracking-[0.2em] uppercase transition-colors duration-300 ${i === current ? 'text-[#FAF9F6]' : 'text-[#FAF9F6]/25'}`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {s.titleItalic}
            </span>
            {i === current && <motion.div layoutId="heroBar" className="h-px w-6 bg-[#BCA58A]" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
          </button>
        ))}
      </motion.div>

      {/* Arrow Controls */}
      <motion.button style={{ opacity }} onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 border border-[#FAF9F6]/20 hover:border-[#BCA58A] text-[#FAF9F6]/50 hover:text-[#BCA58A] flex items-center justify-center transition-all duration-300 z-30 cursor-pointer backdrop-blur-sm bg-[#111111]/20">
        <ChevronLeft size={18} />
      </motion.button>
      <motion.button style={{ opacity }} onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 border border-[#FAF9F6]/20 hover:border-[#BCA58A] text-[#FAF9F6]/50 hover:text-[#BCA58A] flex items-center justify-center transition-all duration-300 z-30 cursor-pointer backdrop-blur-sm bg-[#111111]/20">
        <ChevronRight size={18} />
      </motion.button>

      {/* Vertical slide number */}
      <motion.div style={{ opacity }} className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-2 z-30">
        <span className="text-4xl font-light text-[#FAF9F6]/8 select-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          0{current + 1}
        </span>
        <div className="w-px h-16 bg-[#BCA58A]/20" />
        <span className="text-[9px] tracking-[0.2em] text-[#FAF9F6]/20 uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {current + 1}/{slides.length}
        </span>
      </motion.div>
    </section>
  );
}
