import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const marqueeItems = ['Heritage Handcrafted', 'Founded by Madhav Arora', '50+ Boutiques', 'Women-Owned Brands', 'Verified Artisans', '12,000+ Suits', 'Slow Fashion', 'Real Craft'];

const milestones = [
  { year: '2026 — Idea', title: 'The Spark', desc: 'Gurnaaz was born in 2026 from a single frustration: finding authentic premium Indian ethnic wear online felt impossible. The idea took shape over late nights and dozens of boutique visits.' },
  { year: '2026 — Build', title: 'The Build', desc: 'No team. No agency. Madhav Arora designed, coded, and curated every single pixel of the platform entirely alone — a true single-man army. No shortcuts, no compromises.' },
  { year: '2026 — Launch', title: 'The Launch', desc: 'Gurnaaz launched with a small curated selection of hand-verified boutiques and premium suits. The response was beyond anything Madhav had imagined.' },
  { year: '2026 — Vision', title: 'The Vision', desc: 'The dream is simple — make authentic Indian ethnic wear accessible to everyone, everywhere. One boutique, one suit, one customer at a time. We are just getting started.' },
];

function Marquee() {
  return (
    <div className="overflow-hidden whitespace-nowrap border-y border-[#D4AF37]/20 py-4 bg-[#FAF9F6]">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 24, ease: 'linear', repeat: Infinity }}
        className="inline-flex gap-0"
      >
        {[...marqueeItems, ...marqueeItems].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-4 mx-10 text-[10px] tracking-[0.3em] uppercase font-bold text-[#1A0008]/50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {item}
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] flex-shrink-0" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function AboutPage({ setView }) {
  const containerRef = useRef(null);
  const [activeYear, setActiveYear] = useState('2026 — Idea');

  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroImgScale = useTransform(scrollYProgress, [0, 0.3], [1.15, 1]);
  const heroTxtY = useTransform(scrollYProgress, [0, 0.25], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <div ref={containerRef} className="bg-[#FAF9F6] text-[#1A0008] min-h-screen overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: FULL-WIDTH HERO — Giant Letters
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">

        {/* Centered text */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 sm:px-10 md:px-20 pt-16 sm:pt-20 md:pt-24">
          <motion.div style={{ y: heroTxtY, opacity: heroOpacity }}>
            <span className="text-[8px] sm:text-[9px] tracking-[0.4em] text-[#D4AF37] font-bold uppercase block mb-5 sm:mb-8">Est. 2026 · Madhav Arora</span>
            <div className="overflow-hidden mb-2">
              <motion.h1 initial={{ y: 80 }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: [0.16,1,0.3,1], delay: 0.1 }}
                className="text-[52px] sm:text-[70px] md:text-[110px] lg:text-[160px] font-light leading-none"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                About
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1 initial={{ y: 80 }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: [0.16,1,0.3,1], delay: 0.25 }}
                className="text-[52px] sm:text-[70px] md:text-[110px] lg:text-[160px] font-light leading-none italic text-[#D4AF37]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Us.
              </motion.h1>
            </div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 1 }}
              className="text-xs sm:text-sm text-[#1A0008]/60 mt-6 sm:mt-10 max-w-xs sm:max-w-md mx-auto leading-relaxed font-light px-2">
              India's most trusted platform for premium handcrafted ethnic wear — connecting extraordinary artisans with discerning shoppers.
            </motion.p>
          </motion.div>
        </div>

        {/* Rotated GURNAAZ text behind */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
          <p className="text-[15vw] scale-y-150 transform font-bold text-[#1A0008]/[0.03] uppercase tracking-widest select-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            GURNAAZ
          </p>
        </div>


      </section>

      {/* ═══════════════════════════════════════════════════════════
          MARQUEE STRIP
      ═══════════════════════════════════════════════════════════ */}
      <Marquee />

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: STORY — Asymmetric editorial collage layout
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-20 sm:py-32 px-4 sm:px-6 md:px-0 overflow-hidden">

        {/* Big ghost number */}
        <div className="hidden sm:block absolute top-20 right-10 text-[200px] font-bold text-[#1A0008]/[0.03] leading-none select-none pointer-events-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>01</div>

        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start px-4 sm:px-6 md:px-12">

          {/* LEFT: tall portrait image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 1, ease: [0.16,1,0.3,1] }}
            className="md:col-span-5 relative"
          >
            <div className="relative h-[400px] sm:h-[500px] md:h-[750px] overflow-hidden">
              <img src="/wedding_edit.png" alt="Story" className="w-full h-full object-cover object-top" />
              {/* gold corner frame */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-10 h-10 sm:w-14 sm:h-14 border-t-2 border-l-2 border-[#D4AF37]" />
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-10 h-10 sm:w-14 sm:h-14 border-b-2 border-r-2 border-[#D4AF37]" />
            </div>
            {/* floating dark pill */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.8 }}
              className="absolute -bottom-4 sm:-bottom-6 right-2 sm:right-0 bg-[#1A0008] text-white px-5 sm:px-8 py-4 sm:py-6 max-w-[180px] sm:max-w-[220px]"
            >
              <p className="text-2xl sm:text-3xl font-light mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>500+</p>
              <p className="text-[7px] sm:text-[9px] tracking-[0.2em] uppercase text-white/50 font-bold">Verified Boutiques Across India</p>
            </motion.div>
          </motion.div>

          {/* RIGHT: editorial copy block */}
          <motion.div
            initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 1, delay: 0.2, ease: [0.16,1,0.3,1] }}
            className="md:col-span-7 flex flex-col justify-center md:pl-8 lg:pl-16 pt-6 sm:pt-8 md:pt-24"
          >
            <span className="text-[8px] sm:text-[9px] tracking-[0.3em] text-[#D4AF37] font-bold uppercase block mb-4 sm:mb-6">Chapter 01</span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight mb-6 sm:mb-10" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Born from<br />a frustration<br /><em>with imitation.</em>
            </h2>
            <div className="w-10 sm:w-12 h-px bg-[#D4AF37] mb-6 sm:mb-10" />
            <p className="text-sm sm:text-base text-[#1A0008]/65 leading-relaxed font-light mb-4 sm:mb-6">
              In 2026, Gurnaaz founder Madhav Arora identified a frustration shared by thousands — finding authentic, premium Indian ethnic wear online was impossible. The market was flooded with cheap imitations sold as "handcrafted" at premium prices.
            </p>
            <p className="text-sm sm:text-base text-[#1A0008]/65 leading-relaxed font-light mb-8 sm:mb-12">
              Madhav spent months connecting with real artisans and weavers across India — people whose craft was extraordinary but whose reach was limited to a single lane. Gurnaaz was built to change that.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 border-t border-[#1A0008]/10 pt-6 sm:pt-10">
              {[['12K+', 'Suits'], ['48', 'Cities'], ['98%', 'Satisfaction']].map(([num, label]) => (
                <div key={label}>
                  <p className="text-2xl sm:text-3xl font-light text-[#1A0008] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{num}</p>
                  <p className="text-[7px] sm:text-[8px] tracking-[0.2em] uppercase text-[#D4AF37] font-bold">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3: DARK FULL-BLEED QUOTE
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-[#1A0008] py-20 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center">
          <p className="text-[25vw] font-bold text-white/[0.025] uppercase tracking-widest" style={{ fontFamily: "'Cormorant Garamond', serif" }}>CRAFT</p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 1 }}
          className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center"
        >
          <div className="flex items-center justify-center gap-6 mb-10">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-[9px] tracking-[0.3em] text-[#D4AF37] font-bold uppercase">Our Belief</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>
          <blockquote className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light text-white leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            "Heritage speaks before you do. <em>We make sure it's heard."</em>
          </blockquote>
          <p className="mt-8 text-[10px] tracking-[0.3em] text-white/40 uppercase font-bold">— Madhav Arora, Founder · Gurnaaz</p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4: INTERACTIVE TIMELINE
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 md:px-20 relative">
        <div className="hidden sm:block absolute top-20 left-10 text-[200px] font-bold text-[#1A0008]/[0.03] leading-none select-none pointer-events-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>02</div>
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="mb-10 sm:mb-16"
          >
            <span className="text-[8px] sm:text-[9px] tracking-[0.3em] text-[#D4AF37] font-bold uppercase block mb-3 sm:mb-4">Chapter 02</span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Our Journey</h2>
          </motion.div>

          {/* Timeline: year tabs + content */}
          <div className="flex flex-col md:flex-row gap-0 border border-[#1A0008]/10">
            {/* Year Tabs */}
            <div className="flex md:flex-col border-b md:border-b-0 md:border-r border-[#1A0008]/10 overflow-x-auto md:overflow-visible">
              {milestones.map((m) => (
                <button
                  key={m.year}
                  onClick={() => setActiveYear(m.year)}
                  className={`px-8 py-6 text-left transition-all duration-300 whitespace-nowrap cursor-pointer flex-shrink-0 border-r md:border-r-0 md:border-b border-[#1A0008]/10 group ${activeYear === m.year ? 'bg-[#1A0008] text-white' : 'bg-transparent hover:bg-[#1A0008]/5'}`}
                >
                  <p className={`text-2xl font-light mb-1 transition-colors ${activeYear === m.year ? 'text-[#D4AF37]' : 'text-[#1A0008]/40 group-hover:text-[#1A0008]'}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {m.year}
                  </p>
                  <p className={`text-[9px] tracking-[0.2em] uppercase font-bold transition-colors ${activeYear === m.year ? 'text-white/60' : 'text-[#1A0008]/30'}`}>
                    {m.title}
                  </p>
                </button>
              ))}
            </div>

            {/* Content Panel */}
            <div className="flex-1 p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-start gap-6 sm:gap-12">
              <AnimatePresence mode="wait">
                {milestones.filter(m => m.year === activeYear).map(m => (
                  <motion.div key={m.year}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className="flex-1"
                  >
                    <p className="text-[9px] tracking-[0.3em] text-[#D4AF37] uppercase font-bold mb-4">{m.year} · {m.title}</p>
                    <p className="text-xl md:text-2xl font-light text-[#1A0008]/80 leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {m.desc}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5: MASONRY IMAGE WALL
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-4 sm:py-8 px-1 sm:px-2 bg-[#FAF9F6]">
        <div className="grid grid-cols-2 sm:grid-cols-4 grid-rows-2 gap-1 sm:gap-2 h-[40vh] sm:h-[60vh] md:h-[80vh]">
          {[
            { src: '/luxury_edit.png', span: 'col-span-2 row-span-2' },
            { src: '/pastel_edit.png', span: 'col-span-1 row-span-1' },
            { src: '/summer_edit.png', span: 'col-span-1 row-span-1' },
            { src: '/black_edit.png', span: 'col-span-1 row-span-1' },
            { src: '/hero_campaign_palace.png', span: 'col-span-1 row-span-1' },
          ].map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.1 }}
              className={`${img.span} overflow-hidden group relative`}
            >
              <img src={img.src} alt="" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 6: CTA
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 md:px-20">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.9 }}
            className="text-center lg:text-left"
          >
            <span className="text-[8px] sm:text-[9px] tracking-[0.3em] text-[#D4AF37] uppercase font-bold block mb-4 sm:mb-6">Join the Movement</span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-light leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Wear something<br />that <em>means</em> something.
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full sm:w-auto"
          >
            <button onClick={() => setView('category')}
              className="group bg-[#1A0008] text-white px-8 sm:px-10 py-4 sm:py-5 text-[9px] sm:text-[10px] tracking-[0.25em] font-bold uppercase flex items-center justify-center gap-3 hover:bg-[#D4AF37] transition-colors cursor-pointer">
              Shop the Collection <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => setView('contact')}
              className="border border-[#1A0008]/30 text-[#1A0008] px-8 sm:px-10 py-4 sm:py-5 text-[9px] sm:text-[10px] tracking-[0.25em] font-bold uppercase hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors cursor-pointer flex items-center justify-center gap-3 group">
              Contact Us <ArrowUpRight size={13} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
