import { motion } from 'framer-motion';

const collections = [
  {
    id: '01',
    title: 'Summer Collection',
    desc: 'Breezy cottons and light georgettes tailored for the warm sun.',
    image: '/summer_edit.png',
  },
  {
    id: '02',
    title: 'Monsoon Collection',
    desc: 'Vibrant hues and fluid silhouettes to brighten gray days.',
    image: '/monsoon_edit.png',
  },
  {
    id: '03',
    title: 'Wedding Collection',
    desc: 'Heavy, regal bridal ensembles crafted for your biggest day.',
    image: '/wedding_edit.png',
  },
  {
    id: '04',
    title: 'Pastel Collection',
    desc: 'Soft pinks, mints, and lilacs adorned with delicate threadwork.',
    image: '/pastel_edit.png',
  },
  {
    id: '05',
    title: 'Black Collection',
    desc: 'Striking black suits with dramatic silver and gold accents.',
    image: '/black_edit.png',
  },
  {
    id: '06',
    title: 'Luxury Collection',
    desc: 'Our most exclusive, hand-embroidered heritage pieces.',
    image: '/luxury_edit.png',
  }
];

export default function EditorialCollections() {
  return (
    <section className="relative w-full bg-[#111]">
      
      {/* Intro Header (Sticky at bottom, covered by the first slide) */}
      <div className="h-[70vh] flex flex-col items-center justify-center bg-[#FAF9F6] sticky top-0 z-0">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[#BCA58A] tracking-[0.4em] text-[10px] uppercase font-bold mb-6"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Curated Collections
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-[50px] md:text-[80px] lg:text-[100px] text-[#111] font-light leading-none tracking-tighter text-center" 
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Editorial <span className="italic text-[#BCA58A]">Spreads</span>
        </motion.h2>
        <div className="w-px h-24 bg-black/20 mx-auto mt-12" />
        <p className="mt-8 text-xs text-gray-400 tracking-[0.2em] uppercase">Scroll to explore</p>
      </div>

      {/* The Cinematic Stack */}
      <div className="relative">
        {collections.map((collection, index) => (
          <div 
            key={collection.id} 
            className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.8)] bg-[#0a0a0a]"
            style={{ zIndex: index + 1 }}
          >
            {/* Background Image with Parallax Scale */}
            <motion.div 
              initial={{ scale: 1.1 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full flex items-center justify-center"
            >
              {/* Blurred Background Layer (Fills the screen) */}
              <img 
                src={collection.image} 
                alt=""
                className="absolute inset-0 w-full h-full object-cover blur-[100px] opacity-40 scale-125 saturate-200"
              />
              
              {/* Sharp Foreground Layer (Never gets cut off) */}
              <img 
                src={collection.image} 
                alt={collection.title}
                className="relative w-full h-[90vh] md:h-screen object-contain drop-shadow-2xl"
              />

              {/* Gradient Overlay for Text Legibility */}
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/40" />
            </motion.div>

            {/* Centered Text Content */}
            <div className="relative z-10 text-center px-6 flex flex-col items-center max-w-4xl mx-auto w-full">
              
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-[#BCA58A] tracking-[0.4em] text-xs font-bold uppercase mb-8 block drop-shadow-md"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Edit No. {collection.id}
              </motion.span>
              
              <motion.h3 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-6xl md:text-8xl lg:text-[120px] font-light text-white leading-none tracking-tighter mb-8 drop-shadow-xl"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {collection.title.split(' ')[0]} <br/>
                <span className="italic text-[#BCA58A]">{collection.title.split(' ')[1]}</span>
              </motion.h3>

              <motion.div 
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="w-16 h-px bg-[#BCA58A] mb-8 origin-center"
              />
              
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-white/90 text-lg md:text-xl font-light mb-12 max-w-md drop-shadow-md"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {collection.desc}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <a 
                  href="#explore" 
                  className="group inline-flex items-center gap-4 bg-black/30 backdrop-blur-sm border border-white/30 text-white px-10 py-4 hover:bg-white hover:text-black transition-all duration-300 text-xs font-bold tracking-[0.2em] uppercase"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Explore Collection
                </a>
              </motion.div>
              
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
