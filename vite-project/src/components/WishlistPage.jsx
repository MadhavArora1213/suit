import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

export default function WishlistPage({ allProducts, favorites, toggleFavorite, addToCart, setView }) {
  const favoriteItems = allProducts.filter((p) => favorites[p.id]);

  return (
    <div className="min-h-screen bg-white pt-[80px] md:pt-[110px] pb-20 md:pb-32 font-sans">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 py-8 md:py-16">
        
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center items-center gap-4 mb-3 md:mb-4">
            <Heart size={22} className="text-[#D4AF37]" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-light text-[#1A0008] tracking-tight mb-3 md:mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Your <span className="italic text-[#D4AF37]">Wishlist</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-500 font-light max-w-lg mx-auto text-sm">
            {favoriteItems.length > 0 
              ? `You have ${favoriteItems.length} carefully curated ${favoriteItems.length === 1 ? 'piece' : 'pieces'} waiting for you.` 
              : "Your wishlist is currently empty. Start discovering our luxurious collections."}
          </motion.p>
        </div>

        {/* Content */}
        {favoriteItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-6 gap-y-6 sm:gap-y-12">
            {favoriteItems.map((product, idx) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-[#FAF9F6] mb-3 md:mb-4">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                  
                  {/* Remove from wishlist */}
                  <button 
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-3 right-3 md:top-4 md:right-4 w-7 h-7 md:w-8 md:h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 hover:scale-110 transition-transform shadow-sm"
                  >
                    <Heart size={12} fill="currentColor" />
                  </button>
                  
                  {/* Quick Add overlay - always visible on mobile, hover on desktop */}
                  <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0">
                    <button 
                      onClick={() => addToCart(product, product.fitOptions?.includes('Unstitched') ? 'Unstitched' : (product.fitOptions?.includes('Semi-Stitched') ? 'Semi-Stitched' : (product.sizes?.length > 0 ? `Stitched - ${product.sizes[0]}` : 'Stitched')))}
                      className="w-full py-2.5 sm:py-3 bg-white/95 backdrop-blur-sm text-[#1A0008] text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#1A0008] hover:text-white transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
                    >
                      <ShoppingBag size={12} /> <span className="hidden xs:inline">Add to</span> Cart
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="px-0.5">
                  <div className="text-[8px] sm:text-[9px] tracking-[0.2em] text-[#D4AF37] uppercase font-bold mb-1">{product.brand || 'Gurnaaz'}</div>
                  <h3 className="text-xs sm:text-sm font-medium text-[#1A0008] mb-1 truncate" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{product.name}</h3>
                  <div className="text-xs sm:text-sm text-[#1A0008] font-light">
                    {product.price}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-col items-center justify-center py-12 md:py-20 text-center border-t border-[#1A0008]/5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-[#FAF9F6] flex items-center justify-center text-[#D4AF37]/30 mb-4 md:mb-6">
              <Heart size={28} strokeWidth={1} />
            </div>
            <h3 className="text-xl sm:text-2xl font-light text-[#1A0008] mb-3 md:mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Nothing here yet</h3>
            <p className="text-xs sm:text-sm text-gray-500 font-light mb-6 md:mb-8 max-w-md px-4">
              Save your favorite items here to review them later or quickly add them to your cart when you're ready.
            </p>
            <button 
              onClick={() => setView('shop')}
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-[#1A0008] text-white text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#D4AF37] transition-colors flex items-center gap-2 group"
            >
              Start Shopping <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
