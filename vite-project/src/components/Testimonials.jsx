import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'New Delhi',
    text: 'The quality of the silk salwar suit is absolutely exceptional. Every single detail of the embroidery is perfection. I felt incredibly elegant wearing it for my family festival!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    name: 'Ananya Verma',
    role: 'Mumbai',
    text: 'Stunning collection! It is so unique compared to what you usually find online. The customer service from the boutique was also extremely helpful with size consultations.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    name: 'Deepa Patel',
    role: 'Ahmedabad',
    text: 'Super fast delivery and premium packaging. The suit arrived in pristine condition, and the fabric drape is exactly as shown in the lookbook. Highly recommended!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    name: 'Neha Gupta',
    role: 'Bangalore',
    text: 'I love that I can buy directly from verified heritage boutiques across India. The Banarasi suit set is rich, heavy, and worth every single rupee. A truly premium brand.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev + 1) % testimonials.length), 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-[#111111] relative overflow-hidden border-t border-[#BCA58A]/10">
      <div className="max-w-[1000px] mx-auto px-6 md:px-14 relative z-10 flex flex-col md:flex-row items-center gap-12 md:gap-24">

        {/* Left Intro */}
        <div className="w-full md:w-1/3 text-center md:text-left">
          <span className="text-[10px] tracking-[0.35em] text-[#BCA58A] uppercase block mb-4 font-medium"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>Testimonials</span>
          <h2 className="text-4xl md:text-5xl font-light text-[#FAF9F6] mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Client <em className="italic text-[#BCA58A]">Stories</em>
          </h2>
          <div className="hidden md:flex items-center gap-4 mt-12">
            <button onClick={() => setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length)}
              className="w-10 h-10 border border-[#BCA58A]/30 hover:border-[#BCA58A] text-[#6B6B6B] hover:text-[#BCA58A] flex items-center justify-center transition-all cursor-pointer">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setCurrent((p) => (p + 1) % testimonials.length)}
              className="w-10 h-10 border border-[#BCA58A]/30 hover:border-[#BCA58A] text-[#6B6B6B] hover:text-[#BCA58A] flex items-center justify-center transition-all cursor-pointer">
              <ChevronRight size={16} />
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
              <blockquote className="text-xl md:text-3xl font-light italic text-[#FAF9F6]/90 leading-relaxed"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                "{testimonials[current].text}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-5 pt-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-[#BCA58A]/30">
                  <img src={testimonials[current].avatar} alt={testimonials[current].name}
                    className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <h4 className="text-base font-medium text-[#FAF9F6]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {testimonials[current].name}
                  </h4>
                  <p className="text-[9px] tracking-[0.2em] text-[#BCA58A] uppercase font-semibold mt-0.5"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {testimonials[current].role}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-4 mt-10 justify-center">
            <button onClick={() => setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length)}
              className="w-10 h-10 border border-[#BCA58A]/30 hover:border-[#BCA58A] text-[#6B6B6B] hover:text-[#BCA58A] flex items-center justify-center transition-all cursor-pointer">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setCurrent((p) => (p + 1) % testimonials.length)}
              className="w-10 h-10 border border-[#BCA58A]/30 hover:border-[#BCA58A] text-[#6B6B6B] hover:text-[#BCA58A] flex items-center justify-center transition-all cursor-pointer">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
