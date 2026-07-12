import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const storySteps = [
  {
    id: 1,
    subtitle: 'The Heritage',
    title: 'Woven by Masters',
    text: 'We partner directly with over 40+ heritage weavers across Banaras and Lucknow. Each thread is a testament to centuries of ancestral knowledge.',
    image: '/designer_suit_1.png'
  },
  {
    id: 2,
    subtitle: 'The Artistry',
    title: '140 Hours of Precision',
    text: 'From hand-sewn zardozi wires to meticulously applied gota patti pieces, a single garment requires between 12 to 140 hours of intensive handcrafted work.',
    image: '/chikankari_suit.png'
  },
  {
    id: 3,
    subtitle: 'The Promise',
    title: 'Inspected to Perfection',
    text: 'Our masters inspect every suit across four strict stages: fabric strength, embroidery lock checks, seam density, and fit measurements.',
    image: '/hero_campaign_palace.png'
  }
];

export default function InteractivePillarsCraft() {
  return (
    <section className="relative w-full bg-[#FAF9F6] pt-12 pb-32" id="craftsmanship">
      
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div>
            <span className="text-[#BCA58A] text-[11px] tracking-[0.5em] uppercase font-medium mb-6 block" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              The Anatomy of a Masterpiece
            </span>
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-light text-[#111111] tracking-tight leading-[0.9]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Uncompromising <br/>
              <em className="italic text-[#BCA58A] font-light">Craftsmanship</em>
            </h2>
          </div>
          <p className="text-[#555] text-[10px] tracking-[0.3em] max-w-sm uppercase leading-loose pb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Perfection is not an option; it is the fundamental standard woven into every garment we create.
          </p>
        </div>

        {/* The Pillar Grid */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 h-auto lg:h-[75vh]">
          {storySteps.map((step) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, delay: step.id * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex-1 overflow-hidden cursor-pointer bg-white min-h-[450px] lg:min-h-0 border border-[#111111]/5 shadow-xl hover:shadow-2xl transition-shadow duration-1000"
            >
              {/* Background Image */}
              <img 
                src={step.image} 
                alt={step.title} 
                className="absolute inset-0 w-full h-full object-cover object-center opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
              
              {/* Soft Gradient Overlay for text readability (using light to match aesthetic) */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-[#FAF9F6]/20 to-transparent transition-opacity duration-700 opacity-90 group-hover:opacity-70" />

              {/* Content Container */}
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                
                {/* Number Indicator */}
                <div className="mb-auto opacity-0 group-hover:opacity-100 transform -translate-y-4 group-hover:translate-y-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  <span className="text-[#111111] text-[10px] tracking-[0.4em] font-medium border border-[#111111]/20 rounded-full px-5 py-2.5 backdrop-blur-md bg-white/50 shadow-sm">
                    0{step.id}
                  </span>
                </div>

                {/* Text Container that naturally pushes title up */}
                <div className="flex flex-col z-10">
                  {/* Always Visible Title */}
                  <div className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2">
                    <span className="text-[#BCA58A] text-[10px] tracking-[0.4em] font-medium uppercase mb-4 block" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {step.subtitle}
                    </span>
                    <h3 className="text-4xl md:text-5xl lg:text-6xl text-[#111111] font-light leading-tight tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {step.title}
                    </h3>
                  </div>
                  
                  {/* Text Reveal on Hover (Expands height naturally) */}
                  <div className="grid transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] grid-rows-[0fr] group-hover:grid-rows-[1fr] opacity-0 group-hover:opacity-100 mt-0 group-hover:mt-6">
                    <div className="overflow-hidden">
                      <p className="text-[#555] text-[13px] tracking-wide leading-relaxed font-light" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {step.text}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
