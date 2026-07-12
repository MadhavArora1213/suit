import { motion } from 'framer-motion';

const cards = [
  {
    title: "Expertise",
    desc: "We leverage over 15 years of experience to deliver high-quality, tailored solutions for every client.",
    pinColor: "#7db832",
    bgColor: "bg-[#FFFDF5]",
    rotation: -6,
    translateY: 20,
  },
  {
    title: "Custom Solutions",
    desc: "Every solution is personalized, ensuring that your business gets the exact tools it needs to succeed.",
    pinColor: "#7c5ce7",
    bgColor: "bg-[#F8F6FF]",
    rotation: 4,
    translateY: -20,
  },
  {
    title: "Customer-Focused",
    desc: "We prioritize your satisfaction and aim to exceed your expectations with every project we take on.",
    pinColor: "#e84a9f",
    bgColor: "bg-[#FFF8FB]",
    rotation: 5,
    translateY: 30,
  },
  {
    title: "Results Driven",
    desc: "Our strategies are designed to deliver measurable outcomes that impact your bottom line.",
    pinColor: "#29b5e8",
    bgColor: "bg-[#F5FBFE]",
    rotation: -3,
    translateY: -10,
  },
];

function RealisticPin({ color }) {
  return (
    <div className="absolute -top-4 right-8 z-20 group-hover:scale-110 transition-transform duration-500">
      {/* Shadow on Card */}
      <div className="absolute bottom-[-6px] left-[6px] w-[36px] h-[10px] bg-black/20 rounded-full blur-[4px]" />
      
      {/* Pin SVG */}
      <svg width="44" height="56" viewBox="0 0 44 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Pin Needle */}
        <ellipse cx="22" cy="52" rx="2" ry="3" fill="#999" opacity="0.5"/>
        <rect x="21" y="36" width="2" height="18" rx="1" fill="url(#needleGradient)" />
        
        {/* Main Ball */}
        <defs>
          <radialGradient id={`ball-${color.replace('#','')}`} cx="0.35" cy="0.3" r="0.65">
            <stop offset="0%" stopColor="white" stopOpacity="1"/>
            <stop offset="20%" stopColor={color} stopOpacity="0.9"/>
            <stop offset="60%" stopColor={color} stopOpacity="1"/>
            <stop offset="100%" stopColor={color} stopOpacity="0.7"/>
          </radialGradient>
          <radialGradient id={`shadow-${color.replace('#','')}`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor={color} stopOpacity="0.4"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="needleGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bbb"/>
            <stop offset="100%" stopColor="#888"/>
          </linearGradient>
        </defs>
        
        {/* Ball Shadow */}
        <ellipse cx="22" cy="32" rx="18" ry="4" fill={`url(#shadow-${color.replace('#','')})`}/>
        
        {/* Main Sphere */}
        <circle cx="22" cy="20" r="18" fill={color}/>
        
        {/* Sphere Gradient Overlay */}
        <circle cx="22" cy="20" r="18" fill={`url(#ball-${color.replace('#','')})`}/>
        
        {/* Top Highlight */}
        <ellipse cx="16" cy="12" rx="7" ry="5" fill="white" opacity="0.85" transform="rotate(-15 16 12)"/>
        
        {/* Small Highlight Dot */}
        <circle cx="13" cy="14" r="2.5" fill="white" opacity="0.9"/>
        
        {/* Bottom Reflection */}
        <ellipse cx="28" cy="28" rx="5" ry="3" fill="white" opacity="0.2" transform="rotate(-20 28 28)"/>
        
        {/* Edge Highlight */}
        <path d="M 8 20 Q 8 8 22 4" stroke="white" strokeWidth="1.5" fill="none" opacity="0.4"/>
      </svg>
    </div>
  );
}

export default function WhyShopGurnaaz() {
  return (
    <section className="relative min-h-[80vh] bg-[#FAF9F6] overflow-hidden pt-24 pb-16 z-10 -mt-20">
      
      {/* Background Dashed Lines */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Main diagonal curves */}
          <path 
            d="M -50 200 C 200 150, 400 350, 600 250 C 800 150, 1000 400, 1200 300 C 1400 200, 1600 350, 1900 250" 
            fill="none" 
            stroke="#c5c9d0" 
            strokeWidth="1.5" 
            strokeDasharray="8 6"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path 
            d="M -100 500 C 150 450, 350 650, 550 550 C 750 450, 950 700, 1150 600 C 1350 500, 1550 650, 1900 550" 
            fill="none" 
            stroke="#c5c9d0" 
            strokeWidth="1.5" 
            strokeDasharray="8 6"
            strokeLinecap="round"
            opacity="0.5"
          />
          {/* Crossing lines */}
          <path 
            d="M 300 0 C 350 150, 250 300, 350 450 C 450 600, 350 750, 400 900" 
            fill="none" 
            stroke="#c5c9d0" 
            strokeWidth="1.5" 
            strokeDasharray="8 6"
            strokeLinecap="round"
            opacity="0.4"
          />
          <path 
            d="M 800 0 C 850 150, 750 300, 850 450 C 950 600, 850 750, 900 900" 
            fill="none" 
            stroke="#c5c9d0" 
            strokeWidth="1.5" 
            strokeDasharray="8 6"
            strokeLinecap="round"
            opacity="0.4"
          />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="mb-20">
          <h1 className="text-5xl md:text-7xl font-light text-[#111111] leading-tight tracking-tight mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Why <em className="italic text-[#BCA58A] font-light">Shop</em> From GURNAAZ
          </h1>
        </div>

        {/* Scattered Cards - 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-x-20 md:gap-y-24 max-w-[900px] mx-auto">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-center"
            >
              {/* Floating Animation Wrapper */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4 + (idx % 2), repeat: Infinity, ease: "easeInOut" }}
                className="w-full max-w-[320px] relative"
                style={{
                  transform: `rotate(${card.rotation}deg) translateY(${card.translateY}px)`
                }}
              >
                {/* The Card */}
                <div className="bg-white rounded-[32px] p-3 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] relative cursor-pointer group">
                  
                  {/* Realistic 3D Pin */}
                  <RealisticPin color={card.pinColor} />

                  {/* Inner Content Area */}
                  <div className={`${card.bgColor} rounded-[24px] p-8 h-full border border-black/5 flex flex-col items-start gap-4 transition-colors duration-500`}>
                    
                    <h3 className="text-xl font-bold text-[#111111] mt-2 tracking-wide" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {card.title}
                    </h3>

                    <p className="text-[13px] text-[#555] leading-relaxed font-medium opacity-80" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {card.desc}
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
