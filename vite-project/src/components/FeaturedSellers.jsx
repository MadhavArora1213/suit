import { motion } from 'framer-motion';
import { staticBoutiques, getAllProducts } from '../utils/adminStore';

export default function FeaturedSellers() {
  const allProducts = getAllProducts();
  const sellers = Object.values(staticBoutiques).slice(0, 6);

  return (
    <section className="py-24 md:py-32 bg-[#FAF9F6] relative overflow-hidden">
      
      {/* Delicate Background Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#BCA58A 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-[1400px] mx-auto text-center px-6 mb-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scaleY: 0 }}
          whileInView={{ opacity: 1, scaleY: 1 }}
          viewport={{ once: true }}
          className="w-px h-16 bg-[#BCA58A]/50 mx-auto mb-8 origin-top" 
        />
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[9px] tracking-[0.4em] text-[#BCA58A] uppercase mb-4" 
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Verified Sellers
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-light text-[#111111] mb-6" 
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Top Heritage <span className="italic text-[#BCA58A]">Sellers</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-sm text-[#111111]/50 max-w-md mx-auto"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Shop directly from India's most trusted and highly rated artisan workshops.
        </motion.p>
      </div>

      <div className="w-full relative z-10">
        
        {/* Horizontal Scroll Track */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-12 md:gap-20 px-6 md:px-[10vw] pb-16 pt-4 hide-scrollbar cursor-grab active:cursor-grabbing" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          
          {sellers.map((seller, index) => {
            const sellerProducts = allProducts.filter(p => p.boutique === seller.name).slice(0, 3);
            const thumbnails = [...sellerProducts, ...Array(3)].slice(0, 3);

            return (
              <motion.div 
                key={seller.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                className="flex-shrink-0 w-[300px] md:w-[350px] snap-center flex flex-col items-center group"
              >
                
                {/* Logo & Delicate Line */}
                <div className="flex flex-col items-center mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-[#BCA58A]/30 p-1 group-hover:border-[#BCA58A] transition-colors duration-500">
                    <img src={seller.logo} alt="Logo" className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div className="w-px h-8 bg-[#BCA58A]/30 mt-4 group-hover:h-12 transition-all duration-500" />
                </div>

                {/* The Arch Cover Image */}
                <div className="w-full h-[450px] md:h-[500px] rounded-t-full rounded-b-2xl overflow-hidden relative border border-black/5 group-hover:border-[#BCA58A]/40 transition-colors duration-500 bg-[#F0EBE2]">
                  <img 
                    src={seller.coverImage} 
                    alt="Cover"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out"
                  />
                  
                  {/* Gradient Overlay for Text/Thumbnails */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                  {/* Little Circular Thumbnails Like Jewels */}
                  <div className="absolute bottom-6 left-0 w-full flex justify-center -space-x-3">
                    {thumbnails.map((prod, i) => (
                      <div 
                        key={i} 
                        className="w-12 h-12 rounded-full border-2 border-white/80 overflow-hidden shadow-lg relative z-10 group-hover:scale-110 transition-transform duration-500"
                        style={{ zIndex: 10 - i, transitionDelay: `${i * 100}ms` }}
                      >
                        {prod ? (
                          <img src={prod.image} alt="Product" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[#111] flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-white/20" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Elegant Text Below */}
                <div className="mt-8 text-center flex flex-col items-center">
                  <h3 className="text-3xl text-[#111111] font-medium group-hover:text-[#BCA58A] transition-colors duration-500" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {seller.name}
                  </h3>
                  <div className="mt-4">
                    <a href="#shop" className="text-[9px] text-[#111111]/60 font-bold tracking-[0.2em] uppercase border-b border-[#111111]/20 pb-1 group-hover:border-[#BCA58A] group-hover:text-[#BCA58A] transition-all duration-300" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Visit Shop
                    </a>
                  </div>
                </div>

              </motion.div>
            );
          })}

          {/* Spacer */}
          <div className="flex-shrink-0 w-[5vw] md:w-[10vw]" />
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
}
