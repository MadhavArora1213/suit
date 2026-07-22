import { motion } from 'framer-motion';

const COLUMNS = [
  {
    id: 'col-1',
    offset: 'mt-16',
    items: [
      { id: 1, name: "Siddharth Joshi", quote: "The craftsmanship is unparalleled. I wear it with absolute pride.", isTall: true, image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400" }
    ]
  },
  {
    id: 'col-2',
    offset: 'mt-0',
    items: [
      { id: 2, name: "Ananya S.", quote: "Felt like absolute royalty. The detailing is gorgeous!", isTall: false, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400" },
      { id: 3, name: "Devansh Pillai", quote: "Perfect fit and the fabric feels incredibly premium.", isTall: false, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" }
    ]
  },
  {
    id: 'col-3',
    offset: 'mt-24',
    items: [
      { id: 4, name: "Varun Malhotra", quote: "A masterpiece. Got so many compliments on this piece.", isTall: true, image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400" }
    ]
  },
  {
    id: 'col-4',
    offset: 'mt-10',
    items: [
      { id: 5, name: "Ananya S.", quote: "My absolute favorite ethnic brand now.", isTall: false, image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=400" },
      { id: 6, name: "Simran Kaur", quote: "Exceeded all expectations. Simply stunning.", isTall: false, image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&q=80&w=400" }
    ]
  },
  {
    id: 'col-5',
    offset: 'mt-12',
    items: [
      { id: 7, name: "Sameer Choudhury", quote: "The finest ethnic wear I have ever purchased. Highly recommended.", isTall: true, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" }
    ]
  },
  {
    id: 'col-6',
    offset: 'mt-4',
    items: [
      { id: 8, name: "Rohit K.", quote: "Amazing quality and quick delivery.", isTall: false, image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400" },
      { id: 9, name: "Tanvi", quote: "Absolutely in love with the intricate embroidery.", isTall: false, image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400" }
    ]
  }
];

const ReviewCard = ({ item }) => {
  return (
    <div 
      className={`relative w-[180px] md:w-[220px] rounded-3xl overflow-hidden shrink-0 group bg-[#111] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] cursor-pointer transition-all duration-700 ease-out hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] ring-1 ring-white/40
        ${item.isTall ? 'h-[280px] md:h-[340px]' : 'h-[180px] md:h-[210px]'}`}
    >
      {/* Background Image */}
      <img
        src={item.image}
        alt={item.name}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:blur-sm"
      />
      
      {/* Dark Hover Overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-500 ease-out" />

      {/* Hover Quote Text */}
      <div className="absolute inset-0 p-5 flex flex-col items-center justify-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 ease-out">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#BCA58A" stroke="none" className="mb-3 opacity-80 transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <p className="text-white text-[13px] md:text-[15px] font-light leading-relaxed transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700" 
           style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          "{item.quote}"
        </p>
      </div>

      {/* Premium Frosted Nameplate (Moves down slightly on hover) */}
      <div className="absolute inset-x-2 bottom-2 md:inset-x-3 md:bottom-3 rounded-2xl overflow-hidden pointer-events-none transform translate-y-0 group-hover:translate-y-2 group-hover:opacity-80 transition-all duration-500 ease-out z-10">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-md border border-white/10" />
        <div className="relative px-4 py-3 flex flex-col justify-center items-center text-center">
          <h4 className="text-white font-bold text-sm md:text-[15px] leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
            {item.name.split(' ').map((part, i) => (
              <span key={i} className="block">{part}</span>
            ))}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default function RealReviews() {
  return (
    <section className="relative overflow-hidden py-24 md:py-36 border-t border-[#111111]/5">
      
      {/* ═══ Ultra-Premium Ambient Background ═══ */}
      <div className="absolute inset-0 bg-[#FAF9F6] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#BCA58A]/10 to-transparent rounded-full blur-[150px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#111111]/5 to-transparent rounded-full blur-[120px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

      {/* ═══ Header Section ═══ */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 mb-16 md:mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[#BCA58A] text-[9px] md:text-[10px] tracking-[0.4em] uppercase font-bold"
                style={{ fontFamily: "'Montserrat', sans-serif" }}>
                The Experience
              </span>
              <div className="w-12 h-[1px] bg-[#BCA58A]/50" />
            </div>
            <h2 className="text-[40px] sm:text-[50px] md:text-[64px] font-light text-[#111] tracking-tighter leading-[1.1]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Loved by our <br className="hidden sm:block"/>
              <span className="italic font-light text-[#BCA58A]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>customers</span>
            </h2>
          </div>

          <div className="flex items-center gap-4 pb-2">
            <span className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#111]/40" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Swipe to explore
            </span>
            <div className="w-16 h-[1px] bg-[#111]/20 relative overflow-hidden">
              <motion.div 
                className="absolute inset-y-0 left-0 w-1/3 bg-[#111]"
                animate={{ x: ["-100%", "300%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══ Staggered Column Scroll Layout ═══ */}
      <div className="relative z-10 pl-6 md:pl-12 pr-12 pb-16 overflow-x-auto no-scrollbar flex items-start gap-4 md:gap-6 snap-x snap-mandatory cursor-grab active:cursor-grabbing pt-4">
        {COLUMNS.map((col, i) => (
          <motion.div
            key={col.id}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut" }}
            className={`flex flex-col gap-4 md:gap-6 snap-center shrink-0 ${col.offset}`}
          >
            {col.items.map((item) => (
              <ReviewCard key={item.id} item={item} />
            ))}
          </motion.div>
        ))}
        {/* Extra padding right for scroll end */}
        <div className="w-24 shrink-0" />
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
}
