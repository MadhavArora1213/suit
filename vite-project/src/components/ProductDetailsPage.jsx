import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Star, Heart, ShoppingBag, ChevronDown, ChevronUp, Check,
  ShieldCheck, Truck, RefreshCw, Send, Ruler, Play, Pause, Volume2, VolumeX, X,
  Video, MessageCircle, Phone, Clock, BadgeCheck, ChevronLeft, ChevronRight
} from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';
import { getReviews, addReview, syncProductReviews, getAllProducts, getBoutiqueProfile } from '../utils/adminStore';

/* ─── IMAGE SLIDER ─── */
function ImageSlider({ images, badge, videoUrl, reelUrl, onReelOpen }) {
  const [current, setCurrent] = useState(0);
  const [isVideo, setIsVideo] = useState(false);
  const touchStart = useRef(null);
  const touchEnd = useRef(null);

  const next = () => {
    if (isVideo) { setIsVideo(false); }
    setCurrent((prev) => (prev + 1) % images.length);
  };
  const prev = () => {
    if (isVideo) { setIsVideo(false); }
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };
  const goTo = (i) => { setIsVideo(false); setCurrent(i); };

  // Swipe support
  const minSwipe = 50;
  const onTouchStart = (e) => { touchEnd.current = null; touchStart.current = e.targetTouches[0].clientX; };
  const onTouchMove = (e) => { touchEnd.current = e.targetTouches[0].clientX; };
  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const dist = touchStart.current - touchEnd.current;
    if (dist > minSwipe) next();
    if (dist < -minSwipe) prev();
  };

  return (
    <div className="w-full">
      {/* Main image area */}
      <div className="relative w-full aspect-[4/5] bg-[#F0E8DC] overflow-hidden rounded-xl"
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>

        <AnimatePresence mode="wait">
          {isVideo && videoUrl ? (
            <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0">
              <video src={videoUrl} controls autoPlay playsInline loop muted
                className="w-full h-full object-cover" />
            </motion.div>
          ) : (
            <motion.img key={current} src={images[current]} alt=""
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 w-full h-full object-cover object-top" />
          )}
        </AnimatePresence>

        {/* Badge */}
        {badge && (
          <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-[#111111] text-[8px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 shadow-sm z-10">
            {badge}
          </span>
        )}

        {/* Arrow buttons */}
        <button onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#111111]/60 hover:text-[#111111] hover:bg-white transition-all z-20 cursor-pointer shadow-sm">
          <ChevronLeft size={18} />
        </button>
        <button onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#111111]/60 hover:text-[#111111] hover:bg-white transition-all z-20 cursor-pointer shadow-sm">
          <ChevronRight size={18} />
        </button>

        {/* Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium px-3 py-1 rounded-full z-20">
          {isVideo ? 'Video' : `${current + 1} / ${images.length}`}
        </div>
      </div>

      {/* Thumbnails row */}
      <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
        {images.map((img, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`w-16 h-20 flex-shrink-0 overflow-hidden rounded-lg transition-all cursor-pointer ${
              current === i && !isVideo
                ? 'ring-2 ring-[#BCA58A] ring-offset-1 ring-offset-[#FAF9F6]'
                : 'opacity-50 hover:opacity-100'
            }`}>
            <img src={img} alt="" className="w-full h-full object-cover object-top" />
          </button>
        ))}

        {/* Video thumbnail */}
        {videoUrl && (
          <button onClick={() => setIsVideo(true)}
            className={`w-16 h-20 flex-shrink-0 overflow-hidden rounded-lg cursor-pointer flex items-center justify-center relative ${
              isVideo ? 'ring-2 ring-[#BCA58A] ring-offset-1 ring-offset-[#FAF9F6]' : 'opacity-50 hover:opacity-100'
            }`}>
            <div className="absolute inset-0 bg-[#111111]/60 z-10 flex items-center justify-center">
              <Play size={16} className="text-white fill-white" />
            </div>
            <video src={videoUrl} className="w-full h-full object-cover pointer-events-none" muted />
          </button>
        )}

        {/* Reel thumbnail */}
        {reelUrl && (
          <button onClick={onReelOpen}
            className="w-16 h-20 flex-shrink-0 overflow-hidden rounded-lg cursor-pointer relative border border-[#BCA58A]/15">
            <div className="absolute inset-0 bg-gradient-to-b from-[#833AB4]/40 via-[#FD1D1D]/30 to-[#F77737]/40 z-10" />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center">
                <Play size={10} className="text-[#111111] fill-[#111111] ml-0.5" />
              </div>
            </div>
            <div className="absolute bottom-1 left-1 z-20">
              <FaInstagram size={8} className="text-white" />
            </div>
            <video src={reelUrl} muted loop className="w-full h-full object-cover pointer-events-none" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function ProductDetailsPage({ product, setView, setSelectedCategory, setSelectedBoutique, addToCart, favorites = {}, toggleFavorite }) {
  const [selectedSize, setSelectedSize] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [reviewsList, setReviewsList] = useState([]);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [openAccordions, setOpenAccordions] = useState({ details: true, fabric: false, shipping: false, care: false });
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [reelOpen, setReelOpen] = useState(false);
  const [reelMuted, setReelMuted] = useState(true);
  const [reelProgress, setReelProgress] = useState(0);
  const [reelPlaying, setReelPlaying] = useState(true);
  const reelVideoRef = useRef(null);

  const handleTimeUpdate = () => {
    if (reelVideoRef.current) {
      setReelProgress((reelVideoRef.current.currentTime / reelVideoRef.current.duration) * 100 || 0);
    }
  };
  const toggleReelPlay = () => {
    if (reelVideoRef.current) {
      reelPlaying ? reelVideoRef.current.pause() : reelVideoRef.current.play().catch(() => {});
      setReelPlaying(!reelPlaying);
    }
  };

  useEffect(() => {
    if (!reelOpen) { setReelPlaying(false); } else { setReelPlaying(true); setReelProgress(0); }
  }, [reelOpen]);

  useEffect(() => {
    if (product?.id) {
      setReviewsList(getReviews(product.id));
      setActiveImageIndex(0);
      setSelectedSize('');
      syncProductReviews(product.id, (r) => setReviewsList(r));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  if (!product) {
    return <div className="py-32 text-center"><p className="text-sm text-[#6B6B6B]">Loading...</p>
      <button onClick={() => setView('home')} className="mt-4 text-xs underline font-bold cursor-pointer">Go Home</button></div>;
  }

  const allImages = [product.image, ...(product.additionalImages || [])].filter(Boolean);
  const toggleAccordion = (s) => setOpenAccordions(p => ({ ...p, [s]: !p[s] }));
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) { alert('Please fill in Name and Review.'); return; }
    addReview(product.id, { name: reviewName, rating: reviewRating, review: reviewComment });
    setReviewsList(getReviews(product.id));
    setReviewName(''); setReviewComment(''); setReviewRating(5);
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 2500);
  };

  const isFavorite = favorites[product.id];
  const avgRating = reviewsList.length > 0
    ? (reviewsList.reduce((s, r) => s + r.rating, 0) / reviewsList.length).toFixed(1)
    : product.rating || '4.5';
  const sizes = product.sizes?.length ? product.sizes : ['S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)'];
  const allProducts = getAllProducts();
  const similarProducts = allProducts.filter(p => p.id !== product.id && (p.boutique === product.boutique || p.type === product.type)).slice(0, 4);

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#111111] pt-24 pb-20" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* SIZE GUIDE MODAL */}
      <AnimatePresence>
        {sizeGuideOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSizeGuideOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-[#FAF9F6] p-8 max-w-lg w-full shadow-2xl z-10 rounded-2xl text-left border border-[#BCA58A]/20">
              <button onClick={() => setSizeGuideOpen(false)} className="absolute top-4 right-4 cursor-pointer"><X size={18} className="text-[#6B6B6B]" /></button>
              <h3 className="text-2xl font-light mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Size Guide</h3>
              <p className="text-xs text-[#6B6B6B] mb-6">Standard body measurements in inches.</p>
              <table className="w-full text-xs border-collapse">
                <thead><tr className="border-b border-[#BCA58A]/15">
                  <th className="p-2.5 text-left font-bold uppercase tracking-wider text-[9px]">Size</th>
                  <th className="p-2.5 text-left font-bold uppercase tracking-wider text-[9px]">Bust</th>
                  <th className="p-2.5 text-left font-bold uppercase tracking-wider text-[9px]">Waist</th>
                  <th className="p-2.5 text-left font-bold uppercase tracking-wider text-[9px]">Hips</th>
                </tr></thead>
                <tbody className="divide-y divide-[#BCA58A]/8">
                  {[{ s: 'S (36)', b: '36"', w: '32"', h: '39"' }, { s: 'M (38)', b: '38"', w: '34"', h: '41"' },
                    { s: 'L (40)', b: '40"', w: '36"', h: '43"' }, { s: 'XL (42)', b: '42"', w: '38"', h: '45"' },
                    { s: 'XXL (44)', b: '44"', w: '40"', h: '47"' }
                  ].map(r => <tr key={r.s} className="hover:bg-[#E8DDD0]/10">
                    <td className="p-2.5 font-semibold">{r.s}</td><td className="p-2.5">{r.b}</td><td className="p-2.5">{r.w}</td><td className="p-2.5">{r.h}</td>
                  </tr>)}
                </tbody>
              </table>
              <p className="text-[10px] text-[#6B6B6B] mt-4 leading-relaxed">Order one size larger if between sizes.</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-[1200px] mx-auto px-6 md:px-10">

        {/* BREADCRUMB */}
        <div className="mb-6">
          <button onClick={() => {
            if (product.boutique) { setSelectedBoutique(product.boutique); setView('seller-shop'); }
            else if (product.type) { setSelectedCategory(product.type); setView('category'); }
            else setView('home');
          }} className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] text-[#BCA58A] hover:text-[#111111] uppercase font-semibold transition-colors cursor-pointer">
            <ArrowLeft size={12} /> Back to {product.boutique || 'Collection'}
          </button>
        </div>

        {/* PRODUCT — 2 column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* LEFT: SLIDER */}
          <ImageSlider
            images={allImages}
            badge={product.badge}
            videoUrl={product.videoUrl}
            reelUrl={product.reelUrl}
            onReelOpen={() => setReelOpen(true)}
          />

          {/* RIGHT: INFO */}
          <div className="space-y-5 text-left">
            {/* Boutique tag */}
            <button onClick={() => { setSelectedBoutique(product.boutique); setView('seller-shop'); }}
              className="inline-flex items-center gap-1.5 text-[#BCA58A] text-[8px] font-bold tracking-[0.2em] uppercase border border-[#BCA58A]/20 px-3 py-1 rounded-lg hover:bg-[#BCA58A] hover:text-white transition-all cursor-pointer">
              <BadgeCheck size={10} /> {product.boutique}
            </button>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-light leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={13} className={parseFloat(avgRating) >= i + 1 ? 'fill-amber-400 text-amber-400' : 'text-[#E0D8CC]'} />)}
              </div>
              <span className="text-xs font-semibold text-[#111111]/50">{avgRating}</span>
              <span className="text-[10px] text-[#BCA58A] font-semibold">({reviewsList.length} reviews)</span>
            </div>

            {/* Price */}
            <div className="py-3 border-y border-[#BCA58A]/8">
              <p className="text-2xl font-light text-[#BCA58A]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{product.price}</p>
              <p className="text-[9px] text-[#6B6B6B] uppercase font-semibold tracking-wider mt-0.5">Inclusive of all taxes · Free shipping</p>
            </div>

            {/* Description */}
            <p className="text-[12px] text-[#6B6B6B] leading-relaxed">
              {product.shortDesc || 'Handcrafted designer salwar suit set with elegant details and luxurious fabrics.'}
            </p>

            {/* Colors */}
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-[0.2em] text-[#6B6B6B] font-bold">Color</label>
              <div className="flex gap-2.5">
                {['#1A1A1A', '#BCA58A', '#8B2252', '#2E4057', '#5B8C5A', '#D4A853'].map((c) => (
                  <div key={c} className="w-7 h-7 rounded-full border border-[#BCA58A]/15 hover:scale-110 transition-transform cursor-pointer" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[9px] uppercase tracking-[0.2em] text-[#6B6B6B] font-bold">Size</label>
                <button onClick={() => setSizeGuideOpen(true)}
                  className="text-[9px] uppercase tracking-[0.15em] text-[#BCA58A] font-bold hover:text-[#111111] cursor-pointer flex items-center gap-1">
                  <Ruler size={11} /> Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    className={`min-w-[48px] py-2 px-3 text-[11px] font-semibold transition-all rounded-lg cursor-pointer ${
                      selectedSize === s
                        ? 'bg-[#111111] text-white shadow'
                        : 'bg-white border border-[#BCA58A]/12 text-[#111111]/50 hover:border-[#BCA58A]'
                    }`}>
                    {s.split(' ')[0]}
                  </button>
                ))}
              </div>
              {selectedSize && (
                <p className="text-[9px] text-emerald-600 font-semibold uppercase tracking-wider">Size {selectedSize.split(' ')[0]} selected · In stock</p>
              )}
            </div>

            {/* Shipping info */}
            <div className="flex flex-wrap gap-4 text-[10px] text-[#6B6B6B] font-medium">
              <span className="flex items-center gap-1"><Clock size={12} className="text-[#BCA58A]" /> Dispatch 2-4 days</span>
              <span className="flex items-center gap-1"><Truck size={12} className="text-[#BCA58A]" /> Free shipping</span>
              <span className="flex items-center gap-1"><RefreshCw size={12} className="text-[#BCA58A]" /> 7-day returns</span>
            </div>

            {/* Buttons */}
            <div className="space-y-2.5 pt-1">
              <div className="flex gap-3">
                <motion.button whileTap={{ scale: 0.98 }} onClick={() => {
                  if (!selectedSize) { alert('Please select a size.'); return; }
                  addToCart(product, selectedSize.split(' ')[0]);
                  alert(`Added ${product.name} (Size ${selectedSize.split(' ')[0]}) to your bag!`);
                }} className="flex-1 bg-[#BCA58A] hover:bg-[#A89070] text-white py-3.5 text-[9px] font-bold tracking-[0.25em] uppercase flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer rounded-xl">
                  <ShoppingBag size={13} /> ADD TO BAG
                </motion.button>
                <motion.button whileTap={{ scale: 0.98 }} onClick={() => toggleFavorite(product.id)}
                  className={`px-5 py-3.5 border flex items-center justify-center gap-2 text-[9px] font-bold tracking-[0.2em] uppercase transition-all cursor-pointer rounded-xl ${
                    isFavorite ? 'bg-rose-50 border-rose-200 text-rose-500' : 'border-[#BCA58A]/20 bg-white text-[#111111]/50 hover:border-[#111111]'
                  }`}>
                  <Heart size={13} className={isFavorite ? 'fill-current' : ''} /> {isFavorite ? 'Saved' : 'Wishlist'}
                </motion.button>
              </div>
              <motion.button whileTap={{ scale: 0.98 }} onClick={() => {
                if (!selectedSize) { alert('Please select a size.'); return; }
                addToCart(product, selectedSize.split(' ')[0]);
                setView('checkout');
              }} className="w-full bg-[#111111] hover:bg-[#BCA58A] text-white py-3.5 text-[9px] font-bold tracking-[0.25em] uppercase transition-all shadow-lg cursor-pointer rounded-xl">
                BUY NOW
              </motion.button>
              {product.reelUrl && (
                <motion.button whileTap={{ scale: 0.98 }} onClick={() => setReelOpen(true)}
                  className="w-full bg-white border border-[#BCA58A]/20 hover:border-[#BCA58A] text-[#111111]/60 py-3 text-[9px] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all cursor-pointer rounded-xl">
                  <Video size={13} className="text-[#BCA58A]" /> Watch Product Reel
                </motion.button>
              )}
            </div>

            {/* Seller card */}
            <div className="bg-white/50 border border-[#BCA58A]/8 rounded-xl p-4 space-y-3 mt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[#BCA58A]/15 flex-shrink-0">
                  <img src={getBoutiqueProfile(product.boutique)?.logo || ''} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-[12px] font-semibold">{product.boutique}</h4>
                  <div className="flex items-center gap-1 mt-0.5">
                    <BadgeCheck size={10} className="text-[#BCA58A]" />
                    <span className="text-[8px] text-[#BCA58A] font-semibold tracking-wider uppercase">Verified</span>
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={9} className={i < 4 ? 'fill-amber-400 text-amber-400' : 'text-[#E0D8CC]'} />)}
                </div>
              </div>
              <div className="flex gap-2">
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#1DA851] text-white py-2 text-[8px] font-bold tracking-wider uppercase rounded-lg cursor-pointer">
                  <MessageCircle size={11} /> Chat
                </a>
                <a href="tel:+919876543210"
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#111111] hover:bg-[#BCA58A] text-white py-2 text-[8px] font-bold tracking-wider uppercase rounded-lg cursor-pointer">
                  <Phone size={11} /> Call
                </a>
              </div>
            </div>

            {/* Accordions */}
            <div className="border-t border-[#BCA58A]/8 pt-3 mt-4">
              {[
                { key: 'details', title: 'Product Details', content: <div className="space-y-1.5">
                  <p>{product.fabricDetails || 'Premium silk suit set with elegant zari work and luxury dupatta.'}</p>
                  <ul className="list-disc pl-4 space-y-0.5"><li>Premium thread laces & mirror works</li><li>Handloomed by artisans in India</li><li>Perfect for weddings & festivals</li></ul>
                </div>},
                { key: 'fabric', title: 'Fabric & Craft', content: <div>
                  <p className="font-semibold text-[#111111] mb-0.5">{product.fabricName || 'Pure Silk'}</p>
                  <p>{product.fabricDesc || 'High-density handwoven fabric with silver and gold threads.'}</p>
                </div>},
                { key: 'shipping', title: 'Shipping & Returns', content: <div className="space-y-2">
                  <div className="flex gap-2 items-start"><Truck size={13} className="text-[#BCA58A] mt-0.5 flex-shrink-0" /><p>Free shipping across India. 4-7 business days.</p></div>
                  <div className="flex gap-2 items-start"><RefreshCw size={13} className="text-[#BCA58A] mt-0.5 flex-shrink-0" /><p>7-day returns. Free pick-up.</p></div>
                </div>},
                { key: 'care', title: 'Care Instructions', content: <ul className="list-disc pl-4 space-y-0.5 font-medium text-[#111111]">
                  {product.care?.map((c, i) => <li key={i}>{c}</li>) || <><li>Dry Clean Only</li><li>Do Not Bleach</li><li>Iron on Low Heat</li></>}
                </ul>},
              ].map((sec) => (
                <div key={sec.key} className="border-b border-[#BCA58A]/6">
                  <button onClick={() => toggleAccordion(sec.key)}
                    className="w-full py-3 flex justify-between items-center text-[10px] tracking-[0.15em] uppercase text-[#111111]/60 hover:text-[#BCA58A] transition-colors cursor-pointer font-medium">
                    <span>{sec.title}</span>
                    <motion.div animate={{ rotate: openAccordions[sec.key] ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={12} />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openAccordions[sec.key] && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }} className="overflow-hidden">
                        <div className="pb-3 text-[11px] text-[#6B6B6B] leading-relaxed">{sec.content}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SIMILAR PRODUCTS */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <span className="text-[8px] tracking-[0.3em] text-[#BCA58A] uppercase font-semibold">You May Also Love</span>
              <h2 className="text-2xl md:text-3xl font-light mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Similar from {product.boutique}</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {similarProducts.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  onClick={() => { setSelectedProduct?.(p); setView('product-details'); }} className="group cursor-pointer">
                  <div className="aspect-[3/4] overflow-hidden rounded-xl bg-[#F0E8DC] mb-2.5">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-700" />
                  </div>
                  <h3 className="text-[12px] text-[#111111]/65 group-hover:text-[#111111] transition-colors line-clamp-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{p.name}</h3>
                  <p className="text-[11px] text-[#BCA58A] mt-0.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{p.price}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* REVIEWS */}
        <div className="border-t border-[#BCA58A]/8 mt-14 pt-12">
          <div className="text-center mb-8">
            <span className="text-[8px] tracking-[0.3em] text-[#BCA58A] uppercase font-semibold">Testimonials</span>
            <h2 className="text-2xl md:text-3xl font-light mt-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Customer Reviews</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Rating summary */}
            <div className="bg-white/40 border border-[#BCA58A]/8 p-6 rounded-2xl text-center space-y-2">
              <h4 className="text-4xl font-light text-[#BCA58A]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{avgRating}</h4>
              <div className="flex justify-center gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} className={parseFloat(avgRating) >= i + 1 ? 'fill-amber-400 text-amber-400' : 'text-[#E0D8CC]'} />)}
              </div>
              <p className="text-[9px] text-[#6B6B6B] uppercase font-bold tracking-widest">Based on {reviewsList.length} reviews</p>
            </div>
            {/* Form + List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/40 border border-[#BCA58A]/8 p-5 rounded-2xl space-y-4">
                <h4 className="text-sm font-semibold">Write a Review</h4>
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="text" required value={reviewName} onChange={e => setReviewName(e.target.value)} placeholder="Your name"
                      className="w-full bg-[#FAF9F6] border border-[#BCA58A]/12 focus:border-[#BCA58A] outline-none p-2.5 text-[11px] rounded-lg" />
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map(n => <button key={n} type="button" onClick={() => setReviewRating(n)} className="cursor-pointer">
                        <Star size={18} className={reviewRating >= n ? 'fill-amber-400 text-amber-400' : 'text-[#E0D8CC]'} />
                      </button>)}
                      <span className="text-[10px] font-bold ml-1">{reviewRating}/5</span>
                    </div>
                  </div>
                  <textarea rows={2} required value={reviewComment} onChange={e => setReviewComment(e.target.value)} placeholder="Your review..."
                    className="w-full bg-[#FAF9F6] border border-[#BCA58A]/12 focus:border-[#BCA58A] outline-none p-2.5 text-[11px] rounded-lg resize-none" />
                  {reviewSubmitted && <p className="text-[10px] text-emerald-600 font-semibold">Review submitted!</p>}
                  <button type="submit" className="bg-[#111111] hover:bg-[#BCA58A] text-white px-6 py-2.5 text-[9px] font-bold tracking-[0.2em] uppercase flex items-center gap-2 transition-colors cursor-pointer rounded-lg">
                    <Send size={11} /> Submit
                  </button>
                </form>
              </div>
              <div className="space-y-4">
                {reviewsList.length === 0 ? (
                  <p className="py-6 text-center text-[#6B6B6B] text-[11px]">No reviews yet. Be the first!</p>
                ) : reviewsList.map((r, i) => (
                  <motion.div key={r.id || i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="flex gap-3 pb-4 border-b border-[#BCA58A]/6 last:border-0">
                    <div className="w-8 h-8 rounded-full bg-[#E8DDD0] flex items-center justify-center text-[10px] font-bold flex-shrink-0">{r.name?.[0]}</div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold">{r.name}</span>
                        <div className="flex gap-0.5">{[...Array(5)].map((_, j) => <Star key={j} size={9} className={r.rating >= j + 1 ? 'fill-amber-400 text-amber-400' : 'text-[#E0D8CC]'} />)}</div>
                        <span className="text-[8px] text-[#6B6B6B]">{r.date}</span>
                      </div>
                      <p className="text-[11px] text-[#6B6B6B] leading-relaxed">"{r.review}"</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REEL MODAL */}
      <AnimatePresence>
        {reelOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} exit={{ opacity: 0 }}
              onClick={() => setReelOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer" />
            <motion.div initial={{ scale: 0.9, y: 50, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-[360px] aspect-[9/16] h-[80vh] max-h-[720px] bg-[#111111] rounded-[2rem] border-[6px] border-[#2E2E2E] shadow-2xl overflow-hidden z-10 flex flex-col justify-end">
              {/* Notch */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-4 bg-[#2E2E2E] rounded-full z-30 flex items-center justify-center">
                <div className="w-10 h-0.5 bg-black/40 rounded-full" />
              </div>
              {/* Video */}
              <div className="absolute inset-0 cursor-pointer" onClick={toggleReelPlay}>
                <video ref={reelVideoRef} src={product.reelUrl} autoPlay playsInline loop muted={reelMuted}
                  onTimeUpdate={handleTimeUpdate} className="w-full h-full object-cover" />
                {!reelPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                    <div className="w-14 h-14 rounded-full bg-black/50 flex items-center justify-center text-white"><Play size={24} className="fill-current" /></div>
                  </div>
                )}
              </div>
              {/* Close */}
              <button onClick={() => setReelOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center z-30 cursor-pointer">
                <X size={14} />
              </button>
              {/* Right bar */}
              <div className="absolute right-3 bottom-28 flex flex-col gap-4 z-20 items-center">
                <button onClick={() => toggleFavorite(product.id)} className="flex flex-col items-center gap-1">
                  <div className={`p-2.5 rounded-full backdrop-blur-md ${favorites[product.id] ? 'bg-rose-500 text-white' : 'bg-black/40 text-white border border-white/10'}`}>
                    <Heart size={14} className={favorites[product.id] ? 'fill-current' : ''} />
                  </div>
                  <span className="text-[8px] text-white/80 font-bold uppercase">Save</span>
                </button>
                <button onClick={() => setReelMuted(!reelMuted)} className="flex flex-col items-center gap-1">
                  <div className="p-2.5 rounded-full bg-black/40 text-white border border-white/10">
                    {reelMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </div>
                  <span className="text-[8px] text-white/80 font-bold uppercase">{reelMuted ? 'Mute' : 'Sound'}</span>
                </button>
              </div>
              {/* Bottom card */}
              <div className="relative z-20 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-16 space-y-2">
                <span className="text-[8px] tracking-widest text-[#BCA58A] uppercase font-bold">{product.boutique}</span>
                <h3 className="text-base font-light text-white leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{product.name}</h3>
                <p className="text-sm font-semibold text-[#BCA58A]">{product.price}</p>
                <button onClick={() => { addToCart(product, 'M'); setReelOpen(false); }}
                  className="w-full bg-[#BCA58A] hover:bg-[#A89070] text-white py-2.5 text-[9px] font-bold tracking-[0.25em] uppercase flex items-center justify-center gap-2 rounded-lg cursor-pointer">
                  <ShoppingBag size={11} /> ADD TO BAG
                </button>
              </div>
              {/* Progress */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/15 z-20">
                <div className="h-full bg-[#BCA58A] transition-all duration-100" style={{ width: `${reelProgress}%` }} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
