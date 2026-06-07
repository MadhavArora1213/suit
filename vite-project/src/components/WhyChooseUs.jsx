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
  const [expandedIndex, setExpandedIndex] = useState(0);

  return (
    <section className="py-28 bg-[#111111] relative overflow-hidden border-t border-[#BCA58A]/10">
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,#BCA58A_1px,transparent_0)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Left Sticky Content */}
          <div className="lg:sticky lg:top-32 text-left">
            <span className="text-[10px] tracking-[0.35em] text-[#BCA58A] uppercase block mb-4 font-medium"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>Our Promise</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#FAF9F6] leading-tight mb-8"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Crafting <em className="italic text-[#BCA58A]">Luxury</em><br/>Experiences
            </h2>
            <div className="w-14 h-px bg-[#BCA58A]/40 mb-8" />
            <p className="text-[#6B6B6B] text-sm md:text-base max-w-md leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              We bridge the gap between traditional Indian craftsmanship and modern retail luxury. Our commitment is to deliver not just clothing, but heirlooms of art directly to your wardrobe.
            </p>
            
            {/* Decorative Image */}
            <div className="mt-12 aspect-[4/3] w-full max-w-sm overflow-hidden bg-[#1E1E1E]">
              <img src="/hero_campaign_palace.png" alt="Craftsmanship" className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>

          {/* Right Accordions */}
          <div className="flex flex-col gap-6">
            {features.map((feature, index) => {
              const isExpanded = expandedIndex === index;
              return (
                <div key={index}
                  className={`border-b transition-all duration-300 ${isExpanded ? 'border-[#BCA58A]' : 'border-[#BCA58A]/20'}`}>
                  
                  <button onClick={() => setExpandedIndex(isExpanded ? null : index)}
                    className="w-full py-6 flex items-start gap-6 text-left cursor-pointer group">
                    <div className={`mt-1 transition-colors duration-400 ${isExpanded ? 'text-[#BCA58A]' : 'text-[#6B6B6B] group-hover:text-[#BCA58A]'}`}>
                      <feature.icon size={24} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-2xl font-medium mb-2 transition-colors duration-300 ${isExpanded ? 'text-[#FAF9F6]' : 'text-[#FAF9F6]/60 group-hover:text-[#FAF9F6]'}`}
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {feature.title}
                      </h3>
                      <p className="text-xs text-[#6B6B6B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{feature.desc}</p>
                    </div>
                    <div className={`mt-2 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[#BCA58A]' : 'text-[#BCA58A]/40 group-hover:text-[#BCA58A]'}`}>
                      <ChevronDown size={20} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
                        className="overflow-hidden">
                        <div className="pb-8 pl-12 pr-6">
                          <p className="text-sm text-[#BCA58A]/80 leading-relaxed border-l-2 border-[#BCA58A]/30 pl-4"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            {feature.detail}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
