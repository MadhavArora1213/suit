import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Search, User, ShoppingBag, X, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import gurnaazLogo from '../assets/gurnaaz.png';
import { getAllProducts } from '../utils/adminStore';

export default function Navbar({ cart = [], removeFromCart, updateCartQty, favorites = {}, toggleFavorite, addToCart, setView, setSelectedCategory, setSelectedProduct, setSelectedBoutique, user, handleLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 24, seconds: 53 });
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    setAllProducts(getAllProducts());
    const handleUpdate = () => {
      setAllProducts(getAllProducts());
    };
    window.addEventListener('admin-data-updated', handleUpdate);
    return () => window.removeEventListener('admin-data-updated', handleUpdate);
  }, []);

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

  const suggestions = ['Anarkali', 'Sharara', 'Banarasi', 'Chikankari', 'Patiala', 'Pakistani'];
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const favoriteItems = allProducts.filter((p) => favorites[p.id]);
  const favoriteCount = favoriteItems.length;

  const getSubtotal = () => cart.reduce((total, item) => {
    const priceNum = parseInt(item.price.replace(/[^\d]/g, ''), 10);
    return total + priceNum * item.quantity;
  }, 0);

  const handleCheckout = () => {
    setCartOpen(false);
    setView('checkout');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Announcement Bar */}
      <div className="bg-[#FAF9F6] text-[#111111] py-1.5 sm:py-2 px-4 text-center text-[9px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.22em] font-semibold flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-4 uppercase">
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
            <motion.a href="#" onClick={(e) => { e.preventDefault(); setView('home'); }} whileHover={{ scale: 1.02 }} className="flex items-center gap-2 cursor-pointer group">
              <img src={gurnaazLogo} alt="GURNAAZ" className="h-12 md:h-14 w-auto object-contain" />
            </motion.a>

            <div className="hidden md:flex items-center gap-10">
              {['HOME', 'SHOP', 'COLLECTIONS', 'BOUTIQUES', 'ABOUT US'].map((item, i) => (
                <div key={i} className="relative group py-2">
                  <a href="#" onClick={(e) => { 
                    e.preventDefault(); 
                    if (item === 'HOME') setView('home');
                    if (item === 'COLLECTIONS') { setSelectedCategory('Anarkali'); setView('category'); } 
                  }}
                    className="relative text-[11px] tracking-[0.18em] text-[#111111]/70 hover:text-[#111111] group-hover:text-[#111111] transition-colors duration-300 uppercase py-2"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-[#BCA58A] transition-all duration-400 group-hover:w-full" />
                  </a>

                  {item === 'SHOP' && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-[#FAF9F6] border border-[#BCA58A]/15 shadow-2xl py-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 z-50 rounded">
                      {['Anarkali', 'Sharara', 'Patiala', 'Pakistani', 'Chikankari', 'Banarasi'].map((cat) => (
                        <a
                          key={cat}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedCategory(cat);
                            setView('category');
                          }}
                          className="block px-6 py-2.5 text-[10px] tracking-widest uppercase text-[#111111]/70 hover:text-[#BCA58A] hover:bg-[#E8DDD0]/20 transition-all font-semibold"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {cat} Suits
                        </a>
                      ))}
                    </div>
                  )}

                  {item === 'BOUTIQUES' && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-[#FAF9F6] border border-[#BCA58A]/15 shadow-2xl py-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 z-50 rounded">
                      {['Kala Mandir', 'Zari Heritage', 'Gulabo Jaipur', 'Nazraana', 'Vastra', 'Awadh Kraft'].map((bt) => (
                        <a
                          key={bt}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedBoutique(bt);
                            setView('seller-shop');
                          }}
                          className="block px-6 py-2.5 text-[10px] tracking-widest uppercase text-[#111111]/70 hover:text-[#BCA58A] hover:bg-[#E8DDD0]/20 transition-all font-semibold"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {bt}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-6 md:gap-7">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-[#111111]/70 hover:text-[#BCA58A] transition-colors cursor-pointer">
                <Search size={18} />
              </motion.button>

              {user ? (
                <div className="flex items-center gap-3 relative">
                  <span className="text-[10px] tracking-wider font-bold text-[#BCA58A] uppercase hidden sm:block">
                    Hi, {user.name.split(' ')[0]}
                  </span>
                  <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    title="Log Out"
                    className="text-[10px] text-rose-500 hover:text-rose-700 tracking-wider font-bold uppercase cursor-pointer"
                  >
                    Logout
                  </motion.button>
                </div>
              ) : (
                <motion.button 
                  whileHover={{ scale: 1.1 }} 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setView('login')}
                  className="text-[#111111]/70 hover:text-[#BCA58A] transition-colors cursor-pointer"
                  title="Login / Register"
                >
                  <User size={18} />
                </motion.button>
              )}

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
                onClick={() => setView('cart')}
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

                  {/* Search Results Preview */}
                  {searchQuery.trim().length > 0 && (
                    <div className="mt-4 max-h-[300px] overflow-y-auto border border-[#BCA58A]/15 bg-white divide-y divide-[#BCA58A]/10 shadow-lg">
                      {allProducts
                        .filter(p => 
                          p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.type || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.boutique || '').toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .slice(0, 5)
                        .map(p => (
                          <div 
                            key={p.id} 
                            onClick={() => {
                              setSelectedProduct(p);
                              setView('product-details');
                              setSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="flex items-center gap-4 p-3 hover:bg-[#E8DDD0]/10 cursor-pointer transition-all text-left animate-fadeIn"
                          >
                            <img src={p.image} alt={p.name} className="w-10 h-12 object-cover object-top border border-[#BCA58A]/10" />
                            <div>
                              <p className="text-xs font-semibold text-[#111111]">{p.name}</p>
                              <p className="text-[10px] text-[#BCA58A] font-semibold mt-0.5">{p.boutique} · {p.price}</p>
                            </div>
                          </div>
                        ))}
                      {allProducts.filter(p => 
                        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (p.type || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (p.boutique || '').toLowerCase().includes(searchQuery.toLowerCase())
                      ).length === 0 && (
                        <p className="text-xs text-[#6B6B6B] p-4 text-center">No products found matching "{searchQuery}"</p>
                      )}
                    </div>
                  )}
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
                <div className="flex flex-col gap-5 text-left">
                  <a href="#" onClick={(e) => { e.preventDefault(); setView('home'); setIsOpen(false); }}
                    className="text-[11px] tracking-[0.2em] text-[#111111]/60 hover:text-[#BCA58A] transition-colors py-1 border-b border-[#BCA58A]/10 uppercase font-semibold">
                    HOME
                  </a>
                  <div className="space-y-2">
                    <span className="text-[11px] tracking-[0.2em] text-[#111111]/40 uppercase font-bold block">SHOP CATEGORIES</span>
                    <div className="pl-4 flex flex-col gap-3">
                      {['Anarkali', 'Sharara', 'Patiala', 'Pakistani', 'Chikankari', 'Banarasi'].map((cat) => (
                        <a key={cat} href="#" onClick={(e) => {
                          e.preventDefault();
                          setSelectedCategory(cat);
                          setView('category');
                          setIsOpen(false);
                        }}
                          className="text-[10px] tracking-[0.2em] text-[#111111]/60 hover:text-[#BCA58A] transition-colors uppercase font-medium">
                          {cat} Suits
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] tracking-[0.2em] text-[#111111]/40 uppercase font-bold block">BOUTIQUE SHOPS</span>
                    <div className="pl-4 flex flex-col gap-3">
                      {['Kala Mandir', 'Zari Heritage', 'Gulabo Jaipur', 'Nazraana', 'Vastra', 'Awadh Kraft'].map((bt) => (
                        <a key={bt} href="#" onClick={(e) => {
                          e.preventDefault();
                          setSelectedBoutique(bt);
                          setView('seller-shop');
                          setIsOpen(false);
                        }}
                          className="text-[10px] tracking-[0.2em] text-[#111111]/60 hover:text-[#BCA58A] transition-colors uppercase font-medium">
                          {bt}
                        </a>
                      ))}
                    </div>
                  </div>

                  {['COLLECTIONS', 'ABOUT US'].map((item, i) => (
                    <a key={i} href="#" onClick={(e) => {
                      e.preventDefault();
                      if (item === 'COLLECTIONS') { setSelectedCategory('Anarkali'); setView('category'); }
                      else { setView('home'); }
                      setIsOpen(false);
                    }}
                      className="text-[11px] tracking-[0.2em] text-[#111111]/60 hover:text-[#BCA58A] transition-colors py-1 border-b border-[#BCA58A]/10 uppercase font-semibold">
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

      {/* Checkout QR Code Modal */}
      <AnimatePresence>
        {checkoutOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setCheckoutOpen(false)} 
              className="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-pointer" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-[#FAF9F6] border border-[#BCA58A]/30 p-8 md:p-10 max-w-md w-full shadow-2xl z-10 text-center"
            >
              <button 
                onClick={() => setCheckoutOpen(false)} 
                className="absolute top-4 right-4 text-[#6B6B6B] hover:text-[#111111] cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center gap-4">
                <span className="text-[9px] tracking-[0.3em] text-[#BCA58A] uppercase font-bold">Secure Payment</span>
                <h3 className="text-3xl font-light text-[#111111]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Complete Your Order
                </h3>
                <div className="w-12 h-px bg-[#BCA58A]/30 my-2" />
                
                <p className="text-xs text-[#6B6B6B] leading-relaxed mb-4">
                  Please scan the Google Pay UPI QR code below to complete the payment for your premium Gurnaaz order.
                </p>

                {/* QR Code Container */}
                <div className="w-48 h-48 bg-white border border-[#BCA58A]/20 p-2 shadow-inner flex items-center justify-center rounded">
                  <img src="/gpay_qr_code.png" alt="Google Pay QR Code" className="w-full h-full object-contain" />
                </div>

                {/* Details */}
                <div className="w-full bg-[#E8DDD0]/40 p-4 border border-[#BCA58A]/10 mt-2 space-y-2 text-left">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#6B6B6B] uppercase tracking-wider font-semibold">Order ID:</span>
                    <span className="font-bold text-[#111111]">{orderId}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#6B6B6B] uppercase tracking-wider font-semibold">Total Amount:</span>
                    <span className="font-bold text-[#BCA58A]">₹{getSubtotal().toLocaleString()}</span>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-[#BCA58A]/10 border-l-2 border-[#BCA58A] p-4 text-left w-full mt-4">
                  <p className="text-[11px] text-[#111111] leading-relaxed">
                    <strong>Step 1:</strong> Scan the QR code above and pay the exact amount.
                  </p>
                  <p className="text-[11px] text-[#111111] leading-relaxed mt-1.5">
                    <strong>Step 2:</strong> Send the payment receipt screenshot to WhatsApp: <a href="https://wa.me/919877275894" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#BCA58A] font-bold text-[#111111]">+91 9877275894</a> along with your <strong>Order ID</strong>.
                  </p>
                  <p className="text-[11px] text-[#6B6B6B] leading-relaxed mt-1.5">
                    Once verified, we will place your order and share shipping/tracking updates.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
