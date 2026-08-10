import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Search, User, ShoppingBag, X, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import gurnaazLogo from '../assets/gurnaaz.png';
import { getAllProducts, getBoutiques, getCategories, getCollections } from '../utils/adminStore';

export default function Navbar({
  cart = [],
  removeFromCart,
  updateCartQty,
  favorites = {},
  toggleFavorite,
  addToCart,
  setView,
  setSelectedCategory,
  setSelectedProduct,
  setSelectedBoutique,
  setSelectedCollectionSlug,
  user,
  handleLogout
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [navBoutiques, setNavBoutiques] = useState([]);
  const [navShops, setNavShops] = useState([]);
  const [navFeatured, setNavFeatured] = useState([]);
  const [navCategories, setNavCategories] = useState([]);
  const [dynamicCollections, setDynamicCollections] = useState([]);
  const [navKey, setNavKey] = useState(0);

  useEffect(() => {
    setAllProducts(getAllProducts());
    const bts = getBoutiques().filter(b => b.showInNavbar !== false);
    setNavBoutiques(bts.filter(b => b.type !== 'Shop'));
    setNavShops(bts.filter(b => b.type === 'Shop'));
    setNavFeatured(bts.filter(b => b.isFeatured === true).slice(0, 2));
    setNavCategories(getCategories().filter(c => c.active !== false).sort((a,b) => (a.order || 0) - (b.order || 0)));
    setDynamicCollections(getCollections().filter(c => c.active !== false).sort((a,b) => (a.order || 0) - (b.order || 0)));
    
    const handleUpdate = () => {
      setAllProducts(getAllProducts());
      const updatedBts = getBoutiques().filter(b => b.showInNavbar !== false);
      setNavBoutiques(updatedBts.filter(b => b.type !== 'Shop'));
      setNavShops(updatedBts.filter(b => b.type === 'Shop'));
      setNavFeatured(updatedBts.filter(b => b.isFeatured === true).slice(0, 2));
      setNavCategories(getCategories().filter(c => c.active !== false).sort((a,b) => (a.order || 0) - (b.order || 0)));
      setDynamicCollections(getCollections().filter(c => c.active !== false).sort((a,b) => (a.order || 0) - (b.order || 0)));
    };
    window.addEventListener('admin-data-updated', handleUpdate);
    return () => window.removeEventListener('admin-data-updated', handleUpdate);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const featuredCols = dynamicCollections.filter(c => c.isFeaturedMenu);
  const fallbackCols = dynamicCollections.filter(c => c.image && !c.isFeaturedMenu);
  const megamenuImages = [...featuredCols, ...fallbackCols].slice(0, 2);
  const col3 = megamenuImages[0];
  const col4 = megamenuImages[1];

  return (
    <>
      {/* Announcement Bar */}
      <div className={`fixed top-0 left-0 right-0 w-full bg-[#1A0008] text-[#FAF9F6] overflow-hidden flex whitespace-nowrap transition-all duration-500 z-[101] ${scrolled ? '-translate-y-full' : 'translate-y-0'}`}>
        <motion.div
          className="flex gap-8 items-center py-2"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 120, repeat: Infinity }}
        >
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-8 items-center">
              <span className="text-[10px] tracking-[0.2em] font-semibold uppercase text-[#D4AF37]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                🔥 UP TO 50% OFF : THE ULTIMATE RAKHI SALE IS LIVE
              </span>
              <span className="text-[#FAF9F6]/30 text-[10px]">✦</span>
              <span className="text-[10px] tracking-[0.2em] font-semibold uppercase text-[#FAF9F6]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                NEW ARRIVALS EVERY WEEK
              </span>
              <span className="text-[#FAF9F6]/30 text-[10px]">✦</span>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed left-0 right-0 z-[999] flex justify-center transition-all duration-700 ${scrolled ? 'top-4 px-4' : 'top-[32px] px-0'}`}
      >
        {/* Main Nav */}
        <div className={`transition-all duration-500 flex flex-col relative w-full ${scrolled
          ? 'max-w-[1200px] bg-white/95 backdrop-blur-2xl shadow-[0_20px_50px_-15px_rgba(26,0,8,0.15)] rounded-3xl border border-white ring-1 ring-[#1A0008]/5'
          : 'bg-white border-b border-[#1A0008]/10'
          }`}>
          
          <div className={`mx-auto w-full px-5 md:px-10 transition-all duration-500 flex items-center justify-between ${scrolled ? 'py-3 max-w-[1200px]' : 'py-3.5 md:py-4 max-w-[1600px]'}`}>

            {/* Left: Mobile Hamburger & Desktop Logo */}
            <div className="flex items-center gap-4 lg:gap-5 flex-1">
              <button
                className={`lg:hidden flex flex-col justify-center gap-1.5 w-7 h-7 cursor-pointer text-[#1A0008] shrink-0`}
                onClick={() => setIsOpen(!isOpen)}>
                <span className={`w-5 h-[1px] bg-current transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
                <span className={`w-4 h-[1px] bg-current transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
                <span className={`w-5 h-[1px] bg-current transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
              </button>

              <motion.a href="/" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }} whileHover={{ scale: 1.02 }} className="cursor-pointer group flex items-center">
                <img src={gurnaazLogo} alt="GURNAAZ" className="h-7 md:h-8 lg:h-9 w-auto object-contain drop-shadow-sm ml-2 md:ml-0 transition-all duration-300" />
              </motion.a>
            </div>

            {/* Center: Top-Level Pages & Megamenu (Desktop Only) */}
            <div className={`hidden lg:flex justify-center shrink-0`}>
              <ul key={navKey} onClick={() => setNavKey(k => k + 1)} className="flex items-center justify-center gap-1 lg:gap-3">
            {['Home', 'Shop & Boutiques', 'Collection', 'About Us', 'Contact'].map((item) => (
              <li key={item} className={`group ${['Collection', 'Shop & Boutiques'].includes(item) ? 'static' : 'relative'}`}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (item === 'Home') { setView('customer-home'); }
                    else if (item === 'Shop & Boutiques') { setView('boutiques'); }
                    else if (item === 'Collection') { setView('collections'); }
                    else if (item === 'Contact') { setView('contact'); }
                    else if (item === 'About Us') { setView('about'); }
                    else { window.scrollTo({ top: 0, behavior: 'smooth' }); }
                  }}
                  className={`relative flex items-center justify-center gap-2 text-[11px] lg:text-[12px] uppercase tracking-[0.15em] transition-all duration-300 px-4 py-2 rounded-full text-[#1A0008]/80 hover:text-[#1A0008] hover:bg-[#1A0008]/5 font-semibold whitespace-nowrap`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {item}
                  {item === 'Collection' && (
                    <span className="bg-[#8B1A1A] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm">New</span>
                  )}
                </a>

                {/* Cinematic Floating Megamenu for Collection */}
                {item === 'Collection' && (
                  <div className="absolute top-[100%] left-1/2 -translate-x-1/2 w-[95vw] max-w-[1100px] mt-4 bg-white/95 backdrop-blur-3xl border border-[#D4AF37]/30 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] rounded-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-500 z-50 h-[420px] p-3 transform origin-top group-hover:translate-y-0 translate-y-4 scale-95 group-hover:scale-100 overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#8B1A1A 1px, transparent 1px), linear-gradient(90deg, #8B1A1A 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                    <div className="w-full h-full flex gap-8 p-8 bg-white/60 rounded-xl relative z-10">

                      {/* Col 1: Shop By Category */}
                      <div className="w-[35%] flex flex-col border-r border-[#D4AF37]/10 pr-4">
                        <span className="text-[9px] tracking-[0.3em] text-[#D4AF37] uppercase font-bold mb-5 flex items-center gap-2"><span className="w-4 h-[1px] bg-[#D4AF37]"></span> Shop by Category</span>
<<<<<<< HEAD
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-2">
                          {navCategories.map((cat) => (
=======
                        <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-2">
                          {navCategories.map((cat, i) => (
>>>>>>> aa180a84696430bc746da8dbb638cb663024ea8a
                            <a
                              key={cat.id || cat.name}
                              href={`/category/${cat.name.toLowerCase().replace(/ /g, '-')}`}
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedCategory(cat.name);
                                setView('category');
                              }}
                              className="text-[12px] text-[#1A0008]/80 hover:text-[#D4AF37] hover:translate-x-1 transition-all duration-300 font-medium tracking-wide w-max relative group/cat"
                              style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                              {cat.name}
                              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-300 group-hover/cat:w-full opacity-50" />
                            </a>
                          ))}
                        </div>
                      </div>

                      {/* Col 2: Curated Edits */}
                      <div className="w-[18%] flex flex-col border-r border-[#D4AF37]/10 px-4">
                        <span className="text-[9px] tracking-[0.3em] text-[#D4AF37] uppercase font-bold mb-5 flex items-center gap-2"><span className="w-4 h-[1px] bg-[#D4AF37]"></span> Curated Edits</span>
                        <div className="flex flex-col gap-3.5 mt-2">
                          {dynamicCollections.slice(0, 7).map((edit) => (
                            <a
                              key={edit.id}
                              href={`/collections/${edit.id}`}
                              onClick={(e) => {
                                e.preventDefault();
                                if (setSelectedCollectionSlug) {
                                  setSelectedCollectionSlug(edit.id);
                                  setView('collection-detail');
                                } else {
                                  window.location.href = `/collections/${edit.id}`;
                                }
                              }}
                              className="text-[15px] text-[#1A0008]/90 hover:text-[#D4AF37] hover:translate-x-1 transition-all duration-300 font-light tracking-wide relative w-max"
                              style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
                            >
                              {edit.title}
                            </a>
                          ))}
                        </div>
                        <a href="/collections" onClick={(e) => { e.preventDefault(); window.location.href = '/collections'; }}
                          className="mt-auto text-[9px] font-bold text-[#1A0008] hover:text-[#D4AF37] tracking-[0.2em] uppercase flex items-center gap-2 group/link">
                          View All Pieces <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                        </a>
                      </div>

                      {/* Col 3: Featured Image 1 */}
                      {col3 && (
                      <div className="flex-1 h-full relative overflow-hidden group/img cursor-pointer rounded-xl ml-4 shadow-lg" onClick={() => {
                        if (setSelectedCollectionSlug) {
                          setSelectedCollectionSlug(col3.id);
                          setView('collection-detail');
                        } else {
                          window.location.href = `/collections/${col3.id}`;
                        }
                      }}>
                        <img src={col3.image} alt={col3.title} className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover/img:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-5 left-5 text-white">
                          <span className="text-[8px] tracking-[0.3em] font-bold uppercase mb-1 block text-[#D4AF37]">{col3.tag || 'Featured'}</span>
                          <h3 className="text-2xl font-light tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{col3.title}</h3>
                        </div>
                      </div>
                      )}

                      {/* Col 4: Featured Image 2 */}
                      {col4 && (
                      <div className="flex-1 h-full relative overflow-hidden group/img cursor-pointer rounded-xl shadow-lg" onClick={() => {
                        if (setSelectedCollectionSlug) {
                          setSelectedCollectionSlug(col4.id);
                          setView('collection-detail');
                        } else {
                          window.location.href = `/collections/${col4.id}`;
                        }
                      }}>
                        <img src={col4.image} alt={col4.title} className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover/img:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-5 left-5 text-white pr-4">
                          <span className="text-[8px] tracking-[0.3em] font-bold uppercase mb-1 block text-[#D4AF37]">{col4.tag || 'New Arrival'}</span>
                          <h3 className="text-3xl font-light tracking-wide mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{col4.title}</h3>
                          <p className="text-[10px] tracking-wider opacity-80" style={{ fontFamily: "'DM Sans', sans-serif" }}>{col4.desc || col4.subtitle}</p>
                        </div>
                      </div>
                      )}

                    </div>
                  </div>
                )}

                {/* Cinematic Floating Megamenu for Boutiques */}
                {item === 'Shop & Boutiques' && (
                  <div className="absolute top-[100%] left-1/2 -translate-x-1/2 w-[95vw] max-w-[1100px] mt-4 bg-white/95 backdrop-blur-3xl border border-[#D4AF37]/30 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] rounded-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-500 z-50 h-[420px] p-3 transform origin-top group-hover:translate-y-0 translate-y-4 scale-95 group-hover:scale-100 overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#8B1A1A 1px, transparent 1px), linear-gradient(90deg, #8B1A1A 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                    <div className="w-full h-full flex gap-8 p-8 bg-white/60 rounded-xl relative z-10">

                      {/* Col 1: Top Shops */}
                      <div className="w-[18%] flex flex-col border-r border-[#D4AF37]/10 pr-4">
                        <span className="text-[9px] tracking-[0.3em] text-[#D4AF37] uppercase font-bold mb-5 flex items-center gap-2"><span className="w-4 h-[1px] bg-[#D4AF37]"></span> Top Shops</span>
                        <div className="flex flex-col gap-3.5 mt-2 max-h-[300px] overflow-y-auto scrollbar-thin">
                          {navShops.map((shop) => (
                            <a
                              key={shop.id}
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (setSelectedBoutique) {
                                  setSelectedBoutique(shop.name);
                                  setView('seller-shop');
                                } else {
                                  window.location.href = `/shop/${shop.name.toLowerCase().replace(/ /g, '-')}`;
                                }
                              }}
                              className="text-[16px] text-[#1A0008]/90 hover:text-[#D4AF37] hover:translate-x-1 transition-all duration-300 font-medium tracking-wide relative w-max group/btq"
                              style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                              {shop.name}
                              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-300 group-hover/btq:w-full opacity-50" />
                            </a>
                          ))}
                        </div>
                      </div>

                      {/* Col 2: Top Boutiques */}
                      <div className="w-[18%] flex flex-col border-r border-[#D4AF37]/10 px-4">
                        <span className="text-[9px] tracking-[0.3em] text-[#D4AF37] uppercase font-bold mb-5 flex items-center gap-2"><span className="w-4 h-[1px] bg-[#D4AF37]"></span> Top Boutiques</span>
                        <div className="flex flex-col gap-3.5 mt-2 max-h-[300px] overflow-y-auto scrollbar-thin">
                          {navBoutiques.map((btq) => (
                            <a
                              key={btq.id}
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (setSelectedBoutique) {
                                  setSelectedBoutique(btq.name);
                                  setView('seller-shop');
                                } else {
                                  window.location.href = `/shops-and-boutiques/${btq.name.toLowerCase().replace(/ /g, '-')}`;
                                }
                              }}
                              className="text-[16px] text-[#1A0008]/90 hover:text-[#D4AF37] hover:translate-x-1 transition-all duration-300 font-medium tracking-wide relative w-max group/btq"
                              style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                              {btq.name}
                              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-300 group-hover/btq:w-full opacity-50" />
                            </a>
                          ))}
                        </div>
                        <a href="/shops-and-boutiques" onClick={(e) => { e.preventDefault(); window.location.href = '/shops-and-boutiques'; }}
                          className="mt-auto text-[9px] font-bold text-[#1A0008] hover:text-[#D4AF37] tracking-[0.2em] uppercase flex items-center gap-2 group/link">
                          View All Boutiques <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                        </a>
                      </div>

                      {navFeatured.map((feat, index) => (
                        <div key={feat.id} className={`${index === 0 ? 'w-[32%] ml-4' : 'flex-1'} h-full relative overflow-hidden group/img cursor-pointer rounded-xl shadow-lg`} onClick={() => {
                          if (setSelectedBoutique) {
                            setSelectedBoutique(feat.name);
                            setView('seller-shop');
                          } else {
                            window.location.href = `/${feat.type === 'Shop' ? 'shop' : 'shops-and-boutiques'}/${feat.name.toLowerCase().replace(/ /g, '-')}`;
                          }
                        }}>
                          <img src={feat.coverImage || (index === 0 ? "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80" : "/designer_suit_1.png")} alt={feat.name} className={`w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-110 ${index === 0 ? 'object-center' : 'object-top'}`} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute inset-y-0 left-0 p-6 flex flex-col justify-end text-white">
                            <span className="text-[8px] tracking-[0.3em] text-[#D4AF37] uppercase font-bold mb-1 block">
                              {feat.gstVerified ? 'Premium Partner' : 'Trending'}
                            </span>
                            <h3 className="text-3xl font-light tracking-wide mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{feat.name}</h3>
                            <p className="text-[10px] tracking-wider opacity-90 leading-relaxed font-light mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                              {feat.description || 'Exclusive collections and designer wear.'}
                            </p>
                            <div className="flex items-center gap-2 text-[9px] font-bold tracking-[0.2em] uppercase w-max group-hover/img:text-[#D4AF37] transition-colors">
                              Visit {feat.type || 'Shop'} <ArrowRight size={12} className="group-hover/img:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {navFeatured.length === 0 && (
                        <div className="flex-1 h-full flex items-center justify-center text-center p-8 bg-white/30 border border-dashed border-[#D4AF37]/30 rounded-xl ml-2 text-[#1A0008]/50 text-xs font-medium uppercase tracking-widest">
                          Set featured shops/boutiques in Admin panel to display photos here.
                        </div>
                      )}

                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center justify-end gap-3 sm:gap-5 lg:gap-6 flex-1 pr-4 md:pr-0">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className={`cursor-pointer transition-colors text-[#1A0008] hover:text-[#8B1A1A]`}>
            <Search strokeWidth={1.5} className="w-5 h-5 md:w-5 md:h-5" />
          </button>

          <button
            onClick={() => setView('wishlist')}
            className={`cursor-pointer transition-colors relative text-[#1A0008] hover:text-[#8B1A1A]`}>
            <Heart strokeWidth={1.5} className="w-5 h-5 md:w-5 md:h-5" />
            {favoriteCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#8B1A1A] rounded-full" />
            )}
          </button>

          <button
            onClick={() => setCartOpen(true)}
            className={`cursor-pointer transition-colors relative text-[#1A0008] hover:text-[#8B1A1A]`}>
            <ShoppingBag strokeWidth={1.5} className="w-5 h-5 md:w-5 md:h-5" />
            {cartItemCount > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-2 bg-[#8B1A1A] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                {cartItemCount}
              </motion.span>
            )}
          </button>

          {user ? (
            <button
              onClick={() => setView('profile')}
              title="My Profile"
              className="hidden lg:block w-7 h-7 rounded-full overflow-hidden border border-[#D4AF37] cursor-pointer hover:scale-105 transition-transform"
            >
              <img src="/cute_luxury_model.png" alt="User Profile" className="w-full h-full object-cover" />
            </button>
          ) : (
            <button
              onClick={() => {
                sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
                setView('login');
              }}
              className={`hidden lg:block w-7 h-7 rounded-full overflow-hidden border border-[#1A0008]/20 hover:border-[#1A0008] cursor-pointer transition-all`}
              title="Login / Register"
            >
              <User strokeWidth={1.5} className={`w-full h-full p-1 text-[#1A0008]`} />
            </button>
          )}
        </div>

      </div>

      {/* Search Panel */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden mt-4">
            <div className="border-t border-[#D4AF37]/15 pt-4 pb-3">
              <div className="flex items-center gap-3">
                <input type="text" placeholder="Search for suits, anarkalis, dupattas…"
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#E8DDD0] text-[#1A0008] placeholder-[#6B6B6B] border border-[#D4AF37]/20 rounded-none px-5 py-3 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }} autoFocus />
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setSearchOpen(false)}
                  className="text-[#6B6B6B] p-1.5 hover:text-[#1A0008] cursor-pointer">
                  <X size={20} />
                </motion.button>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-3 pl-1">
                <span className="text-[9px] tracking-[0.2em] text-[#D4AF37] font-semibold uppercase mr-1">Trending:</span>
                {suggestions.map((sug) => (
                  <button key={sug} onClick={() => setSearchQuery(sug)}
                    className="text-[10px] font-medium bg-[#E8DDD0] border border-[#D4AF37]/20 text-[#1A0008]/70 hover:border-[#D4AF37] hover:text-[#D4AF37] px-3 py-1 transition-colors cursor-pointer">
                    {sug}
                  </button>
                ))}
              </div>

              {/* Search Results Preview */}
              {searchQuery.trim().length > 0 && (
                <div className="mt-4 max-h-[300px] overflow-y-auto border border-[#D4AF37]/15 bg-white divide-y divide-[#D4AF37]/10 shadow-lg">
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
                        <img src={p.image} alt={p.name} className="w-10 h-12 object-cover object-top border border-[#D4AF37]/10" />
                        <div>
                          <p className="text-xs font-semibold text-[#1A0008]">{p.name}</p>
                          <p className="text-[10px] text-[#D4AF37] font-semibold mt-0.5">{p.boutique} · {p.price}</p>
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
      </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] lg:hidden" />
            <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }} transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 bottom-0 right-0 w-[85vw] max-w-[320px] bg-white border-l border-[#D4AF37]/10 shadow-2xl z-[1001] p-6 flex flex-col gap-5 lg:hidden overflow-y-auto h-[100dvh]">
              <div className="flex justify-between items-center border-b border-[#D4AF37]/15 pb-4 shrink-0">
                <span className="text-lg tracking-[0.2em] text-[#1A0008]" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>MENU</span>
                <button onClick={() => setIsOpen(false)} className="text-[#6B6B6B] hover:text-[#1A0008] cursor-pointer"><X size={20} /></button>
              </div>

              {/* Login / Profile Mobile Section */}
              <div className="border-b border-[#D4AF37]/15 pb-5 -mt-2">
                {user ? (
                  <div className="flex items-center gap-4 cursor-pointer" onClick={() => { setView('profile'); setIsOpen(false); }}>
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-[#D4AF37]">
                      <img src="/cute_luxury_model.png" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-xs text-[#6B6B6B] block">Welcome back,</span>
                      <span className="text-[15px] font-medium text-[#1A0008]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{user.name || 'User'}</span>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => {
                    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
                    setView('login');
                    setIsOpen(false);
                  }} className="w-full py-3 bg-[#1A0008] text-white text-[10px] tracking-widest uppercase font-semibold hover:bg-[#D4AF37] transition-colors flex items-center justify-center gap-2">
                    <User size={14} /> LOG IN / REGISTER
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-5 text-left">
              <a href="#" onClick={(e) => { e.preventDefault(); window.location.href = '/'; setIsOpen(false); }}
                className="text-[16px] text-[#1A0008] hover:text-[#8B1A1A] transition-colors py-1 border-b border-[#1A0008]/10 font-medium tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Home
              </a>
              <div className="space-y-2">
                <span className="text-[11px] tracking-[0.2em] text-[#1A0008]/40 uppercase font-bold block">SHOP CATEGORIES</span>
                <div className="pl-4 flex flex-col gap-3">
                  {navCategories.map((cat) => (
                    <a key={cat.id || cat.name} href="#" onClick={(e) => {
                      e.preventDefault();
                      setSelectedCategory(cat.name);
                      setView('category');
                      setIsOpen(false);
                    }}
                      className="text-[10px] tracking-[0.2em] text-[#1A0008]/60 hover:text-[#D4AF37] transition-colors uppercase font-medium">
                      {cat.name}
                    </a>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] tracking-[0.2em] text-[#1A0008]/40 uppercase font-bold block">TOP SHOPS</span>
                <div className="pl-4 flex flex-col gap-3">
                  {navShops.slice(0, 5).map((bt) => (
                    <a key={bt.id} href="#" onClick={(e) => {
                      e.preventDefault();
                      setSelectedBoutique(bt.name);
                      setView('seller-shop');
                      setIsOpen(false);
                    }}
                      className="text-[10px] tracking-[0.2em] text-[#1A0008]/60 hover:text-[#D4AF37] transition-colors uppercase font-medium">
                      {bt.name}
                    </a>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] tracking-[0.2em] text-[#1A0008]/40 uppercase font-bold block">TOP BOUTIQUES</span>
                <div className="pl-4 flex flex-col gap-3">
                  {navBoutiques.slice(0, 5).map((bt) => (
                    <a key={bt.id} href="#" onClick={(e) => {
                      e.preventDefault();
                      setSelectedBoutique(bt.name);
                      setView('seller-shop');
                      setIsOpen(false);
                    }}
                      className="text-[10px] tracking-[0.2em] text-[#1A0008]/60 hover:text-[#D4AF37] transition-colors uppercase font-medium">
                      {bt.name}
                    </a>
                  ))}
                </div>
              </div>

              {['Shop & Boutiques', 'Collection', 'About Us', 'Contact'].map((item, i) => (
                <a key={i} href="#" onClick={(e) => {
                  e.preventDefault();
                  if (item === 'Shop & Boutiques') { setView('boutiques'); }
                  else if (item === 'Collection') { setView('collections'); }
                  else if (item === 'About Us') { setView('about'); }
                  else if (item === 'Contact') { setView('contact'); }
                  else { window.location.href = '/'; }
                  setIsOpen(false);
                }}
                  className="text-[16px] text-[#1A0008] hover:text-[#8B1A1A] transition-colors py-1 border-b border-[#1A0008]/10 font-medium tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-[1000] overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer" />
            <div className="absolute inset-y-0 right-0 max-w-full flex">
              <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
                className="w-screen max-w-md bg-white border-l border-[#D4AF37]/10 shadow-2xl flex flex-col">
                <div className="p-6 border-b border-[#D4AF37]/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShoppingBag size={18} className="text-[#D4AF37]" />
                    <span className="text-base tracking-[0.1em] text-[#1A0008]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>SHOPPING BAG</span>
                    <span className="bg-[#D4AF37]/10 text-[#D4AF37] text-[9px] font-semibold px-2 py-0.5 rounded-full">{cartItemCount} items</span>
                  </div>
                  <button onClick={() => setCartOpen(false)} className="text-[#6B6B6B] hover:text-[#1A0008] cursor-pointer"><X size={20} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-full border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]/30">
                        <ShoppingBag size={28} className="stroke-[1.25]" />
                      </div>
                      <h4 className="text-[#1A0008]/70 text-base" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Your bag is empty</h4>
                      <p className="text-xs text-[#6B6B6B] max-w-[200px] leading-relaxed">Add luxury ethnic suits to begin your fashion journey.</p>
                      <button onClick={() => setCartOpen(false)}
                        className="px-6 py-2.5 border border-[#D4AF37] text-[#D4AF37] text-[10px] font-semibold tracking-widest hover:bg-[#D4AF37] hover:text-[#FAF9F6] transition-colors cursor-pointer">
                        CONTINUE SHOPPING
                      </button>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={`${item.id}-${item.size}`} className="flex gap-4 pb-6 border-b border-[#D4AF37]/10 last:border-0">
                        <div className="w-20 h-24 overflow-hidden bg-[#E8DDD0] border border-[#D4AF37]/10 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="text-xs font-medium text-[#1A0008] tracking-wide line-clamp-1">{item.name}</h4>
                              <button onClick={() => removeFromCart(item.id, item.size)}
                                className="text-[#6B6B6B] hover:text-[#FAF9F6] transition-colors cursor-pointer"><Trash2 size={13} /></button>
                            </div>
                            <span className="text-[10px] text-[#6B6B6B] block mt-0.5">Size: <span className="text-[#1A0008]">{item.size}</span></span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-[#D4AF37]/20">
                              <button onClick={() => updateCartQty(item.id, item.size, item.quantity - 1)}
                                className="p-1.5 px-2 text-[#6B6B6B] hover:text-[#D4AF37] cursor-pointer"><Minus size={10} /></button>
                              <span className="text-xs font-medium px-2 text-[#1A0008]">{item.quantity}</span>
                              <button onClick={() => updateCartQty(item.id, item.size, item.quantity + 1)}
                                className="p-1.5 px-2 text-[#6B6B6B] hover:text-[#D4AF37] cursor-pointer"><Plus size={10} /></button>
                            </div>
                            <span className="text-xs font-medium text-[#D4AF37]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{item.price}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="p-6 bg-white border-t border-[#D4AF37]/10 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] tracking-widest text-[#6B6B6B] uppercase">Estimated Subtotal</span>
                      <span className="text-lg text-[#1A0008]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>₹{getSubtotal().toLocaleString()}</span>
                    </div>
                    <p className="text-[9px] text-[#6B6B6B] leading-relaxed">Shipping & taxes calculated at checkout. Free shipping on orders above ₹4,999.</p>
                    <button onClick={handleCheckout}
                      className="w-full bg-[#D4AF37] hover:bg-[#D4AF37] text-[#FAF9F6] py-4 text-[10px] font-bold tracking-[0.25em] flex items-center justify-center gap-2.5 transition-colors shadow-lg cursor-pointer uppercase">
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
          <div className="fixed inset-0 z-[1000] overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setWishlistOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer" />
            <div className="absolute inset-y-0 right-0 max-w-full flex">
              <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
                className="w-screen max-w-md bg-white border-l border-[#D4AF37]/10 shadow-2xl flex flex-col">
                <div className="p-6 border-b border-[#D4AF37]/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Heart size={18} className="text-[#FAF9F6] fill-[#FAF9F6]" />
                    <span className="text-base tracking-[0.1em] text-[#1A0008]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>MY WISHLIST</span>
                    <span className="bg-white/15 text-[#FAF9F6] text-[9px] font-semibold px-2 py-0.5 rounded-full">{favoriteCount} items</span>
                  </div>
                  <button onClick={() => setWishlistOpen(false)} className="text-[#6B6B6B] hover:text-[#1A0008] cursor-pointer"><X size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {favoriteItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-full border border-[#FAF9F6]/20 flex items-center justify-center text-[#FAF9F6]/30">
                        <Heart size={28} className="stroke-[1.25]" />
                      </div>
                      <h4 className="text-[#1A0008]/70 text-base" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Your wishlist is empty</h4>
                      <p className="text-xs text-[#6B6B6B] max-w-[200px] leading-relaxed">Tap the heart icon on designs you love to save them here.</p>
                      <button onClick={() => setWishlistOpen(false)}
                        className="px-6 py-2.5 border border-[#D4AF37] text-[#D4AF37] text-[10px] font-semibold tracking-widest hover:bg-[#D4AF37] hover:text-[#FAF9F6] transition-colors cursor-pointer">
                        EXPLORE TRENDING
                      </button>
                    </div>
                  ) : (
                    favoriteItems.map((item) => (
                      <div key={item.id} className="flex gap-4 pb-6 border-b border-[#D4AF37]/10 last:border-0">
                        <div className="w-20 h-24 overflow-hidden bg-[#E8DDD0] border border-[#D4AF37]/10 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between text-left">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="text-xs font-medium text-[#1A0008]">{item.name}</h4>
                              <button onClick={() => toggleFavorite(item.id)} className="text-[#6B6B6B] hover:text-[#FAF9F6] cursor-pointer"><X size={14} /></button>
                            </div>
                            <span className="text-[9px] text-[#D4AF37] font-semibold uppercase tracking-wider block mt-1">{item.boutique} · Verified</span>
                            <span className="text-sm text-[#1A0008] block mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{item.price}</span>
                          </div>
                          <button onClick={() => { 
                              const fit = item.fitOptions?.includes('Unstitched') ? 'Unstitched' : (item.fitOptions?.includes('Semi-Stitched') ? 'Semi-Stitched' : (item.fitOptions?.[0] || 'Stitched'));
      const size = fit === 'Stitched' ? (item.sizes?.length > 0 ? `Stitched - ${item.sizes[0]}` : 'Stitched') : fit;
                              addToCart(item, size); 
                              alert(`Added ${item.name} to bag!`); 
                            }}
                            className="mt-3 bg-[#E8DDD0] border border-[#D4AF37]/20 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#FAF9F6] text-[#1A0008] py-2 text-[9px] font-semibold tracking-widest uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer">
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
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
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
              className="relative bg-white border border-[#D4AF37]/30 p-8 md:p-10 max-w-md w-full shadow-2xl z-10 text-center"
            >
              <button
                onClick={() => setCheckoutOpen(false)}
                className="absolute top-4 right-4 text-[#6B6B6B] hover:text-[#1A0008] cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center gap-4">
                <span className="text-[9px] tracking-[0.3em] text-[#D4AF37] uppercase font-bold">Secure Payment</span>
                <h3 className="text-3xl font-light text-[#1A0008]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Complete Your Order
                </h3>
                <div className="w-12 h-px bg-[#D4AF37]/30 my-2" />

                <p className="text-xs text-[#6B6B6B] leading-relaxed mb-4">
                  Please scan the Google Pay UPI QR code below to complete the payment for your premium Gurnaaz order.
                </p>

                {/* QR Code Container */}
                <div className="w-48 h-48 bg-white border border-[#D4AF37]/20 p-2 shadow-inner flex items-center justify-center rounded">
                  <img src="/gpay_qr_code.png" alt="Google Pay QR Code" className="w-full h-full object-contain" />
                </div>

                {/* Details */}
                <div className="w-full bg-[#E8DDD0]/40 p-4 border border-[#D4AF37]/10 mt-2 space-y-2 text-left">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#6B6B6B] uppercase tracking-wider font-semibold">Order ID:</span>
                    <span className="font-bold text-[#1A0008]">{orderId}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#6B6B6B] uppercase tracking-wider font-semibold">Total Amount:</span>
                    <span className="font-bold text-[#D4AF37]">₹{getSubtotal().toLocaleString()}</span>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-[#D4AF37]/10 border-l-2 border-[#D4AF37] p-4 text-left w-full mt-4">
                  <p className="text-[11px] text-[#1A0008] leading-relaxed">
                    <strong>Step 1:</strong> Scan the QR code above and pay the exact amount.
                  </p>
                  <p className="text-[11px] text-[#1A0008] leading-relaxed mt-1.5">
                    <strong>Step 2:</strong> Send the payment receipt screenshot to WhatsApp: <a href="https://wa.me/919877275894" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#D4AF37] font-bold text-[#1A0008]">+91 9877275894</a> along with your <strong>Order ID</strong>.
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
    </>
  );
}
