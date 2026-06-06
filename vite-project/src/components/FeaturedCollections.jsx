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
    <section className="py-24 bg-[#FAF9F6]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-bold tracking-[0.25em] text-[#BCA58A] uppercase block mb-3">
            Handpicked Curation
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-medium text-[#111111] mb-6">
            Trending & Festive Wear
          </h2>
          <p className="text-[#686868] text-sm md:text-base max-w-xl mx-auto font-body">
            Luxurious fabrics and unique designs curated from boutique workshops across India.
          </p>
        </motion.div>

        {/* Tab Buttons */}
        <div className="flex justify-center border-b border-[#EBDDD0]/40 mb-12">
          <div className="flex gap-8 md:gap-12">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-xs md:text-sm font-semibold tracking-widest transition-all duration-300 relative uppercase ${
                  activeTab === tab ? 'text-[#111111] scale-105' : 'text-[#686868]/60 hover:text-[#111111]'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#BCA58A]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {products[activeTab].map((product, index) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                whileHover={{ y: -6 }}
                onClick={() => setQuickViewProduct(product)}
                className="group relative text-left cursor-pointer"
              >
                {/* Product Image Frame */}
                <div className="aspect-[3/4] rounded-2xl overflow-hidden relative shadow-sm group-hover:shadow-premium bg-[#EBDDD0]/20 transition-all duration-500 mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Badge */}
                  <span className="absolute top-4 left-4 bg-[#111111]/85 backdrop-blur-sm text-[#FAF9F6] text-[8px] font-bold tracking-widest uppercase px-2.5 py-1.5 rounded-md">
                    {product.badge}
                  </span>

                  {/* Wishlist Button */}
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                    className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md shadow-md border border-white/20 transition-colors duration-300 z-20 ${
                      favorites[product.id]
                        ? 'bg-[#800020] text-white border-transparent'
                        : 'bg-white/85 text-[#111111] hover:bg-[#BCA58A] hover:text-white'
                    }`}
                  >
                    <Heart size={16} className={favorites[product.id] ? 'fill-current' : ''} />
                  </motion.button>

                  {/* Hover Buttons Panel (Slide Up Overlay) */}
                  <div className="absolute inset-0 bg-[#111111]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4 z-10">
                    <div className="w-full flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product, 'M');
                        }}
                        className="flex-1 bg-white text-[#111111] text-[10px] font-bold tracking-widest uppercase py-3 rounded-lg flex items-center justify-center gap-1.5 shadow-md hover:bg-[#BCA58A] hover:text-white transition-colors duration-300"
                      >
                        <ShoppingBag size={12} />
                        ADD TO BAG
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuickViewProduct(product);
                        }}
                        className="bg-white/95 text-[#111111] hover:bg-[#111111] hover:text-white p-3 rounded-lg shadow-md transition-colors"
                      >
                        <Eye size={12} />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="px-1 space-y-1">
                  
                  {/* Verified Boutique Tag */}
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block bg-[#BCA58A]/15 text-[#BCA58A] text-[8px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded">
                      ✓ Verified Boutique
                    </span>
                    <span className="text-[10px] text-[#686868] font-body">
                      by {product.boutique}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold tracking-wide text-[#1E1E1E] group-hover:text-[#BCA58A] transition-colors duration-300 pt-1">
                    {product.name}
                  </h3>

                  <p className="text-sm font-display font-medium text-[#BCA58A]">
                    {product.price}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="flex justify-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.04, backgroundColor: '#1E1E1E' }}
            whileTap={{ scale: 0.96 }}
            className="border border-[#111111] bg-[#111111] text-white hover:bg-black px-10 py-3.5 tracking-widest text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
          >
            VIEW ALL COLLECTIONS
          </motion.button>
        </motion.div>

      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQuickViewProduct(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible"
            >
              {/* Close Button */}
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-neutral-100 hover:bg-[#BCA58A]/10 text-neutral-800 transition-colors z-10 cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Left Side: Product Image Banner */}
              <div className="w-full md:w-1/2 aspect-[3/4] md:aspect-auto md:h-[550px] relative bg-[#FAF9F6]">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover object-top"
                />
                <span className="absolute top-4 left-4 bg-[#BCA58A] text-white text-[9px] font-bold tracking-[0.15em] px-3 py-1.5 rounded-md uppercase z-10 shadow-sm">
                  {quickViewProduct.badge}
                </span>
              </div>

              {/* Right Side: Product Details & Size Selectors */}
              <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-between text-left">
                <div className="space-y-5">
                  {/* Tag & Rating */}
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-[#BCA58A] uppercase">
                      {quickViewProduct.boutique} &middot; EXCLUSIVE
                    </span>
                    <div className="flex items-center gap-1 mt-1 text-[#BCA58A]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className="fill-current" />
                      ))}
                      <span className="text-[10px] text-[#686868] font-body ml-2">(4.8 rating)</span>
                    </div>
                  </div>

                  {/* Product Title & Price */}
                  <div>
                    <h3 className="text-2xl font-display font-medium text-[#111111] leading-tight">
                      {quickViewProduct.name}
                    </h3>
                    <p className="text-xl font-display font-medium text-[#BCA58A] mt-2">
                      {quickViewProduct.price}
                    </p>
                  </div>

                  {/* Fabric Specs */}
                  <div className="pt-4 border-t border-[#EBDDD0]/40 space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#BCA58A] block">FABRIC & DESIGN</span>
                    <p className="text-xs text-[#686868] leading-relaxed">
                      Handcrafted from premium salwar suit fabric blend, with detailed thread embroidery and traditional borders. Direct from artisan workshops in India.
                    </p>
                  </div>

                  {/* Sizing Selectors */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#BCA58A] block">SELECT SIZE (INDIAN SIZE)</span>
                    <div className="flex flex-wrap gap-2.5">
                      {['S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)'].map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4.5 py-2 text-[10px] font-bold tracking-wider rounded-lg border transition-all duration-300 cursor-pointer ${
                            selectedSize === size
                              ? 'border-[#111111] bg-[#111111] text-white shadow-sm'
                              : 'border-[#EBDDD0] bg-white text-[#686868] hover:border-[#BCA58A] hover:text-[#111111]'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#EBDDD0]/40 text-[#686868]">
                    <div className="flex items-center gap-2 text-xs">
                      <Check size={14} className="text-[#BCA58A]" />
                      <span>100% Original Suit</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Check size={14} className="text-[#BCA58A]" />
                      <span>Boutique Verified</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Check size={14} className="text-[#BCA58A]" />
                      <span>Dry Clean Only</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Check size={14} className="text-[#BCA58A]" />
                      <span>7-Day Easy Return</span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-6 border-t border-[#EBDDD0]/40 mt-6 md:mt-0">
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct, selectedSize);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 bg-[#111111] hover:bg-[#BCA58A] text-white py-4 rounded-xl text-xs font-bold tracking-[0.2em] flex items-center justify-center gap-2 transition-all duration-300 shadow-md cursor-pointer"
                  >
                    <ShoppingBag size={14} />
                    <span>ADD TO BAG</span>
                  </button>
                  <button
                    onClick={() => {
                      toggleFavorite(quickViewProduct.id);
                    }}
                    className={`p-4 rounded-xl border transition-colors cursor-pointer ${
                      favorites[quickViewProduct.id]
                        ? 'bg-[#800020] text-white border-transparent shadow-sm'
                        : 'bg-white border-[#EBDDD0] hover:border-[#BCA58A] hover:text-[#BCA58A]'
                    }`}
                  >
                    <Heart size={16} className={favorites[quickViewProduct.id] ? 'fill-current' : ''} />
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
