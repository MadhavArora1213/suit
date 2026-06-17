import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Search, User, ShoppingBag, X, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import gurnaazLogo from '../assets/gurnaaz.png';

const allProductsLookup = [
  { id: 't1', name: 'Embroidered Silk Suit Set', price: '₹4,299', image: '/designer_suit_1.png', boutique: 'Kala Mandir' },
  { id: 't2', name: 'Chanderi Salwar Suit Set', price: '₹3,899', image: '/cotton_suit.png', boutique: 'Zari Heritage' },
  { id: 't3', name: 'Designer Angrakha Suit Set', price: '₹5,499', image: '/sharara_suit.png', boutique: 'Gulabo Jaipur' },
  { id: 't4', name: 'Pakistani Straight Suit Set', price: '₹4,799', image: '/pakistani_suit.png', boutique: 'Nazraana' },
  { id: 'n1', name: 'Floral Silk Anarkali Suit', price: '₹6,899', image: '/anarkali_suit.png', boutique: 'Silk Weaver' },
  { id: 'n2', name: 'Classic Georgette Suit Set', price: '₹3,299', image: '/designer_suit_1.png', boutique: 'Poshak' },
  { id: 'n3', name: 'Glacier Blue Organza Suit Set', price: '₹14,500', image: '/sky_blue_suit.jpg', boutique: 'Punjabi Couture' },
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
  const [scrolled, setScrolled] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 24, seconds: 53 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 1, minutes: 24, seconds: 53 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const suggestions = ['Anarkali', 'Sharara', 'Banarasi Silk', 'Chikankari', 'Zardozi'];
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const favoriteItems = allProductsLookup.filter((p) => favorites[p.id]);
  const favoriteCount = favoriteItems.length;

  const getSubtotal = () => cart.reduce((total, item) => {
    const priceNum = parseInt(item.price.replace(/[^\d]/g, ''), 10);
    return total + priceNum * item.quantity;
  }, 0);

  const handleCheckout = () => {
    alert(`Thank you! Proceeding to secure payment of ₹${getSubtotal().toLocaleString()} with your items.`);
    setCartOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Announcement Bar */}
      <div className="bg-[#FAF9F6] text-[#111111] py-2 px-6 text-center text-[9px] sm:text-[10px] tracking-[0.22em] font-semibold flex items-center justify-center gap-4 uppercase">
        <span>End of Season Sale · Extra 15% Off · Code: SUITE15</span>
        <div className="flex items-center gap-1 font-mono bg-black/20 px-2.5 py-0.5 rounded text-[#BCA58A] font-bold text-[10px]">
          <span>{String(timeLeft.hours).padStart(2, '0')}</span>:
          <span>{String(timeLeft.minutes).padStart(2, '0')}</span>:
          <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Main Nav */}
      <div className={`transition-all duration-500 ${scrolled
        ? 'bg-[#FAF9F6]/95 backdrop-blur-xl border-b border-[#BCA58A]/10 shadow-lg'
        : 'bg-[#FAF9F6]/90 backdrop-blur-md border-b border-transparent'
      }`}>
        <div className="max-w-[1600px] mx-auto px-6 md:px-14 py-4">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <motion.a href="#" whileHover={{ scale: 1.02 }} className="flex items-center gap-2 cursor-pointer group">
              <img src={gurnaazLogo} alt="GURNAAZ" className="h-12 md:h-14 w-auto object-contain" />
            </motion.a>

            {/* Center Nav Links */}
            <div className="hidden md:flex items-center gap-10">
              {['HOME', 'SHOP', 'COLLECTIONS', 'BOUTIQUES', 'ABOUT US'].map((item, i) => (
                <a key={i} href="#"
                  className="relative text-[11px] tracking-[0.18em] text-[#111111]/70 hover:text-[#111111] transition-colors duration-300 py-2 group"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-[#BCA58A] transition-all duration-400 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-6 md:gap-7">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-[#111111]/70 hover:text-[#BCA58A] transition-colors cursor-pointer">
                <Search size={18} />
              </motion.button>

              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                className="text-[#111111]/70 hover:text-[#BCA58A] transition-colors cursor-pointer">
                <User size={18} />
              </motion.button>

              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                onClick={() => setWishlistOpen(true)}
                className="text-[#111111]/70 hover:text-[#BCA58A] transition-colors relative cursor-pointer">
                <Heart size={18} />
                {favoriteCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 bg-[#BCA58A] text-[#FAF9F6] text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {favoriteCount}
                  </motion.span>
                )}
              </motion.button>

              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                onClick={() => setCartOpen(true)}
                className="text-[#111111]/70 hover:text-[#BCA58A] transition-colors relative cursor-pointer">
                <ShoppingBag size={18} />
                {cartItemCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 bg-[#111111] text-[#FAF9F6] text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItemCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Hamburger */}
              <motion.button whileHover={{ scale: 1.1 }}
                className="md:hidden flex flex-col justify-center items-center gap-1.5 w-6 h-6 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}>
                <span className={`w-5 h-px bg-[#111111] transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`w-5 h-px bg-[#111111] transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
                <span className={`w-5 h-px bg-[#111111] transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </motion.button>
            </div>
          </div>

          {/* Search Panel */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden mt-4">
                <div className="border-t border-[#BCA58A]/15 pt-4 pb-3">
                  <div className="flex items-center gap-3">
                    <input type="text" placeholder="Search for suits, anarkalis, dupattas…"
                      value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#E8DDD0] text-[#111111] placeholder-[#6B6B6B] border border-[#BCA58A]/20 rounded-none px-5 py-3 text-sm focus:outline-none focus:border-[#BCA58A] transition-colors"
                      style={{ fontFamily: "'DM Sans', sans-serif" }} autoFocus />
                    <motion.button whileHover={{ scale: 1.05 }} onClick={() => setSearchOpen(false)}
                      className="text-[#6B6B6B] p-1.5 hover:text-[#111111] cursor-pointer">
                      <X size={20} />
                    </motion.button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-3 pl-1">
                    <span className="text-[9px] tracking-[0.2em] text-[#BCA58A] font-semibold uppercase mr-1">Trending:</span>
                    {suggestions.map((sug) => (
                      <button key={sug} onClick={() => setSearchQuery(sug)}
                        className="text-[10px] font-medium bg-[#E8DDD0] border border-[#BCA58A]/20 text-[#111111]/70 hover:border-[#BCA58A] hover:text-[#BCA58A] px-3 py-1 transition-colors cursor-pointer">
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Drawer */}
          <AnimatePresence>
            {isOpen && (
              <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }} transition={{ type: 'tween', duration: 0.3 }}
                className="fixed inset-y-0 right-0 w-64 bg-[#FAF9F6] border-l border-[#BCA58A]/10 shadow-2xl z-50 p-8 flex flex-col gap-6 md:hidden">
                <div className="flex justify-between items-center border-b border-[#BCA58A]/15 pb-4">
                  <span className="text-lg tracking-[0.2em] text-[#111111]" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>MENU</span>
                  <button onClick={() => setIsOpen(false)} className="text-[#6B6B6B] hover:text-[#111111] cursor-pointer"><X size={20} /></button>
                </div>
                <div className="flex flex-col gap-5">
                  {['HOME', 'SHOP', 'COLLECTIONS', 'BOUTIQUES', 'ABOUT US'].map((item, i) => (
                    <a key={i} href="#" onClick={() => setIsOpen(false)}
                      className="text-[11px] tracking-[0.2em] text-[#111111]/60 hover:text-[#BCA58A] transition-colors py-1 border-b border-[#BCA58A]/10">
                      {item}
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer" />
            <div className="absolute inset-y-0 right-0 max-w-full flex">
              <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
                className="w-screen max-w-md bg-[#FAF9F6] border-l border-[#BCA58A]/10 shadow-2xl flex flex-col">
                <div className="p-6 border-b border-[#BCA58A]/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShoppingBag size={18} className="text-[#BCA58A]" />
                    <span className="text-base tracking-[0.1em] text-[#111111]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>SHOPPING BAG</span>
                    <span className="bg-[#BCA58A]/10 text-[#BCA58A] text-[9px] font-semibold px-2 py-0.5 rounded-full">{cartItemCount} items</span>
                  </div>
                  <button onClick={() => setCartOpen(false)} className="text-[#6B6B6B] hover:text-[#111111] cursor-pointer"><X size={20} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-full border border-[#BCA58A]/20 flex items-center justify-center text-[#BCA58A]/30">
                        <ShoppingBag size={28} className="stroke-[1.25]" />
                      </div>
                      <h4 className="text-[#111111]/70 text-base" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Your bag is empty</h4>
                      <p className="text-xs text-[#6B6B6B] max-w-[200px] leading-relaxed">Add luxury ethnic suits to begin your fashion journey.</p>
                      <button onClick={() => setCartOpen(false)}
                        className="px-6 py-2.5 border border-[#BCA58A] text-[#BCA58A] text-[10px] font-semibold tracking-widest hover:bg-[#BCA58A] hover:text-[#FAF9F6] transition-colors cursor-pointer">
                        CONTINUE SHOPPING
                      </button>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={`${item.id}-${item.size}`} className="flex gap-4 pb-6 border-b border-[#BCA58A]/10 last:border-0">
                        <div className="w-20 h-24 overflow-hidden bg-[#E8DDD0] border border-[#BCA58A]/10 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="text-xs font-medium text-[#111111] tracking-wide line-clamp-1">{item.name}</h4>
                              <button onClick={() => removeFromCart(item.id, item.size)}
                                className="text-[#6B6B6B] hover:text-[#FAF9F6] transition-colors cursor-pointer"><Trash2 size={13} /></button>
                            </div>
                            <span className="text-[10px] text-[#6B6B6B] block mt-0.5">Size: <span className="text-[#111111]">{item.size}</span></span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-[#BCA58A]/20">
                              <button onClick={() => updateCartQty(item.id, item.size, item.quantity - 1)}
                                className="p-1.5 px-2 text-[#6B6B6B] hover:text-[#BCA58A] cursor-pointer"><Minus size={10} /></button>
                              <span className="text-xs font-medium px-2 text-[#111111]">{item.quantity}</span>
                              <button onClick={() => updateCartQty(item.id, item.size, item.quantity + 1)}
                                className="p-1.5 px-2 text-[#6B6B6B] hover:text-[#BCA58A] cursor-pointer"><Plus size={10} /></button>
                            </div>
                            <span className="text-xs font-medium text-[#BCA58A]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{item.price}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="p-6 bg-[#FAF9F6] border-t border-[#BCA58A]/10 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] tracking-widest text-[#6B6B6B] uppercase">Estimated Subtotal</span>
                      <span className="text-lg text-[#111111]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>₹{getSubtotal().toLocaleString()}</span>
                    </div>
                    <p className="text-[9px] text-[#6B6B6B] leading-relaxed">Shipping & taxes calculated at checkout. Free shipping on orders above ₹4,999.</p>
                    <button onClick={handleCheckout}
                      className="w-full bg-[#BCA58A] hover:bg-[#BCA58A] text-[#FAF9F6] py-4 text-[10px] font-bold tracking-[0.25em] flex items-center justify-center gap-2.5 transition-colors shadow-lg cursor-pointer uppercase">
                      PROCEED TO CHECKOUT <ArrowRight size={13} />
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Wishlist Drawer */}
      <AnimatePresence>
        {wishlistOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setWishlistOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer" />
            <div className="absolute inset-y-0 right-0 max-w-full flex">
              <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
                className="w-screen max-w-md bg-[#FAF9F6] border-l border-[#BCA58A]/10 shadow-2xl flex flex-col">
                <div className="p-6 border-b border-[#BCA58A]/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Heart size={18} className="text-[#FAF9F6] fill-[#FAF9F6]" />
                    <span className="text-base tracking-[0.1em] text-[#111111]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>MY WISHLIST</span>
                    <span className="bg-[#FAF9F6]/15 text-[#FAF9F6] text-[9px] font-semibold px-2 py-0.5 rounded-full">{favoriteCount} items</span>
                  </div>
                  <button onClick={() => setWishlistOpen(false)} className="text-[#6B6B6B] hover:text-[#111111] cursor-pointer"><X size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {favoriteItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-full border border-[#FAF9F6]/20 flex items-center justify-center text-[#FAF9F6]/30">
                        <Heart size={28} className="stroke-[1.25]" />
                      </div>
                      <h4 className="text-[#111111]/70 text-base" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Your wishlist is empty</h4>
                      <p className="text-xs text-[#6B6B6B] max-w-[200px] leading-relaxed">Tap the heart icon on designs you love to save them here.</p>
                      <button onClick={() => setWishlistOpen(false)}
                        className="px-6 py-2.5 border border-[#BCA58A] text-[#BCA58A] text-[10px] font-semibold tracking-widest hover:bg-[#BCA58A] hover:text-[#FAF9F6] transition-colors cursor-pointer">
                        EXPLORE TRENDING
                      </button>
                    </div>
                  ) : (
                    favoriteItems.map((item) => (
                      <div key={item.id} className="flex gap-4 pb-6 border-b border-[#BCA58A]/10 last:border-0">
                        <div className="w-20 h-24 overflow-hidden bg-[#E8DDD0] border border-[#BCA58A]/10 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between text-left">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="text-xs font-medium text-[#111111]">{item.name}</h4>
                              <button onClick={() => toggleFavorite(item.id)} className="text-[#6B6B6B] hover:text-[#FAF9F6] cursor-pointer"><X size={14} /></button>
                            </div>
                            <span className="text-[9px] text-[#BCA58A] font-semibold uppercase tracking-wider block mt-1">{item.boutique} · Verified</span>
                            <span className="text-sm text-[#111111] block mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{item.price}</span>
                          </div>
                          <button onClick={() => { addToCart(item, 'M'); alert(`Added ${item.name} to bag!`); }}
                            className="mt-3 bg-[#E8DDD0] border border-[#BCA58A]/20 hover:border-[#BCA58A] hover:bg-[#BCA58A] hover:text-[#FAF9F6] text-[#111111] py-2 text-[9px] font-semibold tracking-widest uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer">
                            <ShoppingBag size={10} /> Add To Bag
                          </button>
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
    </motion.nav>
  );
}
