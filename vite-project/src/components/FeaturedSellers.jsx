import { motion } from 'framer-motion';
import { getBoutiques, getAllProducts } from '../utils/adminStore';

export default function FeaturedSellers({ setView, setSelectedBoutique }) {
  const allProducts = getAllProducts();
  const sellers = getBoutiques().filter(b => b.isFeatured).slice(0, 4); 

  return (
    <section className="py-24 md:py-32 bg-[#FAF9F6] relative overflow-hidden">
      
      {/* Delicate Grid Background */}
      <div className="absolute inset-0 opacity-[0.2] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#8B1A1A 1px, transparent 1px), linear-gradient(90deg, #8B1A1A 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} 
      />

      {/* Title Section */}
      <div className="max-w-[1200px] mx-auto px-6 mb-24 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, scaleY: 0 }}
          whileInView={{ opacity: 1, scaleY: 1 }}
          viewport={{ once: true }}
          className="w-px h-16 bg-[#1A0008]/30 mx-auto mb-8 origin-top" 
        />
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[10px] tracking-[0.4em] text-[#8B1A1A] uppercase mb-4 font-bold" 
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Curated Artisans
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-light text-[#1A0008] leading-none mb-6" 
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Top Heritage <span className="italic text-[#D4AF37]">Sellers</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-sm text-[#1A0008]/60 max-w-md mx-auto tracking-wide leading-relaxed"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Shop directly from India's most prestigious and highly rated artisan workshops.
        </motion.p>
      </div>

      {/* Staggered Lookbook Grid */}
      <div className="max-w-[1100px] mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-x-12 md:gap-y-32">
          
          {sellers.map((seller, index) => {
            const sellerProducts = allProducts.filter(p => p.boutique === seller.name).slice(0, 2);
            const isEven = index % 2 !== 0;

            return (
              <motion.div 
                key={seller.name}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`relative flex flex-col group cursor-pointer ${isEven ? 'md:mt-32' : ''}`}
                onClick={() => {
                  if(setSelectedBoutique) setSelectedBoutique(seller.name);
                  if(setView) setView('seller-shop');
                }}
              >
                {/* The Polaroid Frame */}
                <div className="relative w-full h-[450px] md:h-[550px] bg-white p-3 md:p-4 pb-20 md:pb-24 border border-[#1A0008]/10 shadow-[0_20px_50px_rgba(26,0,8,0.08)] rounded-sm group-hover:shadow-[0_30px_60px_rgba(26,0,8,0.12)] transition-all duration-700 z-10">
                  <div className="w-full h-full relative overflow-hidden bg-[#E8DDD0] border border-[#1A0008]/5">
                    <img 
                      src={seller.coverImage} 
                      alt="Cover"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
                    />
                  </div>
                  
                  {/* Seller Info at Bottom of Polaroid */}
                  <div className="absolute bottom-4 md:bottom-6 left-0 w-full flex flex-col items-center px-4">
                     <h3 className="text-3xl text-[#1A0008] font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                       {seller.name}
                     </h3>
                     <p className="text-[#8B1A1A] text-[9px] tracking-[0.2em] uppercase font-bold mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                       Explore Workshop
                     </p>
                  </div>
                </div>

                {/* Floating Logo Badge */}
                <div className="absolute -top-6 -left-2 sm:-left-6 md:-left-8 w-20 h-20 md:w-24 md:h-24 rounded-full bg-white p-1 border border-[#D4AF37]/30 shadow-xl z-30 group-hover:scale-110 transition-transform duration-500">
                  <img src={seller.logo} alt="Logo" className="w-full h-full object-cover rounded-full" />
                </div>

                {/* Floating Products (Overlapping the Polaroid) */}
                {sellerProducts.length > 0 && (
                  <div className="absolute -bottom-10 -right-1 sm:-right-4 md:-right-8 flex gap-3 z-20">
                    {sellerProducts.map((prod, i) => (
                      <div 
                        key={i} 
                        className="w-20 h-24 md:w-28 md:h-36 bg-white p-1.5 shadow-2xl border border-[#1A0008]/10 transform transition-transform duration-500 group-hover:-translate-y-4"
                        style={{ 
                          transform: `rotate(${i === 0 ? '-8deg' : '5deg'}) translateY(${i === 0 ? '10px' : '-5px'})`,
                          transitionDelay: `${i * 100}ms`
                        }}
                      >
                        <img src={prod.image} alt="Product" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
                
              </motion.div>
            );
          })}
          
        </div>
      </div>

    </section>
  );
}
