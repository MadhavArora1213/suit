import { motion } from 'framer-motion';
import { Store, Star, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

const topBoutiques = [
  {
    name: 'Badshah Designer Fabrics',
    established: 2008,
    rating: 4.8,
    orders: '25,000+',
    location: 'Ludhiana, Punjab',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    description: 'Specializing in handcrafted Punjabi fashion and premium ethnic wear with over 15 years of legacy.',
  },
  {
    name: 'Kala Mandir',
    established: 1995,
    rating: 4.9,
    orders: '40,000+',
    location: 'Delhi',
    image: '/designer_suit_1.png',
    description: 'Renowned for exquisite silk blends and heavy bridal collections curated for grand occasions.',
  },
  {
    name: 'Zari Heritage',
    established: 2012,
    rating: 4.7,
    orders: '15,000+',
    location: 'Jaipur, Rajasthan',
    image: '/cotton_suit.png',
    description: 'Your destination for authentic Chanderi handlooms and traditional block-printed everyday wear.',
  },
  {
    name: 'Gulabo Jaipur',
    established: 2015,
    rating: 4.8,
    orders: '12,000+',
    location: 'Jaipur, Rajasthan',
    image: '/sharara_suit.png',
    description: 'Contemporary Angrakha cuts and flowing Sharara sets adorned with intricate Gota Patti work.',
  },
  {
    name: 'Nazraana',
    established: 2010,
    rating: 4.6,
    orders: '18,000+',
    location: 'Lucknow, UP',
    image: '/pakistani_suit.png',
    description: 'Premium destination for elegant straight-cut Pakistani suits and classic shadow-work embroidery.',
  },
  {
    name: 'Awadh Kraft',
    established: 2005,
    rating: 4.9,
    orders: '30,000+',
    location: 'Lucknow, UP',
    image: '/chikankari_suit.png',
    description: 'Masters of authentic artisanal Chikankari embroidery on pure modal and cotton fabrics.',
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
    <div className="min-h-screen bg-[#FAF9F6] mt-[110px] pb-24">
      {/* Hero Section */}
      <div className="relative bg-[#111111] text-[#FAF9F6] py-20 px-6 md:px-12 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="/luxury_edit.png" alt="Boutiques" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="text-[10px] tracking-[0.3em] text-[#BCA58A] uppercase font-bold mb-4 block">Our Partners</span>
          <h1 className="text-4xl md:text-6xl font-light mb-6 tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Curated Boutiques
          </h1>
          <p className="text-sm md:text-base text-[#FAF9F6]/80 font-light leading-relaxed max-w-xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Discover India's finest designers and authentic ethnic wear boutiques, handpicked for their craftsmanship, quality, and legacy.
          </p>
        </div>
      </div>

      {/* Grid Section */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-16">
        <div className="flex items-center justify-between mb-10 border-b border-[#BCA58A]/20 pb-4">
          <h2 className="text-xl md:text-2xl font-medium text-[#111111]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Featured Boutiques
          </h2>
          <span className="text-[11px] text-[#6B6B6B] tracking-widest uppercase font-semibold">
            {topBoutiques.length} Partners
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {topBoutiques.map((boutique, index) => (
            <motion.div 
              key={boutique.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => handleBoutiqueClick(boutique.name)}
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
            >
              <div className="h-64 relative overflow-hidden bg-gray-100">
                <img src={boutique.image} alt={boutique.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1 text-[10px] font-bold shadow-sm">
                  <Star size={10} className="fill-amber-400 text-amber-400" /> {boutique.rating}
                </div>
                {boutique.name === 'Badshah Designer Fabrics' && (
                  <div className="absolute top-4 left-4 bg-[#BCA58A] text-white px-3 py-1.5 text-[9px] font-bold tracking-widest uppercase shadow-sm">
                    Premium Partner
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-2xl font-medium text-[#111111] group-hover:text-[#BCA58A] transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {boutique.name}
                  </h3>
                </div>
                
                <p className="text-xs text-gray-500 leading-relaxed mb-6 h-10 line-clamp-2">
                  {boutique.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-6 border-t border-gray-100 pt-4">
                  <span className="text-[10px] text-[#111111]/70 font-semibold flex items-center gap-1 tracking-wide">
                    <Store size={12} className="text-[#BCA58A]" /> Est. {boutique.established}
                  </span>
                  <span className="text-[10px] text-[#111111]/70 font-semibold flex items-center gap-1 tracking-wide">
                    <MapPin size={12} className="text-[#BCA58A]" /> {boutique.location}
                  </span>
                  <span className="text-[10px] text-[#111111]/70 font-semibold flex items-center gap-1 tracking-wide">
                    <ShieldCheck size={12} className="text-[#BCA58A]" /> {boutique.orders} Orders
                  </span>
                </div>

                <button 
                  className="w-full bg-[#FAF9F6] border border-[#BCA58A]/30 text-[#111111] py-3 text-[10px] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 group-hover:bg-[#111111] group-hover:text-white transition-colors"
                >
                  Visit Boutique <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
