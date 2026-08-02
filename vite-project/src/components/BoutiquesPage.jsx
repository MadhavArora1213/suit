import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Store, Star, ArrowRight, MapPin, Award, ShieldCheck, Sparkles, BadgeCheck } from 'lucide-react';
import { getBoutiques } from '../utils/adminStore';

const fallbackBoutiques = [
  {
    name: 'Riwakarri',
    type: 'Shop',
    verified: true,
    established: 2018,
    rating: 4.8,
    orders: '40+',
    location: 'Shop no 21, Floor 1, Sector 117, Plaza 117, Sahibzada Ajit Singh Nagar, Punjab 140307',
    image: '/pakistani_suit.png',
    description: 'Authentic Kanchipuram and Patola silk sarees with traditional South Indian weaving artistry. Every piece tells a story of culture and elegance.',
    tags: ['Verified', 'Traditional Weaves']
  },
  {
    name: 'The Luxuryy Store',
    type: 'Shop',
    verified: true,
    established: 2020,
    rating: 4.9,
    orders: '30+',
    location: 'House Number 1004, Sector 12-A, Panchkula, Haryana 134113',
    image: '/sharara_suit.png',
    description: 'Curated luxury ethnic wear featuring designer lehengas, Indo-western fusion, and premium bridal collections for the modern woman.',
    tags: ['Verified', 'Luxury Boutique']
  },
  {
    name: 'Mahalaksmi Silk Store',
    type: 'Shop',
    verified: true,
    established: 2010,
    rating: 4.8,
    orders: '10+',
    location: 'Tanda, Hoshiarpur, Punjab',
    image: '/designer_suit_1.png',
    description: 'Premium silk sarees, dupattas, and ethnic suits with authentic handloom craftsmanship. A trusted name for wedding and festive collections.',
    tags: ['Verified', 'Silk Specialist']
  },
  {
    name: 'Jagdambay Binny Store',
    type: 'Shop',
    verified: true,
    established: 1995,
    rating: 4.7,
    orders: '20+',
    location: 'Tanda, Hoshiarpur, Punjab',
    image: '/cotton_suit.png',
    description: 'Heritage Banarasi silk and traditional Indian ethnic wear. Known for timeless weave patterns and rich fabric quality.',
    tags: ['Verified', 'Heritage Store']
  },
  {
    name: 'Gurnaaz',
    verified: true,
    established: 2023,
    rating: 4.9,
    orders: '50+',
    location: 'Punjab',
    image: '/designer_suit_1.png',
    description: 'Premium designer ethnic wear featuring handpicked suits, lehengas, and fusion outfits. Your go-to destination for stunning traditional and modern looks.',
    tags: ['Verified', 'Premium Boutique']
  }
];

export default function BoutiquesPage({ setView, setSelectedBoutique }) {
  const [boutiquesList, setBoutiquesList] = useState([]);

  useEffect(() => {
    const loadBoutiques = () => {
      const dynamic = getBoutiques();
      if (dynamic && dynamic.length > 0) {
        setBoutiquesList(dynamic.sort((a, b) => (a.order || 99) - (b.order || 99)));
      } else {
        setBoutiquesList(fallbackBoutiques);
      }
    };
    
    loadBoutiques();
    window.addEventListener('admin-data-updated', loadBoutiques);
    return () => window.removeEventListener('admin-data-updated', loadBoutiques);
  }, []);

  const handleBoutiqueClick = (name) => {
    if (setSelectedBoutique) {
      setSelectedBoutique(name);
      setView('seller-shop');
    } else {
      window.location.href = `/shops-and-boutiques/${name.toLowerCase().replace(/ /g, '-')}`;
    }
  };

  return (
    <div className="min-h-screen bg-white pt-[80px] md:pt-[110px] pb-20 md:pb-32 font-sans overflow-x-hidden">
      
      {/* ─── 10/10 PREMIUM HERO ─── */}
      <div className="relative w-full max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12 py-10 md:py-16 lg:py-24 flex flex-col items-center text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#D4AF37]/5 rounded-full blur-[80px] -z-10" />
        
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="flex items-center gap-4 mb-8">
          <span className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]" />
          <span className="text-[10px] tracking-[0.5em] text-[#D4AF37] uppercase font-bold flex items-center gap-2">
            <ShieldCheck size={14} /> The Directory
          </span>
          <span className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]" />
        </motion.div>
        
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-[#1A0008] tracking-tight leading-tight mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Explore Shops <span className="italic text-[#D4AF37]">& Boutiques</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }} className="max-w-2xl text-gray-500 text-sm md:text-base font-light">
          A meticulously handpicked selection of India's finest luxury boutiques, trending creators, and trusted local artisans.
        </motion.p>
      </div>

      {/* ─── FASHION EDITORIAL MARQUEE ─── */}
      <div className="w-full bg-[#1A0008] py-4 mb-12 md:mb-20 overflow-hidden relative -rotate-[1deg] scale-105 shadow-xl">
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
              <span className="text-[#D4AF37] text-[11px] tracking-[0.3em] font-bold uppercase mx-8">
                ✦ Verified Sellers
              </span>
              <span className="text-white/90 text-[11px] tracking-[0.3em] font-bold uppercase mx-8">
                ✦ Premium Quality
              </span>
              <span className="text-[#D4AF37] text-[11px] tracking-[0.3em] font-bold uppercase mx-8">
                ✦ Direct from Weavers
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ─── EDITORIAL GRID (MIXED SIZES) ─── */}
      <div className="w-full max-w-[1400px] mx-auto px-5 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {boutiquesList.map((boutique, index) => {
            // Make the 1st and 4th items "Featured" to break the grid and add a huge wow factor
            const isFeatured = index === 0 || index === 3;
            
            // Map dynamic fields to UI
            const image = boutique.coverImage || boutique.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80';
            const location = boutique.location || boutique.address || 'Unknown Location';
            const orders = boutique.totalOrders || boutique.orders || '0';
            const tags = boutique.tags || ['Premium Boutique'];
            const tag = tags.length > 0 ? tags[0] : 'Premium Boutique';

            return (
              <motion.div
                key={boutique.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: (index % 2) * 0.1, ease: [0.21, 1.11, 0.81, 0.99] }}
                onClick={() => handleBoutiqueClick(boutique.name)}
                className={`group cursor-pointer bg-[#F8F5F0] rounded-[32px] p-4 flex flex-col items-stretch shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(188,165,138,0.2)] transition-all duration-500 hover:-translate-y-1.5 border border-[#D4AF37]/30 relative overflow-hidden
                  ${isFeatured ? 'lg:col-span-2 sm:flex-row' : 'sm:flex-col xl:flex-row'}`}
              >
                {/* Subtle hover sweep effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_ease-out] pointer-events-none" />

                {/* Image Side */}
                <div className={`w-full rounded-[24px] overflow-hidden relative bg-gray-100 flex-shrink-0 shadow-inner
                  ${isFeatured ? 'sm:w-[50%] min-h-[350px] lg:min-h-[450px]' : 'xl:w-[45%] min-h-[260px] lg:min-h-[300px]'}`}
                >
                  <img 
                    src={image} 
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
                      <span className="bg-white/95 px-3 py-1.5 rounded-full text-[9px] font-extrabold tracking-widest uppercase text-[#D4AF37] shadow-sm border border-[#D4AF37]/20">
                        {tag}
                      </span>
                      {isFeatured && (
                        <span className="flex items-center gap-1 bg-[#1A0008] text-white px-3 py-1.5 rounded-full text-[9px] font-extrabold tracking-widest uppercase shadow-sm">
                          <Sparkles size={10} className="text-[#D4AF37]" /> Spotlight
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[#D4AF37]">
                      <Star size={13} className="fill-current" />
                      <span className="text-[12px] font-bold text-[#1A0008] tracking-wide">{boutique.rating}</span>
                    </div>
                  </div>

                  {/* Name */}
                  <h2 className={`font-medium text-[#1A0008] leading-tight mb-4 group-hover:text-[#D4AF37] transition-colors duration-300 break-words flex items-center gap-3
                      ${isFeatured ? 'text-2xl sm:text-4xl md:text-5xl lg:text-6xl' : 'text-xl sm:text-2xl lg:text-3xl'}`} 
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {boutique.name}
                      {boutique.verified && (
                        <BadgeCheck size={isFeatured ? 36 : 24} className="text-[#007BFF] fill-[#007BFF]/10 shrink-0 mt-1" />
                      )}
                  </h2>
                  
                  {/* Description */}
                  <p className={`font-light leading-relaxed mb-6 md:mb-8 pr-2 text-[#6B6B6B]
                    ${isFeatured ? 'text-sm sm:text-base lg:text-lg line-clamp-3 sm:line-clamp-4' : 'text-xs sm:text-sm line-clamp-2 sm:line-clamp-3'}`}>
                    {boutique.description}
                  </p>

                  {/* Meta details & Button at the bottom */}
                  <div className="mt-auto flex flex-col gap-5">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-medium text-[#888888]">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-[#D4AF37]" /> {location}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-[#D1C8C0]" />
                      <span className="flex items-center gap-1.5">
                        <Store size={14} className="text-[#D4AF37]" /> Est. {boutique.established}
                      </span>
                    </div>

                    <div className="pt-4 sm:pt-5 border-t border-[#D4AF37]/20 flex items-center justify-between w-full gap-2">
                      {/* Compact Orders Badge (Stacked) */}
                      <div className="flex items-center gap-2 sm:gap-2.5">
                        <Award size={16} className="text-[#D4AF37] flex-shrink-0" /> 
                        <div className="flex flex-col items-start justify-center">
                          <span className="text-xs sm:text-sm font-extrabold text-[#1A0008] leading-none">{orders}</span>
                          <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.15em] text-[#888888] uppercase mt-1">Orders</span>
                        </div>
                      </div>
                      
                      {/* Wide Pill Button */}
                      <button className={`py-2.5 sm:py-3 rounded-full flex items-center justify-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500 shadow-sm hover:shadow-md flex-shrink-0 whitespace-nowrap
                        ${isFeatured ? 'px-6 sm:px-8 bg-[#1A0008] text-white hover:bg-[#D4AF37]' : 'px-3 sm:px-4 bg-white text-[#1A0008] hover:bg-[#1A0008] hover:text-white border border-[#D4AF37]/30'}`}>
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
