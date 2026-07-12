import { motion } from 'framer-motion';

const cards = [
  {
    title: 'Expertise',
    description: 'We leverage over 15 years of experience to deliver high-quality, tailored solutions for every client.',
    sphereGradient: 'from-[#a8c94a] via-[#7db832] to-[#5a9a28]',
    bgColor: 'bg-gradient-to-br from-[#fff9e6] to-[#fff3cc]',
    shadow: 'shadow-[0_4px_12px_rgba(125,184,50,0.4)]',
    position: 'top-[0px] left-[5%] md:left-[8%]',
    rotation: '-rotate-7',
  },
  {
    title: 'Custom Solutions',
    description: 'Every solution is personalized, ensuring that your business gets the exact tools it needs to succeed.',
    sphereGradient: 'from-[#9b7ff0] via-[#7c5ce7] to-[#5f3fd9]',
    bgColor: 'bg-gradient-to-br from-[#f0eeff] to-[#e6e2ff]',
    shadow: 'shadow-[0_4px_12px_rgba(124,92,231,0.4)]',
    position: 'top-[20px] right-[5%] md:right-[8%]',
    rotation: 'rotate-5',
  },
  {
    title: 'Customer-Focused',
    description: 'We prioritize your satisfaction and aim to exceed your expectations with every project we take on.',
    sphereGradient: 'from-[#ff8ec4] via-[#e84a9f] to-[#d63590]',
    bgColor: 'bg-gradient-to-br from-[#fff0f5] to-[#ffe6ef]',
    shadow: 'shadow-[0_4px_12px_rgba(232,74,159,0.4)]',
    position: 'bottom-[40px] left-[10%] md:left-[18%]',
    rotation: 'rotate-6',
  },
  {
    title: 'Results Driven',
    description: 'Our strategies are designed to deliver measurable outcomes that impact your bottom line.',
    sphereGradient: 'from-[#42c6f5] via-[#29b5e8] to-[#1a9fd4]',
    bgColor: 'bg-gradient-to-br from-[#e8f4fc] to-[#d6ecf8]',
    shadow: 'shadow-[0_4px_12px_rgba(41,181,232,0.4)]',
    position: 'bottom-[20px] right-[8%] md:right-[12%]',
    rotation: '-rotate-4',
  },
];

export default function RecentWork() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#e9edf3] via-[#dde3ec] to-[#d5dce7]">
      <div className="max-w-[1100px] mx-auto px-6">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-10"
        >
          <h1 className="text-6xl md:text-7xl font-bold text-[#1a1a2e] tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Recent <span className="italic font-normal">Work</span>
          </h1>
        </motion.div>

        {/* Browser Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="bg-[#f8f9fb] rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.12),0_15px_40px_rgba(0,0,0,0.08)] overflow-hidden"
        >
          {/* Browser Header */}
          <div className="bg-gradient-to-b from-[#f2f3f5] to-[#e8e9ec] px-5 py-3.5 flex items-center gap-3 border-b border-[#dddee2]">
            {/* Window Controls */}
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-gradient-to-b from-[#ff6b6b] to-[#ee5a5a] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)]" />
              <span className="w-3 h-3 rounded-full bg-gradient-to-b from-[#ffd93d] to-[#f0c929] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)]" />
              <span className="w-3 h-3 rounded-full bg-gradient-to-b from-[#28ca41] to-[#20b535] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)]" />
            </div>
            
            {/* Nav Buttons */}
            <div className="flex gap-1.5 ml-2">
              <span className="w-7 h-7 flex items-center justify-center text-[#aaa] text-xs bg-white/50 rounded-md">&lt;</span>
              <span className="w-7 h-7 flex items-center justify-center text-[#aaa] text-xs bg-white/50 rounded-md">&gt;</span>
            </div>
            
            {/* URL Bar */}
            <div className="flex-1 max-w-[280px] mx-auto bg-white rounded-lg px-5 py-2 text-xs text-[#888] text-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]">
              untitled.com
            </div>
          </div>

          {/* Browser Content */}
          <div className="px-6 md:px-10 pt-12 pb-20 bg-[#fcfcfd] min-h-[580px] relative">
            
            {/* Content Header */}
            <div className="text-center mb-10 relative z-10">
              <h2 className="text-3xl md:text-4xl font-semibold text-[#1a1a2e] mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Why <em className="font-normal text-[#4a6cf7]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Choose</em> Seven Figure Agency?
              </h2>
              <p className="text-[15px] text-[#777] max-w-[480px] mx-auto leading-relaxed">
                Here's why businesses choose us to handle their digital needs:
              </p>
            </div>

            {/* Cards Container */}
            <div className="relative h-[420px]">
              
              {/* Connection Lines SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-[1]" viewBox="0 0 700 420" preserveAspectRatio="xMidYMid meet">
                <path d="M 200 90 C 320 50, 420 70, 500 100" fill="none" stroke="#c5ccd6" strokeWidth="1.8" strokeDasharray="8 5" strokeLinecap="round" />
                <path d="M 170 180 C 180 260, 230 310, 270 340" fill="none" stroke="#c5ccd6" strokeWidth="1.8" strokeDasharray="8 5" strokeLinecap="round" />
                <path d="M 520 180 C 530 260, 510 310, 480 340" fill="none" stroke="#c5ccd6" strokeWidth="1.8" strokeDasharray="8 5" strokeLinecap="round" />
                <path d="M 350 370 C 400 390, 440 380, 460 360" fill="none" stroke="#c5ccd6" strokeWidth="1.8" strokeDasharray="8 5" strokeLinecap="round" />
              </svg>

              {/* Floating Cards */}
              {cards.map((card, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 * idx }}
                  whileHover={{ scale: 1.04 }}
                  className={`absolute ${card.position} ${card.rotation} w-[200px] md:w-[220px] bg-white rounded-2xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.07),0_4px_12px_rgba(0,0,0,0.04)] z-5 overflow-hidden transition-shadow duration-300 hover:shadow-[0_16px_50px_rgba(0,0,0,0.1),0_6px_16px_rgba(0,0,0,0.06)]`}
                >
                  {/* Card Background Tint */}
                  <div className={`absolute inset-0 ${card.bgColor} opacity-35 rounded-2xl`} />
                  
                  {/* Content */}
                  <div className="relative z-[1]">
                    {/* 3D Sphere */}
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${card.sphereGradient} ${card.shadow} mb-4 relative`}>
                      <div className="absolute top-1.5 left-2 w-3 h-2 bg-white/60 rounded-full -rotate-[20deg]" />
                    </div>
                    
                    <h3 className="text-base font-semibold text-[#1a1a2e] mb-2.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {card.title}
                    </h3>
                    <p className="text-[12.5px] leading-[1.65] text-[#666]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {card.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
