import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Phone, MapPin, Star, Filter, ArrowUpDown, ChevronDown, Check, ArrowLeft,
  ShoppingBag, Eye, Heart, ShieldCheck, Clock, Truck, RotateCcw,
  MessageCircle, Award, Users, BadgeCheck, X, ChevronUp, Sparkles, Play
} from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';
import { getAllProducts, getBoutiqueProfile } from '../utils/adminStore';

/* ─── ENHANCED BOUTIQUE DATA ─── */
const enhancedBoutiques = {
  'Badshah Designer Fabrics Silk Store': {
    name: 'Badshah Designer Fabrics Silk Store',
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
    story: 'Founded in 2008 in the heart of Ludhiana, Badshah Designer Fabrics Silk Store began as a small family-run boutique with a vision to bring authentic Punjabi silk craftsmanship to fashion-forward women across India. What started as a passion project between husband and wife duo Rajesh and Priya Sharma has now grown into one of the most trusted names in premium ethnic wear, serving over 25,000 happy customers worldwide.',
  },
};

/* ─── SVG BOUTIQUE FACADE ─── */
function BoutiqueFacade() {
  return (
    <div className="w-full h-full relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #F5E6D3 0%, #EDD9C4 30%, #E8CBAF 60%, #F0E0CC 100%)' }} />
      <div className="absolute top-[10%] right-[15%] w-32 h-32 rounded-full opacity-40" style={{ background: 'radial-gradient(circle, #FFE4B5 0%, transparent 70%)' }} />
      <svg viewBox="0 0 800 450" className="w-full h-full relative z-10" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="380" width="800" height="70" fill="#D4C4A8" />
        <rect x="0" y="375" width="800" height="8" fill="#C8B898" rx="2" />
        <rect x="50" y="120" width="180" height="260" fill="#E8D5BC" rx="3" />
        <rect x="55" y="115" width="170" height="10" fill="#BCA58A" rx="2" />
        <rect x="70" y="145" width="40" height="55" fill="#F5E6D3" rx="2" stroke="#BCA58A" strokeWidth="1.5" />
        <rect x="72" y="147" width="16" height="51" fill="#D4C4A8" rx="1" />
        <rect x="90" y="147" width="16" height="51" fill="#D4C4A8" rx="1" />
        <line x1="90" y1="145" x2="90" y2="200" stroke="#BCA58A" strokeWidth="0.8" />
        <rect x="170" y="145" width="40" height="55" fill="#F5E6D3" rx="2" stroke="#BCA58A" strokeWidth="1.5" />
        <rect x="172" y="147" width="16" height="51" fill="#D4C4A8" rx="1" />
        <rect x="190" y="147" width="16" height="51" fill="#D4C4A8" rx="1" />
        <line x1="190" y1="145" x2="190" y2="200" stroke="#BCA58A" strokeWidth="0.8" />
        <rect x="70" y="230" width="40" height="55" fill="#F5E6D3" rx="2" stroke="#BCA58A" strokeWidth="1.5" />
        <rect x="170" y="230" width="40" height="55" fill="#F5E6D3" rx="2" stroke="#BCA58A" strokeWidth="1.5" />
        <rect x="250" y="60" width="300" height="320" fill="#F0E0CC" rx="3" />
        <rect x="255" y="55" width="290" height="12" fill="#C8A882" rx="2" />
        <rect x="245" y="52" width="310" height="8" fill="#BCA58A" rx="2" />
        <rect x="260" y="42" width="280" height="15" fill="#D4C4A8" rx="3" />
        <rect x="290" y="75" width="220" height="65" fill="#1A1A1A" rx="4" />
        <rect x="295" y="80" width="210" height="55" fill="none" stroke="#BCA58A" strokeWidth="1.5" rx="3" />
        <text x="400" y="103" textAnchor="middle" fill="#BCA58A" fontSize="11" fontFamily="serif" fontWeight="600" letterSpacing="2">BADSHAH</text>
        <text x="400" y="116" textAnchor="middle" fill="#F5E6D3" fontSize="8" fontFamily="serif" letterSpacing="3">DESIGNER FABRICS</text>
        <text x="400" y="130" textAnchor="middle" fill="#BCA58A" fontSize="6" fontFamily="serif" letterSpacing="2">— EST. 2008 —</text>
        <path d="M 340 380 L 340 200 Q 400 155 460 200 L 460 380 Z" fill="#2A1F14" />
        <path d="M 345 380 L 345 205 Q 400 165 455 205 L 455 380 Z" fill="#1A1208" />
        <rect x="350" y="210" width="45" height="165" fill="#3D2E1C" rx="2" opacity="0.7" />
        <rect x="405" y="210" width="45" height="165" fill="#3D2E1C" rx="2" opacity="0.7" />
        <rect x="392" y="270" width="3" height="30" fill="#BCA58A" rx="1.5" />
        <rect x="405" y="270" width="3" height="30" fill="#BCA58A" rx="1.5" />
        <ellipse cx="400" cy="350" rx="60" ry="15" fill="#FFE4B5" opacity="0.2" />
        <rect x="270" y="165" width="55" height="70" fill="#F5E6D3" rx="3" stroke="#BCA58A" strokeWidth="1.5" />
        <rect x="273" y="168" width="23" height="64" fill="#D4C4A8" rx="1" />
        <rect x="298" y="168" width="23" height="64" fill="#D4C4A8" rx="1" />
        <line x1="297" y1="165" x2="297" y2="235" stroke="#BCA58A" strokeWidth="0.8" />
        <rect x="475" y="165" width="55" height="70" fill="#F5E6D3" rx="3" stroke="#BCA58A" strokeWidth="1.5" />
        <rect x="478" y="168" width="23" height="64" fill="#D4C4A8" rx="1" />
        <rect x="503" y="168" width="23" height="64" fill="#D4C4A8" rx="1" />
        <line x1="502" y1="165" x2="502" y2="235" stroke="#BCA58A" strokeWidth="0.8" />
        <rect x="570" y="120" width="180" height="260" fill="#E8D5BC" rx="3" />
        <rect x="575" y="115" width="170" height="10" fill="#BCA58A" rx="2" />
        <rect x="590" y="145" width="40" height="55" fill="#F5E6D3" rx="2" stroke="#BCA58A" strokeWidth="1.5" />
        <rect x="690" y="145" width="40" height="55" fill="#F5E6D3" rx="2" stroke="#BCA58A" strokeWidth="1.5" />
        <rect x="590" y="230" width="40" height="55" fill="#F5E6D3" rx="2" stroke="#BCA58A" strokeWidth="1.5" />
        <rect x="690" y="230" width="40" height="55" fill="#F5E6D3" rx="2" stroke="#BCA58A" strokeWidth="1.5" />
        <rect x="120" y="345" width="22" height="30" fill="#8B6F47" rx="3" />
        <circle cx="131" cy="335" r="18" fill="#5B8C5A" opacity="0.8" />
        <circle cx="124" cy="330" r="12" fill="#6B9E6A" opacity="0.7" />
        <circle cx="138" cy="328" r="14" fill="#4A7C4A" opacity="0.7" />
        <rect x="658" y="345" width="22" height="30" fill="#8B6F47" rx="3" />
        <circle cx="669" cy="335" r="18" fill="#5B8C5A" opacity="0.8" />
        <circle cx="662" cy="330" r="12" fill="#6B9E6A" opacity="0.7" />
        <circle cx="676" cy="328" r="14" fill="#4A7C4A" opacity="0.7" />
        <rect x="310" y="348" width="18" height="27" fill="#8B6F47" rx="2" />
        <circle cx="319" cy="340" r="13" fill="#5B8C5A" opacity="0.8" />
        <rect x="472" y="348" width="18" height="27" fill="#8B6F47" rx="2" />
        <circle cx="481" cy="340" r="13" fill="#5B8C5A" opacity="0.8" />
        <rect x="325" y="185" width="8" height="18" fill="#BCA58A" rx="2" />
        <circle cx="329" cy="183" r="5" fill="#D4A853" opacity="0.6" />
        <rect x="467" y="185" width="8" height="18" fill="#BCA58A" rx="2" />
        <circle cx="471" cy="183" r="5" fill="#D4A853" opacity="0.6" />
        <rect x="271" y="166" width="53" height="68" fill="#FFE4B5" opacity="0.08" rx="2" />
        <rect x="476" y="166" width="53" height="68" fill="#FFE4B5" opacity="0.08" rx="2" />
      </svg>
    </div>
  );
}

/* ─── PRODUCT CARD ─── */
function ProductCard({ product, index, favorites, toggleFavorite, addToCart, setSelectedProduct, setView }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={() => { setSelectedProduct(product); setView('product-details'); }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F0E8DC] mb-4">
        <img src={product.image} alt={product.name} onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-[1.06] ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.badge && (
            <span className="bg-[#FAF9F6]/95 backdrop-blur-sm text-[#111111] text-[9px] font-semibold tracking-[0.15em] uppercase px-3 py-1.5 border border-[#BCA58A]/20 shadow-sm">{product.badge}</span>
          )}
          {product.collection === 'New Arrivals' && (
            <span className="bg-[#BCA58A] text-[#FAF9F6] text-[9px] font-semibold tracking-[0.15em] uppercase px-3 py-1.5 shadow-sm">New Arrival</span>
          )}
          {product.collection === 'Trending' && (
            <span className="bg-[#111111] text-[#FAF9F6] text-[9px] font-semibold tracking-[0.15em] uppercase px-3 py-1.5 shadow-sm flex items-center gap-1"><Sparkles size={10} /> Trending</span>
          )}
        </div>
        <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
          className={`absolute top-4 right-4 p-2.5 rounded-full border transition-all duration-300 z-20 cursor-pointer ${
            favorites[product.id] ? 'bg-[#BCA58A] text-white border-transparent shadow-lg' : 'bg-[#FAF9F6]/90 text-[#111111]/60 border-[#BCA58A]/20 hover:border-[#BCA58A] hover:text-[#BCA58A] backdrop-blur-sm'
          }`}>
          <Heart size={14} className={favorites[product.id] ? 'fill-current' : ''} />
        </button>
        <div className="absolute inset-x-0 bottom-0 p-4 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-10">
          <button onClick={(e) => { e.stopPropagation(); setSelectedProduct(product); setView('product-details'); }}
            className="flex-1 bg-[#FAF9F6]/95 backdrop-blur-sm hover:bg-[#111111] hover:text-[#FAF9F6] text-[#111111] text-[9px] font-bold tracking-[0.2em] uppercase py-3 flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer border border-[#BCA58A]/20">
            <Eye size={12} /> Quick View
          </button>
          <button onClick={(e) => { e.stopPropagation(); addToCart(product, 'M'); }}
            className="flex-1 bg-[#BCA58A] hover:bg-[#111111] text-[#FAF9F6] text-[9px] font-bold tracking-[0.2em] uppercase py-3 flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer">
            <ShoppingBag size={12} /> Add to Bag
          </button>
        </div>
        {product.videoUrl && (
          <div className="absolute bottom-4 right-4 p-2 bg-[#111111]/60 backdrop-blur-sm rounded-full text-white z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Play size={12} className="fill-current" />
          </div>
        )}
      </div>
      <div className="space-y-2 px-1">
        <h3 className="text-[15px] font-light text-[#111111]/80 group-hover:text-[#111111] transition-colors duration-300 leading-snug line-clamp-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{product.name}</h3>
        <p className="text-[13px] font-light text-[#BCA58A]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{product.price}</p>
      </div>
    </motion.div>
  );
}

/* ─── FILTER ─── */
function FilterSection({ title, options, selected, onSelect }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-[#BCA58A]/10 pb-4 mb-4">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-2 group cursor-pointer">
        <span className="text-[10px] tracking-[0.2em] uppercase text-[#111111]/70 font-semibold">{title}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={13} className="text-[#BCA58A]/60" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="flex flex-col gap-1.5 pt-2">
              {options.map((opt) => (
                <button key={opt.value} onClick={() => onSelect(opt.value)}
                  className={`text-left text-[11px] py-2 px-3 transition-all duration-300 flex items-center justify-between font-medium cursor-pointer ${
                    selected === opt.value ? 'text-[#BCA58A] bg-[#BCA58A]/5' : 'text-[#111111]/50 hover:text-[#111111]/70 hover:bg-[#BCA58A]/3'
                  }`}>
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
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [filters, setFilters] = useState({ fabric: 'All', occasion: 'All', color: 'All', price: 'All', availability: 'All' });

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const prof = getBoutiqueProfile(boutiqueName);
    setProfile(enhancedBoutiques[boutiqueName] || prof);
    const allProds = getAllProducts();
    const boutiqueProds = allProds.filter(p => p.boutique && boutiqueName && p.boutique.trim().toLowerCase() === boutiqueName.trim().toLowerCase());
    setProducts(boutiqueProds);
    setFilteredProducts(boutiqueProds);
    const savedFavs = localStorage.getItem('gurnaaz_favorites');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, [boutiqueName]);

  const fabricOptions = [
    { value: 'All', label: 'All Fabrics' }, { value: 'silk', label: 'Silk' }, { value: 'cotton', label: 'Cotton' },
    { value: 'georgette', label: 'Georgette' }, { value: 'organza', label: 'Organza' }, { value: 'velvet', label: 'Velvet' },
    { value: 'chanderi', label: 'Chanderi' }, { value: 'banarasi', label: 'Banarasi' },
  ];
  const occasionOptions = [
    { value: 'All', label: 'All Occasions' }, { value: 'wedding', label: 'Wedding' }, { value: 'festive', label: 'Festive' },
    { value: 'party', label: 'Party' }, { value: 'casual', label: 'Casual' }, { value: 'daily', label: 'Daily Wear' },
  ];
  const colorOptions = [
    { value: 'All', label: 'All Colors' }, { value: 'red', label: 'Red' }, { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' }, { value: 'gold', label: 'Gold' }, { value: 'black', label: 'Black' },
    { value: 'pink', label: 'Pink' },
  ];
  const priceOptions = [
    { value: 'All', label: 'All Prices' }, { value: 'under3', label: 'Under ₹3,000' },
    { value: '3to6', label: '₹3,000 – ₹6,000' }, { value: '6to10', label: '₹6,000 – ₹10,000' },
    { value: 'over10', label: 'Above ₹10,000' },
  ];
  const availabilityOptions = [
    { value: 'All', label: 'All' }, { value: 'instock', label: 'In Stock' }, { value: 'lowstock', label: 'Low Stock' },
  ];

  useEffect(() => {
    let result = [...products];
    if (filters.fabric !== 'All') result = result.filter(p => ((p.fabricName || '') + ' ' + (p.suitType || '')).toLowerCase().includes(filters.fabric.toLowerCase()));
    if (filters.occasion !== 'All') result = result.filter(p => (p.occasions || []).some(o => o.toLowerCase().includes(filters.occasion.toLowerCase())));
    if (filters.price !== 'All') {
      result = result.filter(p => {
        const priceNum = typeof p.price === 'string' ? parseInt(p.price.replace(/[^\d]/g, '')) : (p.priceNum || 0);
        if (filters.price === 'under3') return priceNum < 3000;
        if (filters.price === '3to6') return priceNum >= 3000 && priceNum <= 6000;
        if (filters.price === '6to10') return priceNum > 6000 && priceNum <= 10000;
        if (filters.price === 'over10') return priceNum > 10000;
        return true;
      });
    }
    if (sortBy === 'price-low') result.sort((a, b) => (typeof a.price === 'string' ? parseInt(a.price.replace(/[^\d]/g, '')) : a.priceNum || 0) - (typeof b.price === 'string' ? parseInt(b.price.replace(/[^\d]/g, '')) : b.priceNum || 0));
    else if (sortBy === 'price-high') result.sort((a, b) => (typeof b.price === 'string' ? parseInt(b.price.replace(/[^\d]/g, '')) : b.priceNum || 0) - (typeof a.price === 'string' ? parseInt(a.price.replace(/[^\d]/g, '')) : a.priceNum || 0));
    else if (sortBy === 'newest') result.sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0));
    setFilteredProducts(result);
  }, [products, filters, sortBy]);

  const toggleFavorite = (id) => {
    const updated = { ...favorites, [id]: !favorites[id] };
    setFavorites(updated);
    localStorage.setItem('gurnaaz_favorites', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('favorites-updated'));
  };

  if (!profile) return null;
  const activeFilters = Object.values(filters).filter(v => v !== 'All').length;

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#111111] overflow-hidden">

      {/* ═══════ HERO ═══════ */}
      <div ref={heroRef} className="relative h-[75vh] md:h-[85vh] w-full overflow-hidden">
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          {profile.coverImage ? (
            <img src={profile.coverImage} alt={profile.name} className="w-full h-full object-cover object-center filter brightness-[0.82]" />
          ) : (
            <BoutiqueFacade />
          )}
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/40 via-[#111111]/10 to-[#FAF9F6]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/30 to-transparent" />
        <button onClick={() => window.location.href = '/sell'}
          className="absolute top-8 left-6 md:left-12 z-30 flex items-center gap-2 bg-[#FAF9F6]/90 hover:bg-[#FAF9F6] text-[#111111] text-[9px] uppercase tracking-[0.2em] px-5 py-2.5 backdrop-blur-md shadow-lg transition-all duration-300 cursor-pointer border border-[#BCA58A]/15">
          <ArrowLeft size={12} /> Back to Home
        </button>
        <motion.div style={{ opacity: heroOpacity }} className="absolute inset-0 flex items-end pb-16 md:pb-20 px-6 md:px-16">
          <div className="max-w-[1400px] mx-auto w-full">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} className="space-y-5">
              <div className="flex items-center gap-3">
                <span className="text-[9px] tracking-[0.3em] text-[#FAF9F6]/70 uppercase font-medium border border-[#FAF9F6]/20 px-4 py-1.5 backdrop-blur-sm">Est. {profile.established || 2008}</span>
                <span className="text-[9px] tracking-[0.3em] text-[#BCA58A] uppercase font-semibold bg-[#BCA58A]/20 backdrop-blur-sm px-4 py-1.5 border border-[#BCA58A]/30 flex items-center gap-1.5"><BadgeCheck size={11} /> Verified Seller</span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-[#FAF9F6] leading-[0.95] tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{profile.name}</h1>
              <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-2">
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} className={profile.rating >= i + 1 ? 'fill-amber-400 text-amber-400' : 'text-white/30'} />)}
                  <span className="text-xs font-semibold text-[#FAF9F6]/80 ml-1">({profile.rating})</span>
                </div>
                <span className="w-px h-4 bg-white/20" />
                <span className="text-[11px] text-[#FAF9F6]/60 font-medium tracking-wide">{profile.totalOrders || '25,000+'} Orders</span>
                <span className="w-px h-4 bg-white/20" />
                <span className="text-[11px] text-[#FAF9F6]/60 font-medium tracking-wide flex items-center gap-1.5"><MapPin size={12} /> {profile.address?.split(',').slice(-2).join(',')}</span>
                <span className="w-px h-4 bg-white/20" />
                <span className="text-[11px] text-[#FAF9F6]/60 font-medium tracking-wide flex items-center gap-1.5"><ShieldCheck size={12} className="text-[#BCA58A]" /> GST Verified</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ═══════ SHOP INFO CARD ═══════ */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 -mt-12 relative z-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-[#FAF9F6]/80 backdrop-blur-xl border border-[#BCA58A]/15 shadow-[0_8px_40px_rgba(0,0,0,0.08)] rounded-2xl p-6 md:p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            <div className="flex-1 space-y-6">
              <div className="flex items-start gap-5">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-[#BCA58A]/20 shadow-lg flex-shrink-0">
                  <img src={profile.logo || profile.coverImage} alt={profile.name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-light text-[#111111]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{profile.name}</h2>
                  {profile.owner && <p className="text-[11px] text-[#111111]/50 font-medium tracking-wide">Owned by {profile.owner}</p>}
                  <p className="text-sm text-[#6B6B6B] leading-relaxed max-w-xl">{profile.welcomeMessage || profile.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  { icon: Users, label: 'Owner', value: profile.owner || 'Family Owned' },
                  { icon: Clock, label: 'Experience', value: profile.experience || '15+ Years' },
                  { icon: ShieldCheck, label: 'GST', value: profile.gstVerified ? 'Verified' : 'Registered' },
                  { icon: Clock, label: 'Response', value: profile.responseTime || 'Within 1 hour' },
                  { icon: Truck, label: 'Shipping', value: profile.shippingTime || '2-4 Days' },
                  { icon: RotateCcw, label: 'Returns', value: profile.returnPolicy || '7-Day Returns' },
                  { icon: Award, label: 'Total Orders', value: profile.totalOrders || '25,000+' },
                  { icon: Star, label: 'Rating', value: `${profile.rating || 4.8} / 5.0` },
                ].map((stat, i) => (
                  <div key={i} className="p-3 bg-[#F5F0E8]/50 border border-[#BCA58A]/8 rounded-xl flex items-start gap-2.5">
                    <div className="p-2 bg-[#BCA58A]/8 rounded-lg"><stat.icon size={14} className="text-[#BCA58A]" /></div>
                    <div>
                      <span className="text-[9px] tracking-wider uppercase text-[#6B6B6B] font-semibold block">{stat.label}</span>
                      <span className="text-[11px] text-[#111111] font-semibold">{stat.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-72 flex flex-col gap-3 flex-shrink-0">
              <a href={`https://wa.me/${(profile.whatsapp || '919876543210').replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1DA851] text-white py-3.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl cursor-pointer">
                <MessageCircle size={15} /> Chat on WhatsApp
              </a>
              <a href={`tel:${(profile.contact || '+919876543210').replace(/[^0-9+]/g, '')}`}
                className="flex items-center justify-center gap-2.5 bg-[#111111] hover:bg-[#BCA58A] text-[#FAF9F6] py-3.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl cursor-pointer">
                <Phone size={15} /> Call Seller
              </a>
              {profile.instagramUrl && (
                <a href={profile.instagramUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white py-3.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl cursor-pointer">
                  <FaInstagram size={15} /> Follow on Instagram
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══════ PRODUCTS ═══════ */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 mt-16 md:mt-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
          <div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-light text-[#111111] tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Our Collection</motion.h2>
            <p className="text-[11px] text-[#6B6B6B] mt-1.5 tracking-wide">{filteredProducts.length} pieces curated with love</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ArrowUpDown size={12} className="text-[#BCA58A]" />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-b border-[#BCA58A]/30 focus:border-[#BCA58A] text-[11px] font-semibold py-1 focus:outline-none cursor-pointer pr-4 appearance-none text-[#111111]/70">
                <option value="default">Default</option>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
              </select>
            </div>
            <button onClick={() => setFilterDrawerOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-[#BCA58A]/20 hover:border-[#BCA58A] text-[11px] font-semibold tracking-wider uppercase transition-colors cursor-pointer rounded-lg">
              <Filter size={13} className="text-[#BCA58A]" /> Filters
              {activeFilters > 0 && <span className="bg-[#BCA58A] text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{activeFilters}</span>}
            </button>
          </div>
        </div>
        <div className="flex gap-10">
          {/* Desktop sidebar */}
          <div className="hidden xl:block w-64 flex-shrink-0">
            <div className="sticky top-32 space-y-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] tracking-[0.25em] uppercase text-[#111111] font-semibold">Refine</h3>
                {activeFilters > 0 && (
                  <button onClick={() => setFilters({ fabric: 'All', occasion: 'All', color: 'All', price: 'All', availability: 'All' })}
                    className="text-[9px] tracking-wider text-[#BCA58A] hover:text-[#111111] uppercase font-semibold cursor-pointer">Clear all</button>
                )}
              </div>
              <FilterSection title="Fabric" options={fabricOptions} selected={filters.fabric} onSelect={(v) => setFilters(f => ({ ...f, fabric: v }))} />
              <FilterSection title="Occasion" options={occasionOptions} selected={filters.occasion} onSelect={(v) => setFilters(f => ({ ...f, occasion: v }))} />
              <FilterSection title="Color" options={colorOptions} selected={filters.color} onSelect={(v) => setFilters(f => ({ ...f, color: v }))} />
              <FilterSection title="Price Range" options={priceOptions} selected={filters.price} onSelect={(v) => setFilters(f => ({ ...f, price: v }))} />
              <FilterSection title="Availability" options={availabilityOptions} selected={filters.availability} onSelect={(v) => setFilters(f => ({ ...f, availability: v }))} />
            </div>
          </div>
          {/* Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-24 border border-dashed border-[#BCA58A]/20 rounded-2xl bg-white/30">
                <p className="text-lg font-light text-[#6B6B6B] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>No pieces match your current filters</p>
                <button onClick={() => { setFilters({ fabric: 'All', occasion: 'All', color: 'All', price: 'All', availability: 'All' }); setSortBy('default'); }}
                  className="text-[10px] font-bold tracking-[0.2em] text-[#BCA58A] hover:text-[#111111] uppercase border-b border-[#BCA58A]/40 pb-1 transition-colors cursor-pointer">Reset All Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {filteredProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} favorites={favorites} toggleFavorite={toggleFavorite}
                    addToCart={addToCart} setSelectedProduct={setSelectedProduct} setView={setView} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════ ABOUT ═══════ */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-24 md:mt-32">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl"><BoutiqueFacade /></div>
          <div className="space-y-6">
            <span className="text-[9px] tracking-[0.3em] text-[#BCA58A] uppercase font-semibold">Our Story</span>
            <h2 className="text-4xl md:text-5xl font-light text-[#111111] leading-tight tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>A Legacy of Craftsmanship</h2>
            <p className="text-sm text-[#6B6B6B] leading-[1.8]">{profile.story || profile.description}</p>
            <div className="flex flex-wrap gap-4 pt-2">
              {profile.instagramUrl && (
                <a href={profile.instagramUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#BCA58A] hover:text-[#111111] border-b border-[#BCA58A]/40 pb-1 transition-colors cursor-pointer">
                  <FaInstagram size={13} /> Our Instagram
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══════ REVIEWS ═══════ */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-24 md:mt-32 mb-16">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }}
          className="text-center mb-12">
          <span className="text-[9px] tracking-[0.3em] text-[#BCA58A] uppercase font-semibold">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-light text-[#111111] mt-2 tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>What Our Customers Say</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Ananya Sharma', location: 'Delhi', rating: 5, text: 'Absolutely stunning collection! The silk quality is unmatched. Badshah Designer Fabrics never disappoints. This is my go-to boutique for all festive occasions.', avatar: 'A' },
            { name: 'Priyanka Mehta', location: 'Mumbai', rating: 5, text: 'Ordered a Banarasi suit set for my sister\'s wedding. The craftsmanship is exquisite and the delivery was super fast. Highly recommended!', avatar: 'P' },
            { name: 'Kavita Singh', location: 'Bangalore', rating: 4, text: 'Beautiful fabrics and attention to detail. The customer service is exceptional — they helped me pick the perfect outfit for Karva Chauth.', avatar: 'K' },
          ].map((review, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }}
              className="bg-white/50 border border-[#BCA58A]/10 p-6 md:p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#E8DDD0] flex items-center justify-center text-sm font-semibold text-[#111111]">{review.avatar}</div>
                <div>
                  <h4 className="text-xs font-semibold text-[#111111]">{review.name}</h4>
                  <p className="text-[9px] text-[#6B6B6B] tracking-wider">{review.location}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => <Star key={j} size={12} className={j < review.rating ? 'fill-amber-400 text-amber-400' : 'text-[#E0D8CC]'} />)}
              </div>
              <p className="text-xs text-[#6B6B6B] leading-relaxed">"{review.text}"</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ═══════ MOBILE FILTER DRAWER ═══════ */}
      <AnimatePresence>
        {filterDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFilterDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#FAF9F6] z-50 shadow-2xl flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-[#BCA58A]/10">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#111111]">Refine Selection</h3>
                <button onClick={() => setFilterDrawerOpen(false)} className="p-2 hover:bg-[#BCA58A]/5 rounded-lg transition-colors cursor-pointer">
                  <X size={18} className="text-[#6B6B6B]" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-0">
                <FilterSection title="Fabric" options={fabricOptions} selected={filters.fabric} onSelect={(v) => setFilters(f => ({ ...f, fabric: v }))} />
                <FilterSection title="Occasion" options={occasionOptions} selected={filters.occasion} onSelect={(v) => setFilters(f => ({ ...f, occasion: v }))} />
                <FilterSection title="Color" options={colorOptions} selected={filters.color} onSelect={(v) => setFilters(f => ({ ...f, color: v }))} />
                <FilterSection title="Price Range" options={priceOptions} selected={filters.price} onSelect={(v) => setFilters(f => ({ ...f, price: v }))} />
                <FilterSection title="Availability" options={availabilityOptions} selected={filters.availability} onSelect={(v) => setFilters(f => ({ ...f, availability: v }))} />
              </div>
              <div className="p-6 border-t border-[#BCA58A]/10 space-y-3">
                <button onClick={() => setFilterDrawerOpen(false)}
                  className="w-full bg-[#111111] hover:bg-[#BCA58A] text-[#FAF9F6] py-3.5 text-[10px] font-bold tracking-[0.25em] uppercase transition-colors cursor-pointer rounded-xl">
                  Show {filteredProducts.length} Results
                </button>
                <button onClick={() => { setFilters({ fabric: 'All', occasion: 'All', color: 'All', price: 'All', availability: 'All' }); setFilterDrawerOpen(false); }}
                  className="w-full text-center text-[10px] text-[#BCA58A] hover:text-[#111111] font-bold tracking-wider uppercase cursor-pointer py-2">Clear All Filters</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
