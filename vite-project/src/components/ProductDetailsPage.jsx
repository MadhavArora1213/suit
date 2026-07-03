import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Heart, ShoppingBag, ChevronDown, ChevronUp, Check, ShieldCheck, Truck, RefreshCw, Send, Ruler, Play, Pause, Volume2, VolumeX, X, Video } from 'lucide-react';
import { getReviews, addReview, syncProductReviews } from '../utils/adminStore';

const P = '#005461';

export default function ProductDetailsPage({ product, setView, setSelectedCategory, setSelectedBoutique, addToCart, favorites = {}, toggleFavorite }) {
  const [selectedSize, setSelectedSize] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Reviews state
  const [reviewsList, setReviewsList] = useState([]);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  
  // Accordions state
  const [openAccordions, setOpenAccordions] = useState({
    details: true,
    fabric: false,
    shipping: false,
    care: false
  });

  // Size Guide Modal State
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Reel Modal State
  const [reelOpen, setReelOpen] = useState(false);
  const [reelMuted, setReelMuted] = useState(true);
  const [reelProgress, setReelProgress] = useState(0);
  const [reelSelectedSize, setReelSelectedSize] = useState('M');
  const [reelPlaying, setReelPlaying] = useState(true);
  const reelVideoRef = useRef(null);

  const handleTimeUpdate = () => {
    if (reelVideoRef.current) {
      const progress = (reelVideoRef.current.currentTime / reelVideoRef.current.duration) * 100;
      setReelProgress(progress || 0);
    }
  };

  const toggleReelPlay = () => {
    if (reelVideoRef.current) {
      if (reelPlaying) {
        reelVideoRef.current.pause();
      } else {
        reelVideoRef.current.play().catch(e => console.log(e));
      }
      setReelPlaying(!reelPlaying);
    }
  };

  // Pause playing video if modal closes
  useEffect(() => {
    if (!reelOpen) {
      setReelPlaying(false);
    } else {
      setReelPlaying(true);
      setReelProgress(0);
    }
  }, [reelOpen]);

  useEffect(() => {
    if (product?.id) {
      // Load local cached reviews first for instant rendering
      setReviewsList(getReviews(product.id));
      setActiveImageIndex(0);
      setSelectedSize('');

      // Fetch and sync reviews with Firebase Firestore database in background
      syncProductReviews(product.id, (syncedReviews) => {
        setReviewsList(syncedReviews);
      });
    }
  }, [product]);

  if (!product) {
    return (
      <div className="py-32 text-center">
        <p className="text-sm text-[#6B6B6B]">Loading product details…</p>
        <button onClick={() => setView('home')} className="mt-4 text-xs underline font-bold">Go Home</button>
      </div>
    );
  }

  // Combine main image and additional images
  const allImages = [product.image, ...(product.additionalImages || [])].filter(Boolean);

  const toggleAccordion = (sec) => {
    setOpenAccordions(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      alert('Please fill in your Name and Review text.');
      return;
    }

    const review = {
      name: reviewName,
      rating: reviewRating,
      review: reviewComment
    };

    addReview(product.id, review);
    
    // Refresh reviews
    const updated = getReviews(product.id);
    setReviewsList(updated);
    
    setReviewName('');
    setReviewComment('');
    setReviewRating(5);
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 2500);
  };

  const isFavorite = favorites[product.id];

  // Calculate average stars rating
  const avgRating = reviewsList.length > 0
    ? (reviewsList.reduce((sum, r) => sum + r.rating, 0) / reviewsList.length).toFixed(1)
    : product.rating || '4.5';

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#111111] pt-32 pb-24" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      
      {/* Size Guide Modal */}
      <AnimatePresence>
        {sizeGuideOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSizeGuideOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-[#FAF9F6] border border-[#BCA58A]/35 p-8 max-w-lg w-full shadow-2xl z-10 rounded text-left"
            >
              <button 
                onClick={() => setSizeGuideOpen(false)}
                className="absolute top-4 right-4 text-[#6B6B6B] hover:text-[#111111] font-bold text-xs uppercase"
              >
                Close
              </button>
              
              <h3 className="text-2xl font-light text-[#111111] mb-2 tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Women's Ethnic Kurta Size Guide
              </h3>
              <p className="text-xs text-[#6B6B6B] mb-6">Standard body measurements in inches for salwar suits & kurtas.</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#E8DDD0]/30 border-b border-[#BCA58A]/20">
                      <th className="p-3 font-bold uppercase tracking-wider">Size</th>
                      <th className="p-3 font-bold uppercase tracking-wider">Bust (in)</th>
                      <th className="p-3 font-bold uppercase tracking-wider">Waist (in)</th>
                      <th className="p-3 font-bold uppercase tracking-wider">Hips (in)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#BCA58A]/10">
                    {[
                      { size: 'S (36)', bust: '36"', waist: '32"', hips: '39"' },
                      { size: 'M (38)', bust: '38"', waist: '34"', hips: '41"' },
                      { size: 'L (40)', bust: '40"', waist: '36"', hips: '43"' },
                      { size: 'XL (42)', bust: '42"', waist: '38"', hips: '45"' },
                      { size: 'XXL (44)', bust: '44"', waist: '40"', hips: '47"' }
                    ].map(r => (
                      <tr key={r.size} className="hover:bg-[#E8DDD0]/10">
                        <td className="p-3 font-semibold">{r.size}</td>
                        <td className="p-3">{r.bust}</td>
                        <td className="p-3">{r.waist}</td>
                        <td className="p-3">{r.hips}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-[#6B6B6B] mt-4 leading-relaxed">
                * Note: Standard fits can vary slightly by boutique. For a comfortable loose drape, we recommend ordering one size larger if you fall between sizes.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 text-left">
          <button 
            onClick={() => {
              if (product.type) {
                setSelectedCategory(product.type);
                setView('category');
              } else {
                setView('home');
              }
            }}
            className="inline-flex items-center gap-2 text-xs tracking-widest text-[#BCA58A] hover:text-[#111111] uppercase font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span>Back to Category</span>
          </button>
        </div>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 items-start">
          
          {/* LEFT: Multi-photo Gallery */}
          <div className="flex flex-col gap-4">
            {/* Large Main Photo */}
            <div className="w-full aspect-[3/4] bg-white border border-[#BCA58A]/10 overflow-hidden relative rounded shadow-sm">
              {activeImageIndex === allImages.length && product.videoUrl ? (
                <video 
                  src={product.videoUrl} 
                  controls 
                  autoPlay 
                  playsInline
                  loop 
                  muted 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src={allImages[activeImageIndex]} 
                  alt={product.name} 
                  className="w-full h-full object-cover object-top"
                />
              )}
              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#FAF9F6]/90 backdrop-blur-sm text-[#BCA58A] text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 border border-[#BCA58A]/25 rounded-sm z-10">
                  {product.badge}
                </span>
              )}
            </div>
            
            {/* Small Thumbnails Carousel */}
            {(allImages.length > 1 || product.videoUrl) && (
              <div className="flex gap-3 overflow-x-auto py-1">
                {allImages.map((img, index) => (
                  <button 
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`w-20 aspect-[3/4] overflow-hidden bg-white border flex-shrink-0 transition-all rounded cursor-pointer ${
                      activeImageIndex === index 
                        ? 'border-[#BCA58A] ring-1 ring-[#BCA58A]/20' 
                        : 'border-[#BCA58A]/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover object-top" />
                  </button>
                ))}
                
                {/* Product Video Thumbnail */}
                {product.videoUrl && (
                  <button 
                    onClick={() => setActiveImageIndex(allImages.length)}
                    className={`w-20 aspect-[3/4] bg-[#111111] flex-shrink-0 transition-all rounded cursor-pointer border flex items-center justify-center relative overflow-hidden ${
                      activeImageIndex === allImages.length 
                        ? 'border-[#BCA58A] ring-1 ring-[#BCA58A]/20' 
                        : 'border-[#BCA58A]/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="absolute inset-0 bg-[#111111]/40 z-10 flex items-center justify-center">
                      <Play size={20} className="text-[#FAF9F6] fill-[#FAF9F6]" />
                    </div>
                    <video src={product.videoUrl} referrerPolicy="no-referrer" className="w-full h-full object-cover pointer-events-none opacity-50" muted />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Product specifications */}
          <div className="space-y-6 text-left">
            <div className="space-y-2">
              <span 
                onClick={() => {
                  setSelectedBoutique(product.boutique);
                  setView('seller-shop');
                }}
                className="inline-block text-[#BCA58A] text-[9px] font-bold tracking-[0.2em] uppercase border border-[#BCA58A]/25 px-3 py-1 rounded-sm cursor-pointer hover:bg-[#BCA58A] hover:text-[#FAF9F6] transition-all"
              >
                ✓ Boutique: {product.boutique}
              </span>
              
              <h1 className="text-3xl md:text-4xl font-light text-[#111111] leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {product.name}
              </h1>

              {/* Rating Summary Link */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className={parseFloat(avgRating) >= i + 1 ? 'fill-amber-400 text-amber-400' : 'text-[#C8E8EC]'} />
                  ))}
                </div>
                <span className="text-xs font-semibold text-[#111111]/70">{avgRating} Stars</span>
                <span className="text-xs text-[#BCA58A] font-semibold">({reviewsList.length} customer reviews)</span>
              </div>
            </div>

            {/* Price Details */}
            <div className="space-y-1 py-3 border-y border-[#BCA58A]/10">
              <p className="text-3xl font-light text-[#BCA58A] font-display" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {product.price}
              </p>
              <p className="text-[10px] text-[#6B6B6B] uppercase font-bold tracking-wider">Inclusive of all taxes · Free standard shipping</p>
            </div>

            {/* Product short description */}
            <p className="text-sm text-[#6B6B6B] leading-relaxed">
              {product.shortDesc || 'An exquisite, handcrafted designer salwar suit set featuring elegant details and luxurious fabrics tailored to perfection.'}
            </p>

            {/* Size Selector */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase tracking-widest text-[#6B6B6B] font-bold">Select Size</label>
                <button 
                  onClick={() => setSizeGuideOpen(true)}
                  className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-[#BCA58A] font-bold hover:text-[#111111] transition-all cursor-pointer"
                >
                  <Ruler size={12} />
                  <span>Size Guide</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {['S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)'].map((size) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 py-3 text-xs font-semibold transition-all border rounded cursor-pointer ${
                      selectedSize === size 
                        ? 'bg-[#111111] text-[#FAF9F6] border-transparent shadow' 
                        : 'border-[#BCA58A]/20 bg-white hover:border-[#111111] text-[#111111]/70'
                    }`}
                  >
                    {size.split(' ')[0]}
                  </button>
                ))}
              </div>
              {selectedSize && (
                <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider animate-fadeIn">✓ Size {selectedSize.split(' ')[0]} selected. In stock & ready to ship.</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button 
                  whileHover={{ scale: 1.01 }} 
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    if (!selectedSize) {
                      alert('Please select a size before adding to bag.');
                      return;
                    }
                    addToCart(product, selectedSize.split(' ')[0]);
                    alert(`Added ${product.name} (Size ${selectedSize.split(' ')[0]}) to your bag!`);
                  }}
                  className="flex-1 bg-[#BCA58A] hover:bg-[#9A8268] text-white py-4 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2.5 transition-colors shadow-lg cursor-pointer"
                >
                  <ShoppingBag size={14} />
                  <span>ADD TO BAG</span>
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleFavorite(product.id)}
                  className={`px-5 py-4 border flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase transition-all cursor-pointer rounded ${
                    isFavorite 
                      ? 'bg-rose-50 border-rose-200 text-rose-500 hover:bg-rose-100' 
                      : 'border-[#BCA58A]/35 bg-white text-[#111111]/70 hover:border-[#111111]'
                  }`}
                >
                  <Heart size={14} className={isFavorite ? 'fill-current' : ''} />
                  <span>{isFavorite ? 'Saved' : 'Wishlist'}</span>
                </motion.button>
              </div>

              {/* Prominent Direct Checkout Order Button */}
              <motion.button 
                whileHover={{ scale: 1.01 }} 
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  if (!selectedSize) {
                    alert('Please select a size before placing your order.');
                    return;
                  }
                  addToCart(product, selectedSize.split(' ')[0]);
                  setView('checkout');
                }}
                className="w-full bg-[#005461] hover:bg-[#003B44] text-[#FAF9F6] py-4 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2.5 transition-colors shadow-lg cursor-pointer rounded"
              >
                <span>BUY NOW / ORDER NOW</span>
              </motion.button>

              {/* Product Reel Button */}
              {product.reelUrl && (
                <motion.button 
                  whileHover={{ scale: 1.01, boxShadow: '0 4px 20px rgba(188,165,138,0.25)' }} 
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setReelOpen(true)}
                  className="w-full bg-[#FAF9F6] border border-[#BCA58A] hover:bg-[#E8DDD0]/20 text-[#BCA58A] py-4 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2.5 transition-colors shadow-sm rounded cursor-pointer"
                >
                  <Video size={14} className="animate-pulse" />
                  <span>WATCH PRODUCT REEL (9:16)</span>
                </motion.button>
              )}
            </div>

            {/* Editorial Accordion specs */}
            <div className="border-t border-[#BCA58A]/15 pt-2 mt-8 space-y-1">
              
              {/* Description Details */}
              <div className="border-b border-[#BCA58A]/10">
                <button onClick={() => toggleAccordion('details')} className="w-full py-4 flex justify-between items-center font-medium text-xs tracking-wider uppercase text-[#111111] hover:text-[#BCA58A] transition-colors">
                  <span>Product Details & Description</span>
                  {openAccordions.details ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                <AnimatePresence>
                  {openAccordions.details && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pb-4 text-xs text-[#6B6B6B] leading-relaxed space-y-2">
                      <p>{product.fabricDetails || 'Tailored in heavy raw silk fabrics with direct zari work inputs, matching salwar bottoms, and luxury dupatta details.'}</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Premium detailing: fine thread laces & mirror works</li>
                        <li>Origin: Handloomed by boutique artisans in India</li>
                        <li>Perfect for wedding partywear, bridal campaign edits, and festivals</li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Fabric Details */}
              <div className="border-b border-[#BCA58A]/10">
                <button onClick={() => toggleAccordion('fabric')} className="w-full py-4 flex justify-between items-center font-medium text-xs tracking-wider uppercase text-[#111111] hover:text-[#BCA58A] transition-colors">
                  <span>Fabric & Artisan Craft</span>
                  {openAccordions.fabric ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                <AnimatePresence>
                  {openAccordions.fabric && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pb-4 text-xs text-[#6B6B6B] leading-relaxed">
                      <p className="font-semibold text-[#111111] mb-1">{product.fabricName || 'Pure Silk & Zari Weaves'}</p>
                      <p>{product.fabricDesc || 'Every design uses high-density counts. Woven by hand using silver and gold threads in specialized regional craft mills.'}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Shipping & Returns */}
              <div className="border-b border-[#BCA58A]/10">
                <button onClick={() => toggleAccordion('shipping')} className="w-full py-4 flex justify-between items-center font-medium text-xs tracking-wider uppercase text-[#111111] hover:text-[#BCA58A] transition-colors">
                  <span>Shipping & Free returns</span>
                  {openAccordions.shipping ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                <AnimatePresence>
                  {openAccordions.shipping && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pb-4 text-xs text-[#6B6B6B] leading-relaxed space-y-2.5">
                      <div className="flex gap-3 items-start"><Truck size={14} className="text-[#BCA58A] mt-0.5" /> <p>Free standard dispatch across India. Delivered in 4–7 business days.</p></div>
                      <div className="flex gap-3 items-start"><RefreshCw size={14} className="text-[#BCA58A] mt-0.5" /> <p>15-day return window. Free pick-up in original packaging.</p></div>
                      <div className="flex gap-3 items-start"><ShieldCheck size={14} className="text-[#BCA58A] mt-0.5" /> <p>Secure shipping with dynamic transit tracing IDs.</p></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Care Instructions */}
              <div className="border-b border-[#BCA58A]/10">
                <button onClick={() => toggleAccordion('care')} className="w-full py-4 flex justify-between items-center font-medium text-xs tracking-wider uppercase text-[#111111] hover:text-[#BCA58A] transition-colors">
                  <span>Wash Care Guidelines</span>
                  {openAccordions.care ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                <AnimatePresence>
                  {openAccordions.care && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pb-4 text-xs text-[#6B6B6B] leading-relaxed">
                      <p>Recommended care to preserve metallic zari weaves and delicate hand-embroidery work:</p>
                      <ul className="list-disc pl-4 space-y-1 mt-1 font-semibold text-[#111111]">
                        {product.care?.map((c, i) => <li key={i}>{c}</li>) || (
                          <>
                            <li>Dry Clean Only</li>
                            <li>Do Not Bleach</li>
                            <li>Iron on Low Heat Backside</li>
                          </>
                        )}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>

        </div>

        {/* ── BOTTOM SECTION: Persistent Review & Rating System ── */}
        <div className="border-t border-[#BCA58A]/15 mt-20 pt-16 text-left">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 xl:gap-16 items-start">
            
            {/* Left: Star Averages & Bars */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-light text-[#111111] mb-2 tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Customer Feedback
                </h3>
                <p className="text-xs text-[#6B6B6B]">Honest reviews shared by verified Gurnaaz boutique clients.</p>
              </div>

              <div className="bg-white border border-[#BCA58A]/15 p-6 rounded text-center space-y-3">
                <h4 className="text-5xl font-light text-[#BCA58A]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {avgRating}
                </h4>
                <div className="flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} className={parseFloat(avgRating) >= i + 1 ? 'fill-amber-400 text-amber-400' : 'text-[#C8E8EC]'} />
                  ))}
                </div>
                <p className="text-xs text-[#6B6B6B] uppercase font-bold tracking-widest pt-1">Average rating stars</p>
                <p className="text-[10px] text-[#6B6B6B]">Based on {reviewsList.length} verified ratings</p>
              </div>
            </div>

            {/* Middle/Right: Reviews List and Submission form */}
            <div className="lg:col-span-2 space-y-10">
              
              {/* Form card */}
              <div className="bg-white border border-[#BCA58A]/15 p-6 md:p-8 rounded space-y-6 shadow-sm">
                <div>
                  <h4 className="text-lg font-semibold text-[#111111]">Write a Customer Review</h4>
                  <p className="text-xs text-[#6B6B6B] mt-0.5">Let others know about the fabric feel, drape quality, and fitting accuracy.</p>
                </div>

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#6B6B6B] font-bold block">Your Name</label>
                      <input 
                        type="text" 
                        required 
                        value={reviewName} 
                        onChange={e => setReviewName(e.target.value)}
                        placeholder="e.g. Meera Patel" 
                        className="w-full bg-[#FAF9F6] border border-[#BCA58A]/20 focus:border-[#BCA58A] outline-none p-3 text-xs transition-colors rounded"
                      />
                    </div>

                    {/* Star selector */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-[#6B6B6B] font-bold block">Rate Product</label>
                      <div className="flex items-center gap-2.5 py-2">
                        {[1, 2, 3, 4, 5].map(n => (
                          <button 
                            key={n} 
                            type="button" 
                            onClick={() => setReviewRating(n)}
                            className="transition-transform hover:scale-110 active:scale-95"
                          >
                            <Star size={20} className={reviewRating >= n ? 'fill-amber-400 text-amber-400' : 'text-[#C8E8EC]'} />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-[#111111] ml-2">{reviewRating} out of 5</span>
                      </div>
                    </div>

                  </div>

                  {/* Comment */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#6B6B6B] font-bold block">Review Comment</label>
                    <textarea 
                      rows={3} 
                      required
                      value={reviewComment}
                      onChange={e => setReviewComment(e.target.value)}
                      placeholder="Share your detailed feedback here..." 
                      className="w-full bg-[#FAF9F6] border border-[#BCA58A]/20 focus:border-[#BCA58A] outline-none p-3 text-xs transition-colors rounded resize-none"
                    />
                  </div>

                  {reviewSubmitted && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">
                      ✓ Thank you! Review submitted successfully.
                    </motion.p>
                  )}

                  <motion.button 
                    type="submit" 
                    whileHover={{ scale: 1.01 }} 
                    whileTap={{ scale: 0.99 }}
                    className="bg-[#111111] hover:bg-[#BCA58A] text-white px-8 py-3 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Send size={12} />
                    <span>Submit Review</span>
                  </motion.button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-[#111111] border-b border-[#BCA58A]/10 pb-3">Reviews ({reviewsList.length})</h4>
                
                {reviewsList.length === 0 ? (
                  <div className="py-8 text-center text-[#6B6B6B] text-xs">
                    No customer reviews written yet for this product. Be the first to share your experience!
                  </div>
                ) : (
                  <div className="space-y-6 divide-y divide-[#BCA58A]/10">
                    {reviewsList.map((r, i) => (
                      <div key={r.id || i} className={`pt-6 ${i === 0 ? 'pt-0' : ''} space-y-2`}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#E8DDD0] flex items-center justify-center text-xs font-bold text-[#111111] border border-[#BCA58A]/20">
                              {r.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-[#111111]">{r.name}</h5>
                              <p className="text-[9px] text-[#6B6B6B] font-semibold uppercase tracking-widest">{r.date}</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, idx) => (
                              <Star key={idx} size={11} className={r.rating >= idx + 1 ? 'fill-amber-400 text-amber-400' : 'text-[#C8E8EC]'} />
                            ))}
                          </div>
                        </div>

                        <p className="text-xs text-[#6B6B6B] leading-relaxed pl-11">
                          "{r.review}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* 9:16 Vertical Reel Modal */}
      <AnimatePresence>
        {reelOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Dark Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 0.9 }} 
              exit={{ opacity: 0 }}
              onClick={() => setReelOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
            />
            
            {/* Phone Container Shell */}
            <motion.div 
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-[380px] aspect-[9/16] h-[82vh] max-h-[760px] bg-[#111111] rounded-[2.5rem] border-[8px] border-[#2E2E2E] shadow-2xl overflow-hidden z-10 flex flex-col justify-end text-left"
            >
              {/* Smartphone Camera Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-[#2E2E2E] rounded-full z-30 flex items-center justify-center">
                <div className="w-12 h-1 bg-black/40 rounded-full" />
              </div>

              {/* Video Element */}
              <div className="absolute inset-0 w-full h-full cursor-pointer" onClick={toggleReelPlay}>
                <video 
                  ref={reelVideoRef}
                  src={product.reelUrl} 
                  autoPlay 
                  playsInline
                  loop 
                  muted={reelMuted}
                  onTimeUpdate={handleTimeUpdate}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                
                {/* Play/Pause Overlay Indicator on Tap */}
                {!reelPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center text-white backdrop-blur-sm">
                      <Play size={28} className="fill-current" />
                    </div>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setReelOpen(false)}
                className="absolute top-6 right-6 p-2 bg-black/45 hover:bg-black/60 text-white rounded-full backdrop-blur-sm z-30 border border-white/10 transition-colors"
              >
                <X size={16} />
              </button>

              {/* Right Side Social Bar */}
              <div className="absolute right-4 bottom-32 flex flex-col gap-5 z-20 items-center">
                {/* Wishlist Icon */}
                <button 
                  onClick={() => toggleFavorite(product.id)}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className={`p-3 rounded-full backdrop-blur-md border ${
                    favorites[product.id] 
                      ? 'bg-rose-500 border-rose-400 text-white' 
                      : 'bg-black/40 border-white/10 text-white hover:bg-black/60'
                  } transition-all`}>
                    <Heart size={16} className={favorites[product.id] ? 'fill-current' : ''} />
                  </div>
                  <span className="text-[9px] text-white/90 font-bold uppercase tracking-wider">Save</span>
                </button>

                {/* Mute Button */}
                <button 
                  onClick={() => setReelMuted(!reelMuted)}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="p-3 bg-black/40 border border-white/10 text-white hover:bg-black/60 rounded-full backdrop-blur-md transition-all">
                    {reelMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </div>
                  <span className="text-[9px] text-white/90 font-bold uppercase tracking-wider">{reelMuted ? 'Mute' : 'Sound'}</span>
                </button>
              </div>

              {/* Bottom Glassmorphism Product Card & Description */}
              <div className="relative z-20 p-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-20 flex flex-col gap-4">
                
                {/* Brand & Title info */}
                <div className="space-y-1">
                  <span className="text-[9px] tracking-widest text-[#BCA58A] uppercase font-bold">
                    {product.boutique} · EXCLUSIVE
                  </span>
                  <h3 className="text-lg font-light text-white leading-tight font-display" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {product.name}
                  </h3>
                  <p className="text-sm font-semibold text-[#BCA58A]">{product.price}</p>
                </div>

                {/* Size chips selector inside reel */}
                <div className="space-y-1.5">
                  <span className="text-[9px] text-white/70 uppercase tracking-widest font-bold">Select Size</span>
                  <div className="flex gap-1.5">
                    {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                      <button 
                        key={sz}
                        onClick={() => setReelSelectedSize(sz)}
                        className={`px-3 py-1.5 text-[10px] font-bold rounded border transition-colors ${
                          reelSelectedSize === sz 
                            ? 'bg-[#BCA58A] border-transparent text-[#FAF9F6]' 
                            : 'bg-black/30 border-white/15 text-white hover:border-[#BCA58A]'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add to Cart quick CTA */}
                <button 
                  onClick={() => {
                    addToCart(product, reelSelectedSize);
                    alert(`Added ${product.name} (Size ${reelSelectedSize}) to your bag!`);
                    setReelOpen(false);
                  }}
                  className="w-full bg-[#BCA58A] hover:bg-[#9A8268] text-white py-3 text-[10px] font-bold tracking-[0.25em] uppercase flex items-center justify-center gap-2 transition-colors rounded-lg shadow-lg"
                >
                  <ShoppingBag size={12} />
                  <span>ADD TO BAG</span>
                </button>
              </div>

              {/* Progress Slider Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/15 z-20">
                <div 
                  className="h-full bg-[#BCA58A] transition-all duration-100 ease-linear"
                  style={{ width: `${reelProgress}%` }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
