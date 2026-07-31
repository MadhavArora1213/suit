import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShoppingBag, ArrowUpRight, ChevronRight } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { getAllProducts, getCollectionTags } from '../utils/adminStore';


export default function CollectionsPage({ setView, setSelectedCategory, setSelectedProduct, setSelectedCollectionSlug, addToCart }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [activeTag, setActiveTag] = useState('All');
  const [collections, setCollections] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagIcons, setTagIcons] = useState({});

  useEffect(() => {
    const load = () => {
      let data = JSON.parse(localStorage.getItem('gurnaaz_collections') || '[]');
      data = data.filter(c => c.active).sort((a, b) => a.order - b.order);
      setCollections(data);

      const loadedTags = getCollectionTags().filter(t => t.active).sort((a, b) => a.order - b.order);
      setTags(loadedTags);
      
      const iconsMap = {};
      loadedTags.forEach(t => {
        iconsMap[t.name] = t.icon;
      });
      setTagIcons(iconsMap);
    };
    load();
    window.addEventListener('admin-data-updated', load);
    return () => window.removeEventListener('admin-data-updated', load);
  }, []);

  const allProducts = useMemo(() => getAllProducts(), []);

  const filteredCollections = activeTag === 'All' ? collections : collections.filter(c => c.tag === activeTag);

  const getProductCount = (category) => {
    if (category === 'All') return allProducts.length;
    return allProducts.filter(p => p.type === category || p.suitType === category).length;
  };

  const spotlight = collections.length > 0 ? collections[0] : null;

  return (
    <div className="min-h-screen bg-[#FAF9F6] mt-[80px] md:mt-[110px]">
      {/* ── Cinematic Hero ── */}
      <div className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <img src="/luxury_edit.png" alt="" className="absolute inset-0 w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/50 to-[#FAF9F6]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

        <div className="relative h-full max-w-[1600px] mx-auto px-5 sm:px-6 md:px-12 flex flex-col justify-center pb-16 sm:pb-20 md:pb-28 mt-12 sm:mt-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-[#D4AF37] text-[10px] tracking-[0.4em] uppercase font-bold block mb-6"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Gurnaaz · Curated Collections
            </motion.span>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-4xl md:text-6xl lg:text-[80px] font-light text-white leading-[1] tracking-tight mb-6"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              The Art of<br />
              <span className="italic text-[#D4AF37]">Indian Craft</span>
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="w-20 h-px bg-[#D4AF37] mb-8 origin-left"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-white/70 text-sm md:text-base max-w-md leading-relaxed mb-10"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {collections.length} handpicked collections celebrating heritage fabrics,
              artisan embroidery, and timeless silhouettes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={() => document.getElementById('collections-grid')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-[#D4AF37] hover:bg-[#a8906e] text-white px-8 py-4 text-[10px] font-bold tracking-[0.25em] uppercase flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer w-full sm:w-auto"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                EXPLORE ALL <ArrowRight size={14} />
              </button>
              <button
                onClick={() => { setSelectedCategory('All'); setView('category'); }}
                className="border border-white/30 hover:border-white/60 text-white px-8 py-4 text-[10px] font-bold tracking-[0.25em] uppercase flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer backdrop-blur-sm w-full sm:w-auto"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                SHOP NOW <ArrowUpRight size={14} />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Tag Filter ── */}
      <div id="collections-grid" className="sticky top-20 z-40 bg-[#FAF9F6]/95 backdrop-blur-xl border-b border-[#D4AF37]/10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="flex items-center gap-1 overflow-x-auto py-4 scrollbar-hide">
            <button
              onClick={() => setActiveTag('All')}
              className={`flex items-center gap-2 whitespace-nowrap px-5 py-2.5 rounded-full text-[10px] md:text-[11px] font-semibold tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer ${
                activeTag === 'All'
                  ? 'bg-[#1A0008] text-white shadow-lg'
                  : 'bg-[#E8DDD0]/50 text-[#6B6B6B] hover:bg-[#E8DDD0] hover:text-[#1A0008]'
              }`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <span className="text-[12px]">◈</span>
              All Edits
              {activeTag === 'All' && (
                <span className="bg-white/20 text-[9px] px-1.5 py-0.5 rounded-full ml-1">
                  {collections.length}
                </span>
              )}
            </button>
            {tags.map((tagObj) => (
              <button
                key={tagObj.id}
                onClick={() => setActiveTag(tagObj.name)}
                className={`flex items-center gap-2 whitespace-nowrap px-5 py-2.5 rounded-full text-[10px] md:text-[11px] font-semibold tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer ${
                  activeTag === tagObj.name
                    ? 'bg-[#1A0008] text-white shadow-lg'
                    : 'bg-[#E8DDD0]/50 text-[#6B6B6B] hover:bg-[#E8DDD0] hover:text-[#1A0008]'
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <span className="text-[12px]">{tagObj.icon}</span>
                {tagObj.name}
                {activeTag === tagObj.name && (
                  <span className="bg-white/20 text-[9px] px-1.5 py-0.5 rounded-full ml-1">
                    {collections.filter(c => c.tag === tagObj.name).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Trending Horizontal Strip ── */}
      {activeTag === 'All' && (
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 mt-10 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
            <div>
              <span className="text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase font-bold block mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Trending Now
              </span>
              <h2 className="text-2xl md:text-3xl font-light text-[#1A0008]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Most Popular <span className="italic text-[#D4AF37]">Collections</span>
              </h2>
            </div>
            <button
              onClick={() => document.getElementById('collections-grid')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-[10px] text-[#6B6B6B] hover:text-[#D4AF37] tracking-[0.15em] uppercase flex items-center gap-2 transition-colors cursor-pointer"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {collections.filter(c => ['anarkali', 'banarasi', 'wedding', 'chikankari', 'velvet', 'bridal'].includes(c.id)).map((col, i) => (
              <motion.div
                key={col.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                onClick={() => { setSelectedCollectionSlug(col.id); setView('collection-detail'); }}
                className="flex-shrink-0 w-[260px] md:w-[300px] group cursor-pointer"
              >
                <div className="relative aspect-[4/5] overflow-hidden mb-3">
                  <img src={col.image} alt={col.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[8px] tracking-[0.2em] uppercase font-bold block mb-1" style={{ color: col.accent, fontFamily: "'DM Sans', sans-serif" }}>
                      {col.tag}
                    </span>
                    <h3 className="text-xl font-light text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {col.title} <span className="italic" style={{ color: col.accent }}>{col.subtitle}</span>
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ── Featured Spotlight (first item when "All") ── */}
      {activeTag === 'All' && spotlight && (
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 mt-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            onClick={() => { setSelectedCollectionSlug(spotlight.id); setView('collection-detail'); }}
            className="group relative h-[50vh] md:h-[60vh] overflow-hidden cursor-pointer"
          >
            <img src={spotlight.image} alt={spotlight.title} className="absolute inset-0 w-full h-full object-cover object-[center_20%] transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

            <div className="relative h-full flex flex-col justify-end p-6 sm:p-10 md:p-16 max-w-2xl">
              <span className="text-[#D4AF37] text-[9px] tracking-[0.4em] uppercase font-bold mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Featured Collection
              </span>
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-light text-white leading-none mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {spotlight.title} <br /><span className="italic text-[#D4AF37]">{spotlight.subtitle}</span>
              </h2>
              <div className="w-12 h-px bg-[#D4AF37] mb-6" />
              <p className="text-white/70 text-sm leading-relaxed mb-8 max-w-md" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {spotlight.desc}
              </p>
              <div className="flex items-center gap-3 text-[#D4AF37] text-[10px] font-bold tracking-[0.2em] uppercase group-hover:gap-5 transition-all duration-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Explore Now <ArrowRight size={16} />
              </div>
            </div>

            {/* Edit number */}
            <div className="absolute top-6 right-6 sm:top-8 sm:right-8 md:top-12 md:right-12 text-right">
              <span className="text-white/20 text-[60px] sm:text-[80px] md:text-[120px] font-light leading-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                01
              </span>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── Collections Grid ── */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 mt-10 mb-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase font-bold block mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {activeTag === 'All' ? 'All Collections' : activeTag}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[#1A0008]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {activeTag === 'All' ? 'Browse by Category' : `${activeTag} Collections`}
            </h2>
          </div>
          <span className="text-[10px] text-[#6B6B6B] tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {filteredCollections.length} collections
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTag}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filteredCollections.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                onMouseEnter={() => setHoveredId(collection.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => { setSelectedCollectionSlug(collection.id); setView('collection-detail'); }}
                className="group flex flex-col cursor-pointer"
              >
                {/* Image Wrapper */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-[#E8DDD0] mb-5 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  
                  {/* Floating Tag */}
                  <div className="absolute top-4 left-4 z-10">
                    <span
                      className="bg-white/90 backdrop-blur-md text-[9px] font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full shadow-sm text-gray-800"
                    >
                      {collection.tag}
                    </span>
                  </div>

                  {/* Glassmorphism Explore Button */}
                  <div className="absolute inset-x-4 bottom-4 translate-y-16 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                     <div className="w-full bg-white/85 backdrop-blur-md text-[#1A0008] py-3.5 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase flex items-center justify-center gap-2 hover:bg-[#1A0008] hover:text-white transition-colors shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                        Explore Collection <ArrowRight size={14} />
                     </div>
                  </div>
                </div>

                {/* Content below */}
                <div className="flex flex-col px-2">
                  <h3
                    className="text-xl sm:text-2xl md:text-3xl font-medium text-[#1A0008] leading-tight mb-2 group-hover:text-[#D4AF37] transition-colors"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {collection.title}{' '}
                    <span className="italic text-gray-400 font-light">
                      {collection.subtitle}
                    </span>
                  </h3>
                  <p
                    className="text-gray-500 text-[13px] leading-relaxed line-clamp-2"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {collection.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom CTA ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="max-w-[1600px] mx-auto px-6 md:px-12 mt-12 mb-16 text-center"
      >
        <div className="relative py-10 sm:py-16 border border-[#D4AF37]/15 bg-gradient-to-br from-[#E8DDD0]/30 to-transparent">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FAF9F6] px-8">
            <span className="text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              ✦
            </span>
          </div>
          <p className="text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase font-bold mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Can't find what you're looking for?
          </p>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-light text-[#1A0008] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Browse Our <span className="italic text-[#D4AF37]">Full Catalogue</span>
          </h3>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setSelectedCategory('All'); setView('category'); }}
            className="bg-[#1A0008] hover:bg-[#D4AF37] text-white px-8 sm:px-10 py-4 text-[10px] font-bold tracking-[0.25em] uppercase inline-flex items-center gap-3 transition-all duration-300 cursor-pointer"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <ShoppingBag size={14} />
            VIEW ALL PRODUCTS
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
