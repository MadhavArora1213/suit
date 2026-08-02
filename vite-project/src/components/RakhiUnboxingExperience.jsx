import { motion } from 'framer-motion';

export default function RakhiUnboxingExperience({ setView, setSelectedCategory }) {
  const steps = [
    {
      step: '01',
      title: 'Record Your Love',
      desc: 'After placing your order, record a heartfelt voice message for your brother using our simple online studio.',
      image: '/voice_recording.png',
    },
    {
      step: '02',
      title: 'The Signature Box',
      desc: 'We embed your voice into a luxurious golden QR card and safely nestle it inside our premium velvet keepsake box.',
      image: '/rakhi_gift_box_hamper.jpg',
    },
    {
      step: '03',
      title: 'He Hears You',
      desc: 'When he opens his gift, he simply points his phone camera at the card to hear your voice, no matter the distance.',
      image: '/scanning_qr_code.png',
    }
  ];

  return (
    <section className="w-full py-24 md:py-32 bg-[#FAF9F6] relative overflow-hidden">
      
      {/* Subtle Background Textures */}
      <div 
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#8B1A1A 1px, transparent 1px), linear-gradient(90deg, #8B1A1A 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} 
      />
      
      <div className="max-w-[1300px] mx-auto px-4 sm:px-8 relative z-10">
        
        {/* Editorial Header Section */}
        <div className="flex flex-col items-center text-center mb-28 md:mb-36">
          <div className="inline-flex items-center gap-4 mb-6">
            <span className="w-10 h-[1px] bg-[#D4AF37]" />
            <span className="text-[#1A0008] text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              How It Works
            </span>
            <span className="w-10 h-[1px] bg-[#D4AF37]" />
          </div>
          
          <h2 className="text-5xl md:text-7xl lg:text-[5.5rem] text-[#1A0008] font-light leading-[1.05] tracking-tight mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            A Rakhi That <br/>
            <span className="italic text-[#8B1A1A]">Speaks For You.</span>
          </h2>
          
          <p className="text-[#1A0008]/60 text-[15px] md:text-[18px] max-w-xl font-light leading-relaxed mb-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Every premium hamper includes our signature Audio QR Card. It’s incredibly simple to use, yet creates a memory that lasts forever.
          </p>

          <button 
            onClick={() => {
              if (setSelectedCategory) setSelectedCategory('hampers');
              if (setView) setView('category');
              window.scrollTo(0, 0);
            }}
            className="group flex items-center justify-center gap-3 bg-transparent border border-[#1A0008] text-[#1A0008] hover:bg-[#1A0008] hover:text-[#F5D76E] transition-all duration-500 px-8 py-4 rounded-full text-[10px] uppercase font-bold tracking-[0.25em]"
          >
            Explore Hampers
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </button>
        </div>

        {/* Z-Pattern Storytelling Rows */}
        <div className="flex flex-col gap-24 md:gap-40 relative">
          
          {/* Vertical Connecting Line (Hidden on Mobile) */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-[#1A0008]/10 -translate-x-1/2 z-0" />

          {steps.map((step, idx) => {
            const isEven = idx % 2 === 1;
            
            return (
              <div key={idx} className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 relative z-10 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Image Section */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full md:w-1/2"
                >
                  <div className="relative w-full aspect-[4/5] md:aspect-square overflow-hidden group">
                    <div className="absolute inset-4 md:inset-6 border-2 border-[#D4AF37]/30 rounded-2xl z-20 pointer-events-none group-hover:inset-3 md:group-hover:inset-4 transition-all duration-700" />
                    
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-[2s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                    />
                    
                    {/* Shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>
                </motion.div>

                {/* Content Section */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className={`w-full md:w-1/2 flex flex-col ${isEven ? 'md:items-end md:text-right' : 'md:items-start md:text-left'} items-center text-center`}
                >
                   {/* Giant Faded Number */}
                   <span className="text-[6rem] md:text-[9rem] text-[#1A0008]/[0.03] font-black leading-none mb-[-2rem] md:mb-[-3rem] select-none pointer-events-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                     {step.step}
                   </span>
                   
                   <h3 className="text-4xl md:text-5xl lg:text-6xl text-[#1A0008] font-light mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                     {step.title}
                   </h3>
                   
                   <p className="text-[#1A0008]/60 text-[15px] md:text-[17px] leading-[1.8] max-w-md font-light" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                     {step.desc}
                   </p>
                </motion.div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
