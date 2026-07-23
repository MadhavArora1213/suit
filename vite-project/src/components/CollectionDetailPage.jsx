import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Heart, Eye, SlidersHorizontal, ChevronDown, ChevronRight, ChevronUp, Star, X, Check, ArrowRight, ShieldCheck, Award } from 'lucide-react';
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

function FilterAccordion({ title, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#BCA58A]/15 pb-5 mb-5">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full text-left group cursor-pointer">
        <h4 className="text-[11px] font-bold tracking-[0.15em] text-gray-800 uppercase group-hover:text-black transition-colors">{title}</h4>
        {isOpen ? <ChevronUp size={14} className="text-gray-400 group-hover:text-black transition-colors" /> : <ChevronDown size={14} className="text-gray-400 group-hover:text-black transition-colors" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="pt-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CollectionDetailPage({ slug, setView, setSelectedCategory, setSelectedProduct, setSelectedCollectionSlug, addToCart }) {
  const [favorites, setFavorites] = useState({});
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  
  const [selectedBoutiques, setSelectedBoutiques] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedPatterns, setSelectedPatterns] = useState([]);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [selectedSleeves, setSelectedSleeves] = useState([]);
  const [selectedNecks, setSelectedNecks] = useState([]);

  const collection = collectionData[slug];
  const allProducts = useMemo(() => getAllProducts(), []);

  const products = useMemo(() => {
    if (!collection) return [];
    
    // Explicit Collection Overrides
    if (slug === 'wedding' || slug === 'anarkali') {
      return allProducts.filter(p => (p.collection || '').toLowerCase() === slug);
    }
    if (slug === 'velvet') {
      return allProducts.filter(p => (p.fabricName || '').toLowerCase().includes('velvet') || (p.name || '').toLowerCase().includes('velvet'));
    }
    if (slug === 'black') {
      return allProducts.filter(p => (p.name || '').toLowerCase().includes('black') || (p.fabricDetails || '').toLowerCase().includes('black'));
    }
    if (slug === 'pastel') {
      const pastels = ['pink', 'peach', 'mint', 'lavender', 'ivory', 'cream', 'blush', 'sky'];
      return allProducts.filter(p => pastels.some(color => (p.name || '').toLowerCase().includes(color) || (p.shortDesc || '').toLowerCase().includes(color)));
    }
    if (slug === 'luxury') {
      return allProducts.filter(p => p.priceNum >= 12000);
    }
    if (slug === 'festive') {
      return allProducts.filter(p => (p.occasions || []).includes('Festive') || (p.occasions || []).includes('Party'));
    }
    if (slug === 'silk') {
      return allProducts.filter(p => (p.fabricName || '').toLowerCase().includes('silk'));
    }
    if (slug === 'casual') {
      return allProducts.filter(p => (p.occasions || []).includes('Casual') || (p.type || '').toLowerCase() === 'casual');
    }
    if (slug === 'monsoon') {
      return allProducts.filter(p => (p.name || '').toLowerCase().includes('blue') || (p.fabricName || '').toLowerCase().includes('georgette') || (p.fabricName || '').toLowerCase().includes('crepe'));
    }

    if (collection.category === 'All') return allProducts;
    
    return allProducts.filter(p =>
      (p.type || '').toLowerCase() === collection.category.toLowerCase() ||
      (p.suitType || '').toLowerCase() === collection.category.toLowerCase() ||
      (p.collection || '').toLowerCase() === collection.category.toLowerCase()
    );
  }, [collection, allProducts, slug]);

  const boutiques = useMemo(() => [...new Set(products.map(p => p.boutique).filter(Boolean))], [products]);
  
  const categoriesList = ['Anarkali', 'Straight Suit', 'Sharara', 'Patiala', 'Lehenga'];
  const fabricsList = ['Cotton', 'Silk', 'Georgette', 'Velvet', 'Organza', 'Chanderi'];
  const occasionsList = ['Casual', 'Festive', 'Wedding', 'Party'];
  const sizesList = ['S', 'M', 'L', 'XL', 'XXL', 'Unstitched'];
  const patternsList = ['Solid', 'Printed', 'Embroidered', 'Floral', 'Geometric', 'Zari Work'];
  const stylesList = ['Straight', 'A-Line', 'Flared', 'Asymmetric'];
  const sleevesList = ['Sleeveless', 'Short Sleeves', '3/4 Sleeves', 'Full Sleeves'];
  const necksList = ['Round Neck', 'V-Neck', 'Square Neck', 'Mandarin Collar', 'Boat Neck'];
  const pricesList = [
    { id: 'under5k', label: 'Under ₹5,000' },
    { id: '5k-10k', label: '₹5,000 - ₹10,000' },
    { id: 'over10k', label: 'Over ₹10,000' }
  ];
  const colorsList = [
    { name: 'Red', hex: '#E74C3C' },
    { name: 'Blue', hex: '#3498DB' },
    { name: 'Green', hex: '#2ECC71' },
    { name: 'Pink', hex: '#F1948A' },
    { name: 'Black', hex: '#111111' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Yellow', hex: '#F1C40F' },
    { name: 'Wine', hex: '#722F37' }
  ];

  const formatPrice = (num) => `₹${num.toLocaleString('en-IN')}`;
  
  const toggleFilter = (setter, value) => {
    setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const clearAllFilters = () => {
    setSelectedBoutiques([]);
    setSelectedPrices([]);
    setSelectedCategories([]);
    setSelectedFabrics([]);
    setSelectedColors([]);
    setSelectedOccasions([]);
    setSelectedSizes([]);
    setSelectedPatterns([]);
    setSelectedStyles([]);
    setSelectedSleeves([]);
    setSelectedNecks([]);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    if (selectedBoutiques.length > 0) result = result.filter(p => selectedBoutiques.includes(p.boutique));
    
    if (selectedPrices.length > 0) {
      result = result.filter(p => {
        if (selectedPrices.includes('under5k') && p.priceNum < 5000) return true;
        if (selectedPrices.includes('5k-10k') && p.priceNum >= 5000 && p.priceNum <= 10000) return true;
        if (selectedPrices.includes('over10k') && p.priceNum > 10000) return true;
        return false;
      });
    }

    const getText = (p) => `${p.name} ${p.desc} ${p.type} ${p.collection}`.toLowerCase();

    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.some(c => getText(p).includes(c.toLowerCase())));
    }
    if (selectedFabrics.length > 0) {
      result = result.filter(p => selectedFabrics.some(f => getText(p).includes(f.toLowerCase())));
    }
    if (selectedColors.length > 0) {
      result = result.filter(p => selectedColors.some(c => getText(p).includes(c.toLowerCase())));
    }
    if (selectedOccasions.length > 0) {
      result = result.filter(p => selectedOccasions.some(o => getText(p).includes(o.toLowerCase())));
    }
    if (selectedSizes.length > 0) {
      result = result.filter(p => selectedSizes.some(s => getText(p).includes(s.toLowerCase())));
    }
    if (selectedPatterns.length > 0) {
      result = result.filter(p => selectedPatterns.some(pt => getText(p).includes(pt.toLowerCase())));
    }
    if (selectedStyles.length > 0) {
      result = result.filter(p => selectedStyles.some(st => getText(p).includes(st.toLowerCase())));
    }
    if (selectedSleeves.length > 0) {
      result = result.filter(p => selectedSleeves.some(sl => getText(p).includes(sl.toLowerCase())));
    }
    if (selectedNecks.length > 0) {
      result = result.filter(p => selectedNecks.some(n => getText(p).includes(n.toLowerCase())));
    }

    if (sortBy === 'price-low') result.sort((a, b) => (a.priceNum || 0) - (b.priceNum || 0));
    else if (sortBy === 'price-high') result.sort((a, b) => (b.priceNum || 0) - (a.priceNum || 0));
    else if (sortBy === 'rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return result;
  }, [products, sortBy, selectedBoutiques, selectedPrices, selectedCategories, selectedFabrics, selectedColors, selectedOccasions]);

  const toggleFavorite = (id) => setFavorites(prev => ({ ...prev, [id]: !prev[id] }));

  const activeFilterCount = selectedBoutiques.length + selectedPrices.length + selectedCategories.length + selectedFabrics.length + selectedColors.length + selectedOccasions.length + selectedSizes.length + selectedPatterns.length + selectedStyles.length + selectedSleeves.length + selectedNecks.length;

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
    <div className="min-h-screen bg-[#FAF9F6] mt-[110px] pb-16 overflow-hidden">
      {/* High-Fashion Editorial Hero */}
      <div className="relative w-full h-[70vh] min-h-[500px] bg-[#FAF9F6] overflow-hidden flex items-center justify-center border-b border-gray-200">
        <motion.div 
          className="absolute inset-0 flex items-center justify-center z-0 opacity-[0.03] pointer-events-none select-none"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.03 }}
          transition={{ duration: 2 }}
        >
          <h1 className="font-black uppercase tracking-tighter text-black whitespace-nowrap" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: `${Math.min(24, 130 / collection.title.length)}vw` }}>
            {collection.title}
          </h1>
        </motion.div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-12 w-full max-w-7xl px-8">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full md:w-1/2 flex justify-center md:justify-end"
          >
            <div className="relative w-64 h-80 md:w-[350px] md:h-[450px] overflow-hidden rounded-[200px] shadow-2xl border-4 border-white">
              <img src={collection.image} alt={collection.title} className="w-full h-full object-cover" />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="w-full md:w-1/2 text-center md:text-left flex flex-col items-center md:items-start"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-[#BCA58A]"></div>
              <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#BCA58A]">Editorial Edit</h2>
            </div>
            <h1 className="text-6xl md:text-8xl font-light text-[#111111] mb-2 leading-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {collection.title}
            </h1>
            <h2 className="text-4xl md:text-5xl italic text-gray-400 mb-6 font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {collection.subtitle}
            </h2>
            <p className="text-gray-500 text-sm md:text-base font-light leading-relaxed max-w-md" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {collection.story || collection.desc}
            </p>
            <button className="mt-10 pb-2 border-b-2 border-[#111111] text-[#111111] uppercase tracking-[0.2em] text-[10px] font-bold hover:text-[#BCA58A] hover:border-[#BCA58A] transition-all cursor-pointer">
              Discover the pieces
            </button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 mt-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#BCA58A]/30 pb-4">
          <div>
            <p className="text-xs text-gray-500 font-bold tracking-[0.2em] uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Explore {filteredProducts.length} Exquisite Pieces
            </p>
          </div>
          
          <div className="flex md:hidden items-center justify-between w-full">
            <button onClick={() => setMobileFilterOpen(true)} className="flex items-center gap-2 text-[12px] border border-gray-300 px-4 py-2 font-medium cursor-pointer bg-white">
              <SlidersHorizontal size={14} /> FILTERS {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
            <div className="relative">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 text-[11px] text-[#111111] font-medium px-4 py-2.5 pr-8 focus:outline-none cursor-pointer">
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
        <div className={`fixed inset-0 z-50 bg-[#FAF9F6] md:bg-transparent md:relative md:z-auto w-full md:w-[280px] flex-shrink-0 transition-transform duration-300 ${mobileFilterOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} overflow-y-auto h-full md:h-auto md:block pr-4`}>
          <div className="flex md:hidden items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
            <h3 className="font-semibold text-sm tracking-widest uppercase">Filters</h3>
            <button onClick={() => setMobileFilterOpen(false)}><X size={20} /></button>
          </div>
          
          <div className="p-4 md:p-0 md:sticky md:top-[140px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[13px] font-bold tracking-widest uppercase text-[#111111]">Filters</h3>
              {activeFilterCount > 0 && (
                <button onClick={clearAllFilters} className="text-[10px] text-red-500 font-bold uppercase tracking-wider hover:underline cursor-pointer">
                  Clear All
                </button>
              )}
            </div>

            <FilterAccordion title="Category" defaultOpen={true}>
              <div className="space-y-3">
                {categoriesList.map(c => (
                  <label key={c} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={selectedCategories.includes(c)} onChange={() => toggleFilter(setSelectedCategories, c)} className="w-4 h-4 rounded-sm border-gray-300 text-[#111111] focus:ring-[#111111] accent-[#111111] cursor-pointer" />
                    <span className="text-[13px] text-gray-600 group-hover:text-black transition-colors">{c}</span>
                  </label>
                ))}
              </div>
            </FilterAccordion>

            <FilterAccordion title="Size" defaultOpen={false}>
              <div className="flex flex-wrap gap-2">
                {sizesList.map(s => (
                  <button key={s} onClick={() => toggleFilter(setSelectedSizes, s)}
                    className={`px-3 py-1.5 border text-[11px] font-medium transition-colors cursor-pointer ${selectedSizes.includes(s) ? 'border-[#111111] bg-[#111111] text-white' : 'border-[#BCA58A]/30 text-[#6B6B6B] hover:border-[#111111]'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </FilterAccordion>

            <FilterAccordion title="Pattern and Print" defaultOpen={false}>
              <div className="space-y-3">
                {patternsList.map(pt => (
                  <label key={pt} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={selectedPatterns.includes(pt)} onChange={() => toggleFilter(setSelectedPatterns, pt)} className="w-4 h-4 accent-[#111111] cursor-pointer" />
                    <span className="text-[13px] text-gray-600 group-hover:text-black transition-colors">{pt}</span>
                  </label>
                ))}
              </div>
            </FilterAccordion>

            <FilterAccordion title="Style" defaultOpen={false}>
              <div className="space-y-3">
                {stylesList.map(st => (
                  <label key={st} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={selectedStyles.includes(st)} onChange={() => toggleFilter(setSelectedStyles, st)} className="w-4 h-4 accent-[#111111] cursor-pointer" />
                    <span className="text-[13px] text-gray-600 group-hover:text-black transition-colors">{st}</span>
                  </label>
                ))}
              </div>
            </FilterAccordion>

            <FilterAccordion title="Sleeve Length" defaultOpen={false}>
              <div className="space-y-3">
                {sleevesList.map(sl => (
                  <label key={sl} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={selectedSleeves.includes(sl)} onChange={() => toggleFilter(setSelectedSleeves, sl)} className="w-4 h-4 accent-[#111111] cursor-pointer" />
                    <span className="text-[13px] text-gray-600 group-hover:text-black transition-colors">{sl}</span>
                  </label>
                ))}
              </div>
            </FilterAccordion>

            <FilterAccordion title="Neck" defaultOpen={false}>
              <div className="space-y-3">
                {necksList.map(n => (
                  <label key={n} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={selectedNecks.includes(n)} onChange={() => toggleFilter(setSelectedNecks, n)} className="w-4 h-4 accent-[#111111] cursor-pointer" />
                    <span className="text-[13px] text-gray-600 group-hover:text-black transition-colors">{n}</span>
                  </label>
                ))}
              </div>
            </FilterAccordion>

            <FilterAccordion title="Fabric" defaultOpen={false}>
              <div className="space-y-3">
                {fabricsList.map(f => (
                  <label key={f} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={selectedFabrics.includes(f)} onChange={() => toggleFilter(setSelectedFabrics, f)} className="w-4 h-4 rounded-sm accent-[#111111] cursor-pointer" />
                    <span className="text-[13px] text-gray-600 group-hover:text-black transition-colors">{f}</span>
                  </label>
                ))}
              </div>
            </FilterAccordion>

            <FilterAccordion title="Color" defaultOpen={true}>
              <div className="flex flex-wrap gap-3">
                {colorsList.map(c => {
                  const isSelected = selectedColors.includes(c.name);
                  return (
                    <button key={c.name} onClick={() => toggleFilter(setSelectedColors, c.name)} title={c.name}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${isSelected ? 'border-gray-400 scale-110 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                      style={{ backgroundColor: c.hex }}>
                      {isSelected && <Check size={12} className={c.name === 'White' || c.name === 'Yellow' ? 'text-black' : 'text-white'} />}
                    </button>
                  );
                })}
              </div>
            </FilterAccordion>

            <FilterAccordion title="Price" defaultOpen={false}>
              <div className="space-y-3">
                {pricesList.map(p => (
                  <label key={p.id} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={selectedPrices.includes(p.id)} onChange={() => toggleFilter(setSelectedPrices, p.id)} className="w-4 h-4 accent-[#111111] cursor-pointer" />
                    <span className="text-[13px] text-gray-600 group-hover:text-black transition-colors">{p.label}</span>
                  </label>
                ))}
              </div>
            </FilterAccordion>

            <FilterAccordion title="Occasion" defaultOpen={false}>
              <div className="space-y-3">
                {occasionsList.map(o => (
                  <label key={o} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={selectedOccasions.includes(o)} onChange={() => toggleFilter(setSelectedOccasions, o)} className="w-4 h-4 accent-[#111111] cursor-pointer" />
                    <span className="text-[13px] text-gray-600 group-hover:text-black transition-colors">{o}</span>
                  </label>
                ))}
              </div>
            </FilterAccordion>

            <FilterAccordion title="Boutique" defaultOpen={false}>
              <div className="space-y-3">
                {boutiques.map(b => (
                  <label key={b} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={selectedBoutiques.includes(b)} onChange={() => toggleFilter(setSelectedBoutiques, b)} className="w-4 h-4 accent-[#111111] cursor-pointer" />
                    <span className="text-[13px] text-gray-600 group-hover:text-black transition-colors">{b}</span>
                  </label>
                ))}
              </div>
            </FilterAccordion>

            <div className="md:hidden mt-8 sticky bottom-0 p-4 bg-white border-t border-gray-100">
              <button onClick={() => setMobileFilterOpen(false)} className="w-full bg-[#111111] text-white py-3.5 text-xs font-bold tracking-widest uppercase cursor-pointer shadow-lg">
                View Results ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full min-w-0">
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

          {filteredProducts.length === 0 ? (
            <div className="text-center py-24 w-full border border-dashed border-[#BCA58A]/30 rounded-sm bg-white/50">
              <div className="w-16 h-16 bg-[#FAF9F6] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#BCA58A]/20">
                <SlidersHorizontal size={20} className="text-[#BCA58A]" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>No Exact Matches</h3>
              <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>We couldn't find any pieces matching all your selected filters. Try removing some to see more results.</p>
              <button onClick={clearAllFilters}
                className="text-[10px] font-bold tracking-[0.2em] uppercase border border-[#111111] px-8 py-3.5 hover:bg-[#111111] hover:text-white transition-colors cursor-pointer">
                CLEAR ALL FILTERS
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12 py-8 w-full px-4 md:px-8">
              {filteredProducts.map((product) => {
                const originalPriceNum = Math.round(product.priceNum * 1.4);
                const originalPriceStr = formatPrice(originalPriceNum);
                
                return (
                  <motion.div 
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex flex-col w-full group cursor-pointer h-full"
                    onClick={() => { setSelectedProduct(product); setView('product-details'); }}
                  >
                    <div className="relative overflow-hidden w-full aspect-[3/4] rounded-[16px] bg-gray-100 mb-4 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                      
                      <div className="absolute top-4 right-4 z-10">
                        <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
                          className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-full shadow-sm flex items-center justify-center hover:scale-110 transition-transform text-gray-900">
                          <Heart size={16} className={favorites[product.id] ? 'fill-red-500 text-red-500' : ''} />
                        </button>
                      </div>
                      
                      {/* Floating Glassmorphism Quick Add */}
                      <div className="absolute inset-x-4 bottom-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                        <button
                          onClick={(e) => { e.stopPropagation(); addToCart(product, 'Unstitched'); }}
                          className="w-full bg-white/85 backdrop-blur-md text-[#111111] py-3.5 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase flex items-center justify-center gap-2 hover:bg-[#111111] hover:text-white transition-colors shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                          <ShoppingBag size={14} /> Add to Bag
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col px-1 flex-grow">
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <h3 className="font-medium text-[#111111] leading-snug group-hover:text-[#BCA58A] transition-colors text-lg md:text-xl line-clamp-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {product.name}
                        </h3>
                        <div className="flex flex-col items-end flex-shrink-0 mt-1">
                          <span className="text-sm font-semibold text-[#111111] tracking-wide">{product.price}</span>
                          <span className="text-gray-400 line-through text-[10px] mt-0.5">{originalPriceStr}</span>
                        </div>
                      </div>
                      
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-auto pt-2">
                        {product.boutique || 'Gurnaaz Select'}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
