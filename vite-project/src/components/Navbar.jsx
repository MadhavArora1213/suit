import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Search, User, ShoppingBag, X, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

// Product catalogue lookup helper for Wishlist display
const allProductsLookup = [
  { id: 't1', name: 'Embroidered Silk Suit Set', price: '₹4,299', image: '/designer_suit_1.png', boutique: 'Kala Mandir' },
  { id: 't2', name: 'Chanderi Salwar Suit Set', price: '₹3,899', image: '/cotton_suit.png', boutique: 'Zari Heritage' },
  { id: 't3', name: 'Designer Angrakha Suit Set', price: '₹5,499', image: '/sharara_suit.png', boutique: 'Gulabo Jaipur' },
  { id: 't4', name: 'Pakistani Straight Suit Set', price: '₹4,799', image: '/pakistani_suit.png', boutique: 'Nazraana' },
  { id: 'n1', name: 'Floral Silk Anarkali Suit', price: '₹6,899', image: '/anarkali_suit.png', boutique: 'Silk Weaver' },
  { id: 'n2', name: 'Classic Georgette Suit Set', price: '₹3,299', image: '/designer_suit_1.png', boutique: 'Poshak' },
  { id: 'n3', name: 'Cotton Patiala Salwar Suit', price: '₹2,499', image: '/patiala_suit.png', boutique: 'Jaipur Block' },
  { id: 'n4', name: 'Organza Dupatta Suit Set', price: '₹5,199', image: '/chikankari_suit.png', boutique: 'Rivaaz' },
  { id: 'b1', name: 'Velvet Embroidered Suit Set', price: '₹8,999', image: '/banarasi_suit.png', boutique: 'Vastra' },
  { id: 'b2', name: 'Chikankari Handloom Suit Set', price: '₹7,499', image: '/chikankari_suit.png', boutique: 'Awadh Kraft' },
  { id: 'b3', name: 'Banarasi Brocade Suit Set', price: '₹9,299', image: '/banarasi_suit.png', boutique: 'Kashi Fabrics' },
  { id: 'b4', name: 'Gota Patti Sharara Suit Set', price: '₹4,999', image: '/sharara_suit.png', boutique: 'Shagun Jaipur' },
  { id: 'f1', name: 'Royal Sharara Suit Set', price: '₹11,499', image: '/sharara_suit.png', boutique: 'Rajputana' },
  { id: 'f2', name: 'Handcrafted Palazzo Suit Set', price: '₹8,299', image: '/pakistani_suit.png', boutique: 'Gulabi Dhaaga' },
  { id: 'f3', name: 'Raw Silk Anarkali Suit Set', price: '₹13,999', image: '/anarkali_suit.png', boutique: 'Royal Heritage' },
  { id: 'f4', name: 'Heavy Zardozi Salwar Suit Set', price: '₹12,499', image: '/designer_suit_1.png', boutique: 'Lakhnavi Shaan' },
];

export default function Navbar({ cart = [], removeFromCart, updateCartQty, favorites = {}, toggleFavorite, addToCart }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 24, seconds: 53 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 1, minutes: 24, seconds: 53 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Quick suggestions for search
  const suggestions = ['Anarkali', 'Sharara', 'Banarasi Silk', 'Chikankari', 'Zardozi'];

  // Calculate stats
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const favoriteItems = allProductsLookup.filter((p) => favorites[p.id]);
  const favoriteCount = favoriteItems.length;

  const getSubtotal = () => {
    return cart.reduce((total, item) => {
      const priceNum = parseInt(item.price.replace(/[^\d]/g, ''), 10);
      return total + priceNum * item.quantity;
    }, 0);
  };

  const handleCheckout = () => {
    alert(`Thank you! Proceeding to secure payment of ₹${getSubtotal().toLocaleString()} with your items.`);
    setCartOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#EBDDD0]/30 shadow-sm"
    >
      {/* Top Announcement Countdown Bar */}
      <div className="bg-[#7A1A40] text-white py-1.5 px-6 text-center text-[8px] sm:text-[10px] md:text-xs tracking-widest font-semibold flex items-center justify-center gap-3 border-b border-white/5 uppercase">
        <span>Stock Out Sale - Few Hours Left | Extra 15% Off | Code: SUITE15</span>
        <div className="flex items-center gap-1 font-mono text-[9px] sm:text-[11px] bg-black/20 px-2 py-0.5 rounded text-[#BCA58A] font-bold">
          <span>{String(timeLeft.hours).padStart(2, '0')}</span>:
          <span>{String(timeLeft.minutes).padStart(2, '0')}</span>:
          <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
        </div>
      </div>

      <div className="w-full px-6 md:px-12 py-2.5">
        <div className="flex items-center justify-between">
          
          {/* Logo with Subtitle */}
          <motion.a
            href="#"
            whileHover={{ scale: 1.02 }}
            className="flex flex-col items-start cursor-pointer group"
          >
            <span className="text-2xl md:text-3xl font-display font-bold tracking-widest text-[#111111] group-hover:text-[#BCA58A] transition-colors duration-300">
              SUITÉ
            </span>
            <span className="text-[7px] md:text-[8px] font-body tracking-[0.25em] text-[#686868] uppercase -mt-0.5">
              Ethnic Elegance Redefined
            </span>
          </motion.a>

          {/* Center Navigation Links with Underline Animations */}
          <div className="hidden md:flex items-center gap-10">
            {['HOME', 'SHOP', 'COLLECTIONS', 'BOUTIQUES', 'ABOUT US'].map((item, i) => (
              <a
                key={i}
                href="#"
                className="relative text-[13px] font-body font-semibold tracking-widest text-[#1E1E1E] hover:text-[#BCA58A] transition-colors duration-300 py-2 group"
              >
                {item}
                <span className="absolute bottom-0 left-1/2 w-0 h-[1.5px] bg-[#BCA58A] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
              </a>
            ))}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-5 md:gap-7">
            
            {/* Search Icon & Toggle */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1, color: '#BCA58A' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-[#1E1E1E] focus:outline-none cursor-pointer"
              >
                <Search size={20} />
              </motion.button>
            </div>

            {/* Profile Icon */}
            <motion.button
              whileHover={{ scale: 1.1, color: '#BCA58A' }}
              whileTap={{ scale: 0.95 }}
              className="text-[#1E1E1E] cursor-pointer"
            >
              <User size={20} />
            </motion.button>

            {/* Wishlist Heart Icon with Dynamic Badge */}
            <motion.button
              whileHover={{ scale: 1.1, color: '#BCA58A' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setWishlistOpen(true)}
              className="text-[#1E1E1E] relative cursor-pointer"
            >
              <Heart size={20} />
              {favoriteCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-[#BCA58A] text-[#FAF9F6] text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm"
                >
                  {favoriteCount}
                </motion.span>
              )}
            </motion.button>

            {/* Shopping Bag Icon with Dynamic Badge */}
            <motion.button
              whileHover={{ scale: 1.1, color: '#BCA58A' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCartOpen(true)}
              className="text-[#1E1E1E] relative cursor-pointer"
            >
              <ShoppingBag size={20} />
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-[#111111] text-[#FAF9F6] text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </motion.button>

            {/* Mobile Menu Hamburger */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="md:hidden flex flex-col justify-center items-center gap-1.5 w-6 h-6 focus:outline-none cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className={`w-6 h-0.5 bg-[#111111] transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-[#111111] transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-[#111111] transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </motion.button>

          </div>
        </div>

        {/* Search Panel Dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mt-3"
            >
              <div className="border-t border-[#EBDDD0]/30 pt-4 pb-3 text-left">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Search for designer suits, anarkalis, dupattas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#FAF9F6] text-[#1E1E1E] placeholder-[#686868]/70 border border-[#EBDDD0] rounded-full px-5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#BCA58A] focus:border-[#BCA58A]"
                    autoFocus
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSearchOpen(false)}
                    className="text-[#686868] p-1.5 hover:text-[#111111] cursor-pointer"
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                {/* Suggestions chips */}
                <div className="flex flex-wrap items-center gap-2 mt-3 pl-4">
                  <span className="text-[10px] tracking-wider text-[#686868] font-bold uppercase mr-1">Trending:</span>
                  {suggestions.map((sug) => (
                    <button
                      key={sug}
                      onClick={() => setSearchQuery(sug)}
                      className="text-[10px] font-semibold bg-[#EBDDD0]/25 text-[#1E1E1E] hover:bg-[#BCA58A] hover:text-white px-3 py-1 rounded-full transition-colors cursor-pointer"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 right-0 w-64 bg-[#FAF9F6] shadow-2xl z-50 p-6 flex flex-col gap-6 md:hidden text-left"
            >
              <div className="flex justify-between items-center border-b border-[#EBDDD0]/30 pb-4">
                <span className="text-xl font-display font-bold tracking-widest text-[#111111]">
                  MENU
                </span>
                <button onClick={() => setIsOpen(false)} className="text-[#1E1E1E] cursor-pointer">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex flex-col gap-4">
                {['HOME', 'SHOP', 'COLLECTIONS', 'BOUTIQUES', 'ABOUT US'].map((item, i) => (
                  <a
                    key={i}
                    href="#"
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-semibold tracking-widest text-[#1E1E1E] hover:text-[#BCA58A] transition-colors py-2 border-b border-[#EBDDD0]/10"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shopping Cart Side Drawer Overlay */}
        <AnimatePresence>
          {cartOpen && (
            <div className="fixed inset-0 z-50 overflow-hidden">
              {/* Dark backdrop overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setCartOpen(false)}
                className="absolute inset-0 bg-black/55 backdrop-blur-xs cursor-pointer"
              />

              <div className="absolute inset-y-0 right-0 max-w-full flex">
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
                  className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between text-left"
                >
                  {/* Cart Header */}
                  <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <ShoppingBag size={20} className="text-[#BCA58A]" />
                      <span className="text-lg font-display font-bold tracking-wide text-neutral-900">
                        SHOPPING BAG
                      </span>
                      <span className="bg-[#BCA58A]/10 text-[#BCA58A] font-sans font-bold text-[10px] px-2 py-0.5 rounded-full">
                        {cartItemCount} items
                      </span>
                    </div>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="p-1 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
                    >
                      <X size={22} />
                    </button>
                  </div>

                  {/* Cart Items List */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-300">
                          <ShoppingBag size={30} className="stroke-[1.25]" />
                        </div>
                        <h4 className="font-display font-medium text-neutral-700 text-lg">Your bag is empty</h4>
                        <p className="text-xs text-neutral-400 max-w-[200px] leading-relaxed">
                          Add luxury ethnic suits to get started on your fashion journey.
                        </p>
                        <button
                          onClick={() => setCartOpen(false)}
                          className="px-6 py-2.5 bg-[#111111] hover:bg-[#BCA58A] text-white text-[10px] font-bold tracking-widest rounded-lg transition-colors cursor-pointer"
                        >
                          CONTINUE SHOPPING
                        </button>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div key={`${item.id}-${item.size}`} className="flex gap-4 pb-6 border-b border-neutral-100 last:border-b-0 items-start">
                          <div className="w-20 h-24 rounded-xl overflow-hidden bg-neutral-50 border border-neutral-100 flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                          </div>
                          <div className="flex-1 flex flex-col justify-between h-full min-h-[96px]">
                            <div>
                              <div className="flex justify-between items-start gap-2">
                                <h4 className="text-xs font-semibold text-neutral-900 tracking-wide font-sans line-clamp-1">{item.name}</h4>
                                <button
                                  onClick={() => removeFromCart(item.id, item.size)}
                                  className="text-neutral-300 hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                                  title="Remove item"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                              <span className="text-[10px] text-neutral-400 block mt-0.5">Size: <span className="font-bold text-neutral-800">{item.size}</span></span>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              {/* Quantity Adjusters */}
                              <div className="flex items-center border border-neutral-200 rounded-lg">
                                <button
                                  onClick={() => updateCartQty(item.id, item.size, item.quantity - 1)}
                                  className="p-1 px-2 text-neutral-500 hover:bg-neutral-50 cursor-pointer"
                                >
                                  <Minus size={10} />
                                </button>
                                <span className="text-xs font-bold font-mono px-2 text-neutral-900">{item.quantity}</span>
                                <button
                                  onClick={() => updateCartQty(item.id, item.size, item.quantity + 1)}
                                  className="p-1 px-2 text-neutral-500 hover:bg-neutral-50 cursor-pointer"
                                >
                                  <Plus size={10} />
                                </button>
                              </div>
                              <span className="text-xs font-bold text-[#BCA58A] font-display">{item.price}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Cart Footer Subtotals */}
                  {cart.length > 0 && (
                    <div className="p-6 bg-neutral-50 border-t border-neutral-100 space-y-4">
                      <div className="flex justify-between items-center text-sm font-semibold">
                        <span className="text-neutral-500 tracking-wide uppercase text-xs">Estimated Subtotal</span>
                        <span className="text-neutral-900 font-display text-base">₹{getSubtotal().toLocaleString()}</span>
                      </div>
                      <p className="text-[10px] text-neutral-400 leading-relaxed font-body">
                        Shipping fees and custom taxes are calculated at checkout. Free shipping applies to items over ₹4,999.
                      </p>
                      <button
                        onClick={handleCheckout}
                        className="w-full bg-[#111111] hover:bg-[#BCA58A] hover:text-white text-white py-4 text-xs font-bold tracking-[0.2em] rounded-xl flex items-center justify-center gap-2.5 transition-all duration-300 shadow-md cursor-pointer uppercase"
                      >
                        PROCEED TO CHECKOUT
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Wishlist Drawer Overlay */}
        <AnimatePresence>
          {wishlistOpen && (
            <div className="fixed inset-0 z-50 overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setWishlistOpen(false)}
                className="absolute inset-0 bg-black/55 backdrop-blur-xs cursor-pointer"
              />

              <div className="absolute inset-y-0 right-0 max-w-full flex">
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
                  className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between text-left"
                >
                  <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Heart size={20} className="text-[#800020] fill-[#800020]" />
                      <span className="text-lg font-display font-bold tracking-wide text-neutral-900">
                        MY WISHLIST
                      </span>
                      <span className="bg-[#800020]/15 text-[#800020] font-sans font-bold text-[10px] px-2 py-0.5 rounded-full">
                        {favoriteCount} items
                      </span>
                    </div>
                    <button
                      onClick={() => setWishlistOpen(false)}
                      className="p-1 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
                    >
                      <X size={22} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {favoriteItems.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center text-[#800020]/25">
                          <Heart size={30} className="stroke-[1.25]" />
                        </div>
                        <h4 className="font-display font-medium text-neutral-700 text-lg">Your wishlist is empty</h4>
                        <p className="text-xs text-neutral-400 max-w-[200px] leading-relaxed">
                          Tap the heart icon on designs you love to save them here.
                        </p>
                        <button
                          onClick={() => setWishlistOpen(false)}
                          className="px-6 py-2.5 bg-[#111111] hover:bg-[#BCA58A] text-white text-[10px] font-bold tracking-widest rounded-lg transition-colors cursor-pointer"
                        >
                          EXPLORE TRENDING
                        </button>
                      </div>
                    ) : (
                      favoriteItems.map((item) => (
                        <div key={item.id} className="flex gap-4 pb-6 border-b border-neutral-100 last:border-b-0 items-start">
                          <div className="w-20 h-24 rounded-xl overflow-hidden bg-neutral-50 border border-neutral-100 flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                          </div>
                          <div className="flex-1 flex flex-col justify-between h-full min-h-[96px] text-left">
                            <div>
                              <div className="flex justify-between items-start gap-2">
                                <h4 className="text-xs font-semibold text-neutral-900 tracking-wide font-sans">{item.name}</h4>
                                <button
                                  onClick={() => toggleFavorite(item.id)}
                                  className="text-neutral-300 hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                                  title="Remove from wishlist"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                              <span className="text-[9px] text-[#BCA58A] font-bold uppercase tracking-wider block mt-1">{item.boutique} &middot; Verified</span>
                              <span className="text-xs font-bold text-neutral-900 block mt-1 font-display">{item.price}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-3">
                              <button
                                onClick={() => {
                                  addToCart(item, 'M');
                                  alert(`Added ${item.name} to bag!`);
                                }}
                                className="flex-1 bg-[#111111] hover:bg-[#BCA58A] text-white py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <ShoppingBag size={10} />
                                Add To Bag
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </motion.nav>
  );
}
