import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate, useMotionValue } from 'framer-motion';
import {
  Phone, MapPin, Filter, ArrowUpDown, ChevronDown, Check, ArrowLeft,
  ShoppingBag, Eye, Heart, MessageCircle, Star, BadgeCheck
} from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';
import { getAllProducts, getBoutiqueProfile } from '../utils/adminStore';

/* ─── ENHANCED BOUTIQUE DATA (Now managed dynamically in Admin Store) ─── */

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

        {/* Diagonal Premium Sash */}
        {product.badge && (
          <div className="absolute top-0 left-0 overflow-hidden w-28 h-28 z-20 rounded-tl-2xl pointer-events-none" style={{ transform: "translateZ(20px)" }}>
            <div className="absolute top-5 -left-8 w-[150px] bg-gradient-to-r from-[#8B1A1A] to-[#601010] text-[#FAF9F6] text-[8px] font-black tracking-[0.25em] uppercase py-1.5 text-center shadow-lg border-y border-[#D4AF37]/40" style={{ transform: "rotate(-45deg)" }}>
              {product.badge}
            </div>
          </div>
        )}

        <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
          style={{ transform: "translateZ(30px)" }}
          className={`absolute top-4 right-4 p-2.5 rounded-full transition-all duration-300 z-20 shadow-md ${
            favorites[product.id] ? 'bg-[#D4AF37] text-white border-transparent' : 'bg-[#FAF9F6]/90 text-[#1A0008]/60 hover:text-[#D4AF37] backdrop-blur-sm hover:scale-110'
          }`}>
          <Heart size={14} className={favorites[product.id] ? 'fill-current' : ''} />
        </button>

        {/* Hover Action Sheet */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-[150%] group-hover:translate-y-0 transition-transform duration-700 ease-[0.25,1,0.5,1] flex gap-2">
          <button onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); setView('product-details'); }}
            className="flex-1 py-3 text-[9px] font-bold tracking-[0.2em] uppercase rounded-xl bg-[#FAF9F6]/95 backdrop-blur-md text-[#1A0008] hover:bg-[#1A0008] hover:text-[#FAF9F6] transition-all flex items-center justify-center gap-1.5 shadow-lg border border-[#D4AF37]/20">
            <Eye size={12} /> View
          </button>
          <button onClick={(e) => { e.stopPropagation(); addToCart(product, product.fitOptions?.includes('Unstitched') ? 'Unstitched' : (product.fitOptions?.includes('Semi-Stitched') ? 'Semi-Stitched' : (product.sizes?.length > 0 ? `Stitched - ${product.sizes[0]}` : 'Stitched'))); }}
            className="flex-1 py-3 text-[9px] font-bold tracking-[0.2em] uppercase rounded-xl bg-[#D4AF37] hover:bg-[#1A0008] text-[#FAF9F6] transition-all flex items-center justify-center gap-1.5 shadow-lg">
            <ShoppingBag size={12} /> Bag
          </button>
        </div>
      </motion.div>
      
      {/* Product Details */}
      <div className="pt-4 px-1 flex flex-col gap-1.5 transition-transform duration-300 group-hover:translate-y-1">
        <h3 className="text-[16px] font-semibold text-[#1A0008] group-hover:text-[#8B1A1A] transition-colors line-clamp-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{product.name}</h3>
        <p className="text-[15px] font-bold text-[#1A0008] tracking-wide flex items-center gap-2">
          {product.originalPrice && (
            <span className="text-[12px] text-gray-500 line-through font-normal">
              {product.originalPrice}
            </span>
          )}
          <span>{product.price}</span>
        </p>
      </div>
    </motion.div>
  );
}

/* ─── FILTER ─── */
function FilterSection({ title, options, selected, onSelect, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#D4AF37]/15 pb-4 mb-4">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-2 group cursor-pointer">
        <span className="text-[10px] tracking-[0.2em] uppercase text-[#1A0008]/70 font-semibold">{title}</span>
        <ChevronDown size={14} className={`text-[#D4AF37]/70 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="flex flex-col gap-1.5 pt-3">
              {options.map((opt) => (
                <button key={opt.value} onClick={() => onSelect(opt.value)}
                  className={`text-left text-[11px] py-2 px-3 rounded-xl flex items-center justify-between transition-colors ${selected === opt.value ? 'bg-[#D4AF37]/10 text-[#D4AF37] font-semibold' : 'text-[#1A0008]/60 hover:bg-[#D4AF37]/5 hover:text-[#1A0008]'}`}>
                  <span>{opt.label}</span>
                  {selected === opt.value && <Check size={12} className="text-[#D4AF37]" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SellerShopPage({ boutiqueName, setView, setSelectedProduct, addToCart, favorites = {}, toggleFavorite }) {
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState('default');
  const [filters, setFilters] = useState({ fabric: 'All', occasion: 'All', color: 'All', price: 'All', size: 'All', work: 'All' });
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [loading, setLoading] = useState(true);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const collageY1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const collageY2 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const collageScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const loadData = () => {
      const prof = getBoutiqueProfile(boutiqueName);
      setProfile(prof);

      const allProds = getAllProducts();
      const boutiqueProds = allProds.filter(p => {
        if (!p.boutique || !boutiqueName) return false;
        const pb = p.boutique.replace(/[- ]/g, '').toLowerCase();
        const bn = boutiqueName.replace(/[- ]/g, '').toLowerCase();
        return pb === bn || pb.includes(bn) || bn.includes(pb);
      });
      
      setProducts(boutiqueProds);
      setFilteredProducts(boutiqueProds);
      
      // If we got products, or if a reasonable time passed, stop loading
      if (boutiqueProds.length > 0) {
        setLoading(false);
      }
    };

    loadData();
    
    // Fallback: stop loading after 2.5s even if no products found (in case shop is actually empty)
    const timer = setTimeout(() => setLoading(false), 2500);

    window.addEventListener('admin-data-updated', loadData);
    window.addEventListener('gurnaaz-firebase-updated', loadData);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('admin-data-updated', loadData);
      window.removeEventListener('gurnaaz-firebase-updated', loadData);
    };
  }, [boutiqueName]);

  useEffect(() => {
    let result = [...products];
    if (filters.fabric !== 'All') result = result.filter(p => p.fabric === filters.fabric);
    if (filters.occasion !== 'All') result = result.filter(p => p.occasion === filters.occasion);
    if (filters.color !== 'All') result = result.filter(p => p.color === filters.color);
    if (filters.size !== 'All') result = result.filter(p => p.sizes && p.sizes.includes(filters.size));
    if (filters.work !== 'All') result = result.filter(p => p.work === filters.work || (p.description && p.description.includes(filters.work)));
    if (filters.price !== 'All') {
      result = result.filter(p => {
        const price = parseInt(p.price.replace(/[^0-9]/g, ''));
        if (filters.price === 'Under 500') return price < 500;
        if (filters.price === '500 - 800') return price >= 500 && price <= 800;
        if (filters.price === '800 - 1000') return price >= 800 && price <= 1000;
        if (filters.price === '1000 - 1500') return price >= 1000 && price <= 1500;
        if (filters.price === '1500 - 2000') return price >= 1500 && price <= 2000;
        if (filters.price === '2000 - 3000') return price >= 2000 && price <= 3000;
        if (filters.price === '3000 - 5000') return price >= 3000 && price <= 5000;
        if (filters.price === 'Over 5000') return price > 5000;
        return true;
      });
    }
    if (sortBy === 'price-low') result.sort((a, b) => parseInt(a.price.replace(/[^0-9]/g, '')) - parseInt(b.price.replace(/[^0-9]/g, '')));
    if (sortBy === 'price-high') result.sort((a, b) => parseInt(b.price.replace(/[^0-9]/g, '')) - parseInt(a.price.replace(/[^0-9]/g, '')));
    if (sortBy === 'newest') result.reverse();
    setFilteredProducts(result);
  }, [filters, sortBy, products]);

  const fabricOptions = [{ value: 'All', label: 'All Fabrics' }, { value: 'Silk', label: 'Pure Silk' }, { value: 'Georgette', label: 'Georgette' }, { value: 'Cotton', label: 'Cotton' }, { value: 'Banarasi', label: 'Banarasi' }, { value: 'Chiffon', label: 'Chiffon' }];
  const occasionOptions = [{ value: 'All', label: 'All Occasions' }, { value: 'Festive', label: 'Festive Wear' }, { value: 'Wedding', label: 'Wedding Guest' }, { value: 'Casual', label: 'Casual Wear' }];
  const colorOptions = [{ value: 'All', label: 'All Colors' }, { value: 'Red', label: 'Red' }, { value: 'Blue', label: 'Blue' }, { value: 'Green', label: 'Green' }, { value: 'Pink', label: 'Pink' }, { value: 'Black', label: 'Black' }];
  const priceOptions = [
    { value: 'All', label: 'Any Price' },
    { value: 'Under 500', label: 'Under ₹500' },
    { value: '500 - 800', label: '₹500 - ₹800' },
    { value: '800 - 1000', label: '₹800 - ₹1,000' },
    { value: '1000 - 1500', label: '₹1,000 - ₹1,500' },
    { value: '1500 - 2000', label: '₹1,500 - ₹2,000' },
    { value: '2000 - 3000', label: '₹2,000 - ₹3,000' },
    { value: '3000 - 5000', label: '₹3,000 - ₹5,000' },
    { value: 'Over 5000', label: 'Over ₹5,000' }
  ];
  const sizeOptions = [
    { value: 'All', label: 'All Sizes' },
    { value: 'Unstitched', label: 'Unstitched' },
    { value: 'Semi-Stitched', label: 'Semi-Stitched' },
    { value: 'XS', label: 'XS' }, 
    { value: 'S', label: 'S' }, 
    { value: 'M', label: 'M' }, 
    { value: 'L', label: 'L' }, 
    { value: 'XL', label: 'XL' },
    { value: 'XXL', label: 'XXL' },
    { value: 'XXXL', label: 'XXXL' },
    { value: 'XXXXL', label: 'XXXXL' }
  ];
  const workOptions = [{ value: 'All', label: 'All Work' }, { value: 'Embroidery', label: 'Hand Embroidery' }, { value: 'Zari', label: 'Zari Work' }, { value: 'Gota Patti', label: 'Gota Patti' }, { value: 'Printed', label: 'Printed' }];

  if (!profile) return null;

  if (loading) {
    return (
      <div className="bg-[#FAF9F6] min-h-screen text-[#1A0008] overflow-hidden">
        {/* Skeleton Hero */}
        <div className="relative w-full overflow-hidden border-b border-[#D4AF37]/15 pt-14 md:pt-16">
          <div className="md:hidden relative z-10 w-full px-5 py-6">
            <div className="w-full aspect-[4/3] rounded-[16px] bg-black/5 animate-pulse border-[4px] border-[#FAF9F6]"></div>
          </div>
          <div className="hidden md:flex relative z-10 w-full max-w-[1200px] mx-auto px-6 py-10 items-center justify-center gap-6">
            <div className="w-[22%] max-w-[220px] aspect-[3/4] rounded-[20px] bg-black/5 animate-pulse rotate-[-6deg]"></div>
            <div className="w-[55%] max-w-[700px] aspect-[16/10] rounded-[32px] bg-black/5 animate-pulse z-10"></div>
            <div className="w-[22%] max-w-[220px] aspect-[3/4] rounded-[20px] bg-black/5 animate-pulse rotate-[6deg]"></div>
          </div>
        </div>
        {/* Skeleton Action Bar */}
        <div className="border-b border-[#D4AF37]/15 py-3">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between">
            <div className="w-32 h-4 bg-black/5 animate-pulse rounded"></div>
            <div className="w-48 h-10 bg-black/5 animate-pulse rounded-xl"></div>
          </div>
        </div>
        {/* Skeleton Content */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 py-8 md:py-12 flex flex-col xl:flex-row gap-8 md:gap-12">
          {/* Skeleton Sidebar */}
          <div className="hidden xl:block w-64 flex-shrink-0">
            <div className="h-[600px] bg-black/5 animate-pulse rounded-3xl"></div>
          </div>
          {/* Skeleton Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-end mb-8 border-b border-[#D4AF37]/15 pb-4">
              <div className="w-48 h-10 bg-black/5 animate-pulse rounded"></div>
              <div className="w-32 h-10 bg-black/5 animate-pulse rounded-xl"></div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-6 sm:gap-y-10">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="flex flex-col gap-3">
                  <div className="aspect-[3/4] bg-black/5 animate-pulse rounded-2xl"></div>
                  <div className="w-3/4 h-4 bg-black/5 animate-pulse rounded"></div>
                  <div className="w-1/2 h-4 bg-black/5 animate-pulse rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#1A0008] overflow-hidden">
      
      {/* ═══════ COLLAGE HERO ═══════ */}
      <div ref={heroRef} className="relative w-full overflow-hidden bg-[#FAF9F6] border-b border-[#D4AF37]/15 pt-14 md:pt-16">
        
        <button onClick={() => window.location.href = '/shops-and-boutiques'} className="absolute top-4 left-4 md:top-6 md:left-12 z-50 flex items-center gap-2 bg-[#FAF9F6]/90 hover:bg-[#FAF9F6] text-[#1A0008] text-[9px] uppercase tracking-[0.2em] px-4 md:px-5 py-2 md:py-2.5 backdrop-blur-md shadow-lg transition-all rounded-full border border-[#D4AF37]/20 cursor-pointer hover:scale-105">
          <ArrowLeft size={12} /> Directory
        </button>

        {/* Ambient Glow */}
        <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#D4AF37]/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#D4AF37]/15 blur-[100px] pointer-events-none" />

        {/* ── Mobile: Single Center Image ── */}
        <div className="md:hidden relative z-10 w-full px-5 py-6">
          <div className="relative w-full aspect-[4/3] rounded-[16px] overflow-hidden shadow-[0_20px_50px_rgba(188,165,138,0.25)] border-[4px] border-[#FAF9F6]">
            <img src={profile.coverImage || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1400&q=85'} className="w-full h-full object-cover" alt="Boutique Cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-center flex flex-col items-center">
              <span className="text-[7px] font-bold tracking-[0.2em] uppercase text-[#D4AF37] mb-1.5">The Artisan Collection</span>
              <h1 className="text-xl font-light text-white tracking-tight mb-2 break-words px-1 flex items-center justify-center gap-2" style={{ fontFamily: "'Cormorant Garamond', serif", textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
                {profile.name}
                {(profile.verified || profile.gstVerified) && (
                  <BadgeCheck size={16} className="text-[#007BFF] fill-white/10 shrink-0" />
                )}
              </h1>
              <div className="flex items-center justify-center gap-2 text-[7px] font-bold tracking-[0.15em] uppercase text-white/80">
                {profile.address && <span className="flex items-center gap-1"><MapPin size={10} className="text-[#D4AF37]"/> {profile.address.split(',').slice(-1)[0]}</span>}
                <span className="w-1 h-1 bg-[#D4AF37] rounded-full" />
                <span className="flex items-center gap-1"><Star size={10} className="text-[#D4AF37] fill-current" /> {profile.rating || 4.8}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Desktop: Three Image Collage ── */}
        <div className="hidden md:flex relative z-10 w-full max-w-[1200px] mx-auto px-6 py-10 items-center justify-center gap-6">
          {/* Left Image */}
          <motion.div style={{ y: collageY1 }} className="w-[22%] max-w-[220px] aspect-[3/4] rounded-[20px] overflow-hidden shadow-2xl rotate-[-6deg] border-[5px] border-[#FAF9F6] z-0 flex-shrink-0">
            <img src={profile.leftImage || "/custom_suit_1.png"} className="w-full h-full object-cover saturate-[0.8]" alt="" />
          </motion.div>
          
          {/* Center Image */}
          <motion.div style={{ scale: collageScale }} className="w-[55%] max-w-[700px] aspect-[16/10] rounded-[32px] overflow-hidden shadow-[0_30px_60px_rgba(188,165,138,0.25)] border-[8px] border-[#FAF9F6] z-10 relative flex-shrink-0">
            <img src={profile.coverImage || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1400&q=85'} className="w-full h-full object-cover filter brightness-[0.8]" alt="Boutique Cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8 lg:p-12 text-center flex flex-col items-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }} className="space-y-3">
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#D4AF37] drop-shadow-md">The Artisan Collection</span>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-light text-white tracking-tight drop-shadow-2xl flex items-center justify-center gap-3" style={{ fontFamily: "'Cormorant Garamond', serif", textShadow: "0 4px 20px rgba(0,0,0,0.6)" }}>
                  {profile.name}
                  {(profile.verified || profile.gstVerified) && (
                    <BadgeCheck size={32} className="text-[#007BFF] fill-white/10 shrink-0 mt-2" />
                  )}
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-bold tracking-[0.2em] uppercase text-white/90 pt-3">
                  {profile.address && <span className="flex items-center gap-1.5"><MapPin size={12} className="text-[#D4AF37]"/> {profile.address.split(',').slice(-1)[0]}</span>}
                  <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
                  <span className="flex items-center gap-1.5"><Star size={12} className="text-[#D4AF37] fill-current" /> {profile.rating || 4.8}</span>
                  <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
                  {profile.verified || profile.gstVerified ? (
                    <span className="flex items-center gap-1.5"><BadgeCheck size={12} className="text-[#007BFF]"/> Verified Partner</span>
                  ) : (
                    <span className="flex items-center gap-1.5 opacity-80"><BadgeCheck size={12} className="text-white/60"/> Unverified</span>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div style={{ y: collageY2 }} className="w-[22%] max-w-[220px] aspect-[3/4] rounded-[20px] overflow-hidden shadow-2xl rotate-[6deg] border-[5px] border-[#FAF9F6] z-0 flex-shrink-0">
            <img src={profile.rightImage || "/custom_suit_2.png"} className="w-full h-full object-cover saturate-[0.8]" alt="" />
          </motion.div>
        </div>
      </div>

      {/* ═══════ MAGNETIC ACTION BAR ═══════ */}
      <div className="sticky top-0 z-40 bg-[#FAF9F6]/80 backdrop-blur-2xl border-b border-[#D4AF37]/15 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 flex flex-col md:flex-row items-center justify-between py-3 gap-3 md:gap-4">
          <div className="text-[11px] tracking-widest uppercase text-[#6B6B6B] font-semibold w-full md:w-auto text-center md:text-left">
            Showing <span className="text-[#D4AF37]">{filteredProducts.length}</span> curated pieces
          </div>
          <div className="flex items-center w-full md:w-auto h-full gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {profile.whatsapp && profile.whatsapp.split(',').map((num, idx, arr) => (
              <MagneticButton key={`wa-${idx}`} as="a" href={`https://wa.me/${num.trim().replace(/[^0-9]/g, '')}`} 
                 className="flex-shrink-0 flex items-center justify-center w-auto min-w-[140px] md:min-w-0 md:w-full gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white px-6 py-2.5 text-[10px] font-bold tracking-widest uppercase rounded-xl transition-colors shadow-md">
                 <MessageCircle size={14} /> WhatsApp {arr.length > 1 ? idx + 1 : ''}
              </MagneticButton>
            ))}

            {profile.contact && profile.contact.split(',').map((num, idx, arr) => (
              <MagneticButton key={`call-${idx}`} as="a" href={`tel:${num.trim().replace(/[^0-9+]/g, '')}`}
                 className="flex-shrink-0 flex items-center justify-center w-auto min-w-[140px] md:min-w-0 md:w-full gap-2 bg-[#1A0008] hover:bg-[#D4AF37] text-[#FAF9F6] px-6 py-2.5 text-[10px] font-bold tracking-widest uppercase rounded-xl transition-colors shadow-md">
                 <Phone size={14} /> Call Shop {arr.length > 1 ? idx + 1 : ''}
              </MagneticButton>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════ MAIN CONTENT ═══════ */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12 py-8 md:py-12 flex flex-col xl:flex-row gap-8 md:gap-12">
        
        {/* SIDEBAR */}
        <div className="hidden xl:block w-64 flex-shrink-0">
          <div className="sticky top-28 bg-white/50 p-6 rounded-3xl border border-[#D4AF37]/15 shadow-[0_8px_30px_rgba(188,165,138,0.05)] max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#D4AF37]/20">
            <div className="flex items-center justify-between mb-6 border-b border-[#D4AF37]/15 pb-4">
              <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#1A0008]">Refine</h3>
              <button onClick={() => setFilters({ fabric: 'All', occasion: 'All', color: 'All', price: 'All', size: 'All', work: 'All' })} className="text-[9px] uppercase font-bold tracking-wider text-[#D4AF37] hover:text-[#1A0008] transition-colors">Clear</button>
            </div>
            <FilterSection title="Fabric" options={fabricOptions} selected={filters.fabric} onSelect={(v) => setFilters(f => ({ ...f, fabric: v }))} />
            <FilterSection title="Color" options={colorOptions} selected={filters.color} onSelect={(v) => setFilters(f => ({ ...f, color: v }))} />
            <FilterSection title="Work / Pattern" options={workOptions} selected={filters.work} onSelect={(v) => setFilters(f => ({ ...f, work: v }))} />
            <FilterSection title="Occasion" options={occasionOptions} selected={filters.occasion} onSelect={(v) => setFilters(f => ({ ...f, occasion: v }))} />
            <FilterSection title="Size" options={sizeOptions} selected={filters.size} onSelect={(v) => setFilters(f => ({ ...f, size: v }))} />
            <FilterSection title="Price" options={priceOptions} selected={filters.price} onSelect={(v) => setFilters(f => ({ ...f, price: v }))} />
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 md:mb-8 border-b border-[#D4AF37]/15 pb-4 gap-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-[#1A0008] tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Our Collection</h2>
            <div className="flex items-center gap-3 sm:gap-4">
              <button onClick={() => setShowMobileFilter(true)} className="xl:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-[#D4AF37]/30 bg-white/50 text-[10px] font-bold uppercase tracking-widest text-[#1A0008]/80 hover:border-[#D4AF37] transition-all cursor-pointer">
                <Filter size={12} className="text-[#D4AF37]" /> Filters
              </button>
              <div className="flex items-center gap-2 border border-[#D4AF37]/30 px-3 sm:px-4 py-2 rounded-xl bg-white/50 cursor-pointer hover:border-[#D4AF37] transition-all">
                <ArrowUpDown size={12} className="text-[#D4AF37]" />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-[10px] font-bold uppercase tracking-widest bg-transparent focus:outline-none cursor-pointer text-[#1A0008]/80">
                  <option value="default">Default</option>
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
          
          {filteredProducts.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 md:py-24 bg-white/50 rounded-2xl md:rounded-3xl border border-dashed border-[#D4AF37]/30">
              <p className="text-lg md:text-xl font-light text-[#6B6B6B]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>No pieces match your current filters.</p>
              <button onClick={() => setFilters({ fabric: 'All', occasion: 'All', color: 'All', price: 'All' })} className="mt-4 text-[10px] font-bold tracking-[0.2em] uppercase text-[#D4AF37] hover:text-[#1A0008] border-b border-[#D4AF37]/40 pb-1 transition-colors">Reset All Filters</button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-6 sm:gap-y-10 [perspective:1000px]">
              {filteredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} favorites={favorites} toggleFavorite={toggleFavorite} addToCart={addToCart} setSelectedProduct={setSelectedProduct} setView={setView} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ═══════ MOBILE FILTER PANEL ═══════ */}
      <AnimatePresence>
        {showMobileFilter && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilter(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 xl:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[300px] max-w-[85vw] bg-white z-50 xl:hidden overflow-y-auto shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6 border-b border-[#D4AF37]/15 pb-4">
                  <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#1A0008]">Refine</h3>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setFilters({ fabric: 'All', occasion: 'All', color: 'All', price: 'All', size: 'All', work: 'All' })} className="text-[9px] uppercase font-bold tracking-wider text-[#D4AF37] hover:text-[#1A0008] transition-colors">Clear</button>
                    <button onClick={() => setShowMobileFilter(false)} className="text-[#1A0008] hover:text-[#D4AF37] transition-colors cursor-pointer">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                </div>
                <FilterSection title="Fabric" options={fabricOptions} selected={filters.fabric} onSelect={(v) => setFilters(f => ({ ...f, fabric: v }))} defaultOpen={true} />
                <FilterSection title="Color" options={colorOptions} selected={filters.color} onSelect={(v) => setFilters(f => ({ ...f, color: v }))} defaultOpen={true} />
                <FilterSection title="Work / Pattern" options={workOptions} selected={filters.work} onSelect={(v) => setFilters(f => ({ ...f, work: v }))} defaultOpen={true} />
                <FilterSection title="Occasion" options={occasionOptions} selected={filters.occasion} onSelect={(v) => setFilters(f => ({ ...f, occasion: v }))} defaultOpen={true} />
                <FilterSection title="Size" options={sizeOptions} selected={filters.size} onSelect={(v) => setFilters(f => ({ ...f, size: v }))} defaultOpen={true} />
                <FilterSection title="Price" options={priceOptions} selected={filters.price} onSelect={(v) => setFilters(f => ({ ...f, price: v }))} defaultOpen={true} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════ BRAND STORY FOOTER ═══════ */}
      <div className="border-t border-[#D4AF37]/15 bg-gradient-to-b from-white/30 to-[#F5F0E8] mt-8 md:mt-12 py-12 md:py-20 px-5 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
          className="max-w-[1000px] mx-auto text-center space-y-4 sm:space-y-6 bg-white/60 backdrop-blur-xl p-6 sm:p-10 md:p-16 rounded-[24px] sm:rounded-[40px] border border-[#D4AF37]/20 shadow-[0_20px_60px_rgba(188,165,138,0.15)]"
        >
          <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#D4AF37]">Our Heritage</span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-light text-[#1A0008]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>About {profile.name}</h2>
          <p className="text-xs sm:text-sm text-[#6B6B6B] leading-[1.8] max-w-2xl mx-auto">{profile.story || profile.description}</p>
          
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 pt-6 sm:pt-8 border-t border-[#D4AF37]/15 mt-6 sm:mt-8">
            <div className="text-center">
              <span className="block text-2xl sm:text-3xl font-light text-[#1A0008]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{profile.experience || '10+'}</span>
              <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Years Experience</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl sm:text-3xl font-light text-[#1A0008]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{profile.totalOrders || '10K+'}</span>
              <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Orders Delivered</span>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
