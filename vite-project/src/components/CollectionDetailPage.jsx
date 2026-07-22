import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Heart, Eye, SlidersHorizontal, ChevronDown, ChevronRight, Star, X, Check, ArrowRight } from 'lucide-react';
import { useState, useMemo, useRef } from 'react';
import { getAllProducts } from '../utils/adminStore';

const collectionData = {
  'summer': { title: 'Summer', subtitle: 'Collection', desc: 'Breezy cottons and light georgettes tailored for the warm sun. Embrace the season with breathable fabrics and vibrant prints that keep you cool while looking effortlessly elegant.', image: '/summer_edit.png', accent: '#D4A574', category: 'All', story: 'Inspired by sun-drenched Indian gardens and breezy terraces, this collection celebrates the joy of warm-weather dressing with lightweight fabrics and cheerful palettes.' },
  'monsoon': { title: 'Monsoon', subtitle: 'Collection', desc: 'Vibrant hues and fluid silhouettes to brighten gray days.', image: '/monsoon_edit.png', accent: '#5B9AA0', category: 'All', story: 'When the rains arrive, so does our most colorful collection. Rich jewel tones and flowing fabrics that dance with the monsoon breeze.' },
  'wedding': { title: 'Wedding', subtitle: 'Collection', desc: 'Heavy, regal bridal ensembles crafted for your biggest day.', image: '/wedding_edit.png', accent: '#C77B8A', category: 'All', story: 'For the most important day of your life, we bring you ensembles that carry centuries of bridal tradition, reimagined for the modern bride.' },
  'pastel': { title: 'Pastel', subtitle: 'Collection', desc: 'Soft pinks, mints, and lilacs adorned with delicate threadwork.', image: '/pastel_edit.png', accent: '#B8A9C9', category: 'All', story: 'Whisper-soft hues meet intricate hand embroidery in a collection that celebrates understated elegance and feminine grace.' },
  'black': { title: 'Black', subtitle: 'Collection', desc: 'Striking black suits with dramatic silver and gold accents.', image: '/black_edit.png', accent: '#BCA58A', category: 'All', story: 'Timeless, powerful, and always in style. Our black collection brings drama and sophistication to every occasion.' },
  'luxury': { title: 'Luxury', subtitle: 'Collection', desc: 'Our most exclusive, hand-embroidered heritage pieces.', image: '/luxury_edit.png', accent: '#C5A55A', category: 'All', story: 'The pinnacle of Indian craftsmanship. Each piece in this collection takes weeks of dedicated handwork by master artisans.' },
  'punjabi': { title: 'Punjabi', subtitle: 'Suits', desc: 'Rich Punjabi heritage with vibrant phulkari dupattas and bold silhouettes.', image: '/patiala_suit.png', accent: '#E07A5F', category: 'Patiala', story: 'Bold colors, generous silhouettes, and the exuberant spirit of Punjab come alive in these traditionally crafted suits.' },
  'anarkali': { title: 'Anarkali', subtitle: 'Collection', desc: 'Regal flares and majestic silhouettes inspired by Mughal grandeur.', image: '/anarkali_suit.png', accent: '#81B29A', category: 'Anarkali', story: 'Named after the legendary court dancer, Anarkali suits feature voluminous flares that create a regal, princess-like silhouette.' },
  'sharara': { title: 'Sharara', subtitle: 'Collection', desc: 'Playful tiers and festive drama with traditional three-piece elegance.', image: '/sharara_suit.png', accent: '#F2CC8F', category: 'Sharara', story: 'The three-piece ensemble that has been a staple of Indian celebrations for centuries, now reimagined with contemporary flair.' },
  'chikankari': { title: 'Chikankari', subtitle: 'Collection', desc: 'Delicate shadow embroidery from Lucknow, woven with artisan heritage.', image: '/chikankari_suit.png', accent: '#9DB4C0', category: 'Chikankari', story: 'Born in the royal courts of Lucknow, Chikankari is one of India\'s most refined embroidery traditions, featuring delicate shadow work on sheer fabrics.' },
  'banarasi': { title: 'Banarasi', subtitle: 'Collection', desc: 'Opulent katan silk brocades with golden zari from Varanasi looms.', image: '/banarasi_suit.png', accent: '#C9A96E', category: 'Banarasi', story: 'Handwoven in the ancient city of Varanasi, Banarasi silk is renowned for its gold and silver brocade, fine silk, and opulent embroidery.' },
  'pakistani': { title: 'Pakistani', subtitle: 'Collection', desc: 'Contemporary straight-cut elegance with delicate laces and organza details.', image: '/pakistani_suit.png', accent: '#7EB8C9', category: 'Pakistani', story: 'Clean lines, elegant cuts, and meticulous attention to detail define this collection inspired by cross-border fashion sensibilities.' },
  'designer': { title: 'Designer', subtitle: 'Edit', desc: 'Handpicked designer suits featuring premium fabrics and exclusive craftsmanship.', image: '/designer_suit_1.png', accent: '#D4A574', category: 'All', story: 'Curated from the studios of India\'s most talented designers, each piece is a wearable work of art.' },
  'festive': { title: 'Festive', subtitle: 'Wear', desc: 'Celebratory ensembles with rich embroidery for festivals and puja ceremonies.', image: '/anarkali_suit.png', accent: '#D4574E', category: 'All', story: 'From Diwali to Eid, Navratri to Pongal — celebrate every festival in ensembles that match the joy of the occasion.' },
  'party': { title: 'Party', subtitle: 'Wear', desc: 'Statement pieces with contemporary cuts and glamorous embellishments.', image: '/sharara_suit.png', accent: '#9B59B6', category: 'All', story: 'Make an entrance with bold silhouettes, shimmering fabrics, and statement embellishments designed for unforgettable evenings.' },
  'bridal': { title: 'Bridal', subtitle: 'Collection', desc: 'Exquisite bridal lehengas and suits with heavy zardozi and danka work.', image: '/wedding_edit.png', accent: '#C0392B', category: 'All', story: 'For the bride who wants to honor tradition while embracing modernity, our bridal collection features the finest zardozi, danka, and gota patti work.' },
  'casual': { title: 'Casual', subtitle: '& Daily Wear', desc: 'Comfortable everyday suits in breathable cottons and soft georgettes.', image: '/cotton_suit.png', accent: '#7DCEA0', category: 'Casual', story: 'Elegance doesn\'t need to be reserved for special occasions. Our casual collection brings comfort and style to your everyday wardrobe.' },
  'velvet': { title: 'Velvet', subtitle: 'Collection', desc: 'Luxurious micro-velvet suits with heavy hand-applied zardozi work.', image: '/banarasi_suit.png', accent: '#6C3483', category: 'All', story: 'The richness of velvet meets the artistry of traditional Indian embroidery in this winter-perfect collection.' },
  'silk': { title: 'Pure Silk', subtitle: 'Collection', desc: 'Handloomed silk suits with natural sheen and royal drape.', image: '/luxury_edit.png', accent: '#B7950B', category: 'All', story: 'There is nothing quite like the feel of pure silk against skin. Our silk collection celebrates this most regal of fabrics.' },
  'cotton': { title: 'Cotton', subtitle: 'Collection', desc: 'Breathable handloom cotton suits with block prints and Chikankari.', image: '/cotton_suit.png', accent: '#45B39D', category: 'All', story: 'India\'s gift to the world, handloom cotton is celebrated for its breathability, durability, and the unique character of handwoven textiles.' },
  'georgette': { title: 'Georgette', subtitle: 'Collection', desc: 'Flowy georgette suits with delicate threadwork and easy drape.', image: '/chikankari_suit.png', accent: '#AED6F1', category: 'All', story: 'Lightweight, flowy, and effortlessly elegant — georgette is the fabric of choice for those who love movement and grace.' },
  'organza': { title: 'Organza', subtitle: 'Collection', desc: 'Sheer organza silk suits with intricate floral embroidery and volume.', image: '/pastel_edit.png', accent: '#F5B7B1', category: 'All', story: 'The ethereal sheerness of organza creates a dreamlike quality, perfect for those who love romantic, feminine silhouettes.' },
};

export default function CollectionDetailPage({ slug, setView, setSelectedCategory, setSelectedProduct, setSelectedCollectionSlug, addToCart }) {
  const [favorites, setFavorites] = useState({});
  const [selectedSize, setSelectedSize] = useState('M');
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedBoutique, setSelectedBoutique] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');

  const collection = collectionData[slug];
  const allProducts = useMemo(() => getAllProducts(), []);

  const products = useMemo(() => {
    if (!collection) return [];
    // For specific collections, show only explicitly tagged products
    if (slug === 'wedding' || slug === 'anarkali') {
      return allProducts.filter(p => (p.collection || '').toLowerCase() === slug);
    }
    if (collection.category === 'All') return allProducts;
    return allProducts.filter(p =>
      (p.type || '').toLowerCase() === collection.category.toLowerCase() ||
      (p.suitType || '').toLowerCase() === collection.category.toLowerCase() ||
      (p.collection || '').toLowerCase() === collection.category.toLowerCase()
    );
  }, [collection, allProducts, slug]);

  const boutiques = useMemo(() => ['All', ...new Set(products.map(p => p.boutique).filter(Boolean))], [products]);
  
  // Fake Discount Generation for Libas Style
  const formatPrice = (num) => `₹${num.toLocaleString('en-IN')}`;
  
  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (selectedBoutique !== 'All') result = result.filter(p => p.boutique === selectedBoutique);
    
    // Mock Price Filter
    if (selectedPrice === 'under5k') result = result.filter(p => p.priceNum < 5000);
    if (selectedPrice === '5k-10k') result = result.filter(p => p.priceNum >= 5000 && p.priceNum <= 10000);
    if (selectedPrice === 'over10k') result = result.filter(p => p.priceNum > 10000);

    if (sortBy === 'price-low') result.sort((a, b) => (a.priceNum || 0) - (b.priceNum || 0));
    else if (sortBy === 'price-high') result.sort((a, b) => (b.priceNum || 0) - (a.priceNum || 0));
    else if (sortBy === 'rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return result;
  }, [products, sortBy, selectedBoutique, selectedPrice]);

  const toggleFavorite = (id) => setFavorites(prev => ({ ...prev, [id]: !prev[id] }));

  if (!collection) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center mt-[110px]">
        <div className="text-center">
          <h2 className="text-3xl font-light text-[#111111] mb-4">Collection Not Found</h2>
          <button onClick={() => { setSelectedCollectionSlug(null); setView('collections'); }}
            className="text-[12px] font-semibold uppercase hover:underline cursor-pointer">
            ← Back to Collections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] mt-[110px]">
      {/* ── Breadcrumb & Minimal Header ── */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-6 pb-4">
        <div className="flex items-center gap-2 text-[11px] text-[#6B6B6B] mb-6 tracking-wide" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <span className="cursor-pointer hover:text-black transition-colors" onClick={() => setView('home')}>Home</span>
          <ChevronRight size={12} />
          <span className="cursor-pointer hover:text-black transition-colors" onClick={() => { setSelectedCollectionSlug(null); setView('collections'); }}>Collections</span>
          <ChevronRight size={12} />
          <span className="text-black font-medium">{collection.title}</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-light text-[#111111] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {collection.title} {collection.subtitle}
            </h1>
            <p className="text-sm text-gray-500 font-light" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {filteredProducts.length} items found
            </p>
          </div>
          
          {/* Mobile Filter Toggle */}
          <div className="flex md:hidden items-center justify-between w-full">
            <button onClick={() => setMobileFilterOpen(true)} className="flex items-center gap-2 text-[12px] border border-gray-300 px-4 py-2 font-medium cursor-pointer">
              <SlidersHorizontal size={14} /> FILTERS
            </button>
            <div className="relative">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-transparent border border-gray-300 text-[11px] text-[#111111] font-medium px-4 py-2.5 pr-8 focus:outline-none cursor-pointer">
                <option value="featured">FEATURED</option>
                <option value="price-low">PRICE: LOW TO HIGH</option>
                <option value="price-high">PRICE: HIGH TO LOW</option>
                <option value="rating">TOP RATED</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 pb-16 flex items-start gap-8">
        
        {/* ── Left Sidebar Filters (Desktop) ── */}
        <div className={`fixed inset-0 z-50 bg-[#FAF9F6] md:bg-transparent md:relative md:z-auto w-full md:w-[280px] flex-shrink-0 transition-transform duration-300 ${mobileFilterOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} overflow-y-auto h-full md:h-auto md:block border-r border-[#BCA58A]/10 pr-4`}>
          <div className="flex md:hidden items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-sm tracking-widest uppercase">Filters</h3>
            <button onClick={() => setMobileFilterOpen(false)}><X size={20} /></button>
          </div>
          
          <div className="p-4 md:p-0 space-y-6 md:sticky md:top-[140px]">
            {/* Boutique Filter */}
            <div className="border-b border-gray-100 pb-5">
              <h4 className="text-[11px] font-bold tracking-[0.15em] text-gray-800 uppercase mb-4">Boutique</h4>
              <div className="space-y-3">
                {boutiques.map(b => (
                  <label key={b} className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="boutique" checked={selectedBoutique === b} onChange={() => setSelectedBoutique(b)} className="w-3.5 h-3.5 accent-[#111111] cursor-pointer" />
                    <span className="text-[13px] text-gray-600 group-hover:text-black transition-colors">{b}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="border-b border-gray-100 pb-5">
              <h4 className="text-[11px] font-bold tracking-[0.15em] text-gray-800 uppercase mb-4">Price</h4>
              <div className="space-y-3">
                {[
                  { id: 'All', label: 'All Prices' },
                  { id: 'under5k', label: 'Under ₹5,000' },
                  { id: '5k-10k', label: '₹5,000 - ₹10,000' },
                  { id: 'over10k', label: 'Over ₹10,000' }
                ].map(p => (
                  <label key={p.id} className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="price" checked={selectedPrice === p.id} onChange={() => setSelectedPrice(p.id)} className="w-3.5 h-3.5 accent-[#111111] cursor-pointer" />
                    <span className="text-[13px] text-gray-600 group-hover:text-black transition-colors">{p.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Apply button mobile */}
            <div className="md:hidden mt-8">
              <button onClick={() => setMobileFilterOpen(false)} className="w-full bg-[#111111] text-white py-3.5 text-xs font-bold tracking-widest uppercase cursor-pointer">
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* ── Right Main Content ── */}
        <div className="flex-1 w-full">
          {/* Desktop Sort Bar */}
          <div className="hidden md:flex justify-end mb-6">
            <div className="relative">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-transparent border-none text-[11px] text-[#6B6B6B] hover:text-[#111111] font-medium pr-8 cursor-pointer focus:outline-none tracking-wider transition-colors">
                <option value="featured">SORT BY: FEATURED</option>
                <option value="price-low">PRICE (LOW TO HIGH)</option>
                <option value="price-high">PRICE (HIGH TO LOW)</option>
                <option value="rating">TOP RATED</option>
              </select>
              <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-24 w-full border border-gray-100 rounded-sm">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={24} className="text-gray-300" />
              </div>
              <p className="text-gray-500 text-sm mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>We couldn't find any items matching your selected filters.</p>
              <button onClick={() => { setSelectedBoutique('All'); setSelectedPrice('All'); }}
                className="text-[10px] font-bold tracking-[0.2em] uppercase border border-[#111111] px-8 py-3.5 hover:bg-[#111111] hover:text-white transition-colors cursor-pointer">
                CLEAR ALL FILTERS
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 md:gap-y-12">
              {filteredProducts.map((product) => {
                const isSale = true; // Simulating a sale environment like Libas
                const originalPriceNum = Math.round(product.priceNum * 1.4); // 40% fake markup
                const originalPriceStr = formatPrice(originalPriceNum);
                const discountText = "(40% OFF)";

                return (
                  <div key={product.id} className="group relative cursor-pointer flex flex-col h-full" onClick={() => { setSelectedProduct(product); setView('product-details'); }}>
                    {/* Image Box */}
                    <div className="relative aspect-[3/4] bg-[#f8f8f8] mb-4 overflow-hidden rounded-[2px]">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                      
                      {/* Wishlist Icon */}
                      <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
                        className="absolute top-2.5 right-2.5 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform z-10 cursor-pointer text-gray-400 hover:text-red-500">
                        <Heart size={14} className={favorites[product.id] ? 'fill-red-500 text-red-500' : ''} />
                      </button>

                      {/* Quick Add Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 transition-all duration-300">
                        <button
                          onClick={(e) => { e.stopPropagation(); addToCart(product, 'Unstitched'); }}
                          className="w-full bg-[#111111] text-white text-[10px] font-bold tracking-[0.2em] uppercase py-3.5 flex items-center justify-center gap-2 transition-colors cursor-pointer hover:bg-[#111111]/90 shadow-md">
                          <ShoppingBag size={13} /> ADD TO BAG
                        </button>
                      </div>
                    </div>

                    {/* Product Info - Libas Style */}
                    <div className="px-1 text-left flex flex-col flex-1">
                      <h3 className="text-[13px] text-[#111111] font-medium leading-snug line-clamp-2 mb-2 group-hover:text-gray-600 transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {product.name}
                      </h3>
                      
                      <div className="mt-auto flex flex-wrap items-baseline gap-2 text-[14px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        <span className="font-bold text-[#111111]">{product.price}</span>
                        {isSale && (
                          <>
                            <span className="text-gray-400 line-through text-[12px]">{originalPriceStr}</span>
                            <span className="text-red-600 font-bold text-[11px] tracking-wide">{discountText}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
