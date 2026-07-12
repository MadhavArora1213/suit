import { Package, ShieldCheck, Gem, Truck, Globe, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
  {
    icon: Gem,
    title: "Curated Collections",
    desc: "Exquisite craftsmanship, handpicked for you.",
    rotation: -4,
    translateY: 20,
    accent: "from-[#F3E8C1] to-[#E5C980]", // Gold/Yellow
    innerBg: "bg-[#FFFDF5]"
  },
  {
    icon: ShieldCheck,
    title: "Verified Sellers",
    desc: "Authentic heritage boutiques & master weavers.",
    rotation: 3,
    translateY: -30,
    accent: "from-[#E6D5D5] to-[#CBA5A5]", // Dusty Rose
    innerBg: "bg-[#FDF9F9]"
  },
  {
    icon: Package,
    title: "Premium Packaging",
    desc: "Signature branded packaging with a personal touch.",
    rotation: -2,
    translateY: 40,
    accent: "from-[#D5E1E6] to-[#A5C0CB]", // Dusty Blue
    innerBg: "bg-[#F9FCFD]"
  },
  {
    icon: Truck,
    title: "Fast Dispatch",
    desc: "Expedited processing within 24 hours.",
    rotation: 4,
    translateY: -10,
    accent: "from-[#E6E2D5] to-[#CBC2A5]", // Sage/Olive
    innerBg: "bg-[#FCFDF9]"
  },
  {
    icon: Globe,
    title: "Worldwide Delivery",
    desc: "From Mumbai to Manhattan, shipped globally.",
    rotation: -3,
    translateY: 30,
    accent: "from-[#DFD5E6] to-[#BBA5CB]", // Lavender
    innerBg: "bg-[#FAFC]"
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    desc: "Encrypted transactions via global gateways.",
    rotation: 2,
    translateY: -40,
    accent: "from-[#E6D5DF] to-[#CBABB]", // Mauve
    innerBg: "bg-[#FDF9FB]"
  }
];

export default function WhyShopGurnaaz() {
  return (
    <section className="relative min-h-[120vh] bg-[#FAF9F6] overflow-hidden py-32 border-t border-[#111111]/5">
      
      {/* Background Graphic: Dashed Lines & Horizontal Rules */}
      <div className="absolute inset-0 pointer-events-none opacity-30 z-0 flex flex-col justify-between py-64">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-full h-px bg-[#111111]/10" />
        ))}
      </div>
      
      {/* Diagonal Dashed Connecting Lines (SVG) */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M 200 400 Q 600 200 1000 600 T 1800 300" fill="transparent" stroke="#111111" strokeWidth="2" strokeDasharray="10 10" />
          <path d="M -100 800 Q 400 900 800 500 T 1600 700" fill="transparent" stroke="#111111" strokeWidth="2" strokeDasharray="10 10" />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-32 relative">
          <h2 className="text-5xl md:text-7xl font-light text-[#111111] leading-tight tracking-tight mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Why <em className="italic text-[#BCA58A] font-light">Choose</em> Gurnaaz?
          </h2>
          <p className="text-[14px] text-[#555] font-light tracking-wide" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Here's why businesses and individuals choose us for their luxury ethnic wear:
          </p>
        </div>

        {/* Scattered Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-x-12 md:gap-y-24">
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-center"
            >
              {/* Floating Animation Wrapper */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4 + (idx % 3), repeat: Infinity, ease: "easeInOut" }}
                className="w-full max-w-[340px]"
                style={{
                  transform: `rotate(${benefit.rotation}deg) translateY(${benefit.translateY}px)`
                }}
              >
                {/* The Card */}
                <div className="bg-white rounded-[32px] p-3 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] relative cursor-pointer group">
                  
                  {/* 3D Floating Pill/Sphere */}
                  <div className="absolute -top-6 right-10 w-12 h-12 rounded-full shadow-lg z-20 overflow-hidden transform group-hover:scale-110 transition-transform duration-500">
                    <div className={`w-full h-full bg-gradient-to-br ${benefit.accent} opacity-90`} />
                    {/* Inner 3D highlight */}
                    <div className="absolute inset-0 rounded-full border-t-2 border-white/60 shadow-[inset_0_-10px_20px_rgba(0,0,0,0.2)]" />
                  </div>

                  {/* Inner Content Area */}
                  <div className={`${benefit.innerBg} rounded-[24px] p-8 h-full border border-black/5 flex flex-col items-start gap-4 transition-colors duration-500`}>
                    
                    <div className="text-[#111111]">
                      <benefit.icon size={28} strokeWidth={2} />
                    </div>

                    <h3 className="text-xl font-bold text-[#111111] mt-2 tracking-wide" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {benefit.title}
                    </h3>

                    <p className="text-[13px] text-[#555] leading-relaxed font-medium opacity-80" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {benefit.desc}
                    </p>

                  </div>

                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
