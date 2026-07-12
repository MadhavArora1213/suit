import { motion } from 'framer-motion';
import { MapPin, Star, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useState } from 'react';

// Using unsplash images for demo purposes
const featuredStores = [
  {
    id: 1,
    name: "Banaras Heritage",
    city: "Varanasi, UP",
    followers: "12.4k",
    rating: 4.9,
    cover: "https://images.unsplash.com/photo-1605814545564-9a99f121d5fa?auto=format&fit=crop&w=800&q=80",
    logo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: 2,
    name: "The Chikankari Studio",
    city: "Lucknow, UP",
    followers: "8.2k",
    rating: 4.8,
    cover: "https://images.unsplash.com/photo-1621272036047-bb0f76bbc1ad?auto=format&fit=crop&w=800&q=80",
    logo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: 3,
    name: "Royal Rajputana",
    city: "Jaipur, RJ",
    followers: "15.1k",
    rating: 5.0,
    cover: "https://images.unsplash.com/photo-1583391733959-b9e4a36d2c49?auto=format&fit=crop&w=800&q=80",
    logo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: 4,
    name: "Kanjeevaram Looms",
    city: "Kanchipuram, TN",
    followers: "19.8k",
    rating: 4.9,
    cover: "https://images.unsplash.com/photo-1599389274291-7f9a2d8e4040?auto=format&fit=crop&w=800&q=80",
    logo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
  },
];

export default function FeaturedStores({ setView, setSelectedBoutique }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextStore = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredStores.length);
  };

  const prevStore = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredStores.length) % featuredStores.length);
  };

  return (
    <section className="py-32 bg-[#FAF9F6] relative overflow-hidden border-t border-[#111111]/5">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <span className="text-[11px] tracking-[0.5em] text-[#BCA58A] uppercase font-medium mb-6 block" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Boutique Spotlight
            </span>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-light text-[#111111] leading-none tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Featured <em className="italic text-[#BCA58A] font-light">Stores</em>
            </h2>
          </div>
          
          <div className="flex gap-4">
            <button onClick={prevStore} className="w-14 h-14 rounded-full border border-[#111111]/10 flex items-center justify-center hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-all duration-500 cursor-pointer text-[#111111]">
              <ChevronLeft size={20} strokeWidth={1} />
            </button>
            <button onClick={nextStore} className="w-14 h-14 rounded-full border border-[#111111]/10 flex items-center justify-center hover:bg-[#111111] hover:text-white hover:border-[#111111] transition-all duration-500 cursor-pointer text-[#111111]">
              <ChevronRight size={20} strokeWidth={1} />
            </button>
          </div>
        </div>

        {/* Horizontal Slider */}
        <div className="relative w-full overflow-hidden">
          <motion.div 
            className="flex gap-8"
            animate={{ x: `calc(-${currentIndex * 100}% - ${currentIndex * 2}rem)` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ width: "100%" }}
          >
            {featuredStores.map((store) => (
              <div key={store.id} className="min-w-full md:min-w-[calc(50%-1rem)] lg:min-w-[calc(33.333%-1.33rem)] group cursor-pointer">
                <div className="bg-white border border-[#111111]/5 overflow-hidden group-hover:shadow-2xl transition-all duration-700 h-full flex flex-col">
                  
                  {/* Store Cover Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img src={store.cover} alt={store.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                    <div className="absolute inset-0 bg-[#111111]/20 group-hover:bg-[#111111]/10 transition-colors duration-700" />
                    
                    {/* Floating Logo */}
                    <div className="absolute -bottom-8 left-8 w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-lg z-10 bg-white">
                      <img src={store.logo} alt={`${store.name} Logo`} className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Store Details */}
                  <div className="pt-14 px-8 pb-8 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-3xl font-light text-[#111111]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {store.name}
                      </h3>
                      <div className="flex items-center gap-1 bg-[#FAF9F6] px-3 py-1 border border-[#111111]/5">
                        <Star size={12} className="fill-[#BCA58A] text-[#BCA58A]" />
                        <span className="text-[11px] font-medium text-[#111111]" style={{ fontFamily: "'Montserrat', sans-serif" }}>{store.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-[#555] mb-8">
                      <MapPin size={12} strokeWidth={1.5} className="text-[#BCA58A]" />
                      <span className="text-[11px] tracking-wide font-light uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>{store.city}</span>
                      <span className="mx-2 text-[#111111]/20">•</span>
                      <span className="text-[11px] tracking-wide font-light" style={{ fontFamily: "'Montserrat', sans-serif" }}>{store.followers} Followers</span>
                    </div>

                    <div className="mt-auto pt-6 border-t border-[#111111]/5">
                      <button 
                        onClick={() => {
                          if (setSelectedBoutique && setView) {
                            setSelectedBoutique(store.name);
                            setView('seller-shop');
                          }
                        }}
                        className="w-full flex items-center justify-between group-hover:text-[#BCA58A] transition-colors text-[#111111]"
                      >
                        <span className="text-[10px] tracking-[0.3em] font-medium uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>Visit Boutique</span>
                        <ArrowRight size={16} strokeWidth={1} className="group-hover:translate-x-2 transition-transform duration-500" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
