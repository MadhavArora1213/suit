import { motion } from 'framer-motion';

const TRUST = [
  {
    num: '01',
    title: 'Heritage Craft',
    desc: 'Each piece is handpicked from India\'s finest heritage boutiques. No mass production.',
    stat: '100%',
    statLabel: 'Authentic',
  },
  {
    num: '02',
    title: 'Risk-Free Trial',
    desc: 'Not the right fit? Send it back within 7 days. We want you to absolutely love every piece.',
    stat: '7',
    statLabel: 'Day Returns',
  },
  {
    num: '03',
    title: 'Global Delivery',
    desc: 'From Jaipur to New York — we ship handcrafted ethnic wear with tracked, insured delivery.',
    stat: '30+',
    statLabel: 'Countries',
  },
];

const MARQUEE_TEXT = [
  "100% AUTHENTIC",
  "PREMIUM PACKAGING",
  "WORLDWIDE SHIPPING",
  "24/7 SUPPORT",
  "SECURE PAYMENTS",
  "HANDCRAFTED"
];

// Marquee Component for the infinite scrolling ribbon
const Marquee = () => {
  return (
    <div className="w-full bg-[#111] text-[#BCA58A] py-2.5 md:py-4 overflow-hidden flex whitespace-nowrap border-y border-[#BCA58A]/30">
      <motion.div
        className="flex gap-6 md:gap-12 items-center"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ ease: "linear", duration: 15, repeat: Infinity }}
      >
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-6 md:gap-12 items-center">
            {MARQUEE_TEXT.map((text, j) => (
              <div key={j} className="flex items-center gap-6 md:gap-12">
                <span className="text-[9px] md:text-[12px] tracking-[0.2em] md:tracking-[0.3em] font-medium uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {text}
                </span>
                <span className="text-[#BCA58A]/40 text-[10px] md:text-[14px]">✦</span>
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default function TrustStrip() {
  return (
    <section className="bg-[#FAF9F6] relative overflow-hidden flex flex-col pt-12 md:pt-16">
      
      {/* ═══ Editorial Header ═══ */}
      <div className="max-w-[1400px] mx-auto px-5 md:px-12 w-full mb-10 md:mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <span className="text-[#BCA58A] text-[9px] md:text-[10px] tracking-[0.3em] md:tracking-[0.4em] uppercase font-bold"
                style={{ fontFamily: "'Montserrat', sans-serif" }}>
                The Gurnaaz Promise
              </span>
              <div className="w-8 md:w-12 h-[1px] bg-[#BCA58A]/50" />
            </div>
            
            <h2 className="text-[#111] text-[42px] sm:text-[48px] md:text-[72px] lg:text-[88px] font-light leading-[0.95] tracking-tighter uppercase"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              TRUST IN <br className="hidden sm:block" /> 
              <span className="italic text-[#BCA58A] lowercase text-[46px] sm:text-[56px] md:text-[80px] lg:text-[100px] block sm:inline mt-1 sm:mt-0">every thread</span>
            </h2>
          </div>
          
          <div className="max-w-xs md:pb-4 mt-2 md:mt-0">
            <p className="text-[#111]/60 text-[13px] md:text-[15px] leading-[1.7] md:leading-[1.8] font-light"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Join <strong className="text-[#111] font-medium">2,400+ women</strong> who have trusted us with their most cherished ethnic wear moments. Uncompromising quality, delivered to your door.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ═══ The Infinite Marquee Ribbon ═══ */}
      <Marquee />

      {/* ═══ Minimalist Accordion/List Layout ═══ */}
      <div className="max-w-[1400px] mx-auto w-full px-5 md:px-12 py-12 md:py-24">
        <div className="border-t border-[#111]/10">
          {TRUST.map((item, i) => (
            <motion.div
              key={item.num}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group border-b border-[#111]/10 flex flex-col lg:flex-row lg:items-center justify-between py-8 md:py-14 gap-4 md:gap-8 hover:bg-white transition-colors duration-500 cursor-default px-4 md:px-6 -mx-4 md:-mx-6 rounded-2xl"
            >
              
              {/* Left: Number & Title */}
              <div className="flex items-start md:items-center gap-4 md:gap-12 w-full lg:w-1/2">
                <span className="text-[#BCA58A] text-[11px] md:text-[14px] font-bold tracking-[0.2em] font-sans pt-1.5 md:pt-0 shrink-0">
                  {item.num}
                </span>
                <h3 className="text-[#111] text-[28px] sm:text-[32px] md:text-[42px] font-light tracking-tight group-hover:lg:pl-4 transition-all duration-500 ease-out leading-[1.1]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {item.title}
                </h3>
              </div>
              
              {/* Middle: Description */}
              <div className="w-full lg:w-1/3 pl-[34px] md:pl-0">
                <p className="text-[#111]/50 text-[14px] md:text-[15px] leading-[1.7] md:leading-[1.8] font-light max-w-[280px] sm:max-w-md lg:max-w-full"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {item.desc}
                </p>
              </div>

              {/* Right: Big Stat */}
              <div className="flex items-baseline justify-start lg:justify-end gap-2 md:gap-3 w-full lg:w-1/6 pl-[34px] md:pl-0 mt-2 md:mt-0">
                <span className="text-[#111] text-[42px] sm:text-[48px] md:text-[72px] font-light leading-[0.8] tracking-tighter group-hover:text-[#BCA58A] transition-colors duration-500"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {item.stat}
                </span>
                <span className="text-[#111]/40 text-[9px] md:text-[10px] tracking-[0.15em] md:tracking-[0.2em] uppercase font-bold"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {item.statLabel}
                </span>
              </div>

            </motion.div>
          ))}
        </div>
      </div>
      
    </section>
  );
}
