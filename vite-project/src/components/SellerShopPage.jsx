import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate, useMotionValue } from 'framer-motion';
import {
  Phone, MapPin, Filter, ArrowUpDown, ChevronDown, Check, ArrowLeft,
  ShoppingBag, Eye, Heart, MessageCircle, Star, BadgeCheck
} from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';
import { getAllProducts, getBoutiqueProfile } from '../utils/adminStore';

/* ─── ENHANCED BOUTIQUE DATA ─── */
const enhancedBoutiques = {
  'Badshah Designer Fabrics Silk Store': {
    name: 'Badshah Designer Fabrics',
    owner: 'Rajesh & Priya Sharma',
    established: 2008,
    experience: '15+ Years',
    gstVerified: true,
    responseTime: 'Within 1 hour',
    shippingTime: '2-4 Business Days',
    returnPolicy: '7-Day Easy Returns',
    description: 'For over 15 years we\'ve been bringing handcrafted Punjabi fashion to thousands of happy customers.',
    welcomeMessage: 'Welcome to our boutique. Every piece we curate tells a story of heritage, craftsmanship, and timeless elegance.',
    whatsapp: '+919876543210',
    instagramUrl: 'https://instagram.com/badshah_designer_fabrics',
    address: 'Guru Nanak Nagar, Model Town, Ludhiana, Punjab',
    totalOrders: '25,000+',
    rating: 4.8,
    coverImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1400&q=85',
    logo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    story: 'Founded in 2008 in the heart of Ludhiana, Badshah Designer Fabrics Silk Store began as a small family-run boutique with a vision to bring authentic Punjabi silk craftsmanship to fashion-forward women across India.',
  },
  'Gulabo Jaipur': {
    name: 'Gulabo Jaipur',
    owner: 'Saloni Panwar',
    established: 2015,
    experience: '9+ Years',
    gstVerified: true,
    responseTime: 'Within 2 hours',
    shippingTime: '3-5 Business Days',
    returnPolicy: '14-Day Returns',
    description: 'Bringing the royal charm of Rajasthan to life with flowy pure georgette fabrics and hand-applied gota patti laces.',
    welcomeMessage: 'Step into the world of Gulabo Jaipur, where every twist and twirl of our fabric echoes the vibrant colors of Rajasthan.',
    whatsapp: '+919876501003',
    instagramUrl: 'https://instagram.com/gulabo_jaipur',
    address: 'B-4, Johari Bazar, Jaipur, Rajasthan',
    totalOrders: '12,000+',
    rating: 4.9,
    coverImage: 'https://images.unsplash.com/photo-1605784401368-5af1d9d6c4dc?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    story: 'Gulabo Jaipur was born from a deep love for the traditional textiles of Rajasthan. What began as a celebration of vibrant colors and flowy silhouettes has become a beloved brand.',
  }
};

/* ─── MAGNETIC BUTTON HOOK ─── */
function MagneticButton({ children, className, onClick, href, as = 'button' }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouse = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.25);
    y.set(middleY * 0.25);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const Component = as;
  const props = as === 'a' ? { href, target: '_blank', rel: 'noopener noreferrer' } : { onClick };

  return (
    <motion.div ref={ref} onMouseMove={handleMouse} onMouseLeave={reset} className="flex-1 md:flex-none">
      <motion.div animate={{ x: x.get(), y: y.get() }} transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}>
        <Component {...props} className={className}>
          {children}
        </Component>
      </motion.div>
    </motion.div>
  );
}

/* ─── 3D TILT PRODUCT CARD ─── */
function ProductCard({ product, index, favorites, toggleFavorite, addToCart, setSelectedProduct, setView }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left - width / 2);
    mouseY.set(clientY - top - height / 2);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 1, 0.5, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
      onClick={() => { setSelectedProduct(product); setView('product-details'); }}
      className="group cursor-pointer flex flex-col relative bg-transparent [perspective:1000px]"
    >
      <motion.div 
        style={{
          rotateX: useTransform(mouseY, [-200, 200], [7, -7]),
          rotateY: useTransform(mouseX, [-200, 200], [-7, 7]),
          transformStyle: "preserve-3d"
        }}
        className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#F0E8DC] shadow-sm group-hover:shadow-2xl transition-shadow duration-500"
      >
        <img src={product.image} alt={product.name} onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-[1.08] ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} />
        
        {/* Shine Effect */}
        <motion.div 
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: useMotionTemplate`radial-gradient(circle at ${useTransform(mouseX, [-200, 200], [0, 100])}% ${useTransform(mouseY, [-200, 200], [0, 100])}%, rgba(255,255,255,0.2) 0%, transparent 60%)`
          }}
        />

        {/* Absolute Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10" style={{ transform: "translateZ(20px)" }}>
          {product.badge && (
            <span className="bg-[#FAF9F6]/95 backdrop-blur-sm text-[#111111] text-[9px] font-semibold tracking-[0.15em] uppercase px-3 py-1.5 rounded-md border border-[#BCA58A]/20 shadow-sm">{product.badge}</span>
          )}
        </div>
        
        <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
          style={{ transform: "translateZ(30px)" }}
          className={`absolute top-4 right-4 p-2.5 rounded-full transition-all duration-300 z-20 shadow-md ${
            favorites[product.id] ? 'bg-[#BCA58A] text-white border-transparent' : 'bg-[#FAF9F6]/90 text-[#111111]/60 hover:text-[#BCA58A] backdrop-blur-sm hover:scale-110'
          }`}>
          <Heart size={14} className={favorites[product.id] ? 'fill-current' : ''} />
        </button>

        {/* Hover Action Sheet */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.25,1,0.5,1] flex gap-2" style={{ transform: "translateZ(40px)" }}>
          <button onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); setView('product-details'); }}
            className="flex-1 py-3 text-[9px] font-bold tracking-[0.2em] uppercase rounded-xl bg-[#FAF9F6]/95 backdrop-blur-md text-[#111111] hover:bg-[#111111] hover:text-[#FAF9F6] transition-all flex items-center justify-center gap-1.5 shadow-lg border border-[#BCA58A]/20">
            <Eye size={12} /> View
          </button>
          <button onClick={(e) => { e.stopPropagation(); addToCart(product, 'M'); }}
            className="flex-1 py-3 text-[9px] font-bold tracking-[0.2em] uppercase rounded-xl bg-[#BCA58A] hover:bg-[#111111] text-[#FAF9F6] transition-all flex items-center justify-center gap-1.5 shadow-lg">
            <ShoppingBag size={12} /> Bag
          </button>
        </div>
      </motion.div>
      
      {/* Product Details */}
      <div className="pt-4 px-1 flex flex-col gap-1.5 transition-transform duration-300 group-hover:translate-y-1">
        <h3 className="text-[15px] font-light text-[#111111]/90 group-hover:text-[#111111] transition-colors line-clamp-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{product.name}</h3>
        <p className="text-[14px] font-medium text-[#BCA58A] tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{product.price}</p>
      </div>
    </motion.div>
  );
}

/* ─── FILTER ─── */
function FilterSection({ title, options, selected, onSelect }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-[#BCA58A]/15 pb-4 mb-4">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-2 group cursor-pointer">
        <span className="text-[10px] tracking-[0.2em] uppercase text-[#111111]/70 font-semibold">{title}</span>
        <ChevronDown size={14} className={`text-[#BCA58A]/70 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="flex flex-col gap-1.5 pt-3">
              {options.map((opt) => (
                <button key={opt.value} onClick={() => onSelect(opt.value)}
                  className={`text-left text-[11px] py-2 px-3 rounded-xl flex items-center justify-between transition-colors ${selected === opt.value ? 'bg-[#BCA58A]/10 text-[#BCA58A] font-semibold' : 'text-[#111111]/60 hover:bg-[#BCA58A]/5 hover:text-[#111111]'}`}>
                  <span>{opt.label}</span>
                  {selected === opt.value && <Check size={12} className="text-[#BCA58A]" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── MAIN ─── */
export default function SellerShopPage({ boutiqueName, setView, setSelectedProduct, addToCart }) {
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [sortBy, setSortBy] = useState('default');
  const [filters, setFilters] = useState({ fabric: 'All', occasion: 'All', color: 'All', price: 'All' });

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const collageY1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const collageY2 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const collageScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const prof = getBoutiqueProfile(boutiqueName);
    
    let richProfile = null;
    if (boutiqueName) {
      const bn = boutiqueName.trim().toLowerCase();
      for (const key in enhancedBoutiques) {
        if (key.toLowerCase().includes(bn) || bn.includes(key.toLowerCase())) {
          richProfile = enhancedBoutiques[key];
          break;
        }
      }
    }
    setProfile(richProfile || prof);

    const allProds = getAllProducts();
    const boutiqueProds = allProds.filter(p => {
      if (!p.boutique || !boutiqueName) return false;
      const pb = p.boutique.trim().toLowerCase();
      const bn = boutiqueName.trim().toLowerCase();
      return pb.includes(bn) || bn.includes(pb);
    });
    setProducts(boutiqueProds);
    setFilteredProducts(boutiqueProds);
    const savedFavs = localStorage.getItem('gurnaaz_favorites');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, [boutiqueName]);

  const toggleFavorite = (id) => {
    const newFavs = { ...favorites, [id]: !favorites[id] };
    setFavorites(newFavs);
    localStorage.setItem('gurnaaz_favorites', JSON.stringify(newFavs));
  };

  useEffect(() => {
    let result = [...products];
    if (filters.fabric !== 'All') result = result.filter(p => p.fabric === filters.fabric);
    if (filters.occasion !== 'All') result = result.filter(p => p.occasion === filters.occasion);
    if (filters.color !== 'All') result = result.filter(p => p.color === filters.color);
    if (filters.price !== 'All') {
      result = result.filter(p => {
        const price = parseInt(p.price.replace(/[^0-9]/g, ''));
        if (filters.price === 'Under 5K') return price < 5000;
        if (filters.price === '5K - 10K') return price >= 5000 && price <= 10000;
        if (filters.price === 'Over 10K') return price > 10000;
        return true;
      });
    }
    if (sortBy === 'price-low') result.sort((a, b) => parseInt(a.price.replace(/[^0-9]/g, '')) - parseInt(b.price.replace(/[^0-9]/g, '')));
    if (sortBy === 'price-high') result.sort((a, b) => parseInt(b.price.replace(/[^0-9]/g, '')) - parseInt(a.price.replace(/[^0-9]/g, '')));
    if (sortBy === 'newest') result.reverse();
    setFilteredProducts(result);
  }, [filters, sortBy, products]);

  const fabricOptions = [{ value: 'All', label: 'All Fabrics' }, { value: 'Silk', label: 'Pure Silk' }, { value: 'Georgette', label: 'Georgette' }, { value: 'Cotton', label: 'Cotton' }, { value: 'Banarasi', label: 'Banarasi' }];
  const occasionOptions = [{ value: 'All', label: 'All Occasions' }, { value: 'Festive', label: 'Festive Wear' }, { value: 'Wedding', label: 'Wedding Guest' }, { value: 'Casual', label: 'Casual Wear' }];
  const colorOptions = [{ value: 'All', label: 'All Colors' }, { value: 'Red', label: 'Red' }, { value: 'Blue', label: 'Blue' }, { value: 'Green', label: 'Green' }, { value: 'Pink', label: 'Pink' }];
  const priceOptions = [{ value: 'All', label: 'Any Price' }, { value: 'Under 5K', label: 'Under ₹5,000' }, { value: '5K - 10K', label: '₹5,000 - ₹10,000' }, { value: 'Over 10K', label: 'Over ₹10,000' }];

  if (!profile) return null;

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#111111] overflow-hidden">
      
      {/* ═══════ COLLAGE HERO ═══════ */}
      <div ref={heroRef} className="relative h-[85vh] md:h-[90vh] min-h-[600px] w-full overflow-hidden flex flex-col items-center justify-center bg-[#FAF9F6] border-b border-[#BCA58A]/15 pt-12 md:pt-16">
        
        <button onClick={() => window.location.href = '/boutiques'} className="absolute top-6 left-6 md:left-12 z-50 flex items-center gap-2 bg-[#FAF9F6]/90 hover:bg-[#FAF9F6] text-[#111111] text-[9px] uppercase tracking-[0.2em] px-5 py-2.5 backdrop-blur-md shadow-lg transition-all rounded-full border border-[#BCA58A]/20 cursor-pointer hover:scale-105">
          <ArrowLeft size={12} /> Directory
        </button>

        {/* Ambient Glow */}
        <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#BCA58A]/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#BCA58A]/15 blur-[100px] pointer-events-none" />

        {/* Collage Container */}
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 flex items-center justify-center">
          
          {/* Left Floating Image */}
          <motion.div style={{ y: collageY1 }} className="hidden md:block w-1/4 max-w-[220px] aspect-[4/5] rounded-[24px] overflow-hidden shadow-2xl rotate-[-8deg] border-[6px] border-[#FAF9F6] translate-x-16 z-0">
            <img src={products[1]?.image || profile.coverImage} className="w-full h-full object-cover saturate-[0.8]" />
          </motion.div>
          
          {/* Center Main Image */}
          <motion.div style={{ scale: collageScale }} className="w-[95%] md:w-[65%] max-w-[700px] aspect-[16/10] rounded-[32px] overflow-hidden shadow-[0_30px_60px_rgba(188,165,138,0.25)] border-[8px] border-[#FAF9F6] z-10 relative">
            <img src={profile.coverImage} className="w-full h-full object-cover filter brightness-[0.8]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-[#111111]/30 to-transparent" />
            
            {/* Embedded Text inside Main Image */}
            <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 text-center flex flex-col items-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }} className="space-y-3">
                <span className="text-[9px] md:text-[10px] font-bold tracking-[0.4em] uppercase text-[#BCA58A] drop-shadow-md">
                  The Artisan Collection
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#FAF9F6] tracking-tight drop-shadow-2xl" style={{ fontFamily: "'Cormorant Garamond', serif", textShadow: "0 4px 20px rgba(0,0,0,0.6)" }}>
                  {profile.name}
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-3 text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase text-[#FAF9F6]/90 pt-3">
                  {profile.address && <span className="flex items-center gap-1.5"><MapPin size={12} className="text-[#BCA58A]"/> {profile.address.split(',').slice(-1)[0]}</span>}
                  <span className="hidden md:block w-1.5 h-1.5 bg-[#BCA58A] rounded-full shadow-lg" />
                  <span className="flex items-center gap-1.5"><Star size={12} className="text-[#BCA58A] fill-current" /> {profile.rating || 4.8}</span>
                  <span className="hidden md:block w-1.5 h-1.5 bg-[#BCA58A] rounded-full shadow-lg" />
                  <span className="flex items-center gap-1.5"><BadgeCheck size={12} className="text-[#BCA58A]"/> Verified Partner</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Floating Image */}
          <motion.div style={{ y: collageY2 }} className="hidden lg:block w-1/4 max-w-[220px] aspect-[4/5] rounded-[24px] overflow-hidden shadow-2xl rotate-[8deg] border-[6px] border-[#FAF9F6] -translate-x-16 z-0">
            <img src={products[2]?.image || profile.coverImage} className="w-full h-full object-cover saturate-[0.8]" />
          </motion.div>

        </div>
      </div>

      {/* ═══════ MAGNETIC ACTION BAR ═══════ */}
      <div className="sticky top-0 z-40 bg-[#FAF9F6]/80 backdrop-blur-2xl border-b border-[#BCA58A]/15 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between py-3 gap-4">
          <div className="text-[11px] tracking-widest uppercase text-[#6B6B6B] font-semibold w-full md:w-auto text-center md:text-left">
            Showing <span className="text-[#BCA58A]">{filteredProducts.length}</span> curated pieces
          </div>
          <div className="flex items-center w-full md:w-auto h-full gap-3">
            <MagneticButton as="a" href={`https://wa.me/${(profile.whatsapp || '919876543210').replace(/[^0-9]/g, '')}`} 
               className="flex items-center justify-center w-full gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white px-8 py-2.5 text-[10px] font-bold tracking-widest uppercase rounded-xl transition-colors shadow-md">
               <MessageCircle size={14} /> WhatsApp
            </MagneticButton>
            <MagneticButton as="a" href={`tel:${(profile.contact || '+919876543210').replace(/[^0-9+]/g, '')}`}
               className="flex items-center justify-center w-full gap-2 bg-[#111111] hover:bg-[#BCA58A] text-[#FAF9F6] px-8 py-2.5 text-[10px] font-bold tracking-widest uppercase rounded-xl transition-colors shadow-md">
               <Phone size={14} /> Call Shop
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* ═══════ MAIN CONTENT ═══════ */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12 flex flex-col xl:flex-row gap-12">
        
        {/* SIDEBAR */}
        <div className="hidden xl:block w-64 flex-shrink-0">
          <div className="sticky top-28 bg-white/50 p-6 rounded-3xl border border-[#BCA58A]/15 shadow-[0_8px_30px_rgba(188,165,138,0.05)]">
            <div className="flex items-center justify-between mb-6 border-b border-[#BCA58A]/15 pb-4">
              <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#111111]">Refine</h3>
              <button onClick={() => setFilters({ fabric: 'All', occasion: 'All', color: 'All', price: 'All' })} className="text-[9px] uppercase font-bold tracking-wider text-[#BCA58A] hover:text-[#111111] transition-colors">Clear</button>
            </div>
            <FilterSection title="Fabric" options={fabricOptions} selected={filters.fabric} onSelect={(v) => setFilters(f => ({ ...f, fabric: v }))} />
            <FilterSection title="Occasion" options={occasionOptions} selected={filters.occasion} onSelect={(v) => setFilters(f => ({ ...f, occasion: v }))} />
            <FilterSection title="Price" options={priceOptions} selected={filters.price} onSelect={(v) => setFilters(f => ({ ...f, price: v }))} />
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <div className="flex-1">
          <div className="flex justify-between items-end mb-8 border-b border-[#BCA58A]/15 pb-4">
            <h2 className="text-3xl md:text-4xl font-light text-[#111111] tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Our Collection</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 border border-[#BCA58A]/30 px-4 py-2 rounded-xl bg-white/50 cursor-pointer hover:border-[#BCA58A] transition-all">
                <ArrowUpDown size={12} className="text-[#BCA58A]" />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-[10px] font-bold uppercase tracking-widest bg-transparent focus:outline-none cursor-pointer text-[#111111]/80">
                  <option value="default">Default</option>
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
          
          {filteredProducts.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 bg-white/50 rounded-3xl border border-dashed border-[#BCA58A]/30">
              <p className="text-xl font-light text-[#6B6B6B]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>No pieces match your current filters.</p>
              <button onClick={() => setFilters({ fabric: 'All', occasion: 'All', color: 'All', price: 'All' })} className="mt-4 text-[10px] font-bold tracking-[0.2em] uppercase text-[#BCA58A] hover:text-[#111111] border-b border-[#BCA58A]/40 pb-1 transition-colors">Reset All Filters</button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 [perspective:1000px]">
              {filteredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} favorites={favorites} toggleFavorite={toggleFavorite} addToCart={addToCart} setSelectedProduct={setSelectedProduct} setView={setView} />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* ═══════ BRAND STORY FOOTER ═══════ */}
      <div className="border-t border-[#BCA58A]/15 bg-gradient-to-b from-white/30 to-[#F5F0E8] mt-12 py-20 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
          className="max-w-[1000px] mx-auto text-center space-y-6 bg-white/60 backdrop-blur-xl p-10 md:p-16 rounded-[40px] border border-[#BCA58A]/20 shadow-[0_20px_60px_rgba(188,165,138,0.15)]"
        >
          <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#BCA58A]">Our Heritage</span>
          <h2 className="text-4xl md:text-5xl font-light text-[#111111]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>About {profile.name}</h2>
          <p className="text-sm text-[#6B6B6B] leading-[1.8] max-w-2xl mx-auto">{profile.story || profile.description}</p>
          
          <div className="flex flex-wrap justify-center gap-12 pt-8 border-t border-[#BCA58A]/15 mt-8">
            <div className="text-center">
              <span className="block text-3xl font-light text-[#111111]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{profile.experience || '10+'}</span>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#BCA58A]">Years Experience</span>
            </div>
            <div className="text-center">
              <span className="block text-3xl font-light text-[#111111]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{profile.totalOrders || '10K+'}</span>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#BCA58A]">Orders Delivered</span>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
