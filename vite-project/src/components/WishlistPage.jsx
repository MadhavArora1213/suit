import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

export default function WishlistPage({ allProducts, favorites, toggleFavorite, addToCart, setView }) {
  const favoriteItems = allProducts.filter((p) => favorites[p.id]);

  return (
    <div className="min-h-screen bg-white pt-[110px] pb-32 font-sans">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-16">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center items-center gap-4 mb-4">
            <Heart size={24} className="text-[#BCA58A]" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-light text-[#111111] tracking-tight mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Your <span className="italic text-[#BCA58A]">Wishlist</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-500 font-light max-w-lg mx-auto">
            {favoriteItems.length > 0 
              ? `You have ${favoriteItems.length} carefully curated ${favoriteItems.length === 1 ? 'piece' : 'pieces'} waiting for you.` 
              : "Your wishlist is currently empty. Start discovering our luxurious collections."}
          </motion.p>
        </div>

        {/* Content */}
        {favoriteItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {favoriteItems.map((product, idx) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-[#FAF9F6] mb-4">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                  
                  {/* Remove from wishlist */}
                  <button 
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 hover:scale-110 transition-transform shadow-sm"
                  >
                    <Heart size={14} fill="currentColor" />
                  </button>
                  
                  {/* Quick Add overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                    <button 
                      onClick={() => addToCart(product, product.sizes?.length > 0 ? product.sizes[0] : 'Unstitched')}
                      className="w-full py-3 bg-white/95 backdrop-blur-sm text-[#111111] text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#111111] hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingBag size={14} /> Add to Cart
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div>
                  <div className="text-[9px] tracking-[0.2em] text-[#BCA58A] uppercase font-bold mb-1.5">{product.brand || 'Gurnaaz'}</div>
                  <h3 className="text-sm font-medium text-[#111111] mb-1 truncate" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{product.name}</h3>
                  <div className="text-sm text-[#111111] font-light">
                    {product.price}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-col items-center justify-center py-20 text-center border-t border-[#111111]/5">
            <div className="w-24 h-24 rounded-full bg-[#FAF9F6] flex items-center justify-center text-[#BCA58A]/30 mb-6">
              <Heart size={40} strokeWidth={1} />
            </div>
            <h3 className="text-2xl font-light text-[#111111] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Nothing here yet</h3>
            <p className="text-sm text-gray-500 font-light mb-8 max-w-md">
              Save your favorite items here to review them later or quickly add them to your cart when you're ready.
            </p>
            <button 
              onClick={() => setView('shop')}
              className="px-8 py-3 bg-[#111111] text-white text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#BCA58A] transition-colors flex items-center gap-2 group"
            >
              Start Shopping <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
