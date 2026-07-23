import { motion } from 'framer-motion';
import { Store, Star, ArrowRight, MapPin, Award, ShieldCheck, Sparkles } from 'lucide-react';

const topBoutiques = [
  {
    name: 'Badshah Designer Fabrics',
    established: 2008,
    rating: 4.8,
    orders: '25,000+',
    location: 'Ludhiana, Punjab',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',
    description: 'Specializing in handcrafted Punjabi fashion and premium ethnic wear. Experience the legacy of authentic fabrics and unparalleled craftsmanship for your special occasions.',
    tags: ['Premium Boutique']
  },
  {
    name: '@ethnic_vibes_by_sana',
    established: 2021,
    rating: 4.9,
    orders: '5,000+',
    location: 'Instagram Store',
    image: '/designer_suit_1.png',
    description: 'Trending Instagram creator curating viral ethnic wear, georgette suits, and modern bridal blends.',
    tags: ['Instagram Creator']
  },
  {
    name: 'Sharma Ji Textiles',
    established: 1990,
    rating: 4.7,
    orders: '15,000+',
    location: 'Chandni Chowk, Delhi',
    image: '/cotton_suit.png',
    description: 'Trusted local seller famous for wholesale unstitched suits and authentic pure cotton handlooms.',
    tags: ['Local Seller']
  },
  {
    name: 'Gulabo Jaipur',
    established: 2015,
    rating: 4.8,
    orders: '12,000+',
    location: 'Jaipur',
    image: '/sharara_suit.png',
    description: 'Contemporary Angrakha cuts and flowing Sharara sets adorned with exquisite Gota Patti work. Perfect for the modern bride seeking traditional elegance.',
    tags: ['Designer Boutique']
  },
  {
    name: '@style_by_roshni',
    established: 2022,
    rating: 4.6,
    orders: '3,000+',
    location: 'Instagram Store',
    image: '/pakistani_suit.png',
    description: 'Aesthetic Instagram page bringing you the most elegant straight-cut Pakistani suits and soft pastels.',
    tags: ['Instagram Page']
  },
  {
    name: 'Arora Cloth House',
    established: 2005,
    rating: 4.9,
    orders: '30,000+',
    location: 'Amritsar, Punjab',
    image: '/chikankari_suit.png',
    description: 'Your favorite local shop for authentic Phulkari dupattas and daily wear cotton suits at best prices.',
    tags: ['Local Shop']
  }
];

export default function BoutiquesPage({ setView, setSelectedBoutique }) {
  const handleBoutiqueClick = (name) => {
    if (setSelectedBoutique) {
      setSelectedBoutique(name);
      setView('seller-shop');
    } else {
      window.location.href = `/boutiques/${name.toLowerCase().replace(/ /g, '-')}`;
    }
  };

  return (
    <div className="min-h-screen bg-white pt-[110px] pb-32 font-sans overflow-x-hidden">
      
      {/* ─── 10/10 PREMIUM HERO ─── */}
      <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24 flex flex-col items-center text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#BCA58A]/5 rounded-full blur-[80px] -z-10" />
        
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="flex items-center gap-4 mb-8">
          <span className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#BCA58A]" />
          <span className="text-[10px] tracking-[0.5em] text-[#BCA58A] uppercase font-bold flex items-center gap-2">
            <ShieldCheck size={14} /> The Directory
          </span>
          <span className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#BCA58A]" />
        </motion.div>
        
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
          className="text-5xl md:text-6xl lg:text-7xl font-light text-[#111111] tracking-tight leading-tight mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Explore Curated <span className="italic text-[#BCA58A]">Shops</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }} className="max-w-2xl text-gray-500 text-sm md:text-base font-light">
          A meticulously handpicked selection of India's finest luxury boutiques, trending creators, and trusted local artisans.
        </motion.p>
      </div>

      {/* ─── FASHION EDITORIAL MARQUEE ─── */}
      <div className="w-full bg-[#111111] py-4 mb-20 overflow-hidden relative rotate-[-1deg] scale-105 shadow-xl">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }} 
          transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
          className="flex whitespace-nowrap items-center w-max"
        >
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center">
              <span className="text-white/90 text-[11px] tracking-[0.3em] font-bold uppercase mx-8">
                ✦ 100% Authentic
              </span>
              <span className="text-[#BCA58A] text-[11px] tracking-[0.3em] font-bold uppercase mx-8">
                ✦ Verified Sellers
              </span>
              <span className="text-white/90 text-[11px] tracking-[0.3em] font-bold uppercase mx-8">
                ✦ Premium Quality
              </span>
              <span className="text-[#BCA58A] text-[11px] tracking-[0.3em] font-bold uppercase mx-8">
                ✦ Direct from Weavers
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ─── EDITORIAL GRID (MIXED SIZES) ─── */}
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {topBoutiques.map((boutique, index) => {
            // Make the 1st and 4th items "Featured" to break the grid and add a huge wow factor
            const isFeatured = index === 0 || index === 3;

            return (
              <motion.div
                key={boutique.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: (index % 2) * 0.1, ease: [0.21, 1.11, 0.81, 0.99] }}
                onClick={() => handleBoutiqueClick(boutique.name)}
                className={`group cursor-pointer bg-[#F8F5F0] rounded-[32px] p-4 flex flex-col items-stretch shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(188,165,138,0.2)] transition-all duration-500 hover:-translate-y-1.5 border border-[#BCA58A]/30 relative overflow-hidden
                  ${isFeatured ? 'lg:col-span-2 sm:flex-row' : 'sm:flex-col xl:flex-row'}`}
              >
                {/* Subtle hover sweep effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_ease-out] pointer-events-none" />

                {/* Image Side */}
                <div className={`w-full rounded-[24px] overflow-hidden relative bg-gray-100 flex-shrink-0 shadow-inner
                  ${isFeatured ? 'sm:w-[50%] min-h-[350px] lg:min-h-[450px]' : 'xl:w-[45%] min-h-[260px] lg:min-h-[300px]'}`}
                >
                  <img 
                    src={boutique.image} 
                    alt={boutique.name}
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-[2s] ease-out group-hover:scale-110"
                  />
                  {/* Elegant Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content Side */}
                <div className={`w-full flex flex-col justify-center relative z-10 min-w-0
                  ${isFeatured ? 'sm:w-[50%] pt-6 sm:pt-0 sm:pl-12 sm:pr-8' : 'xl:w-[55%] pt-6 xl:pt-2 xl:pl-8 xl:pr-4'}`}
                >
                  
                  {/* Tags & Rating Row */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-white/95 px-3 py-1.5 rounded-full text-[9px] font-extrabold tracking-widest uppercase text-[#BCA58A] shadow-sm border border-[#BCA58A]/20">
                        {boutique.tags[0]}
                      </span>
                      {isFeatured && (
                        <span className="flex items-center gap-1 bg-[#111111] text-white px-3 py-1.5 rounded-full text-[9px] font-extrabold tracking-widest uppercase shadow-sm">
                          <Sparkles size={10} className="text-[#BCA58A]" /> Spotlight
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[#BCA58A]">
                      <Star size={13} className="fill-current" />
                      <span className="text-[12px] font-bold text-[#111111] tracking-wide">{boutique.rating}</span>
                    </div>
                  </div>

                  {/* Name */}
                  <h2 className={`font-medium text-[#111111] leading-tight mb-4 group-hover:text-[#BCA58A] transition-colors duration-300 break-words
                    ${isFeatured ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-2xl lg:text-3xl'}`} 
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {boutique.name}
                  </h2>
                  
                  {/* Description */}
                  <p className={`font-light leading-relaxed mb-8 pr-2 text-[#6B6B6B]
                    ${isFeatured ? 'text-base lg:text-lg line-clamp-4' : 'text-sm line-clamp-3'}`}>
                    {boutique.description}
                  </p>

                  {/* Meta details & Button at the bottom */}
                  <div className="mt-auto flex flex-col gap-5">
                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#888888]">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-[#BCA58A]" /> {boutique.location}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-[#D1C8C0]" />
                      <span className="flex items-center gap-1.5">
                        <Store size={14} className="text-[#BCA58A]" /> Est. {boutique.established}
                      </span>
                    </div>

                    <div className="pt-5 border-t border-[#BCA58A]/20 flex items-center justify-between w-full gap-2">
                      {/* Compact Orders Badge (Stacked) */}
                      <div className="flex items-center gap-2 sm:gap-2.5">
                        <Award size={16} className="text-[#BCA58A] flex-shrink-0" /> 
                        <div className="flex flex-col items-start justify-center">
                          <span className="text-xs sm:text-sm font-extrabold text-[#111111] leading-none">{boutique.orders}</span>
                          <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.15em] text-[#888888] uppercase mt-1">Orders</span>
                        </div>
                      </div>
                      
                      {/* Wide Pill Button */}
                      <button className={`py-2.5 sm:py-3 rounded-full flex items-center justify-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500 shadow-sm hover:shadow-md flex-shrink-0 whitespace-nowrap
                        ${isFeatured ? 'px-6 sm:px-8 bg-[#111111] text-white hover:bg-[#BCA58A]' : 'px-3 sm:px-4 bg-white text-[#111111] hover:bg-[#111111] hover:text-white border border-[#BCA58A]/30'}`}>
                        Visit Boutique
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform flex-shrink-0" />
                      </button>
                    </div>
                  </div>

                </div>

              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Global CSS for Shimmer Animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
      
    </div>
  );
}
