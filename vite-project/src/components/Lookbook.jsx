import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';

const lookbookItems = [
  {
    title: 'Anarkali Silhouette',
    desc: 'Royal flared suits & heavy handloom embroidery for celebrations.',
    image: '/anarkali_suit.png',
    tag: 'Classic Royal',
    num: '01',
    fabric: 'Pure Silk & Banarasi Georgette',
    styleTip: 'Accessorize with heavy polki chokers and an embellished velvet clutch.',
    color: 'Crimson Maroon',
    subtitle: 'Majestic flared tiers that drape with royal heritage.',
    productName: 'Royal Crimson Silk Anarkali Set',
    productPrice: '₹14,999',
    productDesc: 'Includes flared silk anarkali, silk churidar, and handwoven banarasi dupatta.'
  },
  {
    title: 'Sharara & Gharara Sets',
    desc: 'Playful flared bottoms paired with heavily detailed short kurtis.',
    image: '/sharara_suit.png',
    tag: 'Modern Festive',
    num: '02',
    fabric: 'Fine Georgette & Zari Embroidery',
    styleTip: 'Pair with chandbali earrings and high-heeled juttis for the perfect festive stance.',
    color: 'Peach Blossom',
    subtitle: 'Playful flared silhouettes for contemporary celebrations.',
    productName: 'Peach Blossom Embroidered Sharara Set',
    productPrice: '₹12,499',
    productDesc: 'Features heavily detailed georgette kurti, flared sharara, and organza dupatta.'
  },
  {
    title: 'Bridal Zardozi Suits',
    desc: 'Exquisite silk fabric and heavy gold zardozi detailing for wedding ceremonies.',
    image: '/designer_suit_1.png',
    tag: 'Heritage Luxe',
    num: '03',
    fabric: 'Raw Silk & Handcrafted Zardozi',
    styleTip: 'Complete the look with a sheer organza dupatta and traditional gold heritage jewelry.',
    color: 'Ivory Gold',
    subtitle: 'Exquisite craftsmanship hand-embroidered for lifetime memories.',
    productName: 'Ivory Gold Handcrafted Zardozi Suit',
    productPrice: '₹18,999',
    productDesc: 'Crafted in raw silk with antique gold zardozi work. Comes with embroidered dupatta.'
  },
  {
    title: 'Straight-Cut Salwars',
    desc: 'Classic straight-cut suits in pastel tones, organza overlays, and silk blends.',
    image: '/pakistani_suit.png',
    tag: 'Daily Elegance',
    num: '04',
    fabric: 'Mulmul Cotton & Silk Blend',
    styleTip: 'Keep it minimal with pearl studs and a light pastel organza dupatta.',
    color: 'Mint Green',
    subtitle: 'Minimalist lines and lightweight silk blends for everyday grace.',
    productName: 'Mint Green Organza Straight-Cut Suit',
    productPrice: '₹8,499',
    productDesc: 'Soft pastel straight-cut suit with fine embroidery details and matching pants.'
  },
];

export default function Lookbook({ addToCart }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeLook = lookbookItems[activeIndex];

  return (
    <section className="py-28 bg-[#FAF9F6] relative overflow-hidden">
      
      {/* Luxury Editorial Margins */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 [writing-mode:vertical-lr] rotate-180 text-[10px] font-bold tracking-[0.4em] text-[#BCA58A]/20 uppercase hidden 2xl:block select-none pointer-events-none">
        SUITÉ LOOKBOOK
      </div>
      <div className="absolute right-6 top-1/2 -translate-y-1/2 [writing-mode:vertical-lr] text-[10px] font-bold tracking-[0.4em] text-[#BCA58A]/20 uppercase hidden 2xl:block select-none pointer-events-none">
        EDITION 2026
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[10px] tracking-[0.35em] text-[#BCA58A] uppercase block mb-4 font-medium"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Fashion Inspiration
          </span>
          <h2 className="text-4xl md:text-5xl font-light text-[#1E1E1E] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Lookbook &amp; <em className="italic text-[#BCA58A]">Style Guide</em>
          </h2>
          <div className="h-px w-16 bg-[#BCA58A]/30 mx-auto mb-5" />
          <p className="text-[#6B6B6B] text-sm max-w-md mx-auto leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Get inspired by how our ethnic designer suits drape, fit, and capture royal heritage.
          </p>
        </motion.div>

        {/* Split Editorial Interactive Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-center">
          
          {/* Left Side: Photo Frame Board (5 Columns) */}
          <div className="col-span-12 lg:col-span-5 flex justify-center">
            <div className="relative w-full aspect-[3/4] max-w-sm md:max-w-md lg:max-w-none">
              
              {/* Layered Decorative Background Frames */}
              <div className="absolute -inset-3 border border-[#BCA58A]/25 rounded-3xl -rotate-1.5 pointer-events-none"></div>
              <div className="absolute inset-0 bg-[#EBDDD0]/10 rounded-3xl transform rotate-1 pointer-events-none"></div>
              
              {/* Main Photo Card */}
              <div className="relative w-full h-full overflow-hidden rounded-3xl shadow-premium bg-[#FAF9F6]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeIndex}
                    src={activeLook.image}
                    alt={activeLook.title}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="w-full h-full object-cover object-top"
                  />
                </AnimatePresence>
                
                {/* Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none z-10"></div>
                
                {/* floating tag */}
                <span className="absolute top-5 left-5 bg-white/95 backdrop-blur-sm text-[#111111] text-[9px] font-bold tracking-[0.15em] px-3.5 py-1.5 rounded-md uppercase border border-[#EBDDD0]/50 shadow-sm z-20">
                  {activeLook.tag}
                </span>

                {/* Overlay Metadata */}
                <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between text-white z-20 pointer-events-none">
                  <span className="text-[10px] tracking-widest uppercase text-white/85 font-mono">{activeLook.color}</span>
                  <span className="text-sm font-display italic text-[#BCA58A]">{activeLook.num} / LOOK</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Side: Editorial Narrative & Controls (7 Columns) */}
          <div className="col-span-12 lg:col-span-7 flex flex-col justify-center">
            
            {/* Horizontal Selectors */}
            <div className="flex flex-wrap gap-4 md:gap-8 border-b border-[#EBDDD0]/40 pb-4 mb-8">
              {lookbookItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`relative pb-2 text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-300 cursor-pointer ${
                  activeIndex === index ? 'text-[#1E1E1E]' : 'text-[#6B6B6B]/50 hover:text-[#1E1E1E]'
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <span>{item.num} / {item.title.split(' ')[0]}</span>
                  {activeIndex === index && (
                  <motion.div layoutId="lookbookActiveUnderline"
                      className="absolute bottom-0 left-0 right-0 h-px bg-[#BCA58A]"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                  )}
                </button>
              ))}
            </div>

            {/* Narrative Info (Slides in and out when changed) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 md:space-y-8"
              >
                
                {/* Title Blocks */}
                <div className="text-left space-y-3">
                  <span className="text-[9px] font-bold tracking-[0.25em] text-[#BCA58A] uppercase block">
                    {activeLook.tag} &middot; LOOK {activeLook.num}
                  </span>
                  <h3 className="text-3xl md:text-5xl font-display font-medium text-[#111111] leading-tight">
                    {activeLook.title}
                  </h3>
                  <p className="text-base md:text-lg font-display italic text-[#BCA58A] leading-relaxed">
                    "{activeLook.subtitle}"
                  </p>
                  <p className="text-sm text-[#686868] leading-relaxed font-body max-w-xl">
                    {activeLook.desc}
                  </p>
                </div>

                {/* Specs Split */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#EBDDD0]/40 text-left">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#BCA58A]">
                      <Sparkles size={14} />
                      <h5 className="text-[10px] font-bold tracking-[0.2em] uppercase">FABRIC & CRAFT</h5>
                    </div>
                    <p className="text-xs text-[#111111] leading-relaxed font-body">
                      {activeLook.fabric}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#BCA58A]">
                      <Sparkles size={14} />
                      <h5 className="text-[10px] font-bold tracking-[0.2em] uppercase">STYLE ADVISORY</h5>
                    </div>
                    <p className="text-xs text-[#686868] italic leading-relaxed font-body">
                      {activeLook.styleTip}
                    </p>
                  </div>
                </div>

                {/* Inline Shoppable Widget */}
                <div className="pt-6 border-t border-[#EBDDD0]/40 text-left">
                  <div className="bg-[#FAF9F6] border border-[#BCA58A]/15 p-4 md:p-6 flex flex-col sm:flex-row gap-4 items-center justify-between hover:border-[#BCA58A]/40 transition-all duration-500">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#EBDDD0]/15 flex-shrink-0">
                        <img
                          src={activeLook.image}
                          alt={activeLook.productName}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#BCA58A]">SUIT EDITION</span>
                        <h4 className="text-sm font-semibold text-[#111111] font-display mt-0.5">
                          {activeLook.productName}
                        </h4>
                        <span className="text-xs font-bold text-[#111111] tracking-[0.05em] block mt-1">
                          {activeLook.productPrice}
                        </span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => addToCart({
                        id: `look-${activeLook.num}`,
                        name: activeLook.productName,
                        price: activeLook.productPrice,
                        image: activeLook.image,
                        badge: 'Lookbook Edition'
                      }, 'M')}
                      className="w-full sm:w-auto px-6 py-3 bg-[#1E1E1E] hover:bg-[#BCA58A] text-[#FAF9F6] text-[9px] font-bold tracking-[0.2em] flex items-center justify-center gap-2.5 transition-colors duration-300 flex-shrink-0 cursor-pointer"
                    >
                      <ShoppingBag size={14} />
                      <span>ADD LOOK TO BAG</span>
                    </button>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>

          </div>

        </div>

      </div>
    </section>
  );
}



