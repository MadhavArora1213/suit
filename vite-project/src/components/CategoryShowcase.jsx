import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const categories = [
  { name: 'Anarkali Suits', image: '/anarkali_suit.png' },
  { name: 'Pakistani Suits', image: '/pakistani_suit.png' },
  { name: 'Punjabi Patiala', image: '/patiala_suit.png' },
  { name: 'Sharara Suits', image: '/sharara_suit.png' },
  { name: 'Chikankari Suits', image: '/chikankari_suit.png' },
  { name: 'Banarasi Silk', image: '/banarasi_suit.png' },
];

export default function CategoryShowcase() {
  return (
    <section className="py-28 bg-[#FAF9F6]" id="collections">
      <div className="max-w-[1600px] mx-auto px-6 md:px-14">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">

          {/* Left: Categories */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }} viewport={{ once: true }} className="mb-12 text-left">
              <span className="text-[10px] tracking-[0.35em] text-[#BCA58A] uppercase block mb-4 font-medium"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Shop By Category
              </span>
              <h2 className="text-4xl md:text-5xl font-light text-[#1E1E1E] leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Explore <em className="italic text-[#BCA58A]">Our Collections</em>
              </h2>
              <div className="mt-4 w-12 h-px bg-[#BCA58A]/40" />
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 md:gap-7">
              {categories.map((cat, index) => (
                <motion.div key={index}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.07, duration: 0.5 }} viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="group cursor-pointer">
                  {/* Square editorial card */}
                  <div className="aspect-square overflow-hidden relative bg-[#E8DDD0] mb-3 border border-[#BCA58A]/10 group-hover:border-[#BCA58A]/40 transition-all duration-400">
                    <img src={cat.image} alt={cat.name}
                      className="w-full h-full object-cover transform scale-100 group-hover:scale-108 transition-transform duration-600" />
                    <div className="absolute inset-0 bg-[#1E1E1E]/10 group-hover:bg-transparent transition-colors duration-300" />
                    {/* Bottom label overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1E1E1E]/70 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                      <span className="text-[9px] tracking-[0.2em] text-[#BCA58A] uppercase font-semibold flex items-center gap-1.5"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Shop Now <ArrowRight size={10} />
                      </span>
                    </div>
                  </div>
                  <span className="text-[13px] font-medium tracking-wide text-[#1E1E1E] group-hover:text-[#BCA58A] transition-colors duration-300 block text-center"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '15px' }}>
                    {cat.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Boutique Promo */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }} viewport={{ once: true }}
            className="relative overflow-hidden bg-[#1E1E1E] group min-h-[500px] flex flex-col justify-end p-8 md:p-10 text-left">
            <div className="absolute inset-0 bg-cover bg-center z-0 opacity-45 group-hover:opacity-55 group-hover:scale-105 transition-all duration-700"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80')` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/50 to-transparent z-10" />
            {/* Gold fine border accent */}
            <div className="absolute inset-3 border border-[#BCA58A]/15 z-20 pointer-events-none" />

            <div className="relative z-30">
              <span className="text-[9px] font-semibold tracking-[0.28em] text-[#BCA58A] uppercase block mb-3"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Boutiques You Can Trust
              </span>
              <h3 className="text-2xl md:text-3xl font-light text-[#FAF9F6] mb-4 leading-snug"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Curated Stores from<br /><em className="italic text-[#BCA58A]">Across India</em>
              </h3>
              <p className="text-xs text-[#FAF9F6]/55 mb-8 leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Explore handpicked designer suits directly sourced from verified heritage boutiques and master artisans.
              </p>
              <motion.button whileHover={{ scale: 1.02, backgroundColor: '#BCA58A', color: '#111111', borderColor: '#BCA58A' }}
                whileTap={{ scale: 0.98 }}
                className="w-full border border-[#FAF9F6]/30 text-[#FAF9F6] py-3.5 text-[9px] font-semibold tracking-[0.25em] inline-flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                EXPLORE BOUTIQUES <ArrowRight size={12} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
