import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getTestimonials } from '../utils/adminStore';

const staticReviews = [
  {
    name: 'Priya Sharma',
    country: 'United Kingdom',
    store: 'Banaras Heritage',
    text: 'The quality of the silk salwar suit is absolutely exceptional. Every single detail of the embroidery is perfection. I felt incredibly elegant wearing it for my family festival!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    name: 'Ananya Verma',
    country: 'United States',
    store: 'The Chikankari Studio',
    text: 'Stunning collection! It is so unique compared to what you usually find online. The customer service from the boutique was also extremely helpful with size consultations.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    name: 'Deepa Patel',
    country: 'Canada',
    store: 'Royal Rajputana',
    text: 'Super fast delivery and premium packaging. The suit arrived in pristine condition, and the fabric drape is exactly as shown in the lookbook. Highly recommended!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    name: 'Neha Gupta',
    country: 'Australia',
    store: 'Kanjeevaram Looms',
    text: 'I love that I can buy directly from verified heritage boutiques across India. The Banarasi suit set is rich, heavy, and worth every single rupee. A truly premium brand.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
  },
];

export default function CustomerReviews() {
  const [current, setCurrent] = useState(0);
  const [testimonials, setTestimonials] = useState(staticReviews);

  const loadTestimonials = () => {
    const adminReviews = getTestimonials().filter(r => r.published).map(r => ({
      name: r.name,
      country: r.location || 'Global',
      store: r.store || 'Verified Boutique',
      text: r.review,
      rating: r.rating,
      avatar: r.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'
    }));

    if (adminReviews.length > 0) {
      setTestimonials(adminReviews);
    } else {
      setTestimonials(staticReviews);
    }
  };

  useEffect(() => {
    loadTestimonials();
    window.addEventListener('admin-data-updated', loadTestimonials);
    return () => window.removeEventListener('admin-data-updated', loadTestimonials);
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % testimonials.length), 7000);
    return () => clearInterval(timer);
  }, [testimonials]);

  return (
    <section className="py-40 bg-[#FAF9F6] relative overflow-hidden border-t border-[#111111]/5">
      
      {/* Massive Background Quote Watermark */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 opacity-[0.02] pointer-events-none select-none">
        <span className="text-[400px] leading-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          "
        </span>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-14 relative z-10 flex flex-col md:flex-row items-center gap-16 md:gap-32">

        {/* Left Intro */}
        <div className="w-full md:w-1/3 text-center md:text-left">
          <span className="text-[11px] tracking-[0.5em] text-[#BCA58A] uppercase block mb-6 font-medium"
            style={{ fontFamily: "'Montserrat', sans-serif" }}>Testimonials</span>
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-light text-[#111111] leading-none tracking-tight mb-8"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Client <br/><em className="italic text-[#BCA58A] font-light">Stories</em>
          </h2>
          <div className="hidden md:flex items-center gap-6 mt-16">
            <button onClick={() => setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length)}
              className="w-12 h-12 border border-[#111111]/20 hover:border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#FAF9F6] flex items-center justify-center transition-all duration-500 cursor-pointer rounded-full">
              <ChevronLeft size={18} strokeWidth={1} />
            </button>
            <button onClick={() => setCurrent((p) => (p + 1) % testimonials.length)}
              className="w-12 h-12 border border-[#111111]/20 hover:border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#FAF9F6] flex items-center justify-center transition-all duration-500 cursor-pointer rounded-full">
              <ChevronRight size={18} strokeWidth={1} />
            </button>
          </div>
        </div>

        {/* Right Quote */}
        <div className="w-full md:w-2/3 relative">
          <AnimatePresence mode="wait">
            <motion.div key={current}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5 }}
              className="text-left space-y-8">

              {/* Stars */}
              <div className="flex gap-2">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <Star key={i} size={14} className="fill-[#BCA58A] text-[#BCA58A]" />
                ))}
              </div>

              {/* Quote text */}
              <blockquote className="text-3xl md:text-5xl font-light text-[#111111] leading-snug"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                "{testimonials[current].text}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-6 pt-8">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-[#111111]/10">
                  <img src={testimonials[current].avatar} alt={testimonials[current].name}
                    className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <h4 className="text-xl font-light text-[#111111] tracking-wide"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {testimonials[current].name}
                  </h4>
                  <p className="text-[10px] tracking-[0.3em] text-[#555] uppercase font-medium mt-1"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {testimonials[current].country}
                  </p>
                </div>
              </div>
              
              {/* Store Purchased From */}
              <div className="pt-4 border-t border-[#111111]/5 inline-block">
                <span className="text-[9px] tracking-[0.3em] text-[#111111]/40 uppercase font-medium block mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>Purchased From</span>
                <span className="text-[12px] text-[#BCA58A] font-light tracking-wide uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>{testimonials[current].store}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-6 mt-16 justify-center">
            <button onClick={() => setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length)}
              className="w-12 h-12 border border-[#111111]/20 hover:border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#FAF9F6] flex items-center justify-center transition-all duration-500 cursor-pointer rounded-full">
              <ChevronLeft size={18} strokeWidth={1} />
            </button>
            <button onClick={() => setCurrent((p) => (p + 1) % testimonials.length)}
              className="w-12 h-12 border border-[#111111]/20 hover:border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#FAF9F6] flex items-center justify-center transition-all duration-500 cursor-pointer rounded-full">
              <ChevronRight size={18} strokeWidth={1} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
