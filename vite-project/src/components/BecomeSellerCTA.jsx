import { motion } from 'framer-motion';

export default function BecomeSellerCTA() {
  return (
    <section className="relative py-40 bg-white overflow-hidden border-t border-[#111111]/5">
      
      {/* Absolute Image Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1599389274291-7f9a2d8e4040?auto=format&fit=crop&w=2000&q=80" 
          alt="Boutique Fabric" 
          className="w-full h-full object-cover object-center opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[11px] tracking-[0.5em] text-[#BCA58A] uppercase font-medium mb-8 block" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Elevate Your Business
          </span>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-[#111111] leading-tight tracking-tight mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Your Boutique Deserves <br className="hidden md:block" />
            More Than <em className="italic text-[#BCA58A] font-light">Instagram.</em>
          </h2>

          <p className="text-[14px] md:text-[16px] text-[#555] font-light tracking-wide leading-loose max-w-2xl mx-auto mb-16" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Join the premier luxury marketplace for Indian ethnic wear. 
            Own your personalized digital storefront and reach high-intent customers worldwide.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto bg-[#111111] hover:bg-[#BCA58A] text-white px-12 py-5 tracking-[0.3em] text-[10px] font-medium transition-all duration-500 uppercase shadow-xl"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Become a Seller
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto bg-transparent border border-[#111111]/20 hover:border-[#111111] text-[#111111] px-12 py-5 tracking-[0.3em] text-[10px] font-medium transition-all duration-500 uppercase"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Talk To Us
            </motion.button>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
