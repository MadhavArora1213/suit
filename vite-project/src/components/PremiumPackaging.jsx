import { motion } from 'framer-motion';

const packagingSteps = [
  {
    title: "Branded Wrapping Paper",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
    desc: "Your garment is carefully enveloped in our signature butter-paper, sealed with heritage insignia."
  },
  {
    title: "Luxury Thank You Card",
    image: "https://images.unsplash.com/photo-1581452441995-1cb6249e917d?auto=format&fit=crop&w=600&q=80",
    desc: "A personalized note expressing our gratitude, printed on heavy-weight textured stock."
  },
  {
    title: "Heritage Hang Tag",
    image: "https://images.unsplash.com/photo-1620392372439-d3e758778465?auto=format&fit=crop&w=600&q=80",
    desc: "Detailed with the artisan's story and garment care instructions."
  },
  {
    title: "Brand Sticker",
    image: "https://images.unsplash.com/photo-1589417430588-3351d38865ec?auto=format&fit=crop&w=600&q=80",
    desc: "A seal of authenticity securing the inner wrapping."
  },
  {
    title: "Premium Courier Bag",
    image: "https://images.unsplash.com/photo-1590248880625-1e35d21a2889?auto=format&fit=crop&w=600&q=80",
    desc: "Weather-resistant, discrete luxury outer packaging for safe global transit."
  }
];

export default function PremiumPackaging() {
  return (
    <section className="py-32 bg-white relative overflow-hidden border-t border-[#111111]/5">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <span className="text-[11px] tracking-[0.5em] text-[#BCA58A] uppercase font-medium mb-6 block" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            The Unboxing Experience
          </span>
          <h2 className="text-5xl md:text-7xl font-light text-[#111111] leading-none tracking-tight mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Premium <em className="italic text-[#BCA58A] font-light">Packaging</em>
          </h2>
          <p className="text-[13px] text-[#555] leading-loose font-light" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            We believe that true luxury begins the moment your package arrives. 
            Every Gurnaaz order is meticulously packed by hand, transforming delivery into an unforgettable unboxing ritual.
          </p>
        </div>

        {/* Large Cinematic Photo + Cards Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Large Photo */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-1/2 relative aspect-[3/4] lg:aspect-auto overflow-hidden group border border-[#111111]/5"
          >
            <img 
              src="https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=1200&q=80" 
              alt="Luxury Packaging" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
            />
            <div className="absolute inset-0 bg-[#111111]/10 group-hover:bg-[#111111]/0 transition-colors duration-700" />
            
            <div className="absolute bottom-10 left-10 right-10 bg-white/90 backdrop-blur-md p-8 border border-white/20 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 translate-y-4 group-hover:translate-y-0">
              <h3 className="text-3xl font-light text-[#111111] mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Signature Box
              </h3>
              <p className="text-[12px] text-[#555] font-light leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Our elegant, rigid-board presentation boxes are designed to be kept and reused, featuring gold-foil embossing and a magnetic closure.
              </p>
            </div>
          </motion.div>

          {/* Grid of smaller packaging details */}
          <div className="w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-8">
            {packagingSteps.slice(0, 4).map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="group relative overflow-hidden border border-[#111111]/5 bg-[#FAF9F6] aspect-square flex flex-col cursor-default"
              >
                <div className="h-1/2 w-full overflow-hidden relative">
                  <img src={step.image} alt={step.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-[#111111]/5" />
                </div>
                <div className="flex-1 p-8 flex flex-col justify-center bg-white group-hover:bg-[#FAF9F6] transition-colors duration-500">
                  <h4 className="text-xl font-light text-[#111111] mb-3 group-hover:text-[#BCA58A] transition-colors duration-500" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-[#555] leading-relaxed font-light" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
