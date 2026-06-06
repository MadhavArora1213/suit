import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Heart, MessageCircle, X, ShoppingBag } from 'lucide-react';

const Instagram = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const galleryItems = [
  { id: 1, image: '/designer_suit_1.png', category: 'Traditional', likes: '1.2k', comments: '142', productId: 't1', caption: 'Capturing royal heritage in our zardozi silk suit. Elegance in every single stitch.' },
  { id: 2, image: '/anarkali_suit.png', category: 'Designer', likes: '942', comments: '85', productId: 'n1', caption: 'The perfect crimson flare for festive gatherings. Designed for true connoisseurs.' },
  { id: 3, image: '/pakistani_suit.png', category: 'Party', likes: '2.5k', comments: '210', productId: 't4', caption: 'Vibrant Pakistani silhouettes that flow beautifully. Perfect summer styling.' },
  { id: 4, image: '/sharara_suit.png', category: 'Casual', likes: '652', comments: '44', productId: 't3', caption: 'Playful sharara tiers layered with premium gota details. Make heads turn!' },
  { id: 5, image: '/patiala_suit.png', category: 'Designer', likes: '1.8k', comments: '166', productId: 'n3', caption: 'Bright handloom patiala suit for effortless day wear. 100% breathable cotton.' },
  { id: 6, image: '/chikankari_suit.png', category: 'Traditional', likes: '1.1k', comments: '98', productId: 'b2', caption: 'Lucknowi shadow embroidery on pastel georgette sets. Timeless handloom artistry.' },
  { id: 7, image: '/banarasi_suit.png', category: 'Casual', likes: '784', comments: '63', productId: 'b3', caption: 'Rich Banarasi handwoven brocade panel. A true treasure in your ethnic closet.' },
  { id: 8, image: '/cotton_suit.png', category: 'Party', likes: '3.1k', comments: '302', productId: 't2', caption: 'Delicate block prints on premium chanderi silk. Sophisticated drapes.' },
];

const lookupProduct = (id) => {
  const allProducts = [
    { id: 't1', name: 'Embroidered Silk Suit Set', price: '₹4,299', image: '/designer_suit_1.png', boutique: 'Kala Mandir', badge: 'Silk Blend' },
    { id: 't2', name: 'Chanderi Salwar Suit Set', price: '₹3,899', image: '/cotton_suit.png', boutique: 'Zari Heritage', badge: 'Handloom' },
    { id: 't3', name: 'Designer Angrakha Suit Set', price: '₹5,499', image: '/sharara_suit.png', boutique: 'Gulabo Jaipur', badge: 'Premium' },
    { id: 't4', name: 'Pakistani Straight Suit Set', price: '₹4,799', image: '/pakistani_suit.png', boutique: 'Nazraana', badge: 'Verified' },
    { id: 'n1', name: 'Floral Silk Anarkali Suit', price: '₹6,899', image: '/anarkali_suit.png', boutique: 'Silk Weaver', badge: 'New Edition' },
    { id: 'n3', name: 'Cotton Patiala Salwar Suit', price: '₹2,499', image: '/patiala_suit.png', boutique: 'Jaipur Block', badge: '100% Cotton' },
    { id: 'b2', name: 'Chikankari Handloom Suit Set', price: '₹7,499', image: '/chikankari_suit.png', boutique: 'Awadh Kraft', badge: 'Artisanal' },
    { id: 'b3', name: 'Banarasi Brocade Suit Set', price: '₹9,299', image: '/banarasi_suit.png', boutique: 'Kashi Fabrics', badge: 'Heritage' },
  ];
  return allProducts.find(p => p.id === id);
};

export default function Gallery({ addToCart }) {
  const [filter, setFilter] = useState('All');
  const [lightboxItem, setLightboxItem] = useState(null);

  const categories = ['All', 'Traditional', 'Designer', 'Party', 'Casual'];

  const filteredItems = filter === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter);

  const matchedProduct = lightboxItem ? lookupProduct(lightboxItem.productId) : null;

  return (
    <section className="py-24 bg-white text-left">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-[0.3em] text-[#BCA58A] uppercase block mb-3">
            Social Showcase
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-medium text-[#111111] mb-6">
            Instagram Moments
          </h2>
          <p className="text-[#686868] text-sm md:text-base max-w-xl mx-auto font-body">
            Follow our style journey on social media. Share your look with <span className="font-semibold text-[#BCA58A]">#SuiteEthnicWear</span>.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full font-semibold tracking-wider text-xs transition-all duration-300 cursor-pointer ${
                filter === cat
                  ? 'bg-[#111111] text-[#FAF9F6] shadow-sm'
                  : 'border border-[#EBDDD0] text-[#686868] hover:border-[#111111] hover:text-[#111111]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                onClick={() => setLightboxItem(item)}
                className="aspect-square rounded-2xl overflow-hidden cursor-pointer bg-[#FAF9F6] relative group shadow-sm hover:shadow-premium"
              >
                {/* Image */}
                <img
                  src={item.image}
                  alt={`Instagram feature ${item.id}`}
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700"
                />

                {/* Hover Instagram Stats Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white z-10">
                  <Instagram className="mb-3 stroke-[1.5]" size={24} />
                  <div className="flex gap-5 text-sm font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Heart size={16} className="fill-current" />
                      {item.likes}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageCircle size={16} className="fill-current" />
                      {item.comments}
                    </span>
                  </div>
                </div>

                {/* Corner indicator */}
                <span className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm p-1.5 rounded-lg text-[#111111] z-0 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                  <Instagram size={14} />
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Instagram CTA */}
        <div className="flex justify-center mt-14">
          <motion.a
            href="#"
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(188,165,138,0.2)' }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#BCA58A] to-[#a69076] text-white px-8 py-3.5 rounded-xl text-xs font-semibold tracking-widest hover:shadow-premium transition-all duration-300"
          >
            <Instagram size={16} />
            FOLLOW @SUITEETHNICWEAR
          </motion.a>
        </div>

      </div>

      {/* Instagram Post Lightbox Modal */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxItem(null)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible"
            >
              {/* Close Button */}
              <button
                onClick={() => setLightboxItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-neutral-100 hover:bg-[#BCA58A]/10 text-neutral-800 transition-colors z-10 cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Left Side: Campaign Photo */}
              <div className="w-full md:w-1/2 aspect-square md:aspect-auto md:h-[500px] relative bg-[#FAF9F6]">
                <img
                  src={lightboxItem.image}
                  alt="Campaign Instagram Look"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Right Side: Social Narrative & Shop look */}
              <div className="w-full md:w-1/2 p-8 flex flex-col justify-between text-left">
                <div className="space-y-5">
                  
                  {/* Insta Account Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#EBDDD0]/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#BCA58A]/15 border border-[#BCA58A]/45 flex items-center justify-center font-display font-bold text-sm text-[#BCA58A]">
                        S
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-neutral-900 tracking-wider">suiteethnicwear</span>
                          <span className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center text-white text-[8px] font-bold">✓</span>
                        </div>
                        <span className="text-[10px] text-neutral-400">Jaipur Heritage Palace</span>
                      </div>
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="space-y-2">
                    <p className="text-xs text-[#1E1E1E] leading-relaxed">
                      <span className="font-bold mr-1.5">suiteethnicwear</span>
                      {lightboxItem.caption}
                    </p>
                    <span className="text-[10px] font-semibold text-[#BCA58A] block">
                      #ethnicwear #salwarsuits #anarkali #weddingseason #artisanal
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-neutral-500 text-xs font-semibold pt-2">
                    <span className="flex items-center gap-1.5 text-neutral-900">
                      <Heart size={14} className="fill-[#800020] text-[#800020]" />
                      {lightboxItem.likes} likes
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageCircle size={14} />
                      {lightboxItem.comments} comments
                    </span>
                  </div>

                </div>

                {/* Shoppable Widget Column */}
                {matchedProduct && (
                  <div className="pt-4 border-t border-[#EBDDD0]/40 mt-6 md:mt-0">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#BCA58A] block mb-2.5">SHOP THIS LOOK</span>
                    
                    <div className="bg-[#FAF9F6] border border-[#EBDDD0]/50 rounded-xl p-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-14 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                          <img src={matchedProduct.image} alt={matchedProduct.name} className="w-full h-full object-cover object-top" />
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-neutral-900 line-clamp-1">{matchedProduct.name}</h4>
                          <span className="text-xs font-bold text-[#BCA58A] mt-0.5 block">{matchedProduct.price}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          addToCart(matchedProduct, 'M');
                          alert(`Added ${matchedProduct.name} to bag!`);
                          setLightboxItem(null);
                        }}
                        className="bg-neutral-900 hover:bg-[#BCA58A] text-white p-2.5 px-4 rounded-lg text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ShoppingBag size={12} />
                        ADD
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
