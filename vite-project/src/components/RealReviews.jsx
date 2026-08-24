import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getReviews } from '../utils/adminStore';

const FALLBACK_REVIEWS = [
  { id: 1, name: "Siddharth Joshi", rating: 5, review: "The craftsmanship is unparalleled. I wear it with absolute pride. Every stitch speaks quality." },
  { id: 2, name: "Ananya S.", rating: 5, review: "Felt like absolute royalty. The detailing is gorgeous and the fabric is so premium." },
  { id: 3, name: "Devansh Pillai", rating: 5, review: "Perfect fit and the fabric feels incredibly premium. Will definitely order again." },
  { id: 4, name: "Varun Malhotra", rating: 5, review: "A masterpiece. Got so many compliments on this piece at the wedding." },
  { id: 5, name: "Simran Kaur", rating: 5, review: "Exceeded all expectations. Simply stunning work by the artisans." },
  { id: 6, name: "Sameer Choudhury", rating: 5, review: "The finest ethnic wear I have ever purchased. Highly recommended to everyone." },
  { id: 7, name: "Tanvi", rating: 5, review: "Absolutely in love with the intricate embroidery. Beautiful piece." },
  { id: 8, name: "Rohit K.", rating: 4, review: "Amazing quality and quick delivery. The suit looks even better in person." },
];

export default function RealReviews() {
  const [reviews, setReviews] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const load = () => {
      const allReviews = getReviews();
      const flat = [];
      if (allReviews && typeof allReviews === 'object') {
        Object.values(allReviews).forEach(arr => {
          if (Array.isArray(arr)) flat.push(...arr);
        });
      }
      if (flat.length > 0) {
        setReviews(flat.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 10));
      } else {
        setReviews(FALLBACK_REVIEWS);
      }
    };
    load();
    window.addEventListener('admin-data-updated', load);
    return () => window.removeEventListener('admin-data-updated', load);
  }, []);

  useEffect(() => {
    if (reviews.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const featured = reviews[activeIdx] || reviews[0];
  const sideReviews = reviews.filter((_, i) => i !== activeIdx).slice(0, 4);

  return (
    <section className="relative overflow-hidden py-24 md:py-36 border-y border-[#1A0008]/5 bg-[#FAF9F6]">
      
      {/* Ambient Background */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#8B1A1A 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#D4AF37]/10 to-transparent rounded-full blur-[150px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#8B1A1A]/5 to-transparent rounded-full blur-[120px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

      {/* Header */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 mb-16 md:mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <span className="text-[#8B1A1A] text-[10px] tracking-[0.4em] uppercase font-bold block mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            The Experience
          </span>
          <h2 className="text-[40px] sm:text-[50px] md:text-[64px] font-light text-[#1A0008] tracking-tighter leading-[1.1]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Loved by our <span className="italic text-[#D4AF37]">customers</span>
          </h2>
        </motion.div>
      </div>

      {/* Testimonials */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12">
        
        {/* Featured Review (Large) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={featured?.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 md:mb-24"
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="#D4AF37" stroke="none" className="mx-auto mb-8 opacity-60">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="text-2xl md:text-4xl lg:text-5xl font-light text-[#1A0008] leading-relaxed mb-10 max-w-4xl mx-auto"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              "{featured?.review}"
            </p>
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < (featured?.rating || 5) ? '#D4AF37' : '#E8DDD0'} stroke="none">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <p className="text-[#1A0008] font-bold text-sm tracking-wider uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {featured?.name}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Side Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sideReviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 md:p-8 border border-[#1A0008]/5 hover:border-[#D4AF37]/30 transition-all duration-500 hover:shadow-lg cursor-pointer group"
              onClick={() => setActiveIdx(reviews.indexOf(review))}
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} width="12" height="12" viewBox="0 0 24 24" fill={j < (review.rating || 5) ? '#D4AF37' : '#E8DDD0'} stroke="none">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <p className="text-[#1A0008]/70 text-sm leading-relaxed mb-6 line-clamp-3 group-hover:text-[#1A0008] transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                "{review.review}"
              </p>
              <p className="text-[#1A0008] font-bold text-xs tracking-wider uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {review.name}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Dots Navigation */}
        {reviews.length > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {reviews.slice(0, 8).map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeIdx ? 'bg-[#D4AF37] w-6' : 'bg-[#1A0008]/20 hover:bg-[#1A0008]/40'}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
