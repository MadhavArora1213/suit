import React from 'react';
import { ShoppingBag, ArrowLeft, Trash2, Minus, Plus, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CartPage({ cart, updateCartQty, removeFromCart, setView }) {
  const getSubtotal = () => cart.reduce((total, item) => {
    const priceNum = parseInt(item.price.replace(/[^\d]/g, ''), 10);
    return total + priceNum * item.quantity;
  }, 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-[1200px] mx-auto px-6 pt-32 pb-24 min-h-[80vh] text-[#111111]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Back to Home Link */}
      <button 
        onClick={() => window.location.href = '/sell'} 
        className="flex items-center gap-2 text-xs tracking-widest text-[#BCA58A] uppercase font-bold mb-8 hover:text-[#111111] transition-colors cursor-pointer"
      >
        <ArrowLeft size={14} />
        <span>Back to Shopping</span>
      </button>

      <h1 className="text-4xl md:text-5xl font-light mb-12 tracking-tight text-[#111111]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Shopping Bag
      </h1>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-[#BCA58A]/15 bg-white p-10 rounded">
          <div className="w-20 h-20 rounded-full border border-[#BCA58A]/20 flex items-center justify-center text-[#BCA58A]/40 mb-6">
            <ShoppingBag size={36} className="stroke-[1.25]" />
          </div>
          <h2 className="text-2xl font-light mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Your bag is empty</h2>
          <p className="text-sm text-[#6B6B6B] max-w-[320px] leading-relaxed mb-8">
            Add premium ethnic wear from the Gurnaaz collections to begin your style journey.
          </p>
          <button 
            onClick={() => window.location.href = '/sell'}
            className="bg-[#BCA58A] hover:bg-[#9A8268] text-[#FAF9F6] px-8 py-4 text-xs font-bold tracking-widest uppercase transition-colors shadow-lg cursor-pointer"
          >
            EXPLORE COLLECTIONS
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex flex-col sm:flex-row gap-6 p-6 border border-[#BCA58A]/10 bg-white shadow-sm relative">
                <div className="w-28 h-36 bg-[#E8DDD0] overflow-hidden flex-shrink-0 border border-[#BCA58A]/10">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-lg font-medium text-[#111111] line-clamp-1">{item.name}</h3>
                      <button 
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-[#6B6B6B] hover:text-[#rose-600] transition-colors p-1 cursor-pointer"
                        title="Remove Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {item.boutique && (
                      <span className="text-[10px] text-[#BCA58A] uppercase tracking-wider block font-semibold">
                        Boutique: {item.boutique}
                      </span>
                    )}
                    <span className="text-xs text-[#6B6B6B] block">
                      Size: <span className="text-[#111111] font-semibold">{item.size}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center border border-[#BCA58A]/20 bg-[#FAF9F6]">
                      <button 
                        onClick={() => updateCartQty(item.id, item.size, item.quantity - 1)}
                        className="p-2 px-3 text-[#6B6B6B] hover:text-[#BCA58A] cursor-pointer"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-semibold px-4 text-[#111111]">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQty(item.id, item.size, item.quantity + 1)}
                        className="p-2 px-3 text-[#6B6B6B] hover:text-[#BCA58A] cursor-pointer"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="text-xl font-light text-[#BCA58A]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {item.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary Card */}
          <div className="border border-[#BCA58A]/15 bg-white p-8 space-y-6 shadow-md">
            <h3 className="text-xl font-light border-b border-[#BCA58A]/10 pb-4 text-[#111111]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Summary
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between text-xs text-[#6B6B6B] uppercase tracking-wider font-semibold">
                <span>Subtotal</span>
                <span className="text-[#111111]">₹{getSubtotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-[#6B6B6B] uppercase tracking-wider font-semibold">
                <span>Shipping</span>
                <span className="text-[#111111]">FREE</span>
              </div>
              <div className="flex justify-between text-xs text-[#6B6B6B] uppercase tracking-wider font-semibold">
                <span>Estimated Taxes</span>
                <span className="text-[#111111]">Calculated next</span>
              </div>
            </div>

            <div className="border-t border-[#BCA58A]/10 pt-4 flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest text-[#6B6B6B]">Estimated Total</span>
              <span className="text-2xl text-[#111111] font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                ₹{getSubtotal().toLocaleString()}
              </span>
            </div>

            <button 
              onClick={() => setView('checkout')}
              className="w-full bg-[#BCA58A] hover:bg-[#9A8268] text-[#FAF9F6] py-4 text-xs font-bold tracking-[0.25em] flex items-center justify-center gap-2.5 shadow-lg transition-colors cursor-pointer uppercase"
            >
              <CreditCard size={14} />
              <span>Checkout Now</span>
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
