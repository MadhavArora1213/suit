import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Heart, ShoppingBag, ChevronDown, Check,
  Truck, ShieldCheck, X, ChevronLeft, ChevronRight,
  BadgeCheck, MessageCircle, Ruler, RotateCcw, Package, Sparkles, Eye,
  Share2, ZoomIn, Clock, Users, Gem, Award, Feather
} from 'lucide-react';
import { getReviews, addReview, updateReview, deleteReview, syncProductReviews, getAllProducts, fileToBase64, recordProductView, recordProductClick } from '../utils/adminStore';

/* ═══ Thumbnail Strip (memoized) ═══ */
const ThumbStrip = React.memo(function ThumbStrip({ images, current, onSelect, vertical = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const active = el.children[current];
    if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [current]);
  return (
    <div ref={ref} className={`flex ${vertical ? 'flex-col gap-2 max-h-[520px] overflow-y-auto no-scrollbar px-4 lg:px-0' : 'gap-1.5 overflow-x-auto no-scrollbar scroll-smooth px-4 lg:px-0'}`}>
      {images.map((img, i) => (
        <button key={i} onClick={() => onSelect(i)}
          className={`${vertical ? 'w-[56px] h-[70px]' : 'w-[52px] h-[65px]'} shrink-0 overflow-hidden rounded-lg transition-all duration-500 cursor-pointer ${
            current === i ? 'ring-2 ring-[#8B2252] opacity-100' : 'opacity-30 hover:opacity-60'
          }`}>
          <img src={img} loading="lazy" decoding="async" className="w-full h-full object-cover object-center" draggable={false} alt="" />
        </button>
      ))}
    </div>
  );
});

/* ═══ Marquee (pure, no re-renders) ═══ */
const MarqueeBanner = React.memo(function MarqueeBanner() {
  return (
    <div className="overflow-hidden bg-[#1A0008] py-2 border-y border-[#D4AF37]/20">
      <div className="pm flex whitespace-nowrap">
        {[...Array(12)].map((_, i) => (
          <span key={i} className="text-[9px] uppercase tracking-[0.25em] text-white/90 font-semibold mx-4 flex items-center gap-2">
            <Gem size={9} className="text-[#D4AF37]" /> Handcrafted Luxury
            <span className="text-[#D4AF37]/40 mx-1">✦</span>
            <Award size={9} className="text-[#D4AF37]" /> Artisan Excellence
            <span className="text-[#D4AF37]/40 mx-1">✦</span>
            <Feather size={9} className="text-[#D4AF37]" /> Timeless Elegance
            <span className="text-[#D4AF37]/40 mx-1">✦</span>
          </span>
        ))}
      </div>
      <style>{`.pm{animation:scrollm 30s linear infinite}@keyframes scrollm{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
    </div>
  );
});

export default function ProductDetailsPage({ product, setView, setSelectedCategory, setSelectedBoutique, addToCart, favorites = {}, toggleFavorite, user, requireLogin }) {
  const [_reviewsRaw, setReviewsList] = useState([]);
  const reviewsList = Array.isArray(_reviewsRaw) ? _reviewsRaw : [];
  const [openAccordions, setOpenAccordions] = useState({ details: true, size: false, material: false, shipping: false });
  const [pinCode, setPinCode] = useState('');
  const [pinChecked, setPinChecked] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [editReviewId, setEditReviewId] = useState(null);
  const [reviewMedia, setReviewMedia] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [addedToBag, setAddedToBag] = useState(false);
  const [selectedFit, setSelectedFit] = useState(product?.fitOptions?.[0] || 'Unstitched');
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'M');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const isInStock = useMemo(() => {
    if (!product) return false;
    if (selectedFit === 'Stitched') {
      if (product.stockQty && typeof product.stockQty === 'object') {
        // If stockQty exists for this size, check it. Otherwise assume in stock for backward compatibility.
        if (product.stockQty[selectedSize] !== undefined) {
          return product.stockQty[selectedSize] > 0;
        }
      }
      return true;
    }
    // For Unstitched / Semi-Stitched, assume in stock
    return true; 
  }, [selectedFit, selectedSize, product]);
  const [zoomedImg, setZoomedImg] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [copied, setCopied] = useState(false);

  const buyBtnRef = useRef(null);
  const galleryRef = useRef(null);
  const touchStart = useRef(null);
  const touchEnd = useRef(null);
  const addedTimerRef = useRef(null);
  const copiedTimerRef = useRef(null);

  // Lazy init for urgency/viewers (only once per mount)
  const urgency = useMemo(() => Math.floor(Math.random() * 8) + 2, []);
  const viewers = useMemo(() => Math.floor(Math.random() * 30) + 12, []);

  useEffect(() => {
    if (product?.id) {
      setReviewsList(Array.isArray(getReviews(product.id)) ? getReviews(product.id) : []);
      syncProductReviews(product.id, (r) => setReviewsList(r));
      recordProductView(product.id);
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
    setAddedToBag(false);
    const defaultFit = product?.fitOptions?.includes('Unstitched') ? 'Unstitched' : (product?.fitOptions?.[0] || 'Stitched');
    setSelectedFit(defaultFit);
    setSelectedSize(null);
    setSelectedColorIndex(0);
    setCurrentImg(0);
    return () => { clearTimeout(addedTimerRef.current); clearTimeout(copiedTimerRef.current); };
  }, [product]);

  // Scroll listener with ref (no state thrashing)
  useEffect(() => {
    const onScroll = () => {
      if (buyBtnRef.current) {
        const bottom = buyBtnRef.current.getBoundingClientRect().bottom;
        setShowStickyBar(prev => {
          const next = bottom < 0;
          return prev !== next ? next : prev;
        });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Memoized derivations
  const availableColors = useMemo(() => {
    if (!product?.colorVariants) return [];
    return Object.keys(product.colorVariants)
      .map(key => ({ ...product.colorVariants[key], _slot: key }))
      .filter(v => v.mainImage)
      .map((v, idx) => ({ ...v, name: v.name || `Color ${idx + 1}` }));
  }, [product?.colorVariants]);

  const selectedColorData = availableColors[selectedColorIndex];

  const allImages = useMemo(() => {
    if (selectedColorData) {
      return [selectedColorData.mainImage, ...(selectedColorData.additionalImages || [])].filter(Boolean);
    }
    return [product?.image, ...(product?.additionalImages || [])].filter(Boolean);
  }, [product, selectedColorData]);
  const avgRating = useMemo(() => {
    if (reviewsList && reviewsList.length > 0) return (reviewsList.reduce((s, r) => s + r.rating, 0) / reviewsList.length).toFixed(1);
    return product?.rating || '4.5';
  }, [reviewsList, product?.rating]);
  const similarProducts = useMemo(() => {
    return getAllProducts().filter(p => p.id !== product?.id && (p.boutique === product?.boutique || p.type === product?.type)).slice(0, 6);
  }, [product?.id, product?.boutique, product?.type]);
  const discount = useMemo(() => {
    const priceNum = parseInt(String(product?.price || '').replace(/[^\d]/g, '')) || 0;
    const origNum = parseInt(String(product?.originalPrice || '').replace(/[^\d]/g, '')) || 0;
    return origNum > priceNum ? Math.round(((origNum - priceNum) / origNum) * 100) : 0;
  }, [product?.price, product?.originalPrice]);
  const ratingDist = useMemo(() => {
    const reviews = reviewsList || [];
    return [5, 4, 3, 2, 1].map(star => {
      const count = reviews.filter(r => Math.round(r.rating) === star).length;
      return { star, count, pct: reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0 };
    });
  }, [reviewsList]);

  // Memoized handlers
  const handleAddToBag = useCallback(() => {
    if (!product) return;
    const size = selectedFit === 'Stitched' ? (selectedSize || (product.sizes?.length > 0 ? product.sizes[0] : 'Stitched')) : selectedFit;
    let finalSelection = selectedFit === 'Stitched' && size !== 'Stitched' ? `Stitched - ${size}` : selectedFit;
    
    if (availableColors.length > 0 && availableColors[selectedColorIndex]) {
      finalSelection = `${availableColors[selectedColorIndex].name} | ${finalSelection}`;
    }

    addToCart(product, finalSelection);
    setAddedToBag(true);
    clearTimeout(addedTimerRef.current);
    addedTimerRef.current = setTimeout(() => setAddedToBag(false), 2500);
  }, [addToCart, product, selectedSize, selectedFit, availableColors, selectedColorIndex]);

  const handleReviewSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!product || !reviewName.trim() || !reviewComment.trim()) return;

    setIsUploading(true);
    const uploadedMediaUrls = [];
    try {
      for (const media of reviewMedia) {
        if (!media.file) continue;
        
        // For images use compressed fileToBase64, for videos use raw base64
        let base64;
        if (media.type.startsWith('video/')) {
          base64 = await new Promise((res, rej) => {
            const r = new FileReader();
            r.readAsDataURL(media.file);
            r.onload = () => res(r.result);
            r.onerror = rej;
          });
        } else {
          base64 = await fileToBase64(media.file);
        }

        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64,
            filename: media.file.name,
            folder: 'reviews'
          })
        });
        const data = await response.json();
        if (data.success && data.url) {
          uploadedMediaUrls.push({ url: data.url, type: media.type });
        }
      }
    } catch (err) {
      console.error('Error uploading media:', err);
    }
    setIsUploading(false);

    if (editReviewId) {
      updateReview(product.id, editReviewId, {
        rating: reviewRating,
        review: reviewComment,
        media: uploadedMediaUrls.length > 0 ? uploadedMediaUrls : reviewMedia.filter(m => m.url),
      });
    } else {
      addReview(product.id, { 
        name: user.name || 'User', 
        rating: reviewRating, 
        review: reviewComment,
        media: uploadedMediaUrls,
        userId: user.uid
      });
    }

    setReviewsList(getReviews(product.id));
    setReviewName('');
    setReviewComment('');
    setReviewRating(5);
    setReviewMedia([]);
    setEditReviewId(null);
    setReviewSubmitted(true);
    setTimeout(() => { setReviewSubmitted(false); setShowReviewForm(false); }, 2000);
  }, [product?.id, reviewName, reviewRating, reviewComment, reviewMedia, user, editReviewId]);

  const nextImg = useCallback(() => setCurrentImg(p => (p + 1) % (allImages.length || 1)), [allImages.length]);
  const prevImg = useCallback(() => setCurrentImg(p => (p - 1 + (allImages.length || 1)) % (allImages.length || 1)), [allImages.length]);

  const onTouchStart = useCallback((e) => { touchEnd.current = null; touchStart.current = e.targetTouches[0].clientX; }, []);
  const onTouchMove = useCallback((e) => { touchEnd.current = e.targetTouches[0].clientX; }, []);
  const onTouchEnd = useCallback(() => {
    if (!touchStart.current || !touchEnd.current) return;
    const d = touchStart.current - touchEnd.current;
    if (d > 50) setCurrentImg(p => (p + 1) % (allImages.length || 1));
    if (d < -50) setCurrentImg(p => (p - 1 + (allImages.length || 1)) % (allImages.length || 1));
  }, [allImages.length]);

  const shareProduct = useCallback(async () => {
    if (!product) return;
    try { await navigator.share({ title: product.name, url: window.location.href }); }
    catch { navigator.clipboard?.writeText(window.location.href); setCopied(true); clearTimeout(copiedTimerRef.current); copiedTimerRef.current = setTimeout(() => setCopied(false), 2000); }
  }, [product?.name]);

  const toggleAccordion = useCallback((key) => setOpenAccordions(p => ({ ...p, [key]: !p[key] })), []);

  if (!product) return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="aspect-[3/4] bg-gradient-to-br from-[#E8DDD0] via-[#F0E8DC] to-[#E8DDD0] rounded-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
            </div>
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-16 h-16 bg-gradient-to-br from-[#E8DDD0] to-[#F0E8DC] rounded-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4 pt-4">
            <div className="h-3 bg-[#E8DDD0] rounded-full w-1/3" />
            <div className="h-7 bg-gradient-to-r from-[#1A1A1A] to-[#333] rounded-lg w-2/3 opacity-10" />
            <div className="h-5 bg-[#D4AF37] rounded-full w-1/4 opacity-30" />
            <div className="h-9 bg-[#1A1A1A] rounded-xl w-1/3 mt-6 opacity-10" />
            <div className="space-y-3 mt-8">
              <div className="h-2.5 bg-[#E8DDD0] rounded-full w-full" />
              <div className="h-2.5 bg-[#E8DDD0] rounded-full w-5/6" />
              <div className="h-2.5 bg-[#E8DDD0] rounded-full w-4/6" />
              <div className="h-2.5 bg-[#E8DDD0] rounded-full w-3/4" />
            </div>
            <div className="flex gap-3 mt-6">
              <div className="h-12 bg-[#1A1A1A] rounded-xl flex-1 opacity-10" />
              <div className="h-12 bg-[#D4AF37] rounded-xl flex-1 opacity-20" />
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#222] pt-[120px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      <MarqueeBanner />

      {/* Breadcrumb */}
      <nav className="border-b border-[#f0ece6]/50">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-10 py-3 flex items-center gap-1.5 text-[11px] text-gray-400 overflow-x-auto whitespace-nowrap no-scrollbar">
          <button onClick={() => window.location.href = '/'} className="hover:text-[#8B2252] transition-colors cursor-pointer shrink-0">Home</button>
          <ChevronRight size={9} className="shrink-0 opacity-40" />
          {product.type && (
            <>
              <button onClick={() => { setSelectedCategory(product.type); setView('category'); }}
                className="hover:text-[#8B2252] transition-colors cursor-pointer shrink-0 capitalize">{product.type}</button>
              <ChevronRight size={9} className="shrink-0 opacity-40" />
            </>
          )}
          <span className="text-[#222] font-medium truncate max-w-[220px]">{product.name}</span>
        </div>
      </nav>

      {/* ═══ Main ═══ */}
      <div className="max-w-[1100px] mx-auto px-4 lg:px-8 py-4 lg:py-6 pb-32 lg:pb-12 overflow-x-hidden">
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-10 items-start">

          {/* ─── LEFT: GALLERY ─── */}
          <div className="w-full lg:w-[38%] lg:sticky lg:top-[120px] shrink-0">
            {/* Desktop */}
            <div className="gallery-desktop hidden lg:flex gap-3">
              <ThumbStrip images={allImages} current={currentImg} onSelect={setCurrentImg} vertical />
              <div className="flex-1 relative" ref={galleryRef}>
                <div className="w-full aspect-[3/4] bg-[#f0ece6] overflow-hidden rounded-3xl relative group cursor-crosshair"
                  onClick={() => setZoomedImg(allImages[currentImg])}>
                  <AnimatePresence mode="wait">
                    <motion.img key={currentImg} src={allImages[currentImg]} alt={product.name}
                      initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full h-full object-cover object-center" draggable={false} />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  <button onClick={(e) => { e.stopPropagation(); prevImg(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur shadow-2xl flex items-center justify-center text-[#222] opacity-0 group-hover:opacity-100 transition-all duration-500 cursor-pointer hover:bg-white hover:scale-110 z-10">
                    <ChevronLeft size={20} strokeWidth={1.5} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); nextImg(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur shadow-2xl flex items-center justify-center text-[#222] opacity-0 group-hover:opacity-100 transition-all duration-500 cursor-pointer hover:bg-white hover:scale-110 z-10">
                    <ChevronRight size={20} strokeWidth={1.5} />
                  </button>
                  <div className="absolute bottom-5 right-5 flex items-center gap-1.5 bg-black/60 backdrop-blur text-white text-[10px] font-semibold px-3.5 py-2 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <ZoomIn size={12} /> Click to zoom
                  </div>
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {allImages.map((_, i) => (
                      <button key={i} onClick={(e) => { e.stopPropagation(); setCurrentImg(i); }}
                        className={`rounded-full transition-all duration-500 cursor-pointer ${currentImg === i ? 'w-6 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'}`} />
                    ))}
                  </div>
                  <div className="absolute top-5 left-5 flex flex-col gap-2 z-10">
                    {product.badge && (
                      <span className="bg-[#8B2252] text-white text-[9px] font-bold px-4 py-2 rounded-full uppercase tracking-[0.15em] shadow-xl">{product.badge}</span>
                    )}
                    {discount > 0 && (
                      <span className="bg-[#c0392b] text-white text-[10px] font-bold px-3.5 py-1.5 rounded-full shadow-lg">-{discount}% OFF</span>
                    )}
                  </div>
                </div>
                <div className="mt-3">
                  <ThumbStrip images={allImages} current={currentImg} onSelect={setCurrentImg} />
                </div>
              </div>
            </div>

            {/* Mobile */}
            <div className="gallery-mobile lg:hidden flex flex-col gap-3">
              <div className="w-full relative rounded-2xl overflow-hidden shadow-sm">
                <div className="w-full aspect-[3/4] overflow-hidden relative group"
                  onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                  <AnimatePresence mode="wait">
                    <motion.img key={currentImg} src={allImages[currentImg]} alt={product.name}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                      className="w-full h-full object-cover object-center" draggable={false} />
                  </AnimatePresence>
                  <button onClick={prevImg} className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur shadow-xl flex items-center justify-center text-[#222] z-10">
                    <ChevronLeft size={20} strokeWidth={1.5} />
                  </button>
                  <button onClick={nextImg} className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur shadow-xl flex items-center justify-center text-[#222] z-10">
                    <ChevronRight size={20} strokeWidth={1.5} />
                  </button>
                  <button onClick={() => setZoomedImg(allImages[currentImg])}
                    className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-black/50 backdrop-blur text-white flex items-center justify-center z-10">
                    <ZoomIn size={16} />
                  </button>
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                    {product.badge && <span className="bg-[#8B2252] text-white text-[9px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-lg">{product.badge}</span>}
                    {discount > 0 && <span className="bg-[#c0392b] text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg">-{discount}%</span>}
                  </div>
                  <div className="absolute bottom-4 left-4 right-16 z-10">
                    <div className="h-[3px] bg-white/20 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-white rounded-full"
                        animate={{ width: `${((currentImg + 1) / allImages.length) * 100}%` }}
                        transition={{ duration: 0.4, ease: 'easeOut' }} />
                    </div>
                  </div>
                </div>
              </div>
              <ThumbStrip images={allImages} current={currentImg} onSelect={setCurrentImg} />
            </div>
          </div>

          {/* ─── RIGHT: PRODUCT INFO ─── */}
          <div className="w-full lg:w-[62%]">
            <div className="lg:pl-2">

              {/* Boutique + Share */}
              <div className="flex items-center justify-between mb-2">
                <button onClick={() => { setSelectedBoutique(product.boutique); setView('seller-shop'); }}
                  className="inline-flex items-center gap-1.5 text-[11px] text-[#8B2252] font-bold tracking-[0.12em] uppercase hover:underline cursor-pointer transition-colors">
                  {product.boutique} <BadgeCheck size={12} className="text-[#8B2252]" />
                </button>
                <button onClick={shareProduct}
                  className="relative w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#8B2252] hover:border-[#8B2252]/30 transition-all cursor-pointer">
                  {copied ? <Check size={13} className="text-[#2e7d32]" /> : <Share2 size={13} />}
                </button>
              </div>

              {/* Title */}
              <h1 className="text-[24px] sm:text-[28px] lg:text-[32px] font-semibold text-[#1a1a1a] leading-[1.1] mb-2 tracking-[-0.01em]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {product.name}
              </h1>

              {/* Rating row */}
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className={parseFloat(avgRating) >= i + 1 ? 'fill-[#f5a623] text-[#f5a623]' : 'fill-gray-200 text-gray-200'} />
                  ))}
                </div>
                <span className="text-[12px] font-bold text-[#222]">{avgRating}</span>
                <span className="text-[11px] text-gray-400">({reviewsList.length})</span>
                <span className="text-gray-300">|</span>
                <span className="text-[11px] text-[#8B2252] font-semibold flex items-center gap-1">
                  <Eye size={11} /> {Math.max(1, (product.viewsCount || product.views || 0))} views
                </span>
              </div>

              {/* Price + Urgency */}
              <div className="mb-4">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-[28px] lg:text-[32px] font-bold text-[#1a1a1a] leading-none tracking-tight">{product.price}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-[14px] text-gray-400 line-through decoration-1">{product.originalPrice}</span>
                      {discount > 0 && <span className="text-[11px] font-bold text-white bg-[#c0392b] px-2 py-0.5 rounded-full">SAVE {discount}%</span>}
                    </>
                  )}
                  <span className={`ml-auto flex items-center gap-1.5 text-[11px] font-bold ${isInStock ? 'text-[#2e7d32]' : 'text-[#c0392b]'}`}>
                    {isInStock ? <><Check size={13} strokeWidth={2.5} /> In Stock</> : <><X size={13} strokeWidth={2.5} /> Out of Stock</>}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">Inclusive of all taxes</p>
              </div>

              {/* Action Buttons */}
              <div ref={buyBtnRef} className="flex items-center gap-2.5 mb-5">
                <motion.button onClick={handleAddToBag} whileTap={isInStock ? { scale: 0.97 } : {}} disabled={!isInStock}
                  className={`flex-1 h-[46px] flex items-center justify-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] rounded-xl sm:rounded-2xl transition-all duration-500 ${
                    !isInStock 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                      : addedToBag
                        ? 'bg-[#2e7d32] text-white shadow-xl shadow-[#2e7d32]/30 cursor-pointer'
                        : 'bg-gradient-to-r from-[#8B2252] to-[#a02d62] text-white shadow-xl shadow-[#8B2252]/25 hover:shadow-[#8B2252]/40 hover:scale-[1.01] cursor-pointer'
                  }`}>
                  {addedToBag ? <><Check size={16} strokeWidth={3} className="shrink-0" /> <span className="hidden sm:inline">Added</span></> : <><ShoppingBag size={16} className="shrink-0" /> Add to Bag</>}
                </motion.button>
                
                <button onClick={() => { 
                    if (!isInStock) return;
                    const size = selectedFit === 'Stitched' ? (selectedSize || (product.sizes?.length > 0 ? product.sizes[0] : 'Stitched')) : selectedFit;
                    let finalSelection = selectedFit === 'Stitched' && size !== 'Stitched' ? `Stitched - ${size}` : selectedFit;
                    if (availableColors.length > 0 && availableColors[selectedColorIndex]) {
                      finalSelection = `${availableColors[selectedColorIndex].name} | ${finalSelection}`;
                    }
                    addToCart(product, finalSelection); 
                    setView('checkout'); 
                  }}
                  disabled={!isInStock}
                  className={`flex-1 h-[46px] flex items-center justify-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] rounded-xl sm:rounded-2xl border-2 transition-all duration-500 ${
                    !isInStock
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-white'
                      : 'border-[#222] text-[#222] hover:bg-[#222] hover:text-white cursor-pointer hover:shadow-lg'
                  }`}>
                  <Sparkles size={14} className="shrink-0" /> Buy Now
                </button>

                <button onClick={() => toggleFavorite(product.id)}
                  className={`w-[46px] h-[46px] flex items-center justify-center rounded-xl sm:rounded-2xl border-2 transition-all cursor-pointer shrink-0 ${
                    favorites[product.id] ? 'bg-rose-50 border-rose-300 text-rose-500' : 'border-gray-200 text-gray-400 hover:border-rose-300 hover:text-rose-400'
                  }`}>
                  <Heart size={18} className={favorites[product.id] ? 'fill-current' : ''} />
                </button>
              </div>

              {/* Color Selection */}
              {availableColors.length > 0 && (
                <div className="mb-4 bg-[#faf8f5] rounded-2xl p-4 border border-[#ebe5de]">
                  <span className="text-[11px] font-bold text-[#8B2252] uppercase tracking-wider mb-2 block">Select Color</span>
                  <div className="flex flex-wrap gap-4">
                    {availableColors.map((color, idx) => (
                      <button key={idx} type="button" onClick={() => { setSelectedColorIndex(idx); setCurrentImg(0); }}
                        className={`group relative flex flex-col items-center gap-1.5 transition-all cursor-pointer`}
                        title={color.name}>
                        <div className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                          selectedColorIndex === idx ? 'border-[#8B2252] shadow-md scale-110' : 'border-gray-200 opacity-70 group-hover:opacity-100'
                        }`}>
                          <img src={color.mainImage} alt={color.name} className="w-full h-full object-cover" />
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${
                          selectedColorIndex === idx ? 'text-[#8B2252]' : 'text-gray-500'
                        }`}>{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Fit and Size Selection */}
              <div className="mb-4 bg-[#faf8f5] rounded-2xl p-4 border border-[#ebe5de]">
                {product.fitOptions && product.fitOptions.length > 0 && (
                  <div className="mb-4">
                    <span className="text-[11px] font-bold text-[#8B2252] uppercase tracking-wider mb-2 block">1. Select Fit</span>
                    <div className="flex flex-wrap gap-2">
                      {['Unstitched', 'Semi-Stitched', 'Stitched'].filter(f => product.fitOptions.includes(f)).map(fit => (
                        <button key={fit} type="button" onClick={() => setSelectedFit(fit)}
                          className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold border-2 transition-all cursor-pointer ${
                            selectedFit === fit
                              ? 'border-[#8B2252] bg-[#8B2252] text-white shadow-md'
                              : 'border-gray-200 text-gray-600 bg-white hover:border-[#8B2252] hover:text-[#8B2252]'
                          }`}>
                          {fit === 'Stitched' ? 'Readymade (Stitched)' : (fit === 'Semi-Stitched' ? 'Semi-Stitched' : 'Unstitched Fabric')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedFit === 'Stitched' && product.sizes && product.sizes.length > 0 && (
                  <div>
                    <div className="mb-2">
                      <span className="text-[11px] font-bold text-[#8B2252] uppercase tracking-wider">2. Select Size</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map(s => (
                        <button key={s} type="button" onClick={() => setSelectedSize(s)}
                          className={`px-3.5 py-2 rounded-xl text-[11px] font-bold border-2 transition-all cursor-pointer ${
                            selectedSize === s
                              ? 'border-[#8B2252] bg-[#8B2252] text-white shadow-md'
                              : 'border-gray-200 text-gray-600 bg-white hover:border-[#8B2252] hover:text-[#8B2252]'
                          }`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Description */}
              <p className="text-[13px] text-[#666] leading-[1.7] mb-4 max-w-[52ch]">
                {product.shortDesc || 'An exquisite handcrafted piece, designed for those who appreciate true luxury. Every detail tells a story of heritage and artisanal excellence.'}
              </p>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { icon: <ShieldCheck size={20} />, label: '100% Authentic', sub: 'Verified seller', color: '#2e7d32' },
                  { icon: <Gem size={20} />, label: 'Premium Quality', sub: 'Handcrafted', color: '#8B2252' },
                  { icon: <Award size={20} />, label: 'Top Rated', sub: 'Customer favorite', color: '#D4AF37' },
                ].map((b, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 py-4 px-2 bg-white rounded-2xl border border-[#f0ece6]/60 hover:border-[#e0d8ce] transition-colors">
                    <span style={{ color: b.color }}>{b.icon}</span>
                    <span className="text-[11px] font-bold text-[#222]">{b.label}</span>
                    <span className="text-[10px] text-gray-400">{b.sub}</span>
                  </div>
                ))}
              </div>



              {/* Accordions */}
              <div className="border border-[#ebe5de] rounded-2xl overflow-hidden bg-white">
                {[
                  { key: 'details', title: 'Product Details', icon: <Eye size={15} />, content: (
                    <div className="space-y-4 text-[13px] text-gray-500 leading-relaxed">
                      <p>{product.fabricDetails || 'Intricate embroidery with hand-placed crystal accents. Includes kameez, bottom, and matching dupatta.'}</p>
                      <div className="bg-[#faf8f5] rounded-xl p-4">
                        <table className="w-full text-xs"><tbody>
                          {[
                            ['Type', product.type || 'Suit Set'], 
                            ['Style', product.styleCategory || 'Traditional'], 
                            ['Occasions', product.occasions?.join(', ') || 'Festive, Wedding'],
                          ].map(([k, v]) => (
                            <tr key={k} className="border-b border-gray-100/80 last:border-0">
                              <td className="py-2.5 pr-6 text-gray-400 font-medium w-[130px]">{k}</td>
                              <td className="py-2.5 text-[#222] font-semibold">{v}</td>
                            </tr>
                          ))}
                        </tbody></table>
                      </div>
                    </div>
                  )},
                  { key: 'size', title: 'Size & Fit', icon: <Ruler size={15} />, content: (
                    <div className="text-[13px] text-gray-500 leading-relaxed space-y-3">
                      {product.sizes && product.sizes.length > 0 && (
                        <p>Available Sizes: <strong className="text-[#222]">{product.sizes.join(', ')}</strong></p>
                      )}
                      <p>Regular fit — fits true to size, take your normal size.</p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {(product.fitOptions || ['Stitched', 'Unstitched']).map((tag) => {
                          const label = tag === 'Stitched' ? 'Readymade (Stitched)' : (tag === 'Unstitched' ? 'Unstitched Fabric' : tag);
                          return (
                            <span key={tag} className="inline-flex items-center rounded-full border border-[#ebe5de] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#6e6158]">{label}</span>
                          );
                        })}
                      </div>
                    </div>
                  )},
                  { key: 'material', title: 'Material & Care', icon: <Sparkles size={15} />, content: (
                    <div className="text-[13px] text-gray-500 leading-relaxed space-y-3">
                      <p><strong className="text-[#222]">Fabric:</strong> {product.fabricName || 'Pure Silk'}</p>
                      {product.fabricDesc && <p>{product.fabricDesc}</p>}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {(product.care || ['Dry Clean Only', 'Do Not Bleach', 'Iron on Low Heat', 'Store in Dry Place']).map((c, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 bg-[#faf8f5] border border-[#ebe5de] rounded-full px-3 py-1.5 text-[11px] font-medium text-gray-600">
                            <span className="w-1 h-1 rounded-full bg-[#D4AF37]" /> {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )},
                  { key: 'shipping', title: 'Shipping Information', icon: <Package size={15} />, content: (
                    <div className="text-[13px] text-gray-500 leading-relaxed space-y-3">
                      <p className="flex items-start gap-2.5"><Package size={15} className="text-[#8B2252] shrink-0 mt-0.5" /> Standard delivery: 4-7 business days.</p>
                    </div>
                  )}
                ].map((acc, idx) => (
                  <div key={acc.key} className={idx > 0 ? 'border-t border-[#f0ece6]/50' : ''}>
                    <button onClick={() => toggleAccordion(acc.key)}
                      className="w-full px-5 py-4 flex justify-between items-center cursor-pointer group transition-all hover:bg-[#faf8f5]">
                      <span className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-[#f0ece6] flex items-center justify-center text-gray-500 group-hover:bg-[#8B2252]/10 group-hover:text-[#8B2252] transition-all">{acc.icon}</span>
                        <span className="text-[13px] font-bold text-[#222] group-hover:text-[#8B2252] transition-colors">{acc.title}</span>
                      </span>
                      <motion.div animate={{ rotate: openAccordions[acc.key] ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        <ChevronDown size={16} className="text-gray-300" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {openAccordions[acc.key] && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                          <div className="px-5 pb-5 pl-[68px]">{acc.content}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ EDITORIAL STORY ═══ */}
        <section className="mt-20 mb-16">
          <div className="relative bg-gradient-to-br from-[#1a1a1a] via-[#2a1520] to-[#1a1a1a] rounded-3xl overflow-hidden px-8 py-16 lg:px-20 lg:py-20 text-center">
            <div className="absolute inset-0 opacity-[0.04]" style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23BCA58A\' fill-opacity=\'1\'%3E%3Cpath d=\'M20 20.5V18H0v-2h20v-2l2 3-2 3z\'/%3E%3C/g%3E%3C/svg%3E")',
            }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#8B2252]/10 rounded-full blur-[120px]" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-semibold mb-5 block relative">The Art of Craft</span>
            <h2 className="text-[28px] lg:text-[40px] text-white font-semibold leading-[1.15] mb-5 max-w-[550px] mx-auto relative" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Heritage Woven Into Every Thread
            </h2>
            <p className="text-[14px] text-white/40 leading-[1.8] max-w-[480px] mx-auto mb-10 relative">
              Each piece is meticulously handcrafted by master artisans, preserving centuries-old techniques while embracing contemporary elegance.
            </p>
            <div className="flex flex-wrap justify-center gap-10 text-center relative">
              {[
                { num: '500+', label: 'Artisans', icon: <Gem size={16} className="text-[#D4AF37] mb-2" /> },
                { num: '50+', label: 'Years Heritage', icon: <Award size={16} className="text-[#D4AF37] mb-2" /> },
                { num: '100%', label: 'Handcrafted', icon: <Feather size={16} className="text-[#D4AF37] mb-2" /> },
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center">
                  {s.icon}
                  <div className="text-[32px] font-bold text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.num}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ REVIEWS ═══ */}
        <section className="mt-16 pt-10 border-t border-[#f0ece6]/50" id="reviews">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[22px] font-bold text-[#222]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Ratings & Reviews</h2>
            {reviewsList.length > 0 && <span className="text-[12px] text-gray-400">{reviewsList.length} reviews</span>}
          </div>
          <div className="flex flex-col md:flex-row gap-10 mb-10">
            <div className="md:w-[240px] shrink-0">
              <div className="bg-white rounded-2xl p-6 text-center border border-[#f0ece6]/50">
                <div className="text-6xl font-bold text-[#222] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{avgRating}</div>
                <div className="flex gap-0.5 justify-center mt-2 mb-2">
                  {[...Array(5)].map((_, i) => {
                    const fill = Math.min(Math.max((parseFloat(avgRating) - i) * 100, 0), 100);
                    return (
                      <div key={i} className="relative" style={{ width: 16, height: 16 }}>
                        <Star size={16} className="fill-gray-200 text-gray-200 absolute inset-0" />
                        <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill}%` }}>
                          <Star size={16} className="fill-[#f5a623] text-[#f5a623]" />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-400 mb-5">{reviewsList.length} Verified Ratings</p>
                <div className="space-y-2">
                  {ratingDist.map(d => (
                    <div key={d.star} className="flex items-center gap-2 text-xs">
                      <span className="w-3 text-gray-500 font-medium">{d.star}</span>
                      <Star size={9} className="fill-gray-300 text-gray-300 shrink-0" />
                      <div className="flex-1 h-[5px] bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#f5a623] rounded-full transition-all duration-700" style={{ width: `${d.pct}%` }} />
                      </div>
                      <span className="w-6 text-gray-400 text-right tabular-nums">{d.count}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => {
                  if (!user) { requireLogin(); return; }
                  setEditReviewId(null);
                  setReviewName(user.name || '');
                  setReviewRating(5);
                  setReviewComment('');
                  setReviewMedia([]);
                  setShowReviewForm(true);
                }}
                  className="mt-6 w-full py-3 text-[11px] font-bold uppercase tracking-wider bg-[#8B2252] text-white rounded-xl hover:bg-[#6f1b42] transition-all duration-300 cursor-pointer">
                  Write a Review
                </button>
              </div>
            </div>
            <div className="flex-1">
              {reviewsList.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-[#ebe5de]">
                  <MessageCircle size={40} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-[14px] text-gray-400 font-medium mb-1">No reviews yet</p>
                  <p className="text-[12px] text-gray-300">Be the first to share your experience!</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {reviewsList.map((r, i) => (
                    <div key={i} className="py-5 border-b border-[#f0ece6]/50 last:border-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8B2252] to-[#D4AF37] flex items-center justify-center text-white text-[11px] font-bold">
                          {r.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-semibold text-[#222]">{r.name}</span>
                            <span className="flex items-center gap-0.5 text-[10px] text-[#2e7d32] font-semibold"><BadgeCheck size={10} /> Verified</span>
                          </div>
                          {r.date && <span className="text-[11px] text-gray-400">{r.date}</span>}
                        </div>
                        <div className="flex items-center gap-0.5 bg-[#2e7d32] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                          {r.rating} <Star size={8} className="fill-current" />
                        </div>
                        {user && user.uid === r.userId && (
                          <div className="flex items-center gap-2 ml-2">
                            <button onClick={() => {
                              setEditReviewId(r.id);
                              setReviewName(r.name);
                              setReviewRating(r.rating);
                              setReviewComment(r.review);
                              setReviewMedia(r.media || []);
                              setShowReviewForm(true);
                            }} className="text-[10px] uppercase font-bold tracking-wider text-gray-400 hover:text-[#8B2252]">
                              Edit
                            </button>
                            <span className="text-gray-300">|</span>
                            <button type="button" onClick={async (e) => {
                              e.preventDefault();
                              if (window.confirm("Are you sure you want to delete your review?")) {
                                await deleteReview(product.id, r.id);
                                setReviewsList(getReviews(product.id));
                              }
                            }} className="text-[10px] uppercase font-bold tracking-wider text-gray-400 hover:text-red-500">
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-[13px] text-[#444] leading-relaxed pl-12 mb-3">{r.review}</p>
                      {r.media && r.media.length > 0 && (
                        <div className="pl-12 flex flex-wrap gap-2">
                          {r.media.map((m, mIdx) => (
                            <div key={mIdx} className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                              {m.type.startsWith('video/') ? (
                                <video src={m.url} className="w-full h-full object-cover" muted />
                              ) : (
                                <img src={m.url} alt="Review Media" className="w-full h-full object-cover" loading="lazy" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ═══ SIMILAR PRODUCTS ═══ */}
        {similarProducts.length > 0 && (
          <section className="mt-14 mb-10 pt-10 border-t border-[#f0ece6]/50">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[22px] font-bold text-[#222]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>You May Also Like</h2>
              <span className="text-[11px] text-gray-400 uppercase tracking-wider">{similarProducts.length} items</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {similarProducts.map((p, i) => (
                <div key={p.id} onClick={() => setView('product-details')} className="group cursor-pointer">
                  <div className="w-full aspect-[3/4] overflow-hidden bg-[#f0ece6] mb-3 rounded-2xl relative">
                    <img src={p.image} alt={p.name} loading="lazy" decoding="async"
                      className="w-full h-full object-cover object-center group-hover:scale-[1.05] transition-transform duration-700 ease-out" />
                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(p.id); }}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer hover:scale-110">
                      <Heart size={14} className={favorites[p.id] ? 'fill-rose-500 text-rose-500' : 'text-gray-400'} />
                    </button>
                  </div>
                  <p className="text-[10px] text-[#8B2252] font-semibold tracking-wider uppercase mb-1">{p.boutique}</p>
                  <h3 className="text-[13px] text-[#222] font-medium line-clamp-1 mb-1.5 group-hover:text-[#8B2252] transition-colors">{p.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-[#222]">{p.price}</span>
                    {p.originalPrice && <span className="text-[11px] text-gray-400 line-through">{p.originalPrice}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ═══ Sticky Desktop Bar ═══ */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 px-8 py-3.5 items-center gap-6 z-[100] shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-4 max-w-[1400px] mx-auto w-full">
              <img src={allImages[0]} loading="lazy" decoding="async" className="w-12 h-15 rounded-xl object-cover" alt="" />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#222] truncate" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{product.name}</p>
                <p className="text-[11px] text-gray-400">{product.boutique}</p>
              </div>
              <div className="text-right mr-4">
                <p className="text-[18px] font-bold text-[#222]">{product.price}</p>
                {product.originalPrice && <p className="text-[10px] text-gray-400 line-through">{product.originalPrice}</p>}
              </div>
              <motion.button onClick={handleAddToBag} whileTap={{ scale: 0.97 }}
                className={`h-12 px-8 flex items-center justify-center gap-2 text-[12px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                  addedToBag ? 'bg-[#2e7d32] text-white' : 'bg-gradient-to-r from-[#8B2252] to-[#a02d62] text-white shadow-lg shadow-[#8B2252]/20'
                }`}>
                {addedToBag ? <><Check size={16} strokeWidth={3} /> Added</> : <><ShoppingBag size={16} /> Add to Bag</>}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Review Modal ═══ */}
      <AnimatePresence>
        {showReviewForm && (
          <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowReviewForm(false)}>
            <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onClick={e => e.stopPropagation()} className="bg-white rounded-3xl p-7 w-full md:w-[90%] max-w-lg relative shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#222]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{editReviewId ? 'Edit Your Review' : 'Write a Review'}</h3>
                <button onClick={() => setShowReviewForm(false)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[#222] hover:bg-gray-200 cursor-pointer transition-colors">
                  <X size={17} />
                </button>
              </div>
              <form onSubmit={handleReviewSubmit} className="space-y-5">
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Your Name</label>
                  <input type="text" value={user?.name || reviewName} disabled
                    className="w-full bg-gray-100/50 border border-gray-200 text-gray-500 cursor-not-allowed outline-none px-4 py-3.5 text-sm rounded-xl" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3 block">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1,2,3,4,5].map(n => {
                      const fill = Math.min(Math.max((reviewRating - (n - 1)) * 100, 0), 100);
                      return (
                        <button key={n} type="button" onClick={() => setReviewRating(n)}
                          className="cursor-pointer p-1 hover:scale-110 transition-transform relative" style={{ width: 28, height: 28 }}>
                          <Star size={28} className="text-gray-200 absolute inset-0" />
                          <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill}%` }}>
                            <Star size={28} className="fill-[#f5a623] text-[#f5a623]" />
                          </div>
                        </button>
                      );
                    })}
                    <input type="number" step="0.1" min="0" max="5" value={reviewRating}
                      onChange={e => setReviewRating(parseFloat(e.target.value) || 0)}
                      className="w-16 px-2 py-1 bg-[#faf8f5] border border-gray-200 rounded-lg text-sm text-center font-bold focus:outline-none focus:border-[#8B2252]" />
                    <span className="text-sm font-bold text-[#222]">/ 5</span>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">Your Review</label>
                  <textarea rows={4} required value={reviewComment} onChange={e => setReviewComment(e.target.value)} placeholder="Share your experience..."
                    className="w-full bg-[#faf8f5] border border-gray-200 focus:border-[#8B2252] focus:ring-2 focus:ring-[#8B2252]/10 outline-none px-4 py-3.5 text-sm rounded-xl resize-none transition-all" />
                </div>
                
                {/* File Upload Section */}
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Add Photo or Video</span>
                    <span className="text-[9px] text-gray-400">Max: 5MB (Img), 10MB (Vid)</span>
                  </label>
                  <input type="file" multiple accept="image/*,video/*"
                    className="hidden" id="reviewMediaInput"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      const validFiles = files.filter(f => {
                        if (f.type.startsWith('video/') && f.size > 10 * 1024 * 1024) {
                          alert(`Video ${f.name} is larger than 10MB.`);
                          return false;
                        }
                        if (f.type.startsWith('image/') && f.size > 5 * 1024 * 1024) {
                          alert(`Image ${f.name} is larger than 5MB.`);
                          return false;
                        }
                        return true;
                      });
                      const newMedia = validFiles.map(f => ({
                        file: f,
                        type: f.type,
                        preview: URL.createObjectURL(f)
                      }));
                      setReviewMedia(prev => [...prev, ...newMedia]);
                    }}
                  />
                  <div className="flex flex-wrap gap-3">
                    {reviewMedia.map((media, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-xl border border-gray-200 overflow-hidden group">
                        {media.type.startsWith('video/') ? (
                          <video src={media.preview} className="w-full h-full object-cover" />
                        ) : (
                          <img src={media.preview} alt="preview" className="w-full h-full object-cover" />
                        )}
                        <button type="button" onClick={() => setReviewMedia(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute inset-0 bg-black/40 items-center justify-center hidden group-hover:flex transition-all">
                          <X size={16} className="text-white" />
                        </button>
                      </div>
                    ))}
                    <label htmlFor="reviewMediaInput" className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#8B2252] hover:border-[#8B2252] cursor-pointer transition-colors bg-[#faf8f5]">
                      <span className="text-2xl font-light">+</span>
                    </label>
                  </div>
                </div>

                <AnimatePresence>
                  {reviewSubmitted && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-[#2e7d32] font-semibold flex items-center gap-1.5">
                      <Check size={16} /> Review submitted!
                    </motion.p>
                  )}
                </AnimatePresence>
                <button type="submit" disabled={isUploading}
                  className={`w-full py-4 text-[12px] font-bold uppercase tracking-wider rounded-xl transition-all ${
                    isUploading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#8B2252] to-[#a02d62] text-white cursor-pointer hover:shadow-lg hover:shadow-[#8B2252]/25'
                  }`}>
                  {isUploading ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ Size Guide Modal ═══ */}
      <AnimatePresence>
        {showSizeGuide && (
          <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowSizeGuide(false)}>
            <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onClick={e => e.stopPropagation()} className="bg-white rounded-t-3xl md:rounded-3xl p-7 w-full md:w-[90%] max-w-lg relative shadow-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#222]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Size Guide</h3>
                <button onClick={() => setShowSizeGuide(false)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[#222] hover:bg-gray-200 cursor-pointer transition-colors">
                  <X size={17} />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr className="bg-[#faf8f5]">
                    {['Size', 'Bust', 'Waist', 'Hip', 'Length'].map(h => (
                      <th key={h} className="py-3 px-3 text-left font-bold text-[#222] uppercase tracking-wider text-[10px]">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {[['XS','32"','26"','36"','40"'],['S','34"','28"','38"','41"'],['M','36"','30"','40"','42"'],['L','38"','32"','42"','43"'],['XL','40"','34"','44"','44"'],['XXL','42"','36"','46"','45"']].map(([s,b,w,h,l], i) => (
                      <tr key={s} className={`border-b border-gray-50 ${i % 2 ? 'bg-[#faf8f5]' : ''}`}>
                        <td className="py-2.5 px-3 font-bold text-[#222]">{s}</td>
                        <td className="py-2.5 px-3 text-gray-600">{b}</td>
                        <td className="py-2.5 px-3 text-gray-600">{w}</td>
                        <td className="py-2.5 px-3 text-gray-600">{h}</td>
                        <td className="py-2.5 px-3 text-gray-600">{l}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-gray-400 mt-4 text-center">Size up if between sizes. All measurements in inches.</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ Image Zoom Modal ═══ */}
      <AnimatePresence>
        {zoomedImg && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 cursor-zoom-out" onClick={() => setZoomedImg(null)}>
            <button onClick={() => setZoomedImg(null)} className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 cursor-pointer z-50 transition-all">
              <X size={24} />
            </button>
            <motion.img initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              src={zoomedImg} className="max-w-[94vw] max-h-[94vh] object-contain rounded-xl" />
          </div>
        )}
      </AnimatePresence>

      {/* ═══ Mobile Sticky Bar ═══ */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-2xl border-t border-gray-200/80 px-3.5 py-2.5 flex items-center gap-2 z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        <div className="flex flex-col shrink-0 min-w-[70px]">
          <span className="text-base font-extrabold text-[#1A0008] leading-none">{product.price}</span>
          {product.originalPrice && <span className="text-[10px] text-gray-400 line-through mt-0.5">{product.originalPrice}</span>}
        </div>

        <button onClick={() => toggleFavorite(product.id)}
          className={`w-10 h-10 flex items-center justify-center rounded-xl border shrink-0 transition-all ${
            favorites[product.id] ? 'bg-rose-50 border-rose-300 text-rose-500' : 'border-gray-200 text-gray-400'
          }`}>
          <Heart size={16} className={favorites[product.id] ? 'fill-current' : ''} />
        </button>

        <button onClick={handleAddToBag} disabled={!isInStock}
          className={`flex-1 h-10 flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            !isInStock
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              : addedToBag 
                ? 'bg-[#2e7d32] text-white shadow-md' 
                : 'bg-[#1A0008] text-white shadow-md'
          }`}>
          {addedToBag ? <><Check size={14} strokeWidth={3} /> Added</> : <><ShoppingBag size={14} /> Bag</>}
        </button>

        <button onClick={() => { 
            if (!isInStock) return;
            const size = selectedFit === 'Stitched' ? (selectedSize || (product.sizes?.length > 0 ? product.sizes[0] : 'Stitched')) : selectedFit;
            let finalSelection = selectedFit === 'Stitched' && size !== 'Stitched' ? `Stitched - ${size}` : selectedFit;
            if (availableColors.length > 0 && availableColors[selectedColorIndex]) {
              finalSelection = `${availableColors[selectedColorIndex].name} | ${finalSelection}`;
            }
            addToCart(product, finalSelection); 
            setView('checkout'); 
          }}
          disabled={!isInStock}
          className={`flex-1 h-10 flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
            !isInStock
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              : 'bg-[#D4AF37] text-white shadow-md hover:bg-[#b8952b]'
          }`}>
          <Sparkles size={13} /> Buy
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar{display:none}
        .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
        .gallery-desktop{display:none}
        .gallery-mobile{display:flex}
        @media(min-width:1024px){
          .gallery-desktop{display:flex}
          .gallery-mobile{display:none!important}
        }
      `}} />
    </div>
  );
}
