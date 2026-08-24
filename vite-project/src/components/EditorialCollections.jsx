import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCollections, getAllProducts } from '../utils/adminStore';

function toSlug(name) {
  return (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const FALLBACK_COLLECTIONS = [
  { id: '01', title: 'Summer Collection', desc: 'Breezy cottons and light georgettes tailored for the warm sun.', image: '/summer_edit.png' },
  { id: '02', title: 'Monsoon Collection', desc: 'Vibrant hues and fluid silhouettes to brighten gray days.', image: '/monsoon_edit.png' },
  { id: '03', title: 'Wedding Collection', desc: 'Heavy, regal bridal ensembles crafted for your biggest day.', image: '/wedding_edit.png' },
];

export default function EditorialCollections({ setView, setSelectedCollectionSlug }) {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const load = () => {
      const allProducts = getAllProducts();
      const allCols = getCollections().filter(c => c.active !== false).sort((a, b) => (a.order || 0) - (b.order || 0));
      const mapped = allCols.map((col, i) => {
        const colProducts = allProducts.filter(p => p.collection === col.title || p.collection === col.id);
        const coverImage = col.image || (colProducts.length > 0 ? colProducts[0].image : null) || '/summer_edit.png';
        return {
          id: String(i + 1).padStart(2, '0'),
          title: col.title || 'Collection',
          subtitle: col.subtitle || '',
          desc: col.desc || 'Handpicked designs for every occasion.',
          image: coverImage,
          slug: col.id || col.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '',
          products: colProducts.slice(0, 4),
        };
      });
      setCollections(mapped.length > 0 ? mapped : FALLBACK_COLLECTIONS);
    };
    load();
    window.addEventListener('admin-data-updated', load);
    return () => window.removeEventListener('admin-data-updated', load);
  }, []);

  return (
    <section className="relative w-full bg-[#FAF9F6]">
      
      {/* Intro Header */}
      <div className="h-[70vh] flex flex-col items-center justify-center bg-[#FAF9F6] sticky top-0 z-0">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[#8B1A1A] tracking-[0.4em] text-[10px] uppercase font-bold mb-6"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Curated Collections
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-[50px] md:text-[80px] lg:text-[100px] text-[#1A0008] font-light leading-none tracking-tighter text-center" 
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Editorial <span className="italic text-[#D4AF37]">Spreads</span>
        </motion.h2>
        <div className="w-px h-24 bg-[#1A0008]/20 mx-auto mt-12" />
        <p className="mt-8 text-xs text-[#1A0008]/40 tracking-[0.2em] uppercase font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>Scroll to explore</p>
      </div>

      {/* The Cinematic Stack */}
      <div className="relative">
        {collections.map((collection, index) => (
          <div 
            key={collection.id} 
            className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.1)] bg-[#FAF9F6]"
            style={{ zIndex: index + 1 }}
          >
            {/* Background Image */}
            <motion.div 
              initial={{ scale: 1.1 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full flex items-center justify-center"
            >
              <img 
                src={collection.image} 
                alt=""
                className="absolute inset-0 w-full h-full object-cover blur-[100px] opacity-20 scale-125 saturate-100"
              />
              <img 
                src={collection.image} 
                alt={collection.title}
                className="relative w-full h-[90vh] md:h-screen object-contain drop-shadow-2xl mix-blend-multiply"
              />
              <div className="absolute inset-0 bg-[#FAF9F6]/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-[#FAF9F6]/80 to-transparent" />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 text-center px-6 flex flex-col items-center max-w-4xl mx-auto w-full mt-20">
              
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-[#8B1A1A] tracking-[0.4em] text-xs font-bold uppercase mb-6 block drop-shadow-md"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Edit No. {collection.id}
              </motion.span>
              
              <motion.h3 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl md:text-7xl lg:text-[100px] font-light text-[#1A0008] leading-none tracking-tighter mb-6 drop-shadow-xl"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {collection.title.includes(' ') ? (
                  <>
                    {collection.title.split(' ').slice(0, -1).join(' ')} <br/>
                    <span className="italic text-[#D4AF37]">{collection.title.split(' ').slice(-1)}</span>
                  </>
                ) : (
                  <span className="italic text-[#D4AF37]">{collection.title}</span>
                )}
              </motion.h3>

              <motion.div 
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="w-16 h-px bg-[#1A0008]/30 mb-6 origin-center"
              />
              
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-[#1A0008]/70 text-base md:text-lg font-light mb-8 max-w-md drop-shadow-md"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {collection.desc}
              </motion.p>

              {/* Products Count */}
              {collection.products.length > 0 && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.65 }}
                  className="text-[#D4AF37] text-[10px] tracking-[0.3em] uppercase font-bold mb-6 drop-shadow-md"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {collection.products.length} Products
                </motion.p>
              )}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="flex flex-col sm:flex-row items-center gap-4"
              >
                <button 
                  onClick={() => {
                    if (setSelectedCollectionSlug) setSelectedCollectionSlug(collection.slug);
                    if (setView) setView('collection-detail');
                  }}
                  className="group inline-flex items-center gap-4 bg-transparent border border-[#1A0008]/20 text-[#1A0008] px-10 py-4 hover:bg-[#1A0008] hover:text-white hover:border-[#1A0008] transition-all duration-500 text-xs font-bold tracking-[0.2em] uppercase cursor-pointer"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Explore Collection
                </button>
              </motion.div>

              {/* Mini Product Thumbnails */}
              {collection.products.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="flex gap-3 mt-8"
                >
                  {collection.products.slice(0, 4).map((prod, i) => (
                    <a 
                      key={prod.id} 
                      href={`/product/${toSlug(prod.name)}`}
                      className="w-14 h-16 md:w-16 md:h-20 bg-white p-1 shadow-lg border border-[#1A0008]/10 hover:scale-110 hover:shadow-xl transition-all duration-300 cursor-pointer"
                      style={{ transform: `rotate(${i % 2 === 0 ? '-3deg' : '3deg'})` }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <img src={prod.image || '/cotton_suit.png'} alt={prod.name} className="w-full h-full object-cover" />
                    </a>
                  ))}
                </motion.div>
              )}
              
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
