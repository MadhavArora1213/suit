import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Sparkles, Truck, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Authentic Craft',
    desc: 'Sourced directly from heritage weavers and verified master designers across India.',
    detail: 'We partner directly with over 40+ heritage weavers across Banaras, Lucknow, and Jaipur. Each piece carries verified geographical tags, ensuring you support genuine ancestral artisans and preserve handloom legacies.',
  },
  {
    icon: Sparkles,
    title: 'Handcrafted Artistry',
    desc: 'Intricate embroidery, gota patti work, and delicate handloom weaves in every thread.',
    detail: 'From hand-sewn zardozi wires to hand-applied gota pieces, our garments require between 12 to 140 hours of intensive precision work. We refuse machine replication to keep handcrafted handlooms alive.',
  },
  {
    icon: Truck,
    title: 'Express Delivery',
    desc: 'Insured premium shipping with real-time tracking directly to your doorstep.',
    detail: 'Orders are dispatched in custom moisture-resistant premium boxes to protect silk threads. Fully insured shipping is tracked in real-time, arriving at your doorstep in pristine condition.',
  },
  {
    icon: Award,
    title: 'Quality Assured',
    desc: 'Hand-inspected premium fabrics, perfect fits, and easy 7-day hassle-free returns.',
    detail: 'Our masters inspect every suit across four strict stages: fabric strength, embroidery lock checks, seam density, and fit measurements. If anything is less than perfect, enjoy our 7-day easy home-pickup returns.',
  },
];

export default function WhyChooseUs() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-[#111111] text-[#FAF9F6] overflow-hidden relative text-left">
      
      {/* Decorative Golden Ambient Gradients */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#BCA58A]/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#BCA58A]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-xs font-bold tracking-[0.3em] text-[#BCA58A] uppercase block mb-3">
            Our Promise
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-medium text-white mb-6">
            Crafting Luxury Experiences
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto font-body text-center">
            We bridge the gap between traditional Indian craftsmanship and modern retail luxury. Click any card to read our story.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
          {features.map((feature, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <motion.div
                key={index}
                layout
                onClick={() => toggleExpand(index)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className={`p-8 rounded-3xl bg-gradient-to-b from-[#1E1E1E] to-[#161616] border transition-all duration-300 group cursor-pointer text-left relative overflow-hidden select-none ${
                  isExpanded ? 'border-[#BCA58A] shadow-premium' : 'border-gray-800/60 hover:border-[#BCA58A]/60 shadow-lg'
                }`}
              >
                {/* Icon Container */}
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                    isExpanded ? 'bg-[#BCA58A] text-white' : 'bg-[#BCA58A]/10 text-[#BCA58A] group-hover:bg-[#BCA58A] group-hover:text-white'
                  }`}>
                    <feature.icon size={26} className="stroke-[1.25]" />
                  </div>
                  
                  <span className="text-neutral-500 p-1">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </span>
                </div>
                
                {/* Feature Title */}
                <h3 className="text-lg font-semibold tracking-wide text-white mb-3 group-hover:text-[#BCA58A] transition-colors duration-300">
                  {feature.title}
                </h3>
                
                {/* Feature Description */}
                <p className="text-sm text-gray-400 leading-relaxed font-body">
                  {feature.desc}
                </p>

                {/* Expanded Story panel */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-gray-800/70"
                    >
                      <p className="text-xs text-neutral-300 leading-relaxed font-body italic">
                        {feature.detail}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
