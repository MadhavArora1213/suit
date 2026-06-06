import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    name: 'Anarkali Suits',
    image: '/anarkali_suit.png',
  },
  {
    name: 'Pakistani Suits',
    image: '/pakistani_suit.png',
  },
  {
    name: 'Punjabi Patiala',
    image: '/patiala_suit.png',
  },
  {
    name: 'Sharara Suits',
    image: '/sharara_suit.png',
  },
  {
    name: 'Chikankari Suits',
    image: '/chikankari_suit.png',
  },
  {
    name: 'Banarasi Silk',
    image: '/banarasi_suit.png',
  },
];

export default function CategoryShowcase() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        
        {/* Layout Split: Categories & Boutique Promo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 items-stretch">
          
          {/* Categories Grid (Spans 2 cols) */}
          <div className="lg:col-span-2 text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <span className="text-xs font-bold tracking-[0.2em] text-[#BCA58A] uppercase block mb-3">
                Shop By Category
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-medium text-[#111111]">
                Explore Our Collections
              </h2>
            </motion.div>

            {/* Circular Category items */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-12">
              {categories.map((cat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6 }}
                  className="group cursor-pointer flex flex-col items-center"
                >
                  {/* Circle Image */}
                  <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full overflow-hidden border-2 border-[#EBDDD0] group-hover:border-[#BCA58A] shadow-md hover:shadow-premium transition-all duration-300 relative bg-[#FAF9F6] mb-5">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-[#111111]/5 group-hover:bg-transparent transition-colors duration-300"></div>
                  </div>
                  
                  {/* Category Name */}
                  <span className="text-sm sm:text-base font-semibold tracking-wider text-[#1E1E1E] group-hover:text-[#BCA58A] transition-colors duration-300 text-center">
                    {cat.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Boutique Promo Card (Spans 1 col) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden relative shadow-premium bg-[#111111] group min-h-[350px] flex flex-col justify-end p-8 md:p-10 text-left"
          >
            {/* Background Store Showroom Image */}
            <div className="absolute inset-0 bg-cover bg-center z-0 opacity-55 transform scale-100 group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80')` }}></div>
            
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent z-10"></div>
            
            {/* Text & Button */}
            <div className="relative z-20">
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#BCA58A] uppercase block mb-2">
                Boutiques You Can Trust
              </span>
              <h3 className="text-2xl md:text-3xl font-display font-medium text-white mb-4 leading-tight">
                Curated Stores from Across India
              </h3>
              <p className="text-xs md:text-sm text-[#FAF9F6]/80 mb-8 leading-relaxed font-body">
                Explore handpicked designer suits directly sourced from verified heritage boutiques and master artisans.
              </p>
              
              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: '#BCA58A', color: '#FAF9F6' }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-[#FAF9F6] text-[#111111] py-3.5 rounded-xl text-xs font-semibold tracking-widest inline-flex items-center justify-center gap-2 transition-all duration-300"
              >
                EXPLORE BOUTIQUES
                <ArrowRight size={14} />
              </motion.button>
            </div>
          </motion.div>

        </div>
        
      </div>
    </section>
  );
}
