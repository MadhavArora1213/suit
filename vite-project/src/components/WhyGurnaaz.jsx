import { motion } from 'framer-motion';

export default function WhyGurnaaz() {
  return (
    <section className="py-24 md:py-32 bg-[#FAF9F6] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-[40px] md:text-[60px] text-[#111] font-light leading-tight tracking-tighter" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Why <span className="italic text-[#BCA58A]">Gurnaaz?</span>
          </h2>
        </div>

        {/* The Exact Bento Grid Layout */}
        <div className="relative w-full h-[1800px] md:h-[900px] flex flex-col md:flex-row gap-4 md:gap-6">
          
          {/* ================= LEFT COLUMN (25%) ================= */}
          <div className="flex-1 flex flex-col gap-4 md:gap-6 h-full">
            
            {/* Top Left (50%) - Heritage */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="h-[350px] md:h-[50%] bg-[#111] rounded-[32px] p-8 md:p-10 relative overflow-hidden shadow-lg flex flex-col justify-end"
            >
              <div className="relative z-20">
                <span className="text-[#BCA58A] text-[10px] uppercase tracking-widest font-bold block mb-3">01 / Heritage</span>
                <h3 className="text-3xl text-white font-light leading-tight mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Authentic<br/>Punjabi Craft</h3>
                <p className="text-gray-200 text-sm font-light leading-relaxed">Rooted in the heart of Punjab. Every suit is a celebration of our vibrant culture, crafted with traditional techniques passed down through generations.</p>
              </div>
            </motion.div>

            {/* Middle Left (30%) - Fabrics */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="h-[250px] md:h-[30%] bg-[#BCA58A] rounded-[32px] overflow-hidden shadow-lg relative p-8 flex flex-col justify-end"
            >
              <div className="relative z-10">
                <span className="text-white/80 text-[10px] uppercase tracking-widest font-bold block mb-2">02 / Materials</span>
                <h3 className="text-3xl text-white font-light leading-tight mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Premium Fabrics</h3>
                <p className="text-white text-sm font-light leading-relaxed">We use only the finest cottons, pure georgettes, and rich silks so your suit feels as luxurious as it looks.</p>
              </div>
            </motion.div>

            {/* Bottom Left (20%) - Tailoring */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="h-[150px] md:h-[20%] bg-white border border-[#BCA58A]/20 rounded-[32px] overflow-hidden shadow-sm p-6 flex flex-col justify-center"
            >
               <div className="relative z-10">
                  <span className="text-[#BCA58A] text-[10px] uppercase tracking-widest font-bold block mb-1">03 / Stitching</span>
                  <h3 className="text-xl text-[#111] font-light leading-tight mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Flawless Tailoring</h3>
                  <p className="text-gray-600 text-xs font-light">No loose threads. No uneven seams. Just immaculate stitching.</p>
               </div>
            </motion.div>

          </div>


          {/* ================= CENTER COLUMN (50%) ================= */}
          <div className="flex-[2_2_0%] flex flex-col gap-4 md:gap-6 h-full">
            
            {/* Top Center (40%) - Rigorous Quality */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="h-[400px] md:h-[40%] bg-white border border-[#BCA58A]/10 rounded-[40px] p-6 pb-20 md:p-8 md:pb-24 flex items-center shadow-sm relative overflow-hidden group"
            >
              <span className="absolute top-8 left-8 text-[#111]/10 text-xs font-bold tracking-widest">GURNAAZ</span>
              
              {/* Arched Window Image - Indian Suit */}
              <div className="w-1/2 h-full bg-gray-200 rounded-t-full rounded-b-[32px] overflow-hidden shadow-inner relative z-10 border border-[#FAF9F6]">
                <img src="/suit1.png" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Beautiful Punjabi Suit" />
              </div>

              {/* Text Right */}
              <div className="w-1/2 pl-6 md:pl-10 relative z-10 pb-8">
                <span className="text-[#BCA58A] px-3 py-1 bg-[#BCA58A]/10 rounded-full text-[10px] uppercase tracking-widest font-bold inline-block mb-4">04 / Craftsmanship</span>
                <h3 className="text-3xl md:text-5xl text-[#111] font-light leading-tight mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Intricate<br/>Embroidery</h3>
                <p className="text-gray-600 text-sm font-light leading-relaxed">Our heavy dupattas and kurtis feature authentic Phulkari, Zari, and Gota Patti work entirely hand-embroidered by artisans.</p>
              </div>
            </motion.div>

            {/* Bottom Center Row (60% split into two halves) */}
            <div className="h-[500px] md:h-[60%] flex flex-col md:flex-row gap-4 md:gap-6">
              
              {/* Center Bottom-Left - Shipping */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex-1 bg-[#BCA58A] rounded-[40px] p-8 pt-20 md:p-10 md:pt-32 md:pr-16 flex flex-col shadow-xl relative overflow-hidden"
              >
                <div className="relative z-10">
                  <span className="text-white/80 text-[10px] uppercase tracking-widest font-bold block mb-2">05 / Logistics</span>
                  <h3 className="text-3xl md:text-4xl text-white font-light leading-tight mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Global<br/>Shipping</h3>
                  <p className="text-white text-sm font-light leading-relaxed">From Punjab to the world. We deliver your favorite ethnic wear securely to your doorstep, fully insured, anywhere across the globe.</p>
                </div>
              </motion.div>

              {/* Center Bottom-Right - Premium Packaging */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="flex-1 bg-[#111] rounded-[40px] p-8 md:p-10 flex flex-col justify-end items-end text-right shadow-xl relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-felt.png')]" />
                
                <div className="relative z-10 pl-12 md:pl-20 mt-auto">
                  <span className="text-[#BCA58A] text-[10px] uppercase tracking-widest font-bold block mb-2">06 / Presentation</span>
                  <h3 className="text-3xl md:text-4xl text-white font-light leading-tight mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Unforgettable<br/>Unboxing
                  </h3>
                  <p className="text-gray-200 text-sm font-light leading-relaxed mb-6">A premium experience. Your suit arrives in beautiful, bespoke packaging—perfect for gifting.</p>
                </div>
                
                {/* Brand Logos (Mockup) */}
                <div className="flex gap-6 items-center opacity-40 mix-blend-screen relative z-10 text-[#BCA58A]">
                  <span className="font-serif tracking-[0.2em] text-xs">VOGUE</span>
                  <span className="font-serif tracking-[0.2em] text-xs">ZALORA</span>
                </div>
              </motion.div>

            </div>

          </div>


          {/* ================= RIGHT COLUMN (25%) ================= */}
          <div className="flex-1 flex flex-col gap-4 md:gap-6 h-full">
            
            {/* Top Right (50%) - Timeless Elegance (IMAGE CARD) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="h-[350px] md:h-[50%] bg-white rounded-[32px] overflow-hidden shadow-sm relative group"
            >
              <img src="/suit2.png" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Authentic Punjabi Suit" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111]/90 via-[#111]/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <span className="text-[#BCA58A] text-[10px] uppercase tracking-widest font-bold block mb-2">07 / Design</span>
                <h3 className="text-2xl text-white font-light leading-tight mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Modern Yet<br/>Traditional</h3>
                <p className="text-gray-200 text-xs font-light">Classic Punjabi silhouettes updated with contemporary cuts.</p>
              </div>
            </motion.div>

            {/* Middle Right (30%) - Ethical Craft */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="h-[250px] md:h-[30%] bg-white border border-[#BCA58A]/30 rounded-[32px] overflow-hidden shadow-sm p-8 flex flex-col justify-center"
            >
              <div className="relative z-10">
                <span className="text-[#BCA58A] text-[10px] uppercase tracking-widest font-bold block mb-2">08 / Values</span>
                <h3 className="text-2xl text-[#111] font-light leading-tight mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Ethical Craft</h3>
                <p className="text-gray-600 text-sm font-light leading-relaxed">We directly support local artisans and karigars in Punjab, ensuring fair wages.</p>
              </div>
            </motion.div>

            {/* Bottom Right (20%) - Ready to wear */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="h-[150px] md:h-[20%] bg-[#111] rounded-[32px] shadow-lg p-6 flex flex-col justify-center"
            >
              <span className="text-[#BCA58A] text-[10px] uppercase tracking-widest font-bold block mb-1">09 / Convenience</span>
              <h3 className="text-xl text-white font-light leading-tight mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Ready to Wear</h3>
              <p className="text-gray-200 text-xs font-light">Skip the tailor. Pre-stitched and ready to flaunt.</p>
            </motion.div>

          </div>


          {/* ================= THE CENTER OVERLAPPING CIRCLE ================= */}
          <motion.div 
            initial={{ scale: 0, opacity: 0, x: '-50%', y: '-50%' }}
            whileInView={{ scale: 1, opacity: 1, x: '-50%', y: '-50%' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.9, type: "spring", bounce: 0.4 }}
            className="hidden md:flex absolute top-1/2 left-1/2 w-[340px] h-[340px] rounded-full border-[16px] border-[#FAF9F6] overflow-hidden z-30 shadow-[0_30px_60px_rgba(0,0,0,0.2)] group items-center justify-center bg-white"
          >
            {/* Valid beautiful Indian Suit Image */}
            <img 
              src="/suit3.png" 
              alt="Gurnaaz Luxury Suit" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" 
            />
            {/* Inner Title for the Circle */}
            <div className="relative z-10 bg-black/60 backdrop-blur-md px-8 py-4 rounded-full border border-white/20">
              <h3 className="text-2xl text-white font-light text-center leading-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                The<br/>Experience
              </h3>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
