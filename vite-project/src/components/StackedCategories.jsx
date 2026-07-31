import { motion } from 'framer-motion';
import { ShoppingBag, ArrowUpRight } from 'lucide-react';

const collections = [
  { 
    id: 1, 
    name: 'Anarkali Set', 
    image: '/anarkali_suit.png', 
    price: 'Starting at ₹6,999',
    colSpan: 'md:col-span-2',
    rowSpan: 'md:row-span-2'
  },
  { 
    id: 2, 
    name: 'Sharara Set', 
    image: '/sharara_suit.png', 
    price: 'Starting at ₹5,499',
    colSpan: 'md:col-span-1',
    rowSpan: 'md:row-span-1'
  },
  { 
    id: 3, 
    name: 'Pakistani Suits', 
    image: '/pakistani_suit.png', 
    price: 'Starting at ₹4,299',
    colSpan: 'md:col-span-1',
    rowSpan: 'md:row-span-1'
  },
  { 
    id: 4, 
    name: 'Bridal Zardozi', 
    image: '/designer_suit_1.png', 
    price: 'Starting at ₹12,999',
    colSpan: 'md:col-span-2',
    rowSpan: 'md:row-span-1'
  },
];

export default function StackedCategories() {
  return (
    <section className="bg-[#FAF9F6] py-24 relative" id="collections">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="text-left">
            <span className="text-[10px] tracking-[0.35em] text-[#D4AF37] uppercase block mb-4 font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Shop By Silhouette
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#1A0008]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Signature <em className="italic text-[#D4AF37]">Styles</em>
            </h2>
          </div>
          <button className="flex items-center gap-2 text-[#1A0008] hover:text-[#D4AF37] transition-colors group pb-1 border-b border-[#1A0008] hover:border-[#D4AF37]">
            <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>View All Categories</span>
            <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

        {/* High Density Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[300px]">
          {collections.map((cat, i) => (
            <motion.div 
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`relative group overflow-hidden bg-[#E8DDD0] ${cat.colSpan} ${cat.rowSpan}`}
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0008]/90 via-[#1A0008]/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
              
              {/* Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col justify-end h-full">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-3xl text-[#FAF9F6] mb-2 font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {cat.name}
                  </h3>
                  <p className="text-[#D4AF37] text-sm tracking-wide mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {cat.price}
                  </p>
                  
                  {/* Shop Button */}
                  <button className="w-fit bg-[#FAF9F6] text-[#1A0008] hover:bg-[#D4AF37] hover:text-[#FAF9F6] px-8 py-3 flex items-center gap-3 text-[10px] tracking-[0.2em] font-bold transition-colors opacity-0 group-hover:opacity-100 cursor-pointer" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <ShoppingBag size={14} />
                    <span>EXPLORE SILHOUETTE</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
