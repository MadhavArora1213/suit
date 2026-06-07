import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Eye, X, Star, Check } from 'lucide-react';
import { useState } from 'react';

const products = {
  Trending: [
    { id: 't1', name: 'Embroidered Silk Suit Set', price: '₹4,299', image: '/designer_suit_1.png', boutique: 'Kala Mandir', badge: 'Silk Blend' },
    { id: 't2', name: 'Chanderi Salwar Suit Set', price: '₹3,899', image: '/cotton_suit.png', boutique: 'Zari Heritage', badge: 'Handloom' },
    { id: 't3', name: 'Designer Angrakha Suit Set', price: '₹5,499', image: '/sharara_suit.png', boutique: 'Gulabo Jaipur', badge: 'Premium' },
    { id: 't4', name: 'Pakistani Straight Suit Set', price: '₹4,799', image: '/pakistani_suit.png', boutique: 'Nazraana', badge: 'Verified' },
  ],
  'New Arrivals': [
    { id: 'n1', name: 'Floral Silk Anarkali Suit', price: '₹6,899', image: '/anarkali_suit.png', boutique: 'Silk Weaver', badge: 'New Edition' },
    { id: 'n2', name: 'Classic Georgette Suit Set', price: '₹3,299', image: '/designer_suit_1.png', boutique: 'Poshak', badge: 'Lightweight' },
    { id: 'n3', name: 'Cotton Patiala Salwar Suit', price: '₹2,499', image: '/patiala_suit.png', boutique: 'Jaipur Block', badge: '100% Cotton' },
    { id: 'n4', name: 'Organza Dupatta Suit Set', price: '₹5,199', image: '/chikankari_suit.png', boutique: 'Rivaaz', badge: 'Best Price' },
  ],
  'Best Sellers': [
    { id: 'b1', name: 'Velvet Embroidered Suit Set', price: '₹8,999', image: '/banarasi_suit.png', boutique: 'Vastra', badge: 'Hot Seller' },
    { id: 'b2', name: 'Chikankari Handloom Suit Set', price: '₹7,499', image: '/chikankari_suit.png', boutique: 'Awadh Kraft', badge: 'Artisanal' },
    { id: 'b3', name: 'Banarasi Brocade Suit Set', price: '₹9,299', image: '/banarasi_suit.png', boutique: 'Kashi Fabrics', badge: 'Heritage' },
    { id: 'b4', name: 'Gota Patti Sharara Suit Set', price: '₹4,999', image: '/sharara_suit.png', boutique: 'Shagun Jaipur', badge: 'Best Seller' },
  ],
  'Festive Edit': [
    { id: 'f1', name: 'Royal Sharara Suit Set', price: '₹11,499', image: '/sharara_suit.png', boutique: 'Rajputana', badge: 'Grand Wedding' },
    { id: 'f2', name: 'Handcrafted Palazzo Suit Set', price: '₹8,299', image: '/pakistani_suit.png', boutique: 'Gulabi Dhaaga', badge: 'Silk Edit' },
    { id: 'f3', name: 'Raw Silk Anarkali Suit Set', price: '₹13,999', image: '/anarkali_suit.png', boutique: 'Royal Heritage', badge: 'Exclusive' },
    { id: 'f4', name: 'Heavy Zardozi Salwar Suit Set', price: '₹12,499', image: '/designer_suit_1.png', boutique: 'Lakhnavi Shaan', badge: 'Festive Special' },
  ],
};

export default function FeaturedCollections({ cart = [], addToCart, favorites = {}, toggleFavorite }) {
  const [activeTab, setActiveTab] = useState('Trending');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const tabs = ['Trending', 'New Arrivals', 'Best Sellers', 'Festive Edit'];

  return (
    <section className="py-28 bg-[#111111] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#BCA58A]/4 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#111111]/4 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-6 md:px-14 relative z-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="text-[10px] tracking-[0.35em] text-[#BCA58A] uppercase block mb-4 font-medium"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>Handpicked Curation</span>
          <div className="flex items-center justify-center gap-5 mb-5">
            <div className="h-px w-12 bg-[#BCA58A]/30" />
            <h2 className="text-4xl md:text-6xl font-light text-[#FAF9F6]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Trending &amp; <em className="italic text-[#BCA58A]">Festive Wear</em>
            </h2>
            <div className="h-px w-12 bg-[#BCA58A]/30" />
          </div>
          <p className="text-[#6B6B6B] text-sm max-w-md mx-auto leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Luxurious fabrics and unique designs curated from boutique workshops across India.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center border-b border-[#BCA58A]/12 mb-14">
          <div className="flex gap-10 md:gap-14">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`pb-4 text-[10px] md:text-[11px] font-semibold tracking-[0.2em] transition-all duration-300 relative uppercase cursor-pointer ${
                  activeTab === tab ? 'text-[#FAF9F6]' : 'text-[#6B6B6B] hover:text-[#FAF9F6]/70'
                }`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="activeTabLine"
                    className="absolute bottom-0 left-0 right-0 h-px bg-[#BCA58A]"
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
                <div className="aspect-[3/4] overflow-hidden relative bg-[#111111] mb-5 border border-[#BCA58A]/8 group-hover:border-[#BCA58A]/30 transition-colors duration-500">
                  <img src={product.image} alt={product.name}
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-108 transition-transform duration-700" />

                  {/* Badge */}
                  <span className="absolute top-3 left-3 bg-[#111111]/85 backdrop-blur-sm text-[#BCA58A] text-[8px] font-semibold tracking-[0.15em] uppercase px-2.5 py-1.5 border border-[#BCA58A]/25">
                    {product.badge}
                  </span>

                  {/* Wishlist */}
                  <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
                    className={`absolute top-3 right-3 p-2 backdrop-blur-md border transition-colors duration-300 z-20 cursor-pointer ${
                      favorites[product.id]
                        ? 'bg-[#111111] text-white border-transparent'
                        : 'bg-[#111111]/70 text-[#FAF9F6]/70 border-[#FAF9F6]/15 hover:border-[#BCA58A] hover:text-[#BCA58A]'
                    }`}>
                    <Heart size={14} className={favorites[product.id] ? 'fill-current' : ''} />
                  </motion.button>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[#111111]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4 z-10">
                    <div className="w-full flex gap-2">
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={(e) => { e.stopPropagation(); addToCart(product, 'M'); }}
                        className="flex-1 bg-[#BCA58A] text-[#111111] text-[9px] font-bold tracking-[0.2em] uppercase py-3 flex items-center justify-center gap-1.5 hover:bg-[#BCA58A] transition-colors cursor-pointer">
                        <ShoppingBag size={11} /> ADD TO BAG
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={(e) => { e.stopPropagation(); setQuickViewProduct(product); }}
                        className="bg-[#FAF9F6]/10 border border-[#FAF9F6]/20 text-[#FAF9F6] hover:bg-[#FAF9F6] hover:text-[#111111] p-3 transition-colors cursor-pointer">
                        <Eye size={12} />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="px-1 space-y-1.5">
                  <span className="inline-block text-[#BCA58A] text-[8px] font-semibold tracking-[0.15em] uppercase border border-[#BCA58A]/25 px-2 py-0.5">
                    ✓ {product.boutique}
                  </span>
                  <h3 className="text-sm font-medium text-[#FAF9F6]/85 group-hover:text-[#FAF9F6] transition-colors duration-300 leading-snug"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '15px' }}>
                    {product.name}
                  </h3>
                  <p className="text-base font-light text-[#BCA58A]"
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
            className="border border-[#BCA58A]/50 text-[#BCA58A] hover:bg-[#BCA58A] hover:text-[#111111] px-12 py-3.5 tracking-[0.25em] text-[10px] font-semibold transition-all duration-300 cursor-pointer"
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
              className="w-full max-w-4xl bg-[#111111] border border-[#BCA58A]/15 overflow-hidden shadow-2xl flex flex-col md:flex-row relative max-h-[90vh] overflow-y-auto md:overflow-visible">

              <button onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 p-2 border border-[#BCA58A]/20 hover:border-[#BCA58A] text-[#6B6B6B] hover:text-[#FAF9F6] transition-colors z-10 cursor-pointer">
                <X size={16} />
              </button>

              <div className="w-full md:w-1/2 aspect-[3/4] md:aspect-auto md:h-[560px] relative bg-[#111111]">
                <img src={quickViewProduct.image} alt={quickViewProduct.name}
                  className="w-full h-full object-cover object-top" />
                <span className="absolute top-4 left-4 bg-[#BCA58A] text-[#111111] text-[8px] font-bold tracking-[0.15em] px-3 py-1.5 uppercase shadow-sm">
                  {quickViewProduct.badge}
                </span>
              </div>

              <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-between text-left">
                <div className="space-y-5">
                  <div>
                    <span className="text-[9px] font-semibold tracking-[0.25em] text-[#BCA58A] uppercase block mb-2">
                      {quickViewProduct.boutique} · EXCLUSIVE
                    </span>
                    <div className="flex items-center gap-1 text-[#BCA58A]">
                      {[...Array(5)].map((_, i) => <Star key={i} size={11} className="fill-current" />)}
                      <span className="text-[9px] text-[#6B6B6B] ml-2">(4.8 rating)</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-light text-[#FAF9F6] leading-tight mb-2"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {quickViewProduct.name}
                    </h3>
                    <p className="text-xl font-light text-[#BCA58A]"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {quickViewProduct.price}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#BCA58A]/12 space-y-2">
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-[#BCA58A] block">FABRIC & DESIGN</span>
                    <p className="text-xs text-[#6B6B6B] leading-relaxed"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Handcrafted from premium salwar suit fabric blend, with detailed thread embroidery and traditional borders. Direct from artisan workshops in India.
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-[#BCA58A] block">SELECT SIZE</span>
                    <div className="flex flex-wrap gap-2">
                      {['S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)'].map((size) => (
                        <button key={size} onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 text-[9px] font-semibold tracking-wider border transition-all duration-200 cursor-pointer ${
                            selectedSize === size
                              ? 'border-[#BCA58A] bg-[#BCA58A] text-[#111111]'
                              : 'border-[#BCA58A]/20 text-[#6B6B6B] hover:border-[#BCA58A] hover:text-[#BCA58A]'
                          }`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#BCA58A]/12">
                    {['100% Original Suit', 'Boutique Verified', 'Dry Clean Only', '7-Day Easy Return'].map((t) => (
                      <div key={t} className="flex items-center gap-2 text-[10px] text-[#6B6B6B]">
                        <Check size={12} className="text-[#BCA58A]" /> {t}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-[#BCA58A]/12 mt-6 md:mt-0">
                  <button onClick={() => { addToCart(quickViewProduct, selectedSize); setQuickViewProduct(null); }}
                    className="flex-1 bg-[#BCA58A] hover:bg-[#BCA58A] text-[#111111] py-4 text-[10px] font-bold tracking-[0.25em] flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer uppercase"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <ShoppingBag size={13} /> ADD TO BAG
                  </button>
                  <button onClick={() => toggleFavorite(quickViewProduct.id)}
                    className={`p-4 border transition-colors cursor-pointer ${
                      favorites[quickViewProduct.id]
                        ? 'bg-[#111111] text-white border-transparent'
                        : 'border-[#BCA58A]/20 text-[#6B6B6B] hover:border-[#BCA58A] hover:text-[#BCA58A]'
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
