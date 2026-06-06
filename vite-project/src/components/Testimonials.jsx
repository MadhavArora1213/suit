import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
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
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const nextTesti = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prevTesti = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-[#FAF9F6] relative overflow-hidden text-left">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-[0.3em] text-[#BCA58A] uppercase block mb-3">
            Customer Stories
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-medium text-[#111111] mb-6">
            Loved by Connoisseurs
          </h2>
          <p className="text-[#686868] text-sm md:text-base max-w-xl mx-auto font-body">
            Read authentic reviews from women who cherish premium handloom and artisan ethnic wear.
          </p>
        </div>

        {/* Cinematic Single Review Container */}
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-14 border border-[#EBDDD0]/30 shadow-premium relative min-h-[350px] flex flex-col justify-between">
          
          {/* Quote Mark */}
          <div className="absolute top-6 right-8 text-[#BCA58A]/10 pointer-events-none">
            <Quote size={80} className="fill-current" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-6 flex-1 flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex gap-1.5 mb-6">
                  {[...Array(testimonials[current].rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-[#BCA58A] text-[#BCA58A]" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-lg md:text-xl text-neutral-800 leading-relaxed italic font-display font-medium">
                  "{testimonials[current].text}"
                </p>
              </div>

              {/* User Avatar & Name */}
              <div className="flex items-center gap-4 border-t border-[#EBDDD0]/25 pt-6 mt-6">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-[#EBDDD0] bg-gray-100 flex-shrink-0">
                  <img
                    src={testimonials[current].avatar}
                    alt={testimonials[current].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-semibold tracking-wide text-neutral-900">
                    {testimonials[current].name}
                  </h4>
                  <p className="text-[10px] tracking-wider text-[#BCA58A] uppercase font-bold">
                    {testimonials[current].role}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider controls */}
          <div className="absolute right-6 bottom-6 flex items-center gap-2">
            <button
              onClick={prevTesti}
              className="w-9 h-9 rounded-full border border-neutral-200 hover:border-[#BCA58A] text-neutral-600 hover:text-[#BCA58A] flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextTesti}
              className="w-9 h-9 rounded-full border border-neutral-200 hover:border-[#BCA58A] text-neutral-600 hover:text-[#BCA58A] flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                current === index ? 'bg-[#BCA58A] w-6' : 'bg-neutral-300 hover:bg-neutral-400'
              }`}
              title={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
