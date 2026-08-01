import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllProducts } from '../utils/adminStore';

const CATEGORIES = [
  { id: 'all', label: 'All Festive Collection', icon: '✨' },
  { id: 'suits', label: 'Designer Suits', type: 'Patiala', icon: '👗' },
  { id: 'rakhi', label: 'Rakhi Specials', type: 'Rakhi Collection', icon: '📿' },
  { id: 'kids', label: 'Bacheya Ki Rakhi', type: 'Kids Rakhi', icon: '👶' },
  { id: 'kashmiri', label: 'Girls Kashmiri Churi', type: 'Kashmiri Churi', icon: '🌸' },
  { id: 'kadas', label: 'Girls Designer Kadas', type: 'Designer Kadas', icon: '💫' },
  { id: 'hampers', label: 'Gift Box Hampers', type: 'Gift Box', icon: '🎁' },
];

export default function RakhiSuitCategoryShowcase({ setView, setSelectedProduct, addToCart, toggleFavorite, favorites }) {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    setProducts(getAllProducts());
    const handleUpdate = () => setProducts(getAllProducts());
    window.addEventListener('admin-data-updated', handleUpdate);
    return () => window.removeEventListener('admin-data-updated', handleUpdate);
  }, []);

  const getFilteredProducts = () => {
    if (activeTab === 'all') return products;

    return products.filter(p => {
      const pCat = (p.category || '').toLowerCase();
      const pType = (p.type || '').toLowerCase();
      const pColl = (p.collection || '').toLowerCase();
      const pName = (p.name || '').toLowerCase();

      if (activeTab === 'suits') {
        return ['anarkali', 'patiala', 'banarasi', 'chikankari', 'sharara', 'pakistani', 'kashmiri', 'designer suits', 'suit'].some(k => pType.includes(k) || pCat.includes(k) || pName.includes(k));
      }
      if (activeTab === 'rakhi') {
        return pCat.includes('rakhi') || pColl.includes('rakhi') || pName.includes('rakhi') || pType.includes('rakhi');
      }
      if (activeTab === 'kids') {
        return pCat.includes('kids') || pColl.includes('kids') || pName.includes('kids') || pType.includes('kids');
      }
      if (activeTab === 'kashmiri') {
        return pCat.includes('kashmiri') || pColl.includes('kashmiri') || pName.includes('kashmiri') || pName.includes('churi');
      }
      if (activeTab === 'kadas') {
        return pCat.includes('kada') || pColl.includes('kada') || pName.includes('kada') || pType.includes('kada');
      }
      if (activeTab === 'hampers') {
        return pCat.includes('box') || pCat.includes('hamper') || pColl.includes('box') || pName.includes('box') || pName.includes('hamper');
      }
      return true;
    });
  };

  const filteredProducts = getFilteredProducts();

  const handleCardClick = (product) => {
    if (setSelectedProduct) setSelectedProduct(product);
    if (setView) setView('product-details');
  };

  return (
    <section className="w-full py-20 bg-gradient-to-b from-[#FAF9F6] via-white to-[#FAF9F6] border-b border-gray-200/80 relative overflow-hidden">
      
      {/* Subtle Background Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8B1A1A]/10 border border-[#8B1A1A]/30 text-[#8B1A1A] text-xs font-bold uppercase tracking-[0.25em] mb-3">
            <span>✨</span> Handcrafted Festival Edition
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#1A0008] tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Explore <span className="italic text-[#8B1A1A] font-normal">Rakhi & Ethnic Collections</span>
          </h2>
          <p className="text-gray-600 text-xs md:text-sm mt-3 max-w-xl mx-auto font-light leading-relaxed">
            Discover exquisite Suits, Kids Rakhis, Kashmiri Churi Bangles, Designer Gold Kadas, and Luxury Audio QR Gift Hampers.
          </p>
        </div>

        {/* Category Tabs Bar */}
        <div className="w-full flex justify-center mb-12">
          <div className="flex items-center gap-2 md:gap-3 overflow-x-auto py-2.5 px-4 max-w-full rounded-2xl md:rounded-full bg-[#1A0008]/5 border border-[#1A0008]/10 backdrop-blur-md no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`shrink-0 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider transition-all duration-300 flex items-center gap-2 border ${
                    isActive
                      ? 'bg-[#1A0008] text-[#F5D76E] border-[#D4AF37] shadow-[0_8px_20px_rgba(26,0,8,0.3)] scale-105'
                      : 'bg-white text-gray-800 border-gray-200/90 hover:border-[#8B1A1A] hover:text-[#8B1A1A] hover:shadow-md'
                  }`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
          <AnimatePresence>
            {filteredProducts.map((product) => {
              const isFav = favorites?.[product.id];
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={product.id}
                  className="bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col justify-between relative"
                >
                  <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden cursor-pointer" onClick={() => handleCardClick(product)}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A0008]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuickViewProduct(product);
                        }}
                        className="w-full py-2 bg-white/90 backdrop-blur-md text-[#1A0008] text-xs font-bold rounded-xl hover:bg-[#D4AF37] transition-all shadow-lg"
                      >
                        ⚡ Quick View
                      </button>
                    </div>

                    {/* Badge */}
                    {product.badge && (
                      <span className="absolute top-3 left-3 bg-[#1A0008] text-[#F5D76E] border border-[#D4AF37]/50 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                        {product.badge}
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (toggleFavorite) toggleFavorite(product.id);
                      }}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-700 hover:text-red-500 transition-colors shadow-md border border-gray-200"
                    >
                      {isFav ? '❤️' : '🤍'}
                    </button>
                  </div>

                  <div className="p-4 flex flex-col flex-grow justify-between">
                    <div>
                      <div className="text-[10px] text-[#8B1A1A] font-bold uppercase tracking-widest mb-1">
                        {product.boutique || 'Gurnaaz Edition'}
                      </div>
                      <h3 
                        onClick={() => handleCardClick(product)}
                        className="text-base font-semibold text-gray-900 line-clamp-2 cursor-pointer hover:text-[#8B1A1A] transition-colors leading-snug" 
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {product.name}
                      </h3>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-base font-extrabold text-[#1A0008]">{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-400 line-through ml-2 font-light">{product.originalPrice}</span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (addToCart) addToCart(product);
                        }}
                        className="px-3.5 py-2 bg-[#1A0008] hover:bg-[#8B1A1A] text-[#F5D76E] text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1"
                      >
                        <span>+</span> Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#D4AF37]/50 relative"
            >
              <button 
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold flex items-center justify-center"
              >
                ✕
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="aspect-[4/5] bg-gray-100">
                  <img src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover" />
                </div>

                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-[#8B1A1A] font-bold uppercase tracking-widest">{quickViewProduct.category || 'Festive Collection'}</span>
                    <h3 className="text-2xl font-bold text-[#1A0008] mt-1 mb-2 font-serif">{quickViewProduct.name}</h3>
                    <div className="text-xl font-bold text-[#8B1A1A] mb-3">{quickViewProduct.price} <span className="text-xs text-gray-400 line-through font-normal">{quickViewProduct.originalPrice}</span></div>
                    
                    <p className="text-xs text-gray-600 mb-4">{quickViewProduct.shortDesc || quickViewProduct.fabricDetails}</p>

                    {quickViewProduct.sizes && (
                      <div className="mb-4">
                        <span className="text-xs font-bold text-gray-700 block mb-1">Available Sizes:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {quickViewProduct.sizes.map((sz) => (
                            <span key={sz} className="text-[11px] px-2.5 py-1 bg-gray-100 rounded-md font-medium text-gray-700 border border-gray-200">{sz}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                        if (addToCart) addToCart(quickViewProduct);
                        setQuickViewProduct(null);
                      }}
                      className="flex-1 py-3 bg-[#1A0008] hover:bg-[#8B1A1A] text-[#F5D76E] text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg"
                    >
                      Add To Bag
                    </button>
                    <button
                      onClick={() => {
                        if (setSelectedProduct) setSelectedProduct(quickViewProduct);
                        if (setView) setView('product-details');
                        setQuickViewProduct(null);
                      }}
                      className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-all"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
