import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "How does Gurnaaz work?",
    answer: "Gurnaaz is a luxury marketplace connecting you directly with authentic, heritage boutiques across India. You browse collections from verified sellers, place a single order, and we handle the collection, premium packaging, and worldwide delivery."
  },
  {
    question: "Can I trust the sellers?",
    answer: "Absolutely. Every boutique on Gurnaaz goes through a rigorous vetting process. We ensure they are genuine creators of heritage garments, and we personally collect the items from them to guarantee authenticity before it reaches you."
  },
  {
    question: "How is the packaging done?",
    answer: "Our packaging is a luxurious experience in itself. Each garment is wrapped in branded butter-paper, sealed with a brand sticker, placed in a premium rigid box, and accompanied by a personalized luxury thank-you card and heritage hang tag."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we offer worldwide delivery. We partner with premium global courier services to ensure your luxury garments arrive safely and promptly, no matter where you are located."
  },
  {
    question: "Can I return products?",
    answer: "We offer a curated luxury experience. Returns are accepted within 7 days of delivery for items in unworn, pristine condition with all original tags and premium packaging intact. Custom-tailored pieces are non-returnable."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-32 bg-[#FAF9F6] relative overflow-hidden border-t border-[#111111]/5">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        
        <div className="text-center mb-24">
          <span className="text-[11px] tracking-[0.5em] text-[#BCA58A] uppercase font-medium mb-6 block" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Common Inquiries
          </span>
          <h2 className="text-5xl md:text-7xl font-light text-[#111111] leading-none tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Frequently Asked <em className="italic text-[#BCA58A] font-light">Questions</em>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto border-t border-[#111111]/10">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            
            return (
              <div key={idx} className="border-b border-[#111111]/10">
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full py-8 flex items-center justify-between group cursor-pointer"
                >
                  <h3 className={`text-2xl font-light text-left transition-colors duration-500 ${isOpen ? 'text-[#BCA58A]' : 'text-[#111111] group-hover:text-[#BCA58A]'}`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {faq.question}
                  </h3>
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-500 ${isOpen ? 'border-[#BCA58A] bg-[#BCA58A] text-white' : 'border-[#111111]/20 text-[#111111] group-hover:border-[#BCA58A] group-hover:text-[#BCA58A]'}`}>
                    {isOpen ? <Minus size={16} strokeWidth={1} /> : <Plus size={16} strokeWidth={1} />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-10 pr-12 text-[13px] text-[#555] leading-loose font-light" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
