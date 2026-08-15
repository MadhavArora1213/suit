import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Eye, X, Star, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getProducts } from '../utils/adminStore';

export default function FeaturedCollections({ cart = [], addToCart, favorites = {}, toggleFavorite }) {
  const [activeTab, setActiveTab] = useState('Trending');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [products, setProducts] = useState({ Trending: [], 'New Arrivals': [], 'Best Sellers': [], 'Festive Edit': [] });
  const tabs = ['Trending', 'New Arrivals', 'Best Sellers', 'Festive Edit'];

  const loadProducts = () => {
    const adminProducts = getProducts();
    const merged = {
      Trending: [],
      'New Arrivals': [],
      'Best Sellers': [],
      'Festive Edit': [],
    };

    adminProducts.forEach((p) => {
      const col = p.collection;
      if (merged[col]) {
        if (!merged[col].some((existing) => existing.id === p.id)) {
          merged[col].unshift(p);
        }
      }
    });

    setProducts(merged);
  };

  useEffect(() => {
    loadProducts();
    window.addEventListener('admin-data-updated', loadProducts);
    return () => window.removeEventListener('admin-data-updated', loadProducts);
  }, []);

  return (
    <section className="py-28 bg-[#FAF9F6] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/4 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#FAF9F6]/4 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-6 md:px-14 relative z-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="text-[10px] tracking-[0.35em] text-[#D4AF37] uppercase block mb-4 font-medium"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>Handpicked Curation</span>
          <div className="flex items-center justify-center gap-5 mb-5">
            <div className="h-px w-12 bg-[#D4AF37]/30" />
            <h2 className="text-4xl md:text-6xl font-light text-[#1A0008]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Trending &amp; <em className="italic text-[#D4AF37]">Festive Wear</em>
            </h2>
            <div className="h-px w-12 bg-[#D4AF37]/30" />
          </div>
          <p className="text-[#6B6B6B] text-sm max-w-md mx-auto leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Luxurious fabrics and unique designs curated from boutique workshops across India.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center border-b border-[#D4AF37]/12 mb-14">
          <div className="flex gap-10 md:gap-14">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`pb-4 text-[10px] md:text-[11px] font-semibold tracking-[0.2em] transition-all duration-300 relative uppercase cursor-pointer ${
                  activeTab === tab ? 'text-[#1A0008]' : 'text-[#6B6B6B] hover:text-[#1A0008]/70'
                }`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="activeTabLine"
                    className="absolute bottom-0 left-0 right-0 h-px bg-[#D4AF37]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {products[activeTab].map((product, index) => (
              <motion.div layout key={product.id}
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ delay: index * 0.06, duration: 0.5 }}
                whileHover={{ y: -8 }}
                onClick={() => setQuickViewProduct(product)}
                className="group relative text-left cursor-pointer">

                {/* Image */}
                <div className="aspect-[3/4] overflow-hidden relative bg-[#FAF9F6] mb-5 border border-[#D4AF37]/8 group-hover:border-[#D4AF37]/30 transition-colors duration-500">
                  <img src={product.image} alt={product.name}
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-108 transition-transform duration-700" />

                  {/* Diagonal Premium Sash */}
                  {product.badge && (
                    <div className="absolute top-0 left-0 overflow-hidden w-28 h-28 z-20 pointer-events-none">
                      <div className="absolute top-5 -left-8 w-[150px] bg-gradient-to-r from-[#8B1A1A] to-[#601010] text-[#FAF9F6] text-[8px] font-black tracking-[0.25em] uppercase py-1.5 text-center shadow-lg border-y border-[#D4AF37]/40" style={{ transform: "rotate(-45deg)" }}>
                        {product.badge}
                      </div>
                    </div>
                  )}

                  {/* Wishlist */}
                  <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
                    className={`absolute top-3 right-3 p-2 backdrop-blur-md border transition-colors duration-300 z-20 cursor-pointer ${
                      favorites[product.id]
                        ? 'bg-[#FAF9F6] text-white border-transparent'
                        : 'bg-[#FAF9F6]/70 text-[#1A0008]/70 border-[#1A0008]/15 hover:border-[#D4AF37] hover:text-[#D4AF37]'
                    }`}>
                    <Heart size={14} className={favorites[product.id] ? 'fill-current' : ''} />
                  </motion.button>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[#FAF9F6]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4 z-10">
                    <div className="w-full flex gap-2">
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={(e) => { e.stopPropagation(); addToCart(product, product.fitOptions?.includes('Unstitched') ? 'Unstitched' : (product.fitOptions?.includes('Semi-Stitched') ? 'Semi-Stitched' : (product.sizes?.length > 0 ? `Stitched - ${product.sizes[0]}` : 'Stitched'))); }}
                        className="flex-1 bg-[#D4AF37] text-[#FAF9F6] text-[9px] font-bold tracking-[0.2em] uppercase py-3 flex items-center justify-center gap-1.5 hover:bg-[#D4AF37] transition-colors cursor-pointer">
                        <ShoppingBag size={11} /> ADD TO BAG
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={(e) => { e.stopPropagation(); setQuickViewProduct(product); }}
                        className="bg-[#1A0008]/10 border border-[#1A0008]/20 text-[#1A0008] hover:bg-[#1A0008] hover:text-[#FAF9F6] p-3 transition-colors cursor-pointer">
                        <Eye size={12} />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="px-1 space-y-1.5">
                  <span className="inline-block text-[#D4AF37] text-[8px] font-semibold tracking-[0.15em] uppercase border border-[#D4AF37]/25 px-2 py-0.5">
                    ✓ {product.boutique}
                  </span>
                  <h3 className="text-sm font-medium text-[#1A0008]/85 group-hover:text-[#1A0008] transition-colors duration-300 leading-snug"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '15px' }}>
                    {product.name}
                  </h3>
                  <p className="text-base font-light text-[#D4AF37]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {product.price}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.4 }}
          viewport={{ once: true }} className="flex justify-center mt-16">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#FAF9F6] px-12 py-3.5 tracking-[0.25em] text-[10px] font-semibold transition-all duration-300 cursor-pointer"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            VIEW ALL COLLECTIONS
          </motion.button>
        </motion.div>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setQuickViewProduct(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 24 }} animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 24 }} transition={{ type: 'spring', duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl bg-[#FAF9F6] border border-[#D4AF37]/15 overflow-hidden shadow-2xl flex flex-col md:flex-row relative max-h-[90vh] overflow-y-auto md:overflow-visible">

              <button onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 p-2 border border-[#D4AF37]/20 hover:border-[#D4AF37] text-[#6B6B6B] hover:text-[#1A0008] transition-colors z-10 cursor-pointer">
                <X size={16} />
              </button>

              <div className="w-full md:w-1/2 aspect-[3/4] md:aspect-auto md:h-[560px] relative bg-[#FAF9F6]">
                <img src={quickViewProduct.image} alt={quickViewProduct.name}
                  className="w-full h-full object-cover object-top" />
                <span className="absolute top-4 left-4 bg-[#D4AF37] text-[#FAF9F6] text-[8px] font-bold tracking-[0.15em] px-3 py-1.5 uppercase shadow-sm">
                  {quickViewProduct.badge}
                </span>
              </div>

              <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-between text-left">
                <div className="space-y-5">
                  <div>
                    <span className="text-[9px] font-semibold tracking-[0.25em] text-[#D4AF37] uppercase block mb-2">
                      {quickViewProduct.boutique} · EXCLUSIVE
                    </span>
                    <div className="flex items-center gap-1 text-[#D4AF37]">
                      {[...Array(5)].map((_, i) => <Star key={i} size={11} className="fill-current" />)}
                      <span className="text-[9px] text-[#6B6B6B] ml-2">(4.8 rating)</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-light text-[#1A0008] leading-tight mb-2"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {quickViewProduct.name}
                    </h3>
                    <p className="text-xl font-light text-[#D4AF37]"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {quickViewProduct.price}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#D4AF37]/12 space-y-2">
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-[#D4AF37] block">FABRIC & DESIGN</span>
                    <p className="text-xs text-[#6B6B6B] leading-relaxed"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Handcrafted from premium salwar suit fabric blend, with detailed thread embroidery and traditional borders. Direct from artisan workshops in India.
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-[#D4AF37] block">SELECT SIZE</span>
                    <div className="flex flex-wrap gap-2">
                      {['S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)'].map((size) => (
                        <button key={size} onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 text-[9px] font-semibold tracking-wider border transition-all duration-200 cursor-pointer ${
                            selectedSize === size
                              ? 'border-[#D4AF37] bg-[#D4AF37] text-[#FAF9F6]'
                              : 'border-[#D4AF37]/20 text-[#6B6B6B] hover:border-[#D4AF37] hover:text-[#D4AF37]'
                          }`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#D4AF37]/12">
                    {['100% Original Suit', 'Boutique Verified', 'Dry Clean Only', '7-Day Easy Return'].map((t) => (
                      <div key={t} className="flex items-center gap-2 text-[10px] text-[#6B6B6B]">
                        <Check size={12} className="text-[#D4AF37]" /> {t}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-[#D4AF37]/12 mt-6 md:mt-0">
                  <button onClick={() => { addToCart(quickViewProduct, selectedSize); setQuickViewProduct(null); }}
                    className="flex-1 bg-[#D4AF37] hover:bg-[#D4AF37] text-[#FAF9F6] py-4 text-[10px] font-bold tracking-[0.25em] flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer uppercase"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <ShoppingBag size={13} /> ADD TO BAG
                  </button>
                  <button onClick={() => toggleFavorite(quickViewProduct.id)}
                    className={`p-4 border transition-colors cursor-pointer ${
                      favorites[quickViewProduct.id]
                        ? 'bg-[#FAF9F6] text-white border-transparent'
                        : 'border-[#D4AF37]/20 text-[#6B6B6B] hover:border-[#D4AF37] hover:text-[#D4AF37]'
                    }`}>
                    <Heart size={15} className={favorites[quickViewProduct.id] ? 'fill-current' : ''} />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
