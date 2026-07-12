import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

const sellerBenefits = [
  "Zero upfront website or hosting costs",
  "No technical knowledge required",
  "Instant access to a worldwide customer base",
  "Premium packaging handled by our team",
  "End-to-end order management",
  "Dedicated 24/7 customer support",
  "Built-in SEO and digital marketing",
  "Professional editorial photoshoots"
];

export default function WhySellersChoose() {
  return (
    <section className="py-32 bg-[#111111] text-white relative overflow-hidden">
      
      {/* Background Graphic Lines (Subtle) */}
      <div className="absolute inset-0 opacity-5 pointer-events-none mix-blend-overlay">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100 100 C 200 300, 400 0, 1000 200" fill="none" stroke="#FAF9F6" strokeWidth="0.5" />
          <path d="M0 300 C 300 500, 600 200, 1200 400" fill="none" stroke="#FAF9F6" strokeWidth="0.3" />
        </svg>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left Side: Lifestyle Image */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-1/2"
          >
            <div className="relative aspect-[4/5] overflow-hidden border border-white/10 group">
              <img 
                src="https://images.unsplash.com/photo-1599389274291-7f9a2d8e4040?auto=format&fit=crop&w=1200&q=80" 
                alt="Boutique Owner" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-10 left-10 right-10">
                <span className="text-[10px] tracking-[0.4em] text-[#BCA58A] uppercase font-medium mb-3 block" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Empowering Artisans
                </span>
                <p className="text-xl font-light leading-relaxed text-[#FAF9F6] max-w-sm" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  "Gurnaaz took our small heritage boutique from the streets of Varanasi to the global stage."
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Benefits */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-1/2"
          >
            <span className="text-[11px] tracking-[0.5em] text-[#BCA58A] uppercase font-medium mb-6 block" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Partner With Us
            </span>
            <h2 className="text-5xl md:text-7xl font-light text-[#FAF9F6] leading-[1.1] tracking-tight mb-10" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Why Sellers Choose <br/>
              <em className="italic text-[#BCA58A] font-light">Gurnaaz</em>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-16">
              {sellerBenefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full border border-[#BCA58A]/30 flex items-center justify-center flex-shrink-0 mt-0.5 bg-white/5">
                    <Check size={12} strokeWidth={2} className="text-[#BCA58A]" />
                  </div>
                  <span className="text-[13px] text-white/70 font-light leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-4 bg-[#FAF9F6] hover:bg-[#BCA58A] text-[#111111] hover:text-white px-12 py-5 tracking-[0.3em] text-[10px] font-medium transition-all duration-500 group cursor-pointer uppercase shadow-2xl"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Become a Seller
              <ArrowRight size={16} strokeWidth={1.5} className="group-hover:translate-x-2 transition-transform duration-500" />
            </motion.button>
            
          </motion.div>

        </div>
      </div>
    </section>
  );
}
